"use client"

import { useState } from "react"
import { Copy, Check, Code, FileCode, Eye, MessageSquare, BarChart3, FileText } from "lucide-react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { SearchResult } from "@/lib/types"

interface ResultCardProps {
  result: SearchResult
}

export default function ResultCard({ result }: ResultCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(result.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getLanguageColor = (language: string) => {
    switch (language.toLowerCase()) {
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

  const getModeActionButton = (mode: string) => {
    switch (mode) {
      case "summarize":
        return (
          <Button className="bg-[#00ff88] border-2 border-black text-black font-black uppercase text-xs px-3 py-1 h-auto hover:bg-[#00e077] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[2px_2px_0px_#000000] hover:shadow-[1px_1px_0px_#000000]">
            <FileText className="w-3 h-3 mr-1" />
            SUMMARIZE
          </Button>
        )
      case "chat":
        return (
          <Button className="bg-[#00ff88] border-2 border-black text-black font-black uppercase text-xs px-3 py-1 h-auto hover:bg-[#00e077] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[2px_2px_0px_#000000] hover:shadow-[1px_1px_0px_#000000]">
            <MessageSquare className="w-3 h-3 mr-1" />
            DISCUSS
          </Button>
        )
      case "visualize":
        return (
          <Button className="bg-[#00ff88] border-2 border-black text-black font-black uppercase text-xs px-3 py-1 h-auto hover:bg-[#00e077] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[2px_2px_0px_#000000] hover:shadow-[1px_1px_0px_#000000]">
            <BarChart3 className="w-3 h-3 mr-1" />
            VISUALIZE
          </Button>
        )
      default:
        return (
          <Button className="bg-[#00ff88] border-2 border-black text-black font-black uppercase text-xs px-3 py-1 h-auto hover:bg-[#00e077] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[2px_2px_0px_#000000] hover:shadow-[1px_1px_0px_#000000]">
            <Eye className="w-3 h-3 mr-1" />
            VIEW FULL
          </Button>
        )
    }
  }

  return (
    <Card className="bg-white border-4 border-black shadow-[6px_6px_0px_#000000] hover:transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_#ff3f3f] transition-all duration-300 overflow-hidden">
      <CardHeader className="py-4 bg-white border-b-4 border-black">
        <div className="flex items-start justify-between">
          <div className="flex items-center flex-1">
            <FileCode className="w-6 h-6 text-black mr-3" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-black text-black uppercase font-mono text-lg">{result.fileName}</h3>
                <div
                  className={`border-2 border-black px-2 py-1 text-xs font-black uppercase ${getLanguageColor(result.language || "code")}`}
                >
                  {result.language || "CODE"}
                </div>
                <div className="bg-[#e0e0e0] border-2 border-black px-2 py-1 text-black font-black text-xs uppercase">
                  {result.linesOfCode || 0} LINES
                </div>
              </div>
              <p className="font-bold text-black text-sm uppercase mb-2">
                {result.functionName || "(ANONYMOUS CHUNK)"}
              </p>
              <div className="flex gap-1">
                {result.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-black text-white px-2 py-1 text-xs font-black uppercase border border-black"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Button
            onClick={handleCopy}
            className="bg-[#ff3f3f] border-4 border-black text-white font-black uppercase px-4 py-2 h-auto hover:bg-[#e03535] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] ml-4"
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
      </CardHeader>
      <div className="bg-gray-100 border-b-4 border-black p-3">
        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-black">
          <div><strong>📁 File Path:</strong> {result.filePath}</div>
          <div><strong>📍 Line Numbers:</strong> Lines {result.lineNumber}-{((result.lineNumber || 1) + (result.linesOfCode || 10))}</div>
          <div><strong>💯 Similarity:</strong> {((result.similarity || 0) * 100).toFixed(1)}% ★★★★☆</div>
          <div><strong>🏷️ Type:</strong> {result.fileExtension || ".js"}</div>
        </div>
      </div>
      <CardContent className="py-4">
        <ScrollArea className="h-[200px] border-4 border-black bg-black p-4">
          <pre className="text-sm font-mono whitespace-pre overflow-x-auto text-[#00ff88] font-bold">
            <code>{result.content}</code>
          </pre>
        </ScrollArea>
      </CardContent>
      <CardFooter className="py-4 bg-white border-t-4 border-black">
        <div className="flex flex-col gap-3 w-full">
          <p className="text-black font-bold text-sm leading-relaxed">{
            result.summary || "This code snippet demonstrates a key part of the project functionality. Review the code to understand its purpose and integration within the larger codebase."
          }</p>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="bg-black text-white px-3 py-1 font-black text-xs uppercase border-2 border-black">
                <Code className="w-3 h-3 mr-1 inline" />
                {result.tags?.[0] || "FUNCTION"}
              </div>
              <div className="bg-black text-white px-3 py-1 font-black text-xs uppercase border-2 border-black">
                {result.fileName
                  ? (result.fileName.includes('/')
                    ? result.fileName.split('/')[0].toUpperCase()
                    : 'ROOT')
                  : 'ROOT'
                }
              </div>
            </div>
            {getModeActionButton(result.mode || "search")}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
