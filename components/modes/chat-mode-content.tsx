"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, User, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { apiClient, ChatResponse } from "@/lib/api-client"
import { useSession } from "@/lib/session-context"

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

// Component to render chat message content, especially for code blocks
const MessageContent = ({ content }: { content: string }) => {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <p className="font-bold leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.substring(3, part.length - 3);
          return (
            <pre key={index} className="bg-black border-4 border-black p-3 my-2 overflow-x-auto">
              <code className="text-sm font-mono whitespace-pre-wrap text-[#00ff88]">{code}</code>
            </pre>
          );
        } else {
          return <span key={index}>{part}</span>;
        }
      })}
    </p>
  );
};

export default function ChatModeContent() {
  const { sessionId } = useSession()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content: "HELLO! I'M YOUR AI ASSISTANT FOR THIS CODEBASE. ASK ME ANYTHING ABOUT YOUR CODE!",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const addMessage = (content: string, type: "user" | "ai") => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const sendChatMessage = async (userMessage: string, currentSessionId: string) => {
    setIsTyping(true)
    setChatError(null)
    try {
      const response: ChatResponse = await apiClient.chatWithCode(userMessage, currentSessionId)
      if (response.success) {
        addMessage(response.response, "ai")
      } else {
        setChatError(response.message || "Failed to get chat response.")
        addMessage(response.message || "Failed to get chat response.", "ai") // Add error message to chat
      }
    } catch (error: any) {
      console.error("Error sending chat message:", error)
      setChatError(error.message || "An unexpected error occurred during chat.")
      addMessage(error.message || "An unexpected error occurred during chat.", "ai") // Add error message to chat
    } finally {
      setIsTyping(false)
    }
  }

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages, isTyping])

  // This function will be called from the parent component when user sends a message
  useEffect(() => {
    const handleChatMessage = (event: CustomEvent) => {
      const { message: userMessage, sessionId: currentSessionId } = event.detail
      if (currentSessionId) {
        addMessage(userMessage, "user")
        sendChatMessage(userMessage, currentSessionId)
      } else {
        setChatError("No session ID available. Please upload a codebase first.")
      }
    }

    window.addEventListener("chatMessage", handleChatMessage as EventListener)
    return () => window.removeEventListener("chatMessage", handleChatMessage as EventListener)
  }, [sessionId]) // Re-run effect if sessionId changes

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black uppercase text-black font-mono tracking-tight">AI CHAT</h2>
        <div className="bg-[#00ff88] border-2 border-black px-3 py-1 text-black font-black text-sm uppercase">
          {messages.length} MESSAGE{messages.length !== 1 ? "S" : ""}
        </div>
      </div>

      <div className="flex-1 bg-white border-4 border-black shadow-[6px_6px_0px_#000000]">
        <ScrollArea ref={scrollAreaRef} className="h-[500px] p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] ${
                    message.type === "user"
                      ? "bg-[#ff3f3f] text-white border-4 border-black shadow-[4px_4px_0px_#000000]"
                      : "bg-[#00ff88] text-black border-4 border-black shadow-[4px_4px_0px_#000000]"
                  } p-4`}
                >
                  <div className="flex items-center mb-2">
                    {message.type === "user" ? <User className="w-5 h-5 mr-2" /> : <Bot className="w-5 h-5 mr-2" />}
                    <span className="font-black uppercase text-xs">
                      {message.type === "user" ? "YOU" : "AI ASSISTANT"}
                    </span>
                    <span className="ml-auto text-xs font-bold opacity-70">{formatTime(message.timestamp)}</span>
                  </div>
                  <p className="font-bold leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#00ff88] text-black border-4 border-black shadow-[4px_4px_0px_#000000] p-4 max-w-[80%]">
                  <div className="flex items-center mb-2">
                    <Bot className="w-5 h-5 mr-2" />
                    <span className="font-black uppercase text-xs">AI ASSISTANT</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-black rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-black rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <span className="ml-2 font-bold text-sm">TYPING...</span>
                  </div>
                </div>
              </div>
            )}

            {chatError && !isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#ff3f3f] text-white border-4 border-black shadow-[4px_4px_0px_#000000] p-4 max-w-[80%]">
                  <div className="flex items-center mb-2">
                    <X className="w-5 h-5 mr-2" />
                    <span className="font-black uppercase text-xs">ERROR</span>
                  </div>
                  <p className="font-bold leading-relaxed">{chatError}</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="mt-6 text-center">
        {!sessionId ? (
          <p className="text-[#ff3f3f] font-bold text-sm uppercase">UPLOAD A CODEBASE TO START CHATTING</p>
        ) : (
          <p className="text-black font-bold text-sm">USE THE SEARCH BAR BELOW TO SEND MESSAGES</p>
        )}
      </div>
    </div>
  )
}
