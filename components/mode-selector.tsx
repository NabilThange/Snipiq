"use client"

import { Wrench, Search, FileText, MessageCircle, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SearchMode } from "@/lib/types"

interface ModeSelectorProps {
  currentMode: SearchMode
  onModeChange: (mode: SearchMode) => void
}

export default function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const modes = [
    {
      id: "build-understand" as SearchMode,
      label: "GUIDE",
      icon: Wrench,
      description: "BUILD & LEARN",
    },
    {
      id: "search" as SearchMode,
      label: "SEARCH",
      icon: Search,
      description: "FIND CODE SNIPPETS",
    },
    {
      id: "summarize" as SearchMode,
      label: "SUMMARIZE",
      icon: FileText,
      description: "GENERATE SUMMARIES",
    },
    {
      id: "chat" as SearchMode,
      label: "CHAT",
      icon: MessageCircle,
      description: "ASK QUESTIONS",
    },
    {
      id: "visualize" as SearchMode,
      label: "VISUALIZE",
      icon: BarChart3,
      description: "CREATE DIAGRAMS",
    },
  ]

  return (
    <div className="flex gap-3 w-full max-w-4xl">
      {modes.map((mode) => {
        const Icon = mode.icon
        const isActive = currentMode === mode.id
        const isPrimary = mode.id === "build-understand"

        return (
          <Button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`${
              isActive
                ? isPrimary
                  ? "bg-[#00FF88] text-black border-4 border-black shadow-[6px_6px_0px_#FF3F3F] transform -translate-y-1"
                  : "bg-[#ff3f3f] text-white border-4 border-black shadow-[4px_4px_0px_#000000]"
                : "bg-white text-black border-4 border-black shadow-[4px_4px_0px_#000000] hover:bg-[#e0e0e0]"
            } font-black uppercase px-3 py-3 h-auto hover:transform hover:translate-y-1 transition-all duration-300 hover:shadow-[2px_2px_0px_#000000] flex flex-col items-center gap-1 flex-1 min-w-0 ${
              isPrimary && isActive ? "ring-4 ring-[#FF3F3F] ring-offset-2" : ""
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs whitespace-nowrap leading-tight">{mode.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
