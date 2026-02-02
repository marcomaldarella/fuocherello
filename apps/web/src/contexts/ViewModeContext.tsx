"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type ViewMode = "horizontal" | "vertical"

interface ViewModeContextType {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  scrollPosition: number
  setScrollPosition: (position: number) => void
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined)

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    typeof window !== "undefined" ? (
      localStorage.getItem("viewMode") as ViewMode || 
      (window.innerWidth < 768 ? "vertical" : "horizontal")
    ) : "horizontal"
  )
  const [scrollPosition, setScrollPosition] = useState(0)

  // Save view mode to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("viewMode", viewMode)
    }
  }, [viewMode])

  const handleSetViewMode = (mode: ViewMode) => {
    if (typeof window !== "undefined") {
      // Save current scroll position before switching
      if (viewMode === "vertical") {
        const scrollContainer = document.querySelector("div[style*='overflow-y']") as HTMLElement
        if (scrollContainer) {
          localStorage.setItem("verticalScrollPos", scrollContainer.scrollTop.toString())
        }
      } else {
        // For horizontal, we save the current position from the ref
        localStorage.setItem("horizontalScrollPos", scrollPosition.toString())
      }
    }
    setViewMode(mode)
  }

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode: handleSetViewMode, scrollPosition, setScrollPosition }}>
      {children}
    </ViewModeContext.Provider>
  )
}

export function useViewMode() {
  const context = useContext(ViewModeContext)
  if (context === undefined) {
    throw new Error("useViewMode must be used within a ViewModeProvider")
  }
  return context
}
