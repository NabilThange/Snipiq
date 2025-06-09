// lib/milvus.ts
import { MilvusClient, DataType } from '@zilliz/milvus2-sdk-node';

interface CodeChunk {
  id: number;
  content: string;
  file_path: string; // Consistent with Milvus schema
  embedding: number[];
  sessionId: string;
  similarity?: number; // Score from search
}

const COLLECTION_NAME = 'code_embeddings';

const getMilvusClient = async () => {
  const config: any = {
    address: process.env.MILVUS_HOST || 'localhost',
    port: process.env.MILVUS_PORT ? parseInt(process.env.MILVUS_PORT) : 19530,
    ssl: true, // Always true for Zilliz Cloud
  };

  // Add token if available
  if (process.env.MILVUS_TOKEN) {
    config.token = process.env.MILVUS_TOKEN;
  }

  const client = new MilvusClient(config);

  // Ensure collection exists
  try {
    console.log(`Checking if collection '${COLLECTION_NAME}' exists...`);
    const hasCollection = await client.hasCollection({ collection_name: COLLECTION_NAME });
    console.log(`Collection '${COLLECTION_NAME}' exists: ${hasCollection.value}`);
    
    if (!hasCollection.value) {
      console.log(`Collection '${COLLECTION_NAME}' not found, creating it...`);
      // Create collection with explicit fields
      await client.createCollection({
        collection_name: COLLECTION_NAME,
        fields: [
          {
            name: 'id',
            data_type: DataType.Int64,
            is_primary_key: true,
            autoID: true
          },
          {
            name: 'content',
            data_type: DataType.VarChar,
            max_length: 65535
          },
          {
            name: 'file_path',
            data_type: DataType.VarChar,
            max_length: 1024
          },
          {
            name: 'embedding',
            data_type: DataType.FloatVector,
            type_params: { dim: '1024' }
          }
        ],
        enable_dynamic_field: true
      });

      // Removed: Index creation logic moved to api/index/route.ts

    }
  } catch (error) {
    console.error('Error creating/checking collection:', error);
    throw error;
  }

  return client;
};

async function queryBySessionId(sessionId: string): Promise<any[]> {
  const client = await getMilvusClient();
  try {
    const queryResult = await client.query({
      collection_name: COLLECTION_NAME,
      filter: `sessionId == "${sessionId}"`,
      output_fields: ['content', 'file_path', 'embedding', 'sessionId'],
    });
    return queryResult.data || [];
  } catch (error) {
    console.error(`Error querying data for session ${sessionId}:`, error);
    throw new Error(`Failed to query session data: ${error}`);
  }
}

async function searchVectors(
  queryEmbedding: number[],
  sessionId: string,
  limit: number = 5
): Promise<CodeChunk[]> {
  const client = await getMilvusClient();
  try {
    const searchResult = await client.search({
      collection_name: COLLECTION_NAME,
      vectors: [queryEmbedding],
      limit: limit,
      filter: `sessionId == "${sessionId}"`,
      output_fields: ['id', 'content', 'file_path', 'embedding', 'sessionId'],
    });

    const results: CodeChunk[] = [];
    if (searchResult.results && searchResult.results[0]) {
      searchResult.results[0].forEach((hit: any) => {
        results.push({
          id: hit.id,
          content: hit.content,
          file_path: hit.file_path,
          embedding: hit.embedding,
          sessionId: hit.sessionId,
          similarity: hit.score, // Milvus returns the similarity score as 'score'
        });
      });
    }
    return results;
  } catch (error) {
    console.error(`Error searching data for session ${sessionId}:`, error);
    throw new Error(`Failed to search session data: ${error}`);
  }
}

export { getMilvusClient, COLLECTION_NAME, queryBySessionId, searchVectors }; 