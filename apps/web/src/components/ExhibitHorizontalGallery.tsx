"use client"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/lib/imageUrl"
import { PortableTextRenderer } from "@/components/PortableTextRenderer"
import { useEffect, useMemo, useRef, useState } from "react"

interface GalleryItem {
  image: any
  caption?: string
}

interface ExhibitHorizontalGalleryProps {
  title: string
  artistsLine?: string
  dateStart?: string
  dateEnd?: string
  authorName?: string
  featuredImage?: any
  gallery?: GalleryItem[]
  language?: "it" | "en"
}

export function ExhibitHorizontalGallery({
  title,
  artistsLine,
  dateStart,
  dateEnd,
  authorName,
  featuredImage,
  gallery,
  language = "it",
  body,
}: ExhibitHorizontalGalleryProps & { body?: any }) {
  const baseItems = useMemo(() => {
    const arr: any[] = []
    if (featuredImage) arr.push({ type: "image", image: featuredImage })
    if (gallery && gallery.length) arr.push(...gallery.map((g) => ({ type: "image", image: g.image })).filter((x) => x.image))
    // text slide last after all images
    if (body) arr.push({ type: "text" })
    return arr
  }, [featuredImage, gallery, body])

  // Duplicate set 5x for extended scroll range without wrapping issues
  const slides = useMemo(() => [...baseItems, ...baseItems, ...baseItems, ...baseItems, ...baseItems], [baseItems])

  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const [setWidth, setSetWidth] = useState(0)
  const [widths, setWidths] = useState<number[]>(() =>
    baseItems.length ? Array(baseItems.length).fill(typeof window !== "undefined" ? window.innerWidth : 0) : [],
  )
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const initializingRef = useRef(true)
  const initTimerRef = useRef<number | null>(null)
  const wrapTimerRef = useRef<number | null>(null)
  const wheelTickingRef = useRef(false)
  const scrollTickingRef = useRef(false)
  const targetScrollRef = useRef(0)
  const currentScrollRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const isAnimatingRef = useRef(false)
  const wrapLockRef = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // Imposta larghezze di fallback all'inizializzazione lato client
  useEffect(() => {
    if (!mounted) return
    if (!baseItems.length) return
    // make text slides full viewport width (not small), images fallback to window width
    const next = baseItems.map((it) => (it.type === "image" ? window.innerWidth : Math.round(window.innerWidth)))
    setWidths(next)
    setSetWidth(next.reduce((acc, w) => acc + w, 0))
  }, [mounted, baseItems.length])

  useEffect(() => {
    const el = scrollerRef.current
    if (isMobile) return // mobile uses native vertical flow
    if (!el || baseItems.length === 0) return

    const compute = () => {
      const h = window.innerHeight
      // se non abbiamo ancora widths calcolate, fallback a 1vw per slide
      const current = widths.length === baseItems.length ? widths : Array(baseItems.length).fill(window.innerWidth)
      const total = current.reduce((acc, w) => acc + w, 0)
      const prevTotal = setWidth
      setSetWidth(total)
      
      // Only reset position on first compute or if not animating
      if (prevTotal === 0 || !isAnimatingRef.current) {
        // posiziona all'inizio del set centrale for transform-based flow (center of 5 sets = 2.5)
        requestAnimationFrame(() => {
          initializingRef.current = true
          targetScrollRef.current = total * 2
          currentScrollRef.current = total * 2
          // apply initial transform
          if (innerRef.current) innerRef.current.style.transform = `translateX(-${total * 2}px)`
          if (initTimerRef.current) window.clearTimeout(initTimerRef.current)
          initTimerRef.current = window.setTimeout(() => {
            initializingRef.current = false
            initTimerRef.current = null
          }, 350)
        })
      }
    }

    compute()
    const ro = new ResizeObserver(() => compute())
    if (el) ro.observe(el)

    // transform-based animation (lerp) state
    const animate = (sequenceTotal: number) => {
      if (rafRef.current) return
      const loop = () => {
        const smooth = 0.08
        const cur = currentScrollRef.current
        const tgt = targetScrollRef.current
        let next = cur + (tgt - cur) * smooth
        // clamp next and target to valid scroll bounds
        const total = sequenceTotal
        const quintuple = total * 5
        const maxScroll = Math.max(0, quintuple - (el.clientWidth || 0) - 1)
        if (next < 0) next = 0
        if (next > maxScroll) next = maxScroll
        if (targetScrollRef.current < 0) targetScrollRef.current = 0
        if (targetScrollRef.current > maxScroll) targetScrollRef.current = maxScroll
        currentScrollRef.current = next
        if (innerRef.current) innerRef.current.style.transform = `translateX(-${next}px)`

        // stop condition
        if (Math.abs(targetScrollRef.current - currentScrollRef.current) < 0.5) {
          // debug
          if (process && process.env && process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.debug("gallery:animate:stop", { target: targetScrollRef.current, current: currentScrollRef.current })
          }
          rafRef.current = null
          isAnimatingRef.current = false
          return
        }
        rafRef.current = window.requestAnimationFrame(loop)
      }
      isAnimatingRef.current = true
      rafRef.current = window.requestAnimationFrame(loop)
    }

    const onWheel = (e: WheelEvent) => {
      if (initializingRef.current) return
      if (!e.ctrlKey) {
        e.preventDefault()
        const delta = e.deltaY * 2.5
        if (process && process.env && process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.debug("gallery:onWheel", { delta, target: targetScrollRef.current, current: currentScrollRef.current })
        }
        const total = setWidth
        const quintuple = total * 5
        const maxScroll = Math.max(0, quintuple - (el.clientWidth || 0) - 1)
        // base target off the current visible position to avoid stale targets
        let nextTarget = currentScrollRef.current + delta
        if (nextTarget < 0) nextTarget = 0
        if (nextTarget > maxScroll) nextTarget = maxScroll
        targetScrollRef.current = nextTarget
        // ensure animator runs
        if (!isAnimatingRef.current) animate(total)
      }
    }
    el.addEventListener("wheel", onWheel, { passive: false })

    return () => {
      ro.disconnect()
      el.removeEventListener("wheel", onWheel as any)
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      if (initTimerRef.current) window.clearTimeout(initTimerRef.current)
      wheelTickingRef.current = false
      scrollTickingRef.current = false
    }
  }, [baseItems.length, setWidth, widths])


  // Gestisce larghezze per immagine in base all'aspect ratio naturale
  const handleLoaded = (baseIdx: number) => (info: { naturalWidth: number; naturalHeight: number }) => {
    // Skip width updates if animating to prevent layout shifts
    if (isAnimatingRef.current) return
    
    const h = window.innerHeight
    const w = (info.naturalWidth / info.naturalHeight) * h
    setWidths((prev) => {
      const next = prev.length === baseItems.length ? [...prev] : Array(baseItems.length).fill(window.innerWidth)
      // Only update if significantly different to avoid micro-adjustments
      if (Math.abs(next[baseIdx] - w) < 10) return prev
      next[baseIdx] = Math.max(1, Math.round(w))
      // aggiorna setWidth totale
      const total = next.reduce((acc, val) => acc + val, 0)
      setSetWidth(total)
      return next
    })
  }

  if (!mounted) return null
  
  if (isMobile) {
    return (
      <div className="w-screen flex flex-col overflow-y-auto no-scrollbar">
        {baseItems.map((item, idx) => (
          <div key={idx} className="w-full px-[10px] flex-shrink-0 relative">
            {item.type === "image" ? (
              <img src={urlFor(item.image).url() || "/placeholder.svg"} alt={title} className="w-full h-auto block" />
            ) : (
              <div className="p-6 bg-white text-[#0000ff]">
                <h1 className="uppercase leading-[0.95] text-[18px] font-black mb-4">
                  <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                    {title?.[0] || ""}
                  </span>
                  <span>{title ? title.slice(1) : ""}</span>
                </h1>
                {body && <PortableTextRenderer value={body} />}
              </div>
            )}
          </div>
        ))}
        <style jsx global>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    )
  }

  return (
    <div
      ref={scrollerRef}
      className="fixed top-0 left-0 w-screen h-[100svh] pb-14 overflow-hidden overflow-y-hidden no-scrollbar"
      style={{ zIndex: 10 }}
    >
      {/* Barra inferiore: titolo - autore (a sinistra) + link indietro (a destra) */}
      <div className="fixed left-0 right-0 bottom-0 bg-white z-40 flex items-center justify-between py-2 md:py-3" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
        {/* Sinistra: titolo - autore */}
        <div className="flex items-baseline text-[#0000ff]">
          <h1 className="uppercase leading-[0.95] text-[13px] md:text-[13px] font-black">
            <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
              {title?.[0] || ""}
            </span>
            <span className="lowercase">{title ? title.slice(1) : ""}</span>
          </h1>
          {authorName && (
            <>
              <span className="mx-2">–</span>
              <span className="text-[12px] md:text-[13px] font-black">
                {(() => {
                  const parts = authorName.split(' ')
                  return parts.map((part, i) => (
                    <span key={i}>
                      <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                        {part[0] || ""}
                      </span>
                      <span className="lowercase">{part.slice(1)}</span>
                      {i < parts.length - 1 && ' '}
                    </span>
                  ))
                })()}
              </span>
            </>
          )}
        </div>
        {/* Destra: link indietro */}
        <Link
          href={language === "it" ? "/esibizioni-e-fiere" : "/en/exhibits"}
          className="text-[12px] md:text-[13px] font-black lowercase hover:opacity-70 transition-opacity"
          style={{ color: '#0000ff' }}
        >
          <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>I</span>
          <span>ndietro</span>
        </Link>
      </div>
      <div ref={innerRef} className="flex" style={{ width: `${setWidth * 5}px`, willChange: "transform" }}>
        {slides.map((slideItem, idx) => {
        const baseIdx = idx % baseItems.length
        const item = baseItems[baseIdx]
        const defaultTextWidth = Math.round(window.innerWidth * 0.4)
        const w = widths[baseIdx] ?? (item.type === "image" ? window.innerWidth : defaultTextWidth)

        if (item.type === "image") {
          return (
            <div
              key={idx}
              className="h-[100svh] flex-shrink-0 relative"
              style={{ width: `${w}px` }}
            >
              <div className="absolute inset-0 px-[10px] flex items-center justify-center">
                <div className="w-full h-full relative">
                      <Image
                        src={urlFor(item.image).url() || "/placeholder.svg"}
                        alt={title}
                        fill
                        className="object-contain"
                        priority={idx < baseItems.length}
                        loading="eager"
                        sizes="100vw"
                        onLoad={(e: any) => {
                          try {
                            const tgt = e?.currentTarget || e?.nativeEvent?.target
                            if (tgt && tgt.naturalWidth && tgt.naturalHeight) {
                              handleLoaded(baseIdx)({ naturalWidth: tgt.naturalWidth, naturalHeight: tgt.naturalHeight })
                            }
                          } catch (err) {
                            // swallow
                          }
                        }}
                      />
                </div>
              </div>
            </div>
          )
        }

        // text slide (no inner scroll). Title + author at top left, then body below
        return (
          <div key={idx} className="h-[100svh] flex-shrink-0 relative" style={{ width: `${w}px` }}>
            <div className="absolute inset-0 bg-white px-[10px] py-8 text-[#0000ff] flex flex-col" style={{ paddingTop: '10vh', marginLeft: '10px' }}>
              {/* Title and Author at top left */}
              <div className="mb-8">
                <h1 className="uppercase font-black mb-2" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', lineHeight: '1em' }}>
                  <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                    {title?.[0] || ""}
                  </span>
                  <span className="lowercase">{title ? title.slice(1) : ""}</span>
                </h1>
                {authorName && (
                  <p className="font-black" style={{ fontSize: 'clamp(1rem, 2.5vw, 2rem)', lineHeight: '1em' }}>
                    {(() => {
                      const parts = authorName.split(' ')
                      return parts.map((part, i) => (
                        <span key={i}>
                          <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                            {part[0] || ""}
                          </span>
                          <span className="lowercase">{part.slice(1)}</span>
                          {i < parts.length - 1 && ' '}
                        </span>
                      ))
                    })()}
                  </p>
                )}
              </div>

              {/* Body content */}
              <div className="flex-1 overflow-y-auto" style={{ marginTop: '10px' }}>
                <div className="max-w-[80vw] mx-auto ml-[10px] md:ml-[20px] columns-1 md:columns-2" style={{ columnGap: "1.5rem", lineHeight: '1em' }}>
                  {body && <PortableTextRenderer value={body} />}
                </div>
              </div>
            </div>
          </div>
        )
        })}
      </div>
      {/* Overlay aggiuntivo rimosso: tutto gestito nella barra inferiore */}
      <style jsx global>{`
        html, body {
          overflow-x: hidden;
          max-width: 100vw;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar { overscroll-behavior-x: contain; touch-action: pan-x pan-y; }
        p {
          line-height: 1em;
        }
      `}</style>
    </div>
  )
}
