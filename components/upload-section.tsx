"use client"

import React, { useState, useRef, useEffect } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { useSession } from "@/lib/session-context"
import { FileNode, UploadResponse, IndexRequest } from "@/lib/api-client"

export default function UploadSection() {
  const { setSessionId, isUploading, setIsUploading, setUploadedFilePaths, uploadError, setUploadError } = useSession()

  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset progress when isUploading changes to false
  useEffect(() => {
    if (!isUploading) {
      setUploadProgress(0)
    }
  }, [isUploading])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): string | null => {
    // Accept both .zip files and individual code files based on backend logic
    const isZipFile = file.name.toLowerCase().endsWith(".zip") || 
                     file.type.includes('zip') || 
                     file.type === 'application/octet-stream'
    
    const codeExtensions = [
      '.js', '.ts', '.jsx', '.tsx',
      '.py', '.java', '.cpp', '.c', '.h',
      '.cs', '.php', '.rb', '.go', '.rs',
      '.html', '.css', '.scss', '.sass',
      '.json', '.xml', '.yaml', '.yml',
      '.md', '.txt', '.sql', '.sh', '.bat',
      '.vue', '.svelte', '.dart', '.kt'
    ];
    
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    const isCodeFile = codeExtensions.includes(fileExtension);

    if (!isZipFile && !isCodeFile) {
      return "INVALID FILE TYPE. ONLY .ZIP FILES OR SUPPORTED CODE FILES ARE ALLOWED."
    }

    if (file.size > 100 * 1024 * 1024) {
      // 100MB
      return "FILE TOO LARGE. MAXIMUM SIZE IS 100MB."
    }

    if (file.size === 0) {
      return "FILE IS EMPTY. PLEASE SELECT A VALID FILE."
    }

    return null
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    const validationError = validateFile(file)

    if (validationError) {
      setUploadError(validationError)
      return
    }

    setUploadError(null)
    uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setUploadError(null)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append("file", file)

    try {
      console.log("Starting file upload...", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      })

      // Step 1: Upload the file (zip or single file)
      setUploadProgress(10)
      const uploadResponse = await apiClient.uploadFiles(formData)
      
      console.log("Upload response received:", {
        totalFiles: uploadResponse.totalCodeFiles,
        sessionId: uploadResponse.sessionId,
        tempDir: uploadResponse.tempDir,
        files: uploadResponse.codeFiles?.map((f: FileNode) => f.name)
      })

      // Validate upload response
      if (!uploadResponse.codeFiles || uploadResponse.codeFiles.length === 0) {
        throw new Error("No code files were extracted from the upload. Please ensure your file contains supported code files.")
      }

      if (!uploadResponse.sessionId) {
        throw new Error("Upload successful but no session ID received. Please try again.")
      }

      // Set uploaded file paths for session context
      const extractedFilePaths = uploadResponse.codeFiles.map((file: FileNode) => file.path)
      setUploadedFilePaths(extractedFilePaths)
      setUploadProgress(50)

      console.log("Starting code indexing...", {
        sessionId: uploadResponse.sessionId,
        fileCount: uploadResponse.codeFiles.length
      })

      // Step 2: Index the uploaded code using the sessionId from upload response
      const indexRequestData: IndexRequest = {
        codeFiles: uploadResponse.codeFiles,
        tempDir: uploadResponse.tempDir,
        totalFiles: uploadResponse.totalCodeFiles
      };
      await apiClient.indexCode(uploadResponse.sessionId, indexRequestData)

      console.log("Code indexing complete for session:", uploadResponse.sessionId)
      
      // Set session ID after successful indexing
      setSessionId(uploadResponse.sessionId)
      setUploadProgress(100)

      // Success message
      console.log(`Upload and indexing complete! Processed ${uploadResponse.totalCodeFiles} code files.`)

    } catch (error: any) {
      console.error("Upload/Indexing failed:", error)
      
      let errorMessage = "An unexpected error occurred during upload or indexing."
      
      if (error.message?.includes("No code files found")) {
        errorMessage = "No supported code files found in the uploaded file. Please upload a file containing code files with supported extensions."
      } else if (error.message?.includes("400")) {
        errorMessage = "Server rejected the request. Please check your file format and try again."
      } else if (error.message?.includes("413")) {
        errorMessage = "File too large. Please upload a file smaller than 100MB."
      } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
        errorMessage = "Network error. Please check your connection and try again."
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setUploadError(errorMessage.toUpperCase())
    } finally {
      setIsUploading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black uppercase text-black mb-4 font-mono tracking-tight">UPLOAD YOUR CODEBASE</h2>
        <p className="text-black font-bold text-lg">UPLOAD A .ZIP FILE OR INDIVIDUAL CODE FILES TO GET STARTED.</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4 text-sm font-bold text-black">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center mr-2 font-mono font-black">
              1
            </div>
            <span className="uppercase">UPLOAD FILES</span>
          </div>
          <div className="h-1 bg-black w-8"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center mr-2 font-mono font-black">
              2
            </div>
            <span className="uppercase">AI PROCESSES YOUR CODE</span>
          </div>
          <div className="h-1 bg-black w-8"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center mr-2 font-mono font-black">
              3
            </div>
            <span className="uppercase">ASK ANYTHING</span>
          </div>
        </div>
      </div>

      {!isUploading ? (
        <div
          className={`border-4 border-dashed border-black p-8 text-center bg-white transition-transform duration-300 ${dragActive ? "transform -translate-y-1 shadow-[8px_8px_0px_#ff3f3f]" : "shadow-[6px_6px_0px_#000000]"} ${uploadError ? "border-[#ff3f3f]" : ""}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            ref={fileInputRef} 
            type="file" 
            accept=".zip,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.h,.cs,.php,.rb,.go,.rs,.html,.css,.scss,.sass,.json,.xml,.yaml,.yml,.md,.txt,.sql,.sh,.bat,.vue,.svelte,.dart,.kt" 
            onChange={handleChange} 
            className="hidden" 
          />

          <div className="flex flex-col items-center justify-center">
            <Upload
              className={`w-16 h-16 mb-4 ${dragActive ? "text-[#ff3f3f]" : "text-black"} ${uploadError ? "text-[#ff3f3f]" : ""}`}
            />

            <p className="text-2xl font-black mb-2 uppercase font-mono">
              {dragActive ? "DROP YOUR FILE HERE" : "DRAG & DROP YOUR CODEBASE HERE"}
            </p>

            <p className="text-black font-bold mb-4 uppercase">OR</p>

            <Button
              onClick={handleButtonClick}
              className="bg-white border-4 border-black text-black font-black uppercase text-lg px-8 py-4 h-auto hover:bg-[#e0e0e0] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000]"
            >
              <Upload className="w-6 h-6 mr-2" />
              BROWSE FILES
            </Button>

            <p className="text-sm font-bold mt-4 uppercase">
              SUPPORTED: .ZIP FILES OR CODE FILES (.JS, .TS, .PY, .HTML, ETC.) UP TO 100MB
            </p>

            {uploadError && (
              <div className="mt-4 bg-[#ff3f3f] border-4 border-black p-4 text-white font-black uppercase flex items-center shadow-[4px_4px_0px_#000000]">
                <X className="w-6 h-6 mr-2" />
                <span className="text-sm">{uploadError}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="border-4 border-black p-8 bg-white shadow-[6px_6px_0px_#000000]">
          <div className="flex flex-col items-center">
            <div className="w-full bg-white border-4 border-black mb-4 h-8 relative overflow-hidden">
              <div
                className="h-full bg-[#00ff88] transition-all duration-300 flex items-center justify-center"
                style={{ width: `${uploadProgress}%` }}
              >
                <span className="text-black font-black text-sm uppercase font-mono">{Math.round(uploadProgress)}%</span>
              </div>
            </div>
            <p className="text-black font-black uppercase font-mono text-center">
              {uploadProgress < 50
                ? "UPLOADING & EXTRACTING FILES..."
                : uploadProgress < 100
                ? "INDEXING CODE FOR AI PROCESSING..."
                : "PROCESSING COMPLETE! READY TO EXPLORE."}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
