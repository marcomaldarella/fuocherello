"use client"

import * as React from "react"
import type { MediaItem } from "@/components/infinite-canvas/types"

const LazyInfiniteCanvasScene = React.lazy(
  () => import("@/components/infinite-canvas/scene").then((mod) => ({ default: mod.InfiniteCanvasScene }))
)

export function InfiniteCanvasHome({ media }: { media: MediaItem[] }) {
  const [textureProgress, setTextureProgress] = React.useState(0)

  if (!media.length) {
    return null
  }

  return (
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
  )
}
