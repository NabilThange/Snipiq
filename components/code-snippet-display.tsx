"use client"

import { useState } from "react"
import { Copy, Check, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CodeSnippetDisplayProps {
  fileName: string
  code: string
  language: string
  functionName?: string
  className?: string
}

export default function CodeSnippetDisplay({
  fileName,
  code,
  language,
  functionName,
  className = "",
}: CodeSnippetDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "python":
        return "bg-[#3776ab] text-white"
      case "javascript":
        return "bg-[#f7df1e] text-black"
      case "typescript":
        return "bg-[#3178c6] text-white"
      case "html":
        return "bg-[#e34f26] text-white"
      case "css":
        return "bg-[#1572b6] text-white"
      default:
        return "bg-black text-white"
    }
  }

  return (
    <div className={`bg-white border-4 border-black shadow-[6px_6px_0px_#000000] ${className}`}>
      {/* Header */}
      <div className="border-b-4 border-black p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Code className="w-5 h-5 text-black mr-3" />
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-black text-black uppercase font-mono text-lg">{fileName}</h3>
              <div
                className={`border-2 border-black px-2 py-1 text-xs font-black uppercase ${getLanguageColor(language)}`}
              >
                {language.toUpperCase()}
              </div>
            </div>
            {functionName && <p className="font-bold text-black text-sm uppercase mt-1">{functionName}</p>}
          </div>
        </div>
        <Button
          onClick={handleCopy}
          className="bg-[#ff3f3f] border-4 border-black text-white font-black uppercase px-4 py-2 h-auto hover:bg-[#e03535] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              COPIED
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              COPY CODE
            </>
          )}
        </Button>
      </div>

      {/* Code Display */}
      <div className="p-4">
        <ScrollArea className="h-[250px] border-4 border-black bg-black p-4">
          <pre className="text-sm font-mono whitespace-pre overflow-x-auto text-[#00ff88] font-bold">
            <code>{code}</code>
          </pre>
        </ScrollArea>
      </div>
    </div>
  )
}
