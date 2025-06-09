import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import NovitaClient from '../../../lib/novita-client';
import ZillizClient from '../../../lib/zilliz-client';

const novitaClient = new NovitaClient(process.env.NOVITA_API_KEY || '');
let zillizClient: ZillizClient | null = null;

function getZillizClient(): ZillizClient {
  if (!zillizClient) {
    zillizClient = new ZillizClient();
  }
  return zillizClient;
}

// Helper function to recursively get files
async function getFilesInDirectory(dir: string, fileList: string[] = []): Promise<string[]> {
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      await getFilesInDirectory(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// Helper function to organize chunks by file type/importance
function organizeChunksByFile(chunks: any[]) {
  const fileMap = new Map();
  
  chunks.forEach(chunk => {
    const fileName = chunk.filePath;
    if (!fileMap.has(fileName)) {
      fileMap.set(fileName, []);
    }
    fileMap.get(fileName).push(chunk.content);
  });
  
  return Object.fromEntries(fileMap);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ success: false, message: 'Missing sessionId query parameter.' }, { status: 400 });
  }

  const sessionDirPath = path.join(os.tmpdir(), `uploads-${sessionId}`);

  try {
    const extractedFiles = await getFilesInDirectory(sessionDirPath);
    const relativePaths = extractedFiles.map(filePath => path.relative(sessionDirPath, filePath));
    return NextResponse.json({ success: true, files: relativePaths }, { status: 200 });
  } catch (error) {
    console.error(`Error listing files for session ${sessionId}:`, error);
    return NextResponse.json({ success: false, message: 'Failed to list files.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, filePath, summaryType = 'overview' } = await request.json();

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ success: false, message: 'Invalid or missing sessionId.', summary: '' }, { status: 400 });
    }

    // If filePath is provided, generate a file-specific summary
    if (filePath && typeof filePath === 'string') {
      console.log(`[SUMMARIZE] Processing file: ${filePath} for session: ${sessionId}`);
      
      // **FIX 1: Construct the correct full path**
      const sessionDirPath = path.join(os.tmpdir(), `uploads-${sessionId}`);
      const fullPath = path.join(sessionDirPath, filePath);
      
      console.log(`[SUMMARIZE] Attempting to read file from: ${fullPath}`);
      
      let fileContent: string;

      try {
        // **FIX 2: Check if file exists first**
        const fileStats = await fs.stat(fullPath);
        if (!fileStats.isFile()) {
          console.error(`[SUMMARIZE] Path is not a file: ${fullPath}`);
          return NextResponse.json({ success: false, message: 'Path is not a file.', summary: '' }, { status: 404 });
        }
        
        fileContent = await fs.readFile(fullPath, 'utf-8');
        console.log(`[SUMMARIZE] Successfully read file: ${filePath} (${fileContent.length} characters)`);
      } catch (readError: any) {
        console.error(`[SUMMARIZE] Could not read file ${fullPath}:`, readError);
        
        // **FIX 3: Try alternative approaches if direct file read fails**
        try {
          // Option A: Try to find the file in subdirectories
          const allFiles = await getFilesInDirectory(sessionDirPath);
          const matchingFile = allFiles.find(f => f.endsWith(path.basename(filePath)));
          
          if (matchingFile) {
            console.log(`[SUMMARIZE] Found file via directory search: ${matchingFile}`);
            fileContent = await fs.readFile(matchingFile, 'utf-8');
            console.log(`[SUMMARIZE] Successfully read file via search: ${matchingFile} (${fileContent.length} characters)`);
          } else {
            // Option B: Try to get content from vector database
            console.log(`[SUMMARIZE] File not found on disk, attempting to retrieve from vector DB`);
            const chunks = await getZillizClient().getAllChunks(sessionId);
            const fileChunks = chunks.filter(chunk => 
              chunk.filePath.includes(path.basename(filePath))
            );
            
            if (fileChunks.length > 0) {
              fileContent = fileChunks.map(chunk => chunk.content).join('\n\n');
              console.log(`[SUMMARIZE] Retrieved content from vector DB: ${fileContent.length} characters`);
            } else {
              return NextResponse.json({ 
                success: false, 
                message: `File not found: ${filePath}. Checked paths: ${fullPath}`, 
                summary: '',
                debug: {
                  sessionDirPath,
                  fullPath,
                  fileExists: false,
                  availableFiles: allFiles.map(f => path.relative(sessionDirPath, f))
                }
              }, { status: 404 });
            }
          }
        } catch (fallbackError) {
          console.error(`[SUMMARIZE] All fallback methods failed:`, fallbackError);
          return NextResponse.json({ 
            success: false, 
            message: `File not found and could not retrieve from vector DB: ${filePath}`, 
            summary: '' 
          }, { status: 404 });
        }
      }
  
      if (fileContent.trim().length === 0) {
        return NextResponse.json({ success: false, message: 'File content is empty, cannot summarize.' }, { status: 400 });
      }

      let summary: string;
      try {
        console.log(`[SUMMARIZE] Generating summary for ${filePath}...`);
        const summarizeResponse = await novitaClient.summarizeText(fileContent);
        summary = summarizeResponse.summary;
        console.log(`[SUMMARIZE] Summary generated successfully for ${filePath}`);
      } catch (summarizeError) {
        console.error('[SUMMARIZE] Error during text summarization:', summarizeError);
        return NextResponse.json({ success: false, message: 'Failed to generate summary.', summary: '' }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Text summarized successfully.', summary: summary, fileContent: fileContent }, { status: 200 });
    } 
    // If no filePath is provided, generate a project-wide summary
    else {
      console.log(`[SUMMARIZE] Generating project-wide summary for session: ${sessionId}`);
      try {
        // Retrieve all code chunks from vector DB
        const allChunks = await getZillizClient().getAllChunks(sessionId);
        
        if (!allChunks || allChunks.length === 0) {
          return NextResponse.json({ 
            success: false, 
            message: 'No indexed content found for this session', 
            summary: '' 
          }, { status: 404 });
        }
        
        console.log(`[SUMMARIZE] Retrieved ${allChunks.length} chunks from vector DB`);
          
        // Organize chunks by file type/importance
        const organizedContent = organizeChunksByFile(allChunks);
        
        // Generate summary using Novita AI
        const summaryResponse = await novitaClient.generateProjectSummary(
          organizedContent,
          summaryType
        );
        
        console.log(`[SUMMARIZE] Project summary generated successfully`);
        
        return NextResponse.json({ 
          success: true, 
          message: 'Project summarized successfully.', 
          summary: summaryResponse.summary,
          summaryType
        }, { status: 200 });
      } catch (error: any) {
        console.error('[SUMMARIZE] Error during project summarization:', error);
        return NextResponse.json({ 
          success: false, 
          message: `Failed to generate project summary: ${error.message}`, 
          summary: '' 
        }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('[SUMMARIZE] API error in summarize route:', error);
    return NextResponse.json({ success: false, message: 'An unexpected error occurred during summarization.', summary: '' }, { status: 500 });
  }
}