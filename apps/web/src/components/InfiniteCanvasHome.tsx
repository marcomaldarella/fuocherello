"use client"

import * as React from "react"
import type { MediaItem } from "@/components/infinite-canvas/types"

const LazyInfiniteCanvasScene = React.lazy(
  () => import("@/components/infinite-canvas/scene").then((mod) => ({ default: mod.InfiniteCanvasScene }))
)

export function InfiniteCanvasHome({ media }: { media: MediaItem[] }) {
  const [textureProgress, setTextureProgress] = React.useState(0)
  const [canvasReady, setCanvasReady] = React.useState(false)
  const [splashFading, setSplashFading] = React.useState(false)
  const [splashVisible, setSplashVisible] = React.useState(true)

  React.useEffect(() => {
    if (textureProgress >= 100 || canvasReady) {
      setSplashFading(true)
      const timer = setTimeout(() => setSplashVisible(false), 600)
      return () => clearTimeout(timer)
    }
  }, [textureProgress, canvasReady])

  // Fallback: hide splash after 4s even if textures haven't fully loaded
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCanvasReady(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  if (!media.length) {
    return null
  }

  return (
    <>
      {/* Canvas background */}
      <div className="fixed inset-0 z-0">
        <React.Suspense fallback={null}>
          <LazyInfiniteCanvasScene
            media={media}
            onTextureProgress={setTextureProgress}
            backgroundColor="#ffffff"
            fogColor="#ffffff"
          />
        </React.Suspense>
      </div>

      {/* Title - appears when canvas is ready */}
      <div
        className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none"
        style={{
          opacity: splashVisible && !splashFading ? 0 : 1,
          transition: 'opacity 0.6s ease-in',
        }}
      >
        <h1 className="text-[#0000ff] font-medium leading-[0.85] tracking-[-0.05em] text-[clamp(4rem,12vw,10rem)]">
          <span className="italic uppercase inline-block" style={{ marginRight: "0.05em" }}>
            F
          </span>
          <span className="lowercase">uocherello</span>
        </h1>
      </div>

      {/* Splash overlay - on top of everything */}
      {splashVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          style={{
            opacity: splashFading ? 0 : 1,
            transition: 'opacity 0.6s ease-out',
            pointerEvents: splashFading ? 'none' : 'auto',
          }}
        >
          <img src="/fuocherello.gif" alt="Loading" style={{ width: '120px', height: 'auto' }} />
        </div>
      )}
    </>
  )
}
