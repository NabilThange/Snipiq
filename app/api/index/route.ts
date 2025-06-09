import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises'; // Use async fs
import path from 'path';
import { CodeChunker } from '../../../lib/code-chunker';
import NovitaClient from '../../../lib/novita-client';
import { getMilvusClient, COLLECTION_NAME } from '../../../lib/milvus';
import { IndexState } from '@zilliz/milvus2-sdk-node';

const novitaClient = new NovitaClient(process.env.NOVITA_API_KEY || '');

// Configuration constants
const MAX_INDEX_WAIT_TIME = 10 * 60 * 1000; 
const POLLING_INTERVAL = 2000;
const MAX_CONCURRENT_FILES = 5; // Process max 5 files concurrently
const MAX_CONCURRENT_EMBEDDINGS = 10; // Process max 10 embeddings concurrently
const BATCH_SIZE = 20; // Process embeddings in batches
const MAX_RETRIES = 30; // Max attempts for index polling

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  extension?: string;
  children?: FileNode[];
  content?: string; // Only for code files
}

// Utility function for controlled concurrency
async function processConcurrently<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  maxConcurrency: number
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += maxConcurrency) {
    const batch = items.slice(i, i + maxConcurrency);
    const batchResults = await Promise.allSettled(
      batch.map(processor)
    );
    
    // Extract successful results and log failures
    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.warn('Processing failed:', result.reason);
      }
    }
  }
  
  return results;
}

// New function to process code file content directly
async function processCodeFileContent(file: FileNode, sessionId: string) {
  try {
    const fileContent = file.content || '';
    const filePath = file.path;
    const fileExtension = file.extension || '';
    
    // Generate chunks
    const codeChunks = await CodeChunker.generateChunks(fileContent, fileExtension);
    console.log(`Generated ${codeChunks.length} chunks for ${filePath}`);
    
    if (codeChunks.length === 0) {
      return [];
    }

    const embeddingsToInsert: Array<{
      content: string;
      file_path: string;
      embedding: number[];
      sessionId: string;
      startLine?: number;
      endLine?: number;
      chunkType?: string;
    }> = [];

    const processChunk = async (chunk: any) => {
      try {
        const embeddingResponse = await novitaClient.generateEmbeddings(chunk.content);
        if (embeddingResponse.data && embeddingResponse.data.length > 0) {
          const embedding = embeddingResponse.data[0].embedding;
          return {
            content: chunk.content,
            file_path: filePath,
            embedding: embedding,
            sessionId: sessionId,
            startLine: chunk.startLine,
            endLine: chunk.endLine,
            chunkType: chunk.type
          };
        }
        return null;
      } catch (error) {
        console.error(`Failed to generate embedding for chunk in ${filePath}:`, error);
        return null;
      }
    };

    const results = await processConcurrently(
      codeChunks,
      processChunk,
      MAX_CONCURRENT_EMBEDDINGS
    );

    const validResults = results.filter(result => result !== null);
    embeddingsToInsert.push(...validResults);

    console.log(`Processed ${validResults.length}/${codeChunks.length} chunks for ${filePath}`);
    return embeddingsToInsert;

  } catch (error) {
    console.warn(`Could not process file ${file.path}:`, error);
    return [];
  }
}

