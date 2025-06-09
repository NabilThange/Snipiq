"use client"

import { useState, useEffect } from "react"
import { ZoomIn, ZoomOut, Download, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiClient, VisualizeNode, VisualizeEdge } from "@/lib/api-client"
import { useSession } from "@/lib/session-context"

interface VisualizeModeContentProps {
  sessionId: string
  // isSearching: boolean // This prop is likely no longer needed, but keeping for now if used elsewhere
}

export default function VisualizeModeContent({ sessionId }: VisualizeModeContentProps) {
  const [zoomLevel, setZoomLevel] = useState(100)
  const [nodes, setNodes] = useState<VisualizeNode[]>([])
  const [edges, setEdges] = useState<VisualizeEdge[]>([])
  const [isLoadingVisualization, setIsLoadingVisualization] = useState(true)
  const [visualizationError, setVisualizationError] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<string>("all") // Keep filter for future enhancements if needed

  useEffect(() => {
    const fetchVisualizationData = async () => {
      if (!sessionId) {
        setIsLoadingVisualization(false);
        return;
      }
      setIsLoadingVisualization(true)
      setVisualizationError(null)
      try {
        const response = await apiClient.getVisualizationData(sessionId)
        if (response.success && response.graph) {
          setNodes(response.graph.nodes)
          setEdges(response.graph.edges)
        } else {
          setVisualizationError(response.message || "Failed to fetch visualization data.")
        }
      } catch (error: any) {
        console.error("Error fetching visualization data:", error)
        setVisualizationError(error.message || "An unexpected error occurred while fetching visualization data.")
      } finally {
        setIsLoadingVisualization(false)
      }
    }

    fetchVisualizationData()
  }, [sessionId])

  const getNodeColor = (node: VisualizeNode) => {
    // Simplified color logic as type/language might not be directly available from Zilliz query
    return "#000000" // Default to black for all nodes
  }

  const getNodeSize = (node: VisualizeNode) => {
    // All nodes are treated as files in the simplified visualization
    return 40
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50))
  }

  const handleReset = () => {
    setZoomLevel(100)
  }

  const handleExport = () => {
    alert("EXPORT FUNCTIONALITY WOULD BE IMPLEMENTED HERE")
  }

  const filteredNodes = nodes.filter((node) => {
    // Filter logic might be limited due to simplified node structure from backend
    // For now, only filter by 'all' or based on future node types
    if (selectedFilter === "all") return true
    // Add more filter conditions if node properties allow
    return true
  })

  if (!sessionId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center py-12 border-4 border-black bg-white shadow-[6px_6px_0px_#000000] max-w-2xl">
          <p className="text-black font-black uppercase text-xl font-mono px-8">
            PLEASE UPLOAD A CODEBASE TO GENERATE A VISUALIZATION.
          </p>
        </div>
      </div>
    )
  }

  if (isLoadingVisualization) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black bg-white mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-black animate-pulse"></div>
          </div>
          <p className="text-[#00ff88] font-black uppercase text-xl font-mono animate-pulse">GENERATING VISUALIZATION...</p>
        </div>
      </div>
    )
  }

  if (visualizationError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center py-12 border-4 border-black bg-white shadow-[6px_6px_0px_#000000] max-w-2xl">
          <p className="text-[#ff3f3f] font-black uppercase text-xl font-mono px-8">
            ERROR: {visualizationError.toUpperCase()}
          </p>
        </div>
      </div>
    )
  }

  if (nodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center py-12 border-4 border-black bg-white shadow-[6px_6px_0px_#000000] max-w-2xl">
          <p className="text-black font-black uppercase text-xl font-mono px-8">
            NO VISUALIZATION DATA FOUND FOR THIS CODEBASE. IT MIGHT BE TOO SMALL OR UNSUPPORTED.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase text-black font-mono tracking-tight">CODEBASE VISUALIZATION</h2>
        <div className="bg-[#00ff88] border-2 border-black px-3 py-1 text-black font-black text-sm uppercase">
          {nodes.length} NODES
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white border-4 border-black p-4 shadow-[4px_4px_0px_#000000]">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleZoomOut}
            className="bg-white border-2 border-black text-black font-black uppercase px-3 py-2 h-auto hover:bg-[#e0e0e0] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[2px_2px_0px_#000000] hover:shadow-[1px_1px_0px_#000000]"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="font-black text-black font-mono px-3">{zoomLevel}%</span>
          <Button
            onClick={handleZoomIn}
            className="bg-white border-2 border-black text-black font-black uppercase px-3 py-2 h-auto hover:bg-[#e0e0e0] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[2px_2px_0px_#000000] hover:shadow-[1px_1px_0px_#000000]"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleReset}
            className="bg-white border-2 border-black text-black font-black uppercase px-3 py-2 h-auto hover:bg-[#e0e0e0] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[2px_2px_0px_#000000] hover:shadow-[1px_1px_0px_#000000]"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            RESET
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bg-white border-2 border-black text-black font-black uppercase px-3 py-2 focus:outline-none focus:border-[#ff3f3f]"
          >
            <option value="all">ALL NODES</option>
            {/* Filters below are not fully functional with simplified backend response for now */}
            <option value="files">FILES ONLY</option>
            <option value="functions">FUNCTIONS ONLY</option>
            <option value="python">PYTHON</option>
            <option value="javascript">JAVASCRIPT</option>
            <option value="typescript">TYPESCRIPT</option>
          </select>
          <Button
            onClick={handleExport}
            className="bg-[#00ff88] border-2 border-black text-black font-black uppercase px-3 py-2 h-auto hover:bg-[#00e077] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[2px_2px_0px_#000000] hover:shadow-[1px_1px_0px_#000000]"
          >
            <Download className="w-4 h-4 mr-1" />
            EXPORT
          </Button>
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000000] overflow-hidden">
        <div className="relative h-[500px] overflow-auto">
          <svg
            width="100%" // Adjust width dynamically if needed
            height="100%" // Adjust height dynamically if needed
            viewBox="0 0 600 400"
            className="w-full h-full"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {/* Draw connections */}
            {edges.map((edge, index) => {
              const sourceNode = nodes.find((n) => n.id === edge.from);
              const targetNode = nodes.find((n) => n.id === edge.to);
              if (!sourceNode || !targetNode) return null;

              // Simple layout for visualization, ideally use a force-directed graph library
              const x1 = (nodes.indexOf(sourceNode) + 0.5) * (600 / nodes.length);
              const y1 = 150;
              const x2 = (nodes.indexOf(targetNode) + 0.5) * (600 / nodes.length);
              const y2 = 250;

              return (
                <line
                  key={index}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#000000"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}

            {/* Draw nodes */}
            {nodes.map((node, index) => {
              // Simple layout for visualization
              const x = (index + 0.5) * (600 / nodes.length);
              const y = 200; // Place nodes in the middle for simplicity

              return (
                <g key={node.id} transform={`translate(${x},${y})`}>
                  <circle
                    r={getNodeSize(node) / 2}
                    fill={getNodeColor(node)}
                    stroke="#000000"
                    strokeWidth="2"
                  />
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    className="uppercase font-mono"
                  >
                    {node.label.length > 10 ? node.label.substring(0, 7) + '...' : node.label}
                  </text>
                </g>
              );
            })}
            {/* Define arrowhead marker for lines */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="8"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#000000" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  )
}
