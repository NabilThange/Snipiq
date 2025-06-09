"use client"

import type { SearchResult, SearchMode } from "@/lib/types"
import ResultCard from "./result-card"

interface ResultsDisplayProps {
  results: SearchResult[]
  query: string
  isSearching: boolean
  mode: SearchMode
}

export default function ResultsDisplay({ results, query, isSearching, mode }: ResultsDisplayProps) {
  const getModeTitle = (mode: SearchMode) => {
    switch (mode) {
      case "search":
        return "SEARCH RESULTS"
      case "summarize":
        return "SUMMARIES"
      case "chat":
        return "AI RESPONSES"
      case "visualize":
        return "VISUALIZATIONS"
      default:
        return "RESULTS"
    }
  }

  const getEmptyStateMessage = (mode: SearchMode) => {
    switch (mode) {
      case "search":
        return "NO MATCHING CODE FOUND. TRY REPHRASING YOUR SEARCH."
      case "summarize":
        return "NO SUMMARIES GENERATED. TRY DESCRIBING WHAT TO SUMMARIZE."
      case "chat":
        return "NO RESPONSES YET. ASK A QUESTION ABOUT YOUR CODEBASE."
      case "visualize":
        return "NO VISUALIZATIONS CREATED. DESCRIBE WHAT YOU WANT TO SEE."
      default:
        return "NO RESULTS FOUND."
    }
  }

  if (isSearching) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black bg-white mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-black animate-pulse"></div>
          </div>
          <p className="text-[#00ff88] font-black uppercase text-xl font-mono animate-pulse">
            {mode.toUpperCase()}ING...
          </p>
        </div>
      </div>
    )
  }

  if (query && results.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center py-12 border-4 border-black bg-white shadow-[6px_6px_0px_#000000] max-w-2xl">
          <p className="text-black font-black uppercase text-xl font-mono px-8">{getEmptyStateMessage(mode)}</p>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-black uppercase text-black font-mono tracking-tight mb-4">
            READY TO {mode.toUpperCase()}
          </h2>
          <p className="text-black font-bold text-lg">USE THE SEARCH BAR BELOW TO GET STARTED</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase text-black font-mono tracking-tight">{getModeTitle(mode)}</h2>
        <div className="bg-[#00ff88] border-2 border-black px-3 py-1 text-black font-black text-sm uppercase">
          {results.length} RESULT{results.length !== 1 ? "S" : ""}
        </div>
      </div>
      <div className="space-y-6">
        {results.map((result, index) => (
          <ResultCard key={index} result={result} />
        ))}
      </div>
    </div>
  )
}