// Optimized index creation with better error handling
async function createIndexIfNeeded(milvusClient: any, totalEmbeddings: number) {
  try {
    // Check if index already exists
    const indexInfo = await milvusClient.describeIndex({
      collection_name: COLLECTION_NAME,
      field_name: 'embedding'
    }).catch(() => null);

    if (indexInfo && indexInfo.index_descriptions?.length > 0) {
      console.log('Index already exists, skipping creation');
      return true;
    }

    console.log(`Creating index for collection '${COLLECTION_NAME}'...`);
    await milvusClient.createIndex({
      collection_name: COLLECTION_NAME,
      field_name: 'embedding',
      index_name: 'embedding_index',
      extra_params: {
        index_type: 'IVF_FLAT',
        metric_type: 'COSINE',
        params: JSON.stringify({ 
          nlist: Math.min(128, Math.max(4, Math.ceil(totalEmbeddings / 2)))
        }),
      },
    });

    // Optimized polling with exponential backoff
    let elapsedTime = 0;
    let pollInterval = POLLING_INTERVAL;
    let retryCount = 0; // New: retry counter
    
    while (elapsedTime < MAX_INDEX_WAIT_TIME && retryCount < MAX_RETRIES) {
      const stateResponse = await milvusClient.getIndexState({
        collection_name: COLLECTION_NAME,
        field_name: 'embedding',
        index_name: 'embedding_index',
      });

      const indexState = stateResponse.state;
      console.log(`Index state: ${indexState} (${Math.round(elapsedTime / 1000)}s elapsed)`);

      if (indexState === 'Finished' || indexState === 'IndexStateFinished') {
        console.log('Index creation completed successfully');
        return true;
      }

      if (indexState === 'Failed' || indexState === 'IndexStateFailed') {
        throw new Error('Index creation failed');
      }

      // Exponential backoff for polling
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      elapsedTime += pollInterval;
      pollInterval = Math.min(pollInterval * 1.2, 10000); // Max 10s intervals
      retryCount++; // Increment retry count
    }

    throw new Error(`Index creation timed out after ${MAX_INDEX_WAIT_TIME / 1000} seconds or exceeded ${MAX_RETRIES} retries.`);
    
  } catch (error) {
    console.error('Index creation error:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log('Starting indexing process...');

  try {
    const { sessionId, codeFiles } = await req.json(); // Changed to expect codeFiles

    if (!sessionId || !codeFiles || !Array.isArray(codeFiles)) {
      return NextResponse.json({ 
        error: 'Invalid request parameters',
        details: 'SessionId and codeFiles array are required' // Updated error message
      }, { status: 400 });
    }

    console.log(`Processing ${codeFiles.length} code files...`); // Updated log

    // Process files concurrently with controlled concurrency
    const allEmbeddings = await processConcurrently(
      codeFiles, // Changed from filePaths to codeFiles
      (file: FileNode) => processCodeFileContent(file, sessionId), // Use new function
      MAX_CONCURRENT_FILES
    );

    // Flatten results
    const embeddingsToInsert = allEmbeddings.flat();
    const totalProcessingTime = Date.now() - startTime;

    console.log(`Generated ${embeddingsToInsert.length} embeddings in ${totalProcessingTime}ms`);

    if (embeddingsToInsert.length === 0) {
      return NextResponse.json({ 
        message: 'No embeddings could be generated',
        details: 'Check file contents and embedding generation',
        processingTime: totalProcessingTime
      }, { status: 400 });
    }

    // Get Milvus client and insert data
    const milvusClient = await getMilvusClient();
    
    console.log('Inserting embeddings into Milvus...');
    const insertStartTime = Date.now();
    
    // Insert in batches if dataset is large
    if (embeddingsToInsert.length > 1000) {
      for (let i = 0; i < embeddingsToInsert.length; i += 1000) {
        const batch = embeddingsToInsert.slice(i, i + 1000);
        await milvusClient.insert({
          collection_name: COLLECTION_NAME,
          data: batch
        });
        console.log(`Inserted batch ${Math.floor(i/1000) + 1}/${Math.ceil(embeddingsToInsert.length/1000)}`);
      }
    } else {
      await milvusClient.insert({
        collection_name: COLLECTION_NAME,
        data: embeddingsToInsert
      });
    }
    
    const insertTime = Date.now() - insertStartTime;
    console.log(`Embeddings inserted in ${insertTime}ms`);

    // Create index if needed
    const indexStartTime = Date.now();
    await createIndexIfNeeded(milvusClient, embeddingsToInsert.length);
    const indexTime = Date.now() - indexStartTime;

    // Load collection
    console.log(`Loading collection '${COLLECTION_NAME}'...`);
    const loadStartTime = Date.now();
    await milvusClient.loadCollection({ collection_name: COLLECTION_NAME });
    const loadTime = Date.now() - loadStartTime;
    console.log(`Collection loaded in ${loadTime}ms`);

    const totalTime = Date.now() - startTime;
    console.log(`Indexing process completed in ${totalTime}ms`);

    return NextResponse.json({ 
      success: true, 
      message: 'Indexing completed successfully',
      chunksProcessed: embeddingsToInsert.length,
      processingTime: totalTime,
      sessionId: sessionId
    }, { status: 200 });

  } catch (error) {
    console.error('Indexing API Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Indexing failed',
      details: error instanceof Error ? error.message : 'Unknown indexing error'
    }, { status: 500 });
  }
}