import { NextRequest, NextResponse } from 'next/server';
import { getMilvusClient, COLLECTION_NAME, queryBySessionId } from '../../../lib/milvus';

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ success: false, message: 'Invalid or missing sessionId.', graph: {} }, { status: 400 });
    }

    const sessionChunks = await queryBySessionId(sessionId);

    if (!sessionChunks || sessionChunks.length === 0) {
      return NextResponse.json({ success: false, message: 'No code indexed for this session ID in Zilliz. Please upload and index code first.', graph: {} }, { status: 404 });
    }

    // Simplified visualization: nodes are files, and all files in a session are connected.
    // In a real scenario, this would involve static analysis to build a proper AST/dependency graph.
    const nodes: Array<{ id: string; label: string }> = [];
    const edges: Array<{ from: string; to: string }> = [];

    const uniqueFilePaths = Array.from(new Set(sessionChunks.map(chunk => chunk.file_path)));

    uniqueFilePaths.forEach(filePath => {
      nodes.push({ id: filePath, label: filePath.split('/').pop() || filePath });
    });

    // Create simple connections for visualization (e.g., all files related to a central session node)
    if (uniqueFilePaths.length > 1) {
      for (let i = 0; i < uniqueFilePaths.length; i++) {
        for (let j = i + 1; j < uniqueFilePaths.length; j++) {
          edges.push({ from: uniqueFilePaths[i], to: uniqueFilePaths[j] });
        }
      }
    } else if (uniqueFilePaths.length === 1) {
      // For a single file, just add a dummy self-loop or a single node indication
      edges.push({ from: uniqueFilePaths[0], to: uniqueFilePaths[0], label: "Self-contained" });
    }

    const graphData = {
      nodes,
      edges,
    };

    return NextResponse.json({ success: true, message: 'Visualization data generated successfully from Zilliz data.', graph: graphData }, { status: 200 });
  } catch (error: any) {
    console.error('API error in visualize route:', error);
    if (error.message.includes('not available during build')) {
      return NextResponse.json({
        success: false,
        message: 'Vector database not available during build.',
        graph: {}
      }, { status: 503 });
    }
    return NextResponse.json({ success: false, message: 'An unexpected error occurred during visualization.', graph: {} }, { status: 500 });
  }
} 