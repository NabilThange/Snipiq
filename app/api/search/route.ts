import { NextRequest, NextResponse } from 'next/server';
import NovitaClient from '../../../lib/novita-client';
import ZillizClient, { CodeChunk } from '../../../lib/zilliz-client';
import { SearchResult } from '../../../lib/types';

const novitaClient = new NovitaClient(process.env.NOVITA_API_KEY || '');

function getLanguageFromExtension(filePath: string): string {
  if (!filePath) return 'code';
  
  const ext = filePath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'py': return 'python';
    case 'js': return 'javascript';
    case 'ts': return 'typescript';
    case 'jsx': return 'javascript';
    case 'tsx': return 'typescript';
    case 'html': return 'html';
    case 'css': return 'css';
    case 'java': return 'java';
    case 'cpp': case 'c++': return 'cpp';
    case 'c': return 'c';
    case 'php': return 'php';
    case 'rb': return 'ruby';
    case 'go': return 'go';
    case 'rs': return 'rust';
    default: return 'code';
  }
}

function extractFunctionName(content: string): string {
  if (!content) return '(ANONYMOUS CHUNK)';
  
  // Python function detection
  if (content.includes('def ')) {
    const match = content.match(/def\s+(\w+)\s*\(/);
    if (match) return match[1];
  }
  
  // JavaScript function detection
  if (content.includes('function')) {
    const match = content.match(/function\s+(\w+)\s*\(/);
    if (match) return match[1];
  }
  
  // Arrow function detection
  const arrowMatch = content.match(/const\s+(\w+)\s*=/);
  if (arrowMatch) return arrowMatch[1];
  
  return '(ANONYMOUS CHUNK)';
}

function generateTags(content: string): string[] {
  if (!content) return ['CODE'];
  
  const tags = [];
  
  // Python specific
  if (content.includes('def ')) tags.push('FUNCTION');
  if (content.includes('class ')) tags.push('CLASS');
  if (content.includes('import ')) tags.push('IMPORT');
  if (content.includes('print(')) tags.push('PRINT');
  
  // JavaScript specific
  if (content.includes('function')) tags.push('FUNCTION');
  if (content.includes('const') || content.includes('let') || content.includes('var')) tags.push('VARIABLE');
  if (content.includes('console.log')) tags.push('LOG');
  
  // General
  if (content.includes('//') || content.includes('#') || content.includes('/*')) tags.push('COMMENT');
  
  return tags.length > 0 ? tags : ['CODE'];
}

function detectLanguageFromContent(content: string): string {
  if (!content) return 'code';
  
  // Python detection
  if (content.includes('print(') || content.includes('def ') || content.includes('import ')) {
    return 'python';
  }
  
  // JavaScript detection
  if (content.includes('console.log') || content.includes('function') || content.includes('=>')) {
    return 'javascript';
  }
  
  // Add more detection logic as needed
  return 'code';
}

export async function POST(req: NextRequest) {
  try {
    const { query, sessionId, limit = 5 } = await req.json();

    // Validate inputs
    if (!query || typeof query !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Invalid or missing search query.',
        results: []
      }, { status: 400 });
    }

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Invalid or missing sessionId.',
        results: []
      }, { status: 400 });
    }

    // Step 1: Generate embedding for user query
    console.log('Generating embedding for query:', query);
      const embeddingResponse = await novitaClient.generateEmbeddings(query);
    const queryEmbedding = embeddingResponse.data[0].embedding;
   
    // Step 2: Search Zilliz for similar vectors
    console.log('Searching Zilliz for similar vectors...');
    const zillizClient = new ZillizClient();
    const searchResults: CodeChunk[] = await zillizClient.searchVectors(queryEmbedding, sessionId, limit);
    console.log('🔍 DEBUG: Raw search results from database:', searchResults);
    searchResults.forEach((result, index) => {
      console.log(`Result ${index + 1}:`, {
        filePath: result.filePath,
        content: result.content?.substring(0, 100) + '...',
        sessionId: result.sessionId,
        similarity: result.similarity
      });
    });
   
    // Step 3: Format results for frontend
    const formattedResults: SearchResult[] = searchResults.map(hit => {
      // Extract actual file info if available
      const actualFilePath = hit.filePath && hit.filePath !== '' ? hit.filePath : null;
      const actualFileName = actualFilePath ? actualFilePath.split('/').pop() : null;
      const actualExtension = actualFilePath ? `.${actualFilePath.split('.').pop()}` : null;
      
      return {
        filePath: actualFilePath || `Unknown file from session ${hit.sessionId}`,
        content: hit.content || '',
        similarity: hit.similarity || 0,
        fileName: actualFileName || `Unknown file`,
        fileExtension: actualExtension || '.txt',
        lineNumber: hit.lineNumber || 1,
        // Enhanced details
        language: getLanguageFromExtension(actualFilePath || '') || detectLanguageFromContent(hit.content || ''),
        linesOfCode: hit.content ? hit.content.split('\n').length : 0,
        functionName: extractFunctionName(hit.content || ''),
        tags: generateTags(hit.content || ''),
        summary: actualFilePath ? `Code snippet from ${actualFilePath}` : 'Code snippet from uploaded file',
        mode: 'search'
      };
    });

    console.log('Final formatted results:', formattedResults);
    console.log('Results count:', formattedResults.length);
   
    return NextResponse.json({
      success: true,
      message: 'Search completed successfully.',
      results: formattedResults
    }, { status: 200 });
   
  } catch (error: any) {
    console.error('Search API error:', error);
      return NextResponse.json({
        success: false,
      message: 'Search failed: ' + error.message,
        results: []
    }, { status: 500 });
  }
} 