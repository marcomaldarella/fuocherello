"use client"
import { useEffect, useRef } from "react"

export function BackgroundVideo({ src = "/video-home.mp4" }: { src?: string }) {
  const ref = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    // Ensure autoplay on Safari by programmatic play if possible (video must be muted)
    const tryPlay = async () => {
      try {
        await v.play()
      } catch (e) {
        // ignore
      }
    }
    tryPlay()
  }, [])

  return (
    <div aria-hidden className="fixed inset-0 z-0 w-screen h-screen overflow-hidden pointer-events-none">
      <video
        ref={ref}
        className="w-full h-full object-cover"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        // prevent controls and interaction
        tabIndex={-1}
      />
    </div>
  )
}
