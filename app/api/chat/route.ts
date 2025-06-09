import { NextRequest, NextResponse } from 'next/server';
import NovitaClient from '../../../lib/novita-client';
import { getMilvusClient, searchVectors } from '../../../lib/milvus';

const novitaClient = new NovitaClient(process.env.NOVITA_API_KEY || '');

const COLLECTION_NAME = 'code_embeddings';

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, limit = 3 } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Invalid or missing message.',
        response: ''
      }, { status: 400 });
    }

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Invalid or missing sessionId.',
        response: ''
      }, { status: 400 });
    }

    let queryEmbedding: number[];
    try {
      const embeddingResponse = await novitaClient.generateEmbeddings(message);
      if (!embeddingResponse.data || embeddingResponse.data.length === 0) {
        throw new Error('No embedding data returned for the message.');
      }
      queryEmbedding = embeddingResponse.data[0].embedding;
    } catch (error) {
      console.error('Error generating query embedding for chat:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to generate embedding for the message.',
        response: ''
      }, { status: 500 });
    }

    // Use ZillizClient to search for relevant code chunks
    const relevantChunks = await searchVectors(queryEmbedding, sessionId, limit);

    if (relevantChunks.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No relevant code context found for this session.',
        response: 'I could not find relevant information in the provided codebase to answer your question.'
      }, { status: 200 });
    }

    const context = relevantChunks.map(chunk =>
      "File: " + chunk.filePath + "\n```\n" + chunk.content + "\n```\n"
    ).join('\n\n');

    const chatMessages = [
      {
        role: 'system',
        content: 'You are an AI assistant that answers questions about codebases. Use the provided context to answer the user\'s question. If the answer is not in the context, state that you don\'t have enough information.'
      },
      {
        role: 'user',
        content: 'Context:\n' + context + '\n\nQuestion: ' + message
      },
    ];

    let chatResponseContent: string;
    try {
      const chatCompletionResponse = await novitaClient.chatCompletion(chatMessages);
      chatResponseContent = chatCompletionResponse.choices[0]?.message?.content || 'No response.';
    } catch (chatError) {
      console.error('Error during chat completion:', chatError);
      return NextResponse.json({
        success: false,
        message: 'Failed to get chat completion.',
        response: ''
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Chat response generated successfully.',
      response: chatResponseContent
    }, { status: 200 });
  } catch (error: any) {
    console.error('API error in chat route:', error);
    if (error.message.includes('not available during build')) {
      return NextResponse.json({
        success: false,
        message: 'Vector database not available during build.',
        response: ''
      }, { status: 503 });
    }
    return NextResponse.json({ success: false, message: 'An unexpected error occurred during chat.', response: '' }, { status: 500 });
  }
} 