"use client"

import { useEffect, useState } from "react"
import { useViewMode } from "@/contexts/ViewModeContext"

export function ViewModeSwitch() {
  const { viewMode, setViewMode } = useViewMode()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const glassStyle = {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.08)",
  }

  const handleViewModeChange = (mode: "horizontal" | "vertical") => {
    if (viewMode === mode) return
    setViewMode(mode)
  }

  return (
    <div 
      className="fixed top-4 right-4 z-[9999] text-[#0000ff] rounded-lg transition-all duration-300"
      style={Object.assign({}, glassStyle, { padding: '10px 12px' })}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleViewModeChange("horizontal")}
          className="text-[#0000ff] p-1 transition-all duration-200"
          style={{ 
            opacity: viewMode === "horizontal" ? 1 : 0.4,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: viewMode === "horizontal" ? 'scale(1.1)' : 'scale(1)',
            transitionProperty: 'opacity, transform',
          }}
          title="Scroll orizzontale"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 10H17M17 10L13 6M17 10L13 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={() => handleViewModeChange("vertical")}
          className="text-[#0000ff] p-1 transition-all duration-200"
          style={{ 
            opacity: viewMode === "vertical" ? 1 : 0.4,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: viewMode === "vertical" ? 'scale(1.1)' : 'scale(1)',
            transitionProperty: 'opacity, transform',
          }}
          title="Scroll verticale"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3V17M10 17L6 13M10 17L14 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
