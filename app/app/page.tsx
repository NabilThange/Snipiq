"use client"

import { useState } from "react"
import Header from "@/components/header"
import UploadSection from "@/components/upload-section"
import ModeSelector from "@/components/mode-selector"
import SearchInterface from "@/components/search-interface"
import ModeContent from "@/components/mode-content"
import SessionControls from "@/components/session-controls"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import type { SearchResult, SearchMode } from "@/lib/types"
import { apiClient } from "@/lib/api-client"
import { useSession } from "@/lib/session-context"

export default function AppPage() {
  const { sessionId, setSessionId, isUploading, uploadedFilePaths, setUploadedFilePaths, uploadError, setUploadError } = useSession()
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [currentMode, setCurrentMode] = useState<SearchMode>("build-understand")
  const { toast } = useToast()

  const handleSearch = async (query: string) => {
    if (!sessionId) {
      toast({
        title: "ACTION FAILED",
        description: "PLEASE UPLOAD A CODEBASE FIRST.",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    setSearchQuery(query)

    try {
      if (currentMode === "chat") {
        // Dispatch custom event for chat mode, chat-mode-content will handle the API call.
        window.dispatchEvent(new CustomEvent("chatMessage", { detail: { message: query, sessionId } }))
        toast({
          title: "CHAT MESSAGE SENT",
          description: "GENERATING RESPONSE...",
        })
      } else if (currentMode === "search") {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: query.trim(),
            sessionId: sessionId,
            limit: 10
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          setResults(data.results);
          toast({
            title: "SEARCH COMPLETED",
            description: `FOUND ${data.results.length} RESULTS FOR "${query.toUpperCase()}"`, 
          });
        } else {
          console.error('Search failed:', data.message);
          setResults([]);
          toast({
            title: "SEARCH FAILED",
            description: data.message || "AN UNEXPECTED ERROR OCCURRED DURING SEARCH.",
            variant: "destructive",
          });
        }
      } else if (currentMode === "summarize") {
        toast({
          title: "ACTION NOT SUPPORTED",
          description: "QUERY VIA SEARCH BAR IS NOT SUPPORTED IN SUMMARIZE MODE. SELECT A FILE.",
          variant: "destructive",
        })
      } else if (currentMode === "build-understand") {
        toast({
          title: "ACTION NOT SUPPORTED",
          description: "QUERY VIA SEARCH BAR IS NOT SUPPORTED IN BUILD & UNDERSTAND MODE.",
          variant: "destructive",
        })
      } else if (currentMode === "visualize") {
        toast({
          title: "ACTION NOT SUPPORTED",
          description: "QUERY VIA SEARCH BAR IS NOT SUPPORTED IN VISUALIZE MODE.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("API call failed:", error)
      toast({
        title: `${currentMode.toUpperCase()} FAILED`,
        description: error.message || "AN UNEXPECTED ERROR OCCURRED. PLEASE TRY AGAIN.",
        variant: "destructive",
      })
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleClearSession = async () => {
    // For now, only clear local state. Actual Zilliz data deletion would require a backend call.
    // A new API endpoint could be created in the future for this.
    setSessionId(null)
    setUploadedFilePaths([]) // Clear uploaded paths from context
    setUploadError(null) // Clear any upload errors
    setResults([])
    setSearchQuery("")
    setCurrentMode("build-understand") // Reset to default mode

    toast({
      title: "SESSION CLEARED",
      description: "YOUR UPLOADED CODEBASE AND ANALYSIS DATA HAVE BEEN CLEARED LOCALLY.",
    })
  }

  const handleModeChange = (mode: SearchMode) => {
    setCurrentMode(mode)
    setResults([]) // Clear results when switching modes
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-white font-bold flex flex-col">
      <Header />

      {/* Add padding to account for fixed header */}
      <div className="pt-24">
        {sessionId && (
          <div className="border-b-4 border-black bg-white">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="flex justify-between items-center py-4">
                <div className="flex-1 flex justify-center">
                  <ModeSelector currentMode={currentMode} onModeChange={handleModeChange} />
                </div>
                <div className="ml-4">
                  <SessionControls sessionId={sessionId} onClearSession={handleClearSession} compact />
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 flex flex-col">
          {!sessionId ? (
            <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
              <UploadSection
                // Removed props as UploadSection now uses useSession internally
              />
            </div>
          ) : (
            <>
              <div className="flex-1 container mx-auto px-4 py-6 pb-24 max-w-5xl overflow-y-auto">
                <ModeContent
                  mode={currentMode}
                  results={results}
                  query={searchQuery}
                  isSearching={isSearching}
                  sessionId={sessionId}
                />
              </div>

              {/* Only show search interface for modes that need it */}
              {currentMode !== "build-understand" && currentMode !== "summarize" && currentMode !== "visualize" && (
                <SearchInterface onSearch={handleSearch} isSearching={isSearching} currentMode={currentMode} />
              )}
            </>
          )}
        </main>

        {!sessionId && <Footer />}
        <Toaster />
      </div>
    </div>
  )
}
