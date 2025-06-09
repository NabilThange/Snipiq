"use client"

import type React from "react"

import { useState } from "react"
import { Search, FileText, MessageCircle, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { SearchMode } from "@/lib/types"

interface SearchInterfaceProps {
  onSearch: (query: string) => void
  isSearching: boolean
  currentMode: SearchMode
}

export default function SearchInterface({ onSearch, isSearching, currentMode }: SearchInterfaceProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim().length >= 3) {
      onSearch(query)
    }
  }

  const getModeConfig = (mode: SearchMode) => {
    switch (mode) {
      case "search":
        return { icon: Search, label: "SEARCH", placeholder: "SEARCH FOR CODE SNIPPETS..." }
      case "summarize":
        return { icon: FileText, label: "SUMMARIZE", placeholder: "DESCRIBE WHAT TO SUMMARIZE..." }
      case "chat":
        return { icon: MessageCircle, label: "ASK", placeholder: "ASK ANYTHING ABOUT YOUR CODE..." }
      case "visualize":
        return { icon: BarChart3, label: "VISUALIZE", placeholder: "DESCRIBE WHAT TO VISUALIZE..." }
      default:
        return { icon: Search, label: "SEARCH", placeholder: "ASK ANYTHING ABOUT YOUR CODE..." }
    }
  }

  const config = getModeConfig(currentMode)
  const Icon = config.icon

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 py-4">
      <div className="container mx-auto max-w-5xl">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder={config.placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border-4 border-black text-black font-bold text-lg px-4 py-4 h-auto placeholder:text-black placeholder:opacity-60 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#ff3f3f] uppercase font-mono"
              aria-label={`${currentMode} your codebase`}
            />
          </div>
          <Button
            type="submit"
            disabled={query.trim().length < 3 || isSearching}
            className="bg-[#ff3f3f] border-4 border-black text-white font-black uppercase text-lg px-8 py-4 h-auto hover:bg-[#e03535] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <>
                <div className="w-6 h-6 border-4 border-t-transparent border-white animate-spin mr-2"></div>
                {config.label}ING...
              </>
            ) : (
              <>
                <Icon className="w-6 h-6 mr-2" />
                {config.label}
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
