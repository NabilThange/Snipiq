import { NextRequest, NextResponse } from 'next/server';
import { queryBySessionId } from '@/lib/milvus';
import NovitaClient from '@/lib/novita-client'; // Assuming this is your AI client
import { generateTeachingExplanation } from '@/lib/utils'; // Assuming this utility function exists

const novitaClient = new NovitaClient(process.env.NOVITA_API_KEY as string);
const BATCH_SIZE = 5; // Adjust based on API rate limits

interface BuildStep {
  stepNumber: number;
  filePath: string;
  content: string;
  explanation: string;
  fileName: string;
  fileExtension: string;
  chunkType: string;
  startLine: number;
  endLine: number;
}

interface SessionChunk {
  content: string;
  filePath: string;
  file_path?: string; // Older sessions might have this
  chunkType?: string;
  startLine: number;
  endLine: number;
}

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();

  // Basic validation
  if (!sessionId) {
    return new NextResponse(JSON.stringify({ error: 'Session ID is required' }), { status: 400 });
  }

  // Create a readable stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const sessionChunks: SessionChunk[] = await queryBySessionId(sessionId);
        
        // Send total count first
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'total', count: sessionChunks.length })}\n\n`));
        
        const buildSteps: BuildStep[] = [];

        // Process chunks in batches to respect rate limits
        for (let i = 0; i < sessionChunks.length; i += BATCH_SIZE) {
          const batch = sessionChunks.slice(i, i + BATCH_SIZE);
          
          const batchPromises = batch.map(async (chunk, batchIndex) => {
            const stepNumber = i + batchIndex + 1;
            const filePath = chunk.file_path || chunk.filePath || 'Unknown file';
            const content = chunk.content || '';
            
            if (!content.trim()) return null;
            
            const fileName = filePath.split('/').pop() || 'Unknown';
            const fileExtension = fileName.includes('.') ? fileName.split('.').pop() || '' : '';
            
            try {
              let explanation = 'No explanation generated.';
              if (novitaClient.teachCodeCreation) {
                const teachingResponse = await novitaClient.teachCodeCreation(content, fileName, stepNumber);
                explanation = teachingResponse?.summary || 'Failed to generate teaching explanation.';
              } else {
                explanation = generateTeachingExplanation(content, fileName, fileExtension, stepNumber);
              }
              
              const step: BuildStep = {
                stepNumber,
                filePath,
                content,
                explanation,
                fileName,
                fileExtension,
                chunkType: chunk.chunkType || 'code',
                startLine: chunk.startLine,
                endLine: chunk.endLine
              };
              
              // Send each completed step immediately
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'step', step })}\n\n`));
              
              return step;
            } catch (error) {
              console.error(`Error processing ${filePath}:`, error);
              // Even if there's an error, send a partial update for progress
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: `Error processing ${filePath}: ${error}`, stepNumber })}\n\n`));
              return null;
            }
          });
          
          await Promise.all(batchPromises);
          
          // Add delay between batches to respect rate limits
          if (i + BATCH_SIZE < sessionChunks.length) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
          }
        }
        
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'complete' })}\n\n`));
        controller.close();
      } catch (error: any) {
        console.error('Stream error:', error);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: error.message || 'An unknown error occurred during streaming' })}\n\n`));
        controller.close();
      }
    }
  });
  
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
} 