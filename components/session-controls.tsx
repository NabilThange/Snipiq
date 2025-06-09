"use client"

import { useState } from "react"
import { Trash2, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SessionControlsProps {
  sessionId: string
  onClearSession: () => Promise<void>
  compact?: boolean
}

export default function SessionControls({ sessionId, onClearSession, compact = false }: SessionControlsProps) {
  const [showSessionId, setShowSessionId] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const handleClearSession = async () => {
    setIsClearing(true)
    await onClearSession()
    setIsClearing(false)
  }

  if (compact) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <Button
            onClick={() => setShowSessionId(!showSessionId)}
            className="bg-white border-2 border-black text-black font-black uppercase text-xs px-3 py-2 h-auto hover:bg-[#e0e0e0] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[2px_2px_0px_#000000] hover:shadow-[1px_1px_0px_#000000]"
          >
            <Settings className="w-4 h-4 mr-1" />
            SESSION
          </Button>
          {showSessionId && (
            <div className="ml-2 text-xs font-mono bg-black text-[#00ff88] p-1 border-2 border-black font-bold">
              {sessionId.slice(-8)}
            </div>
          )}
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-[#ff3f3f] border-2 border-black text-white font-black uppercase text-xs px-3 py-2 h-auto hover:bg-[#e03535] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[2px_2px_0px_#000000] hover:shadow-[1px_1px_0px_#000000]">
              <Trash2 className="w-4 h-4 mr-1" />
              CLEAR
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white border-4 border-black shadow-[8px_8px_0px_#000000] max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-black font-black uppercase text-xl font-mono">
                ARE YOU SURE?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-black font-bold uppercase">
                THIS WILL DELETE YOUR UPLOADED CODEBASE AND SEARCH DATA.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-4">
              <AlertDialogCancel className="bg-white border-4 border-black text-black font-black uppercase px-6 py-3 h-auto hover:bg-[#e0e0e0] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000]">
                CANCEL
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearSession}
                disabled={isClearing}
                className="bg-[#ff3f3f] border-4 border-black text-white font-black uppercase px-6 py-3 h-auto hover:bg-[#e03535] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] disabled:opacity-50"
              >
                {isClearing ? "CLEARING..." : "CLEAR SESSION"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }

  // Original full layout for non-compact mode
  return (
    <div className="mt-12 border-t-4 border-black pt-6 flex flex-col sm:flex-row items-center justify-between">
      <div>
        <label className="flex items-center text-black font-bold uppercase">
          <input
            type="checkbox"
            checked={showSessionId}
            onChange={() => setShowSessionId(!showSessionId)}
            className="mr-3 w-5 h-5 accent-[#ff3f3f]"
          />
          SHOW SESSION ID
        </label>
        {showSessionId && (
          <div className="mt-2 text-xs font-mono bg-black text-[#00ff88] p-2 border-2 border-black font-bold">
            {sessionId}
          </div>
        )}
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="mt-4 sm:mt-0 bg-[#ff3f3f] border-4 border-black text-white font-black uppercase px-6 py-3 h-auto hover:bg-[#e03535] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000]">
            <Trash2 className="w-5 h-5 mr-2" />
            CLEAR SESSION
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white border-4 border-black shadow-[8px_8px_0px_#000000] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black font-black uppercase text-xl font-mono">
              ARE YOU SURE?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black font-bold uppercase">
              THIS WILL DELETE YOUR UPLOADED CODEBASE AND SEARCH DATA.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-4">
            <AlertDialogCancel className="bg-white border-4 border-black text-black font-black uppercase px-6 py-3 h-auto hover:bg-[#e0e0e0] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000]">
              CANCEL
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearSession}
              disabled={isClearing}
              className="bg-[#ff3f3f] border-4 border-black text-white font-black uppercase px-6 py-3 h-auto hover:bg-[#e03535] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] disabled:opacity-50"
            >
              {isClearing ? "CLEARING..." : "CLEAR SESSION"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
