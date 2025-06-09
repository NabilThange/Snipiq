"use client"

import BuildUnderstandModeContent from "./modes/build-understand-mode-content"
import SearchModeContent from "./modes/search-mode-content"
import SummarizeModeContent from "./modes/summarize-mode-content"
import ChatModeContent from "./modes/chat-mode-content"
import VisualizeModeContent from "./modes/visualize-mode-content"
import type { SearchResult, SearchMode } from "@/lib/types"

interface ModeContentProps {
  mode: SearchMode
  results: SearchResult[]
  query: string
  isSearching: boolean
  sessionId: string
}

export default function ModeContent({ mode, results, query, isSearching, sessionId }: ModeContentProps) {
  switch (mode) {
    case "build-understand":
      return <BuildUnderstandModeContent sessionId={sessionId} isSearching={isSearching} />
    case "search":
      return <SearchModeContent results={results} query={query} isSearching={isSearching} />
    case "summarize":
      return <SummarizeModeContent sessionId={sessionId} isSearching={isSearching} />
    case "chat":
      return <ChatModeContent sessionId={sessionId} />
    case "visualize":
      return <VisualizeModeContent sessionId={sessionId} isSearching={isSearching} />
    default:
      return <BuildUnderstandModeContent sessionId={sessionId} isSearching={isSearching} />
  }
}
