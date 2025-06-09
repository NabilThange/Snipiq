import { NextRequest, NextResponse } from 'next/server';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  extension?: string;
  children?: FileNode[];
  content?: string;
}

export interface UploadResponse {
  message: string;
  filename: string;
  size: number;
  sessionId: string;
  directoryTree: FileNode;
  codeFiles: FileNode[];
  totalCodeFiles: number;
  tempDir: string;
}

export interface IndexResponse {
  success: boolean;
  message: string;
  chunksProcessed: number;
  processingTime: number;
  sessionId: string;
}

export interface SearchResultItem {
  filePath: string;
  content: string;
  similarity: number;
  startLine?: number; // Optional, as it's not directly returned by Zilliz in my current schema
}

export interface SearchResponse {
  success: boolean;
  message: string;
  results: SearchResultItem[];
}

export interface SummarizeResponse {
  success: boolean;
  message: string;
  summary: string;
  summaryType?: string;
  fileContent?: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  response: string;
}

export interface BuildStep {
  stepNumber: number;
  filePath: string;
  content: string;
  explanation: string;
}

export interface BuildGuideResponse {
  success: boolean;
  message: string;
  steps: BuildStep[];
}

export interface VisualizeNode {
  id: string;
  label: string;
}

export interface VisualizeEdge {
  from: string;
  to: string;
  label?: string;
}

export interface VisualizeResponse {
  success: boolean;
  message: string;
  graph: {
    nodes: VisualizeNode[];
    edges: VisualizeEdge[];
  };
}

export interface IndexRequest {
  codeFiles: FileNode[];
  tempDir: string;
  totalFiles: number;
}

interface ApiClientOptions {
  baseUrl?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(options?: ApiClientOptions) {
    this.baseUrl = options?.baseUrl || '/api';
  }

  private async request<T>(endpoint: string, method: string, data?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error(`API Client Error (${method} ${url}):`, error);
      throw error;
    }
  }

  async uploadFiles(formData: FormData): Promise<UploadResponse> {
    console.log("API Client: Starting file upload...")
    
    try {
      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
      })

      console.log("API Client: Upload response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API Client: Upload failed with status", response.status, errorData)
        throw new Error(`Upload failed: ${errorData.error || errorData.message || `HTTP ${response.status}`}`)
      }

      const data = await response.json() as UploadResponse
      console.log("API Client: Upload successful, files extracted:", data.totalCodeFiles)
      
      return data
    } catch (error) {
      console.error("API Client: Upload error:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Upload request failed")
    }
  }

  async indexCode(sessionId: string, indexData: IndexRequest): Promise<void> {
    console.log("API Client: Starting code indexing for session:", sessionId)
    
    try {
      const response = await fetch(`${this.baseUrl}/index`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          codeFiles: indexData.codeFiles,
          tempDir: indexData.tempDir,
          totalFiles: indexData.totalFiles
        }),
      })

      console.log("API Client: Index response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API Client: Indexing failed with status", response.status, errorData)
        throw new Error(`Indexing failed: ${errorData.error || errorData.message || `HTTP ${response.status}`}`)
      }

      const data = await response.json()
      console.log("API Client: Indexing successful:", data.message || "Complete")
    } catch (error) {
      console.error("API Client: Indexing error:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Indexing request failed")
    }
  }

  async searchCode(query: string, sessionId: string, limit?: number): Promise<SearchResponse> {
    return this.request<SearchResponse>('/search', 'POST', { query, sessionId, limit });
  }

  async summarizeText(sessionId: string, filePath: string): Promise<SummarizeResponse> {
    return this.request<SummarizeResponse>('/summarize', 'POST', { sessionId, filePath });
  }

  async generateProjectSummary(sessionId: string, summaryType: string = 'overview'): Promise<SummarizeResponse> {
    return this.request<SummarizeResponse>('/summarize', 'POST', { sessionId, summaryType });
  }

  async chatWithCode(message: string, sessionId: string, limit?: number): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', 'POST', { message, sessionId, limit });
  }

  async getBuildGuide(sessionId: string): Promise<BuildGuideResponse> {
    return this.request<BuildGuideResponse>('/build-guide', 'POST', { sessionId });
  }

  async getBuildGuideStream(sessionId: string, onUpdate: (data: any) => void, onComplete: () => void, onError: (error: string) => void): Promise<void> {
    console.log("API Client: Requesting build guide stream for session:", sessionId);
    try {
      const response = await fetch(`${this.baseUrl}/build-guide-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Client: Stream request failed with status", response.status, errorText);
        onError(`Failed to get build guide stream: HTTP ${response.status} - ${errorText}`);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        onError("Failed to get readable stream from response.");
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n\n')) !== -1) {
          const message = buffer.substring(0, newlineIndex);
          buffer = buffer.substring(newlineIndex + 2);

          if (message.startsWith('data: ')) {
            try {
              const data = JSON.parse(message.substring(6));
              onUpdate(data);
              if (data.type === 'complete') {
                onComplete();
                reader.releaseLock();
                return;
              }
            } catch (parseError) {
              console.error("API Client: Error parsing stream message:", parseError, message);
              onError(`Error parsing stream message: ${message}`);
            }
          }
        }
      }
      onComplete();
    } catch (error: any) {
      console.error("API Client: Stream error:", error);
      onError(error.message || "An unknown error occurred during streaming");
    }
  }

  async getVisualizationData(sessionId: string): Promise<VisualizeResponse> {
    return this.request<VisualizeResponse>('/visualize', 'POST', { sessionId });
  }
}

export const apiClient = new ApiClient(); 