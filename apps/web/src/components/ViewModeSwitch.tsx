"use client"

import { useViewMode } from "@/contexts/ViewModeContext"

export function ViewModeSwitch() {
  const { viewMode, setViewMode } = useViewMode()

  const glassStyle = {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.08)",
  }

  return (
    <div 
      className="hidden md:block fixed top-4 right-4 z-[9999] text-[#0000ff] rounded-lg"
      style={Object.assign({}, glassStyle, { padding: '10px 12px' })}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode("horizontal")}
          className="text-[#0000ff] hover:opacity-70 transition-opacity p-1"
          style={{ 
            opacity: viewMode === "horizontal" ? 1 : 0.5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Scroll orizzontale"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 10H17M17 10L13 6M17 10L13 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={() => setViewMode("vertical")}
          className="text-[#0000ff] hover:opacity-70 transition-opacity p-1"
          style={{ 
            opacity: viewMode === "vertical" ? 1 : 0.5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
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
