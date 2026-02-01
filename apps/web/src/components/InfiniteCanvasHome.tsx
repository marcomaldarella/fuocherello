"use client"

import * as React from "react"
import type { MediaItem } from "@/components/infinite-canvas/types"

const LazyInfiniteCanvasScene = React.lazy(
  () => import("@/components/infinite-canvas/scene").then((mod) => ({ default: mod.InfiniteCanvasScene }))
)

export function InfiniteCanvasHome({ media }: { media: MediaItem[] }) {
  const [textureProgress, setTextureProgress] = React.useState(0)
  const [splashFading, setSplashFading] = React.useState(false)
  const [splashVisible, setSplashVisible] = React.useState(true)

  React.useEffect(() => {
    if (textureProgress >= 100) {
      setSplashFading(true)
      const timer = setTimeout(() => setSplashVisible(false), 500)
      return () => clearTimeout(timer)
    }
  }, [textureProgress])

  if (!media.length) {
    return null
  }

  return (
    <div className="fixed inset-0 z-0">
      {splashVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          style={{
            opacity: splashFading ? 0 : 1,
            transition: 'opacity 0.5s ease-out',
            pointerEvents: splashFading ? 'none' : 'auto',
          }}
        >
          <img src="/fuocherello.gif" alt="Loading" style={{ width: '120px', height: 'auto' }} />
        </div>
      )}
      <React.Suspense fallback={null}>
        <LazyInfiniteCanvasScene
          media={media}
          onTextureProgress={setTextureProgress}
          backgroundColor="#ffffff"
          fogColor="#ffffff"
        />
      </React.Suspense>
    </div>
  )
}
