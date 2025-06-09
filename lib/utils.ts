import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function uploadCodebase(file: File): Promise<string> {
  // In a real implementation, this would be an actual API call
  // For now, we'll simulate the API call

  const formData = new FormData()
  formData.append("file", file)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Return a mock session ID
  return "session_" + Math.random().toString(36).substring(2, 15)
}

export async function searchCode(sessionId: string, query: string): Promise<SearchResult[]> {
  // In a real implementation, this would be an actual API call
  // For now, we'll simulate the API call

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Return mock results
  return [
    {
      fileName: "utils.py",
      functionName: "parse_json",
      codeSnippet: `def parse_json(json_str):\n    """Parse JSON string and handle errors gracefully."""\n    try:\n        return json.loads(json_str)\n    except json.JSONDecodeError as e:\n        logger.error(f"Failed to parse JSON: {e}")\n        return None`,
      summary: "Parses JSON strings with error handling and logging.",
    },
    // Add more mock results as needed
  ]
}

export async function clearSession(sessionId: string): Promise<void> {
  // In a real implementation, this would be an actual API call
  // For now, we'll simulate the API call

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Nothing to return
  return
}

// Helper type for SearchResult to avoid circular imports
interface SearchResult {
  fileName: string
  functionName?: string
  codeSnippet: string
  summary: string
}

export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must be of the same length");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0; // Avoid division by zero
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

export function generateTeachingExplanation(
  content: string,
  fileName: string,
  fileExtension: string,
  stepNumber: number
): string {
  return `Step ${stepNumber}: Explanation for ${fileName} (${fileExtension}) is not yet implemented.`;
}
