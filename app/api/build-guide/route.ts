import { NextRequest, NextResponse } from 'next/server';
import NovitaClient from '../../../lib/novita-client';
import { queryBySessionId } from '../../../lib/milvus';

const novitaClient = new NovitaClient(process.env.NOVITA_API_KEY || '');

// Add BATCH_SIZE for concurrent processing
const BATCH_SIZE = 5; // Adjust based on Novita.ai rate limits

// Type definitions for better type safety
interface BuildStep {
  stepNumber: number;
  filePath: string;
  content: string;
  explanation: string;
  fileName?: string;
  fileExtension?: string;
  chunkType?: string;
  startLine?: number;
  endLine?: number;
}

interface SessionChunk {
  content: string;
  file_path: string;
  sessionId: string;
  startLine?: number;
  endLine?: number;
  chunkType?: string;
  [key: string]: any; // Allow for additional properties
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    // Validate sessionId
    if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
      return NextResponse.json({
        success: false,
        message: 'Invalid or missing sessionId.',
        steps: []
      }, { status: 400 });
    }

    console.log(`Querying build guide for sessionId: ${sessionId}`);

    // Query session chunks from Milvus
    let sessionChunks: SessionChunk[];
    try {
      sessionChunks = await queryBySessionId(sessionId);
    } catch (queryError) {
      console.error('Error querying session chunks:', queryError);
      return NextResponse.json({
        success: false,
        message: 'Failed to retrieve session data from database.',
        steps: []
      }, { status: 500 });
    }

    // Check if any chunks were found
    if (!sessionChunks || sessionChunks.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No code indexed for this session ID in Zilliz. Please upload and index code first.', 
        steps: []
      }, { status: 404 });
    }

    console.log(`Found ${sessionChunks.length} chunks for session ${sessionId}`);

    const buildSteps: BuildStep[] = [];

    // Process chunks in batches to respect rate limits and improve concurrency
    for (let i = 0; i < sessionChunks.length; i += BATCH_SIZE) {
      const batch = sessionChunks.slice(i, i + BATCH_SIZE);
      
      const batchPromises = batch.map(async (chunk, batchIndex) => {
        const currentStepNumber = i + batchIndex + 1;
        console.log(`Processing chunk ${currentStepNumber}/${sessionChunks.length} for file: ${chunk.file_path || chunk.filePath || 'Unknown file'}`);
        
        try {
          const filePath = chunk.file_path || chunk.filePath || 'Unknown file';
          const content = chunk.content || '';
          
          if (!content.trim()) {
            console.warn(`Skipping empty chunk for file: ${filePath}`);
            return null; // Return null for skipped chunks
          }

          const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || 'Unknown';
          const fileExtension = fileName.includes('.') ? fileName.split('.').pop() || '' : '';

          let explanation = 'No explanation generated.';
          
          try {
            if (novitaClient.teachCodeCreation && typeof novitaClient.teachCodeCreation === 'function') {
              console.log(`Calling AI for teaching explanation for ${fileName} (Step ${currentStepNumber})...`);
              const teachingResponse = await novitaClient.teachCodeCreation(content, fileName, currentStepNumber);
              explanation = teachingResponse?.summary || 'Failed to generate teaching explanation.';
              console.log(`AI teaching explanation generated for ${fileName} (Step ${currentStepNumber}).`);
            } else {
              console.log(`Using fallback explanation for ${fileName} (Step ${currentStepNumber})...`);
              explanation = generateTeachingExplanation(content, fileName, fileExtension, currentStepNumber);
              console.log(`Fallback explanation generated for ${fileName} (Step ${currentStepNumber}).`);
            }
          } catch (teachingError) {
            console.error(`Error generating teaching explanation for ${filePath}:`, teachingError);
            explanation = generateTeachingExplanation(content, fileName, fileExtension, currentStepNumber);
            console.log(`Fallback explanation generated after error for ${fileName} (Step ${currentStepNumber}).`);
          }

          if (!explanation || explanation.trim() === '') {
            explanation = `STEP ${currentStepNumber}: Review the code for ${fileName}`;
            console.warn(`Explanation was empty, set to default for ${fileName} (Step ${currentStepNumber}).`);
          }

          const step = {
            stepNumber: currentStepNumber,
            filePath: filePath,
            content: content,
            explanation: explanation,
            fileName: fileName,
            fileExtension: fileExtension,
            chunkType: chunk.chunkType || 'code',
            startLine: chunk.startLine,
            endLine: chunk.endLine
          };
          console.log(`Successfully prepared step ${currentStepNumber} for ${fileName}.`);
          return step;
        } catch (chunkError) {
          console.error(`Error processing chunk for ${chunk.file_path || chunk.filePath || 'Unknown file'}:`, chunkError);
          return null; // Return null for chunks that failed processing
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      buildSteps.push(...batchResults.filter(step => step !== null)); // Filter out nulls
      
      // Add delay between batches to respect rate limits
      if (i + BATCH_SIZE < sessionChunks.length) {
        console.log(`Waiting ${1000}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      }
    }

    // Check if any valid steps were generated
    if (buildSteps.length === 0) {
      console.log('No valid build steps were generated after processing all chunks.');
      return NextResponse.json({ 
        success: false, 
        message: 'No valid build steps could be generated from the indexed code.', 
        steps: [] 
      }, { status: 400 });
    }

    console.log(`Finished processing chunks. Generated ${buildSteps.length} build steps.`);

    return NextResponse.json({ 
      success: true, 
      message: 'Build guide generated successfully from Zilliz data.', 
      steps: buildSteps,
      totalSteps: buildSteps.length,
      sessionId: sessionId
    }, { status: 200 });

  } catch (error: any) {
    console.error('API error in build-guide route:', error);
    
    // Handle specific error types
    if (error.message?.includes('not available during build')) {
      return NextResponse.json({
        success: false,
        message: 'Vector database not available during build.',
        steps: []
      }, { status: 503 });
    }

    if (error.message?.includes('ENOTFOUND') || error.message?.includes('ECONNREFUSED')) {
      return NextResponse.json({
        success: false,
        message: 'Database connection failed. Please try again later.',
        steps: []
      }, { status: 503 });
    }

    return NextResponse.json({ 
      success: false, 
      message: 'An unexpected error occurred during build guide generation.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      steps: [] 
    }, { status: 500 });
  }
}

// Fallback function to generate simple explanations
function generateTeachingExplanation(content: string, fileName: string, fileExtension: string, stepNumber: number): string {
  if (!content || content.trim() === '') {
    return `STEP ${stepNumber}: Create an empty file called ${fileName} - this will be your starting point!`;
  }

  const lines = content.split('\n').filter(line => line.trim() !== '');
  const lineCount = lines.length;
  
  // Analyze content type and provide basic teaching instructions
  let instructions = `STEP ${stepNumber}: `;
  let codeType: string = 'code'; // Initialize codeType at the start of the function
  
  if (fileExtension.toLowerCase() === 'html') {
    instructions += `Create a new HTML file called ${fileName}. Start by typing \`<!DOCTYPE html>\` at the top - this tells the browser you're writing HTML code! Then add your \`<html>\` tags, followed by \`<head>\` for settings and \`<body>\` for what people see.`;
  } else if (fileExtension.toLowerCase() === 'css') {
    instructions += `Create a new CSS file called ${fileName}. This file will make your webpage look pretty! Start by writing your first style rule. For example, to change the color of everything, you could write \`body { color: blue; }\`.`;
  } else if (['js', 'ts', 'jsx', 'tsx'].includes(fileExtension.toLowerCase())) {
    instructions += `Create a new JavaScript/TypeScript file called ${fileName}. This file will make your webpage interactive! You can start by declaring a simple function like \`function sayHello() { console.log("Hello!"); }\`.`;
  } else if (fileExtension.toLowerCase() === 'py') {
    instructions += `Create a new Python file called ${fileName}. This file will run commands! You can start with a simple print statement like \`print("Hello, Python!")\`.`;
  } else if (['json', 'yaml', 'yml'].includes(fileExtension.toLowerCase())) {
    instructions += `Create a new configuration file called ${fileName}. This file holds settings for your project, like a recipe book. Start with a simple key-value pair, like \`{ "name": "My Project" }\`.`;
  } else if (fileExtension.toLowerCase() === 'md') {
    instructions += `Create a new Markdown file called ${fileName}. This is like a special text file for notes and documentation. Use \`#\` for big titles, \`##\` for smaller ones, and \`- \` for lists!`;
  } else {
    // Only assign codeType here if it's the last fallback, otherwise it uses the default.
    if (content.includes('function ') || content.includes('const ') || content.includes('let ')) {
      codeType = 'JavaScript/TypeScript functions and variables';
    } else if (content.includes('class ') && content.includes('def ')) {
      codeType = 'Python class definitions';
    } else if (content.includes('import ') || content.includes('from ')) {
      codeType = 'import statements';
    } else if (content.includes('export ')) {
      codeType = 'export definitions';
    }
    instructions = `STEP ${stepNumber}: Create a new file named ${fileName} and add the following content. This ${fileExtension.toUpperCase()} file contains ${codeType}.`;
  }

  return instructions;
}