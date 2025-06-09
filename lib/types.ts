export interface SearchResult {
  filePath: string;
  content: string;
  similarity: number;
  fileName?: string;
  fileExtension?: string;
  lineNumber?: number;
  language?: string;
  linesOfCode?: number;
  functionName?: string;
  tags?: string[];
  summary?: string;
  mode?: string;
}

export interface UploadResponse {
  sessionId: string
}

export interface SearchRequest {
  sessionId: string
  queryText: string
  mode?: SearchMode
}

export interface SearchResponse {
  results: SearchResult[]
}

export interface ClearSessionRequest {
  sessionId: string
}

export interface ClearSessionResponse {
  message: string
}

export interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export interface FileItem {
  path: string
  name: string
  language: string
  functions: string[]
}

export interface GraphNode {
  id: string
  label: string
  type: "file" | "function" | "class"
  language: string
  x: number
  y: number
  connections: string[]
}

export interface BuildStep {
  id: string
  title: string
  description: string
  command?: string
  explanation: string
  status: "pending" | "completed" | "current"
  troubleshooting?: string[]
}

export interface ProjectAnalysis {
  language: string
  framework?: string
  packageManager: string
  dependencies: string[]
  buildSteps: BuildStep[]
  keyFiles: FileItem[]
  environment: string[]
}

export type SearchMode = "build-understand" | "search" | "summarize" | "chat" | "visualize"
