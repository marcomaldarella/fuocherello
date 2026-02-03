"use client"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/lib/imageUrl"
import { PortableTextRenderer } from "@/components/PortableTextRenderer"
import { useEffect, useMemo, useRef, useState } from "react"
import { useViewMode } from "@/contexts/ViewModeContext"

interface GalleryItem {
  image: any
  lqip?: string
  caption?: string
}

interface RelatedItem {
  _id: string
  title: string
  slug: { current: string }
  artistsLine?: string
  authorName?: string
  venue?: string
  dateStart?: string
  dateEnd?: string
  featuredImage?: any
  lqip?: string
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
  relatedExhibitions?: RelatedItem[]
  relatedFairs?: RelatedItem[]
  backHref?: string
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
  relatedExhibitions = [],
  relatedFairs = [],
  backHref,
}: ExhibitHorizontalGalleryProps & { body?: any }) {
  const { viewMode, setScrollPosition, scrollPosition } = useViewMode()
  const locale = language === "en" ? "en-US" : "it-IT"
  const [splashVisible, setSplashVisible] = useState(true)
  const [splashFading, setSplashFading] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const verticalContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashFading(true)
      setTimeout(() => setSplashVisible(false), 500)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Handle scroll position restoration when switching views
  useEffect(() => {
    setIsTransitioning(true)
    const transitionTimer = setTimeout(() => setIsTransitioning(false), 300)
    
    if (viewMode === "vertical" && verticalContainerRef.current) {
      // Restore vertical scroll position
      const savedVerticalPos = localStorage.getItem("verticalScrollPos")
      if (savedVerticalPos) {
        requestAnimationFrame(() => {
          if (verticalContainerRef.current) {
            verticalContainerRef.current.scrollTop = parseInt(savedVerticalPos, 10)
          }
        })
      }
    }
    
    return () => clearTimeout(transitionTimer)
  }, [viewMode])


  const baseItems = useMemo(() => {
    const arr: any[] = []
    if (featuredImage) arr.push({ type: "image", image: featuredImage })
    if (gallery && gallery.length) arr.push(...gallery.map((g) => ({ type: "image", image: g.image })).filter((x) => x.image))
    // text slide: always show (title + optional body)
    arr.push({ type: "text" })
    return arr
  }, [featuredImage, gallery, body, authorName])

  const renderNameList = (names?: string) => {
    if (!names) return null
    return names.split(/,| e | and /).map((name, i, arr) => (
      <span key={i}>
        {name.trim().split(" ").map((word, j) => (
          <span key={j}>
            <span className="italic uppercase inline-block" style={{ marginRight: "0.02em" }}>
              {word[0]}
            </span>
            <span className="lowercase">{word.slice(1)}</span>
            {j < name.trim().split(" ").length - 1 && " "}
          </span>
        ))}
        {i < arr.length - 1 && ", "}
      </span>
    ))
  }

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
    if (viewMode === "vertical") return // vertical mode uses native vertical flow
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
          if (process.env.NODE_ENV !== "production") {
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
        if (process.env.NODE_ENV !== "production") {
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

    // Touch handling for mobile horizontal scroll
    let touchStartX = 0
    let touchStartY = 0
    let touchStartScroll = 0
    let isTouchDragging = false

    const onTouchStart = (e: TouchEvent) => {
      if (initializingRef.current) return
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
      touchStartScroll = currentScrollRef.current
      isTouchDragging = false
    }

    const onTouchMove = (e: TouchEvent) => {
      if (initializingRef.current) return
      const dx = e.touches[0].clientX - touchStartX
      const dy = e.touches[0].clientY - touchStartY
      // Only handle horizontal drags
      if (!isTouchDragging && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
        isTouchDragging = true
      }
      if (!isTouchDragging) return
      e.preventDefault()
      const total = setWidth
      const quintuple = total * 5
      const maxScroll = Math.max(0, quintuple - (el.clientWidth || 0) - 1)
      let next = touchStartScroll - dx
      if (next < 0) next = 0
      if (next > maxScroll) next = maxScroll
      targetScrollRef.current = next
      currentScrollRef.current = next
      if (innerRef.current) innerRef.current.style.transform = `translateX(-${next}px)`
    }

    const onTouchEnd = () => {
      isTouchDragging = false
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true })
    el.addEventListener("touchmove", onTouchMove, { passive: false })
    el.addEventListener("touchend", onTouchEnd, { passive: true })

    return () => {
      ro.disconnect()
      el.removeEventListener("wheel", onWheel as any)
      el.removeEventListener("touchstart", onTouchStart as any)
      el.removeEventListener("touchmove", onTouchMove as any)
      el.removeEventListener("touchend", onTouchEnd as any)
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      if (initTimerRef.current) window.clearTimeout(initTimerRef.current)
      wheelTickingRef.current = false
      scrollTickingRef.current = false
    }
  }, [baseItems.length, setWidth, widths, viewMode])


  // Gestisce larghezze per immagine in base all'aspect ratio naturale
  const handleLoaded = (baseIdx: number) => (info: { naturalWidth: number; naturalHeight: number }) => {
    // Skip width updates if animating to prevent layout shifts
    if (isAnimatingRef.current) return

    // Subtract bottom bar height (56px = pb-14)
    const h = window.innerHeight - 56
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

  // Precompute vertical items (always, for preloading)
  const verticalItems = isMobile ? [
    ...(title || artistsLine ? [{ type: "header" }] : []),
    ...baseItems.filter(item => item.type === "image"),
    { type: "text" }
  ] : baseItems;

  const isVertical = viewMode === "vertical"

  // Vertical view — always rendered, hidden when horizontal (for preloading correlati)
  const verticalView = (
    <div
      ref={verticalContainerRef}
      className="w-full min-h-screen overflow-y-auto"
      style={{
        opacity: isVertical ? (isTransitioning ? 0.5 : 1) : 0,
        transition: 'opacity 0.3s ease-out',
        position: isVertical ? 'relative' : 'fixed',
        pointerEvents: isVertical ? 'auto' : 'none',
        zIndex: isVertical ? 10 : -1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        visibility: isVertical ? 'visible' : 'hidden',
      }}
      onScroll={(e) => {
        setScrollPosition((e.target as HTMLElement).scrollTop)
      }}
      >
        {isMobile && (title || artistsLine) && (
          <div className="sticky top-0 z-30 w-full bg-white text-[#0000ff]" style={{ padding: '3em 1em 1em 1em' }}>
            <h1 className="uppercase leading-[0.95] text-[28px]" style={{ paddingBottom: '0.3em' }}>
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                {title?.[0] || ""}
              </span>
              <span className="lowercase">{title ? title.slice(1) : ""}</span>
            </h1>
            {artistsLine && (
              <div className="text-[16px] opacity-70 leading-tight">{renderNameList(artistsLine)}</div>
            )}
          </div>
        )}
        {verticalItems.filter(item => item.type !== "header").map((item, idx) => (
          <div key={idx} className="w-full" style={{ padding: '0 1em', marginBottom: item.type === "image" ? '1em' : '0' }}>
            {item.type === "image" ? (
              <img
                src={urlFor(item.image).width(1800).quality(85).url() || "/placeholder.svg"}
                alt={title}
                className="w-full h-auto block animate-fade-in"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            ) : item.type === "text" ? (
              <div className="w-full max-w-[800px] mx-auto text-[#0000ff]" style={{ paddingTop: body ? '1.5em' : '0.5em', paddingBottom: '0.5em' }}>
                {!isMobile && (
                  <>
                    <h1 className="uppercase leading-[0.95] text-[24px] mb-6" style={{ paddingBottom: '1em' }}>
                      <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                        {title?.[0] || ""}
                      </span>
                      <span className="lowercase">{title ? title.slice(1) : ""}</span>
                    </h1>
                    {artistsLine && (
                      <div className="text-[15px] opacity-70 leading-tight mb-3">{renderNameList(artistsLine)}</div>
                    )}
                  </>
                )}
                {body && (
                  <div className="text-[15px] leading-snug">
                    <PortableTextRenderer value={body} />
                  </div>
                )}
                {body && authorName && (
                  <div className="text-[15px] opacity-70" style={{ paddingTop: '1em', paddingBottom: '1em' }}>
                    <span style={{ marginRight: '1em' }}>{language === 'en' ? 'text by' : 'testo di'}</span>
                    {authorName.split(' ').map((word, i) => (
                      <span key={i}>
                        <span className="italic uppercase inline-block" style={{ marginRight: "0.02em" }}>
                          {word[0]}
                        </span>
                        <span className="lowercase">{word.slice(1)}</span>
                        {i < authorName.split(' ').length - 1 && ' '}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ))}

        {relatedExhibitions.length > 0 && (
          <div className="w-full" style={{ padding: "0 1em", marginTop: "3em", marginBottom: "2em" }}>
            <h2 className="text-[#0000ff] text-[clamp(1.5rem,4vw,2rem)] leading-[0.85] tracking-[-0.03em]" style={{ paddingBottom: '1em' }}>
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                {language === "en" ? "O" : "A"}
              </span>
              <span className="lowercase">{language === "en" ? "ther exhibitions" : "ltre mostre"}</span>
            </h2>
            <div
              className="grid grid-cols-1 md:grid-cols-2"
              style={{ gap: "10px" }}
            >
              {relatedExhibitions.map((item) => (
                <Link
                  key={item._id}
                  href={`${language === "en" ? "/en/exhibitions" : "/mostre"}/${item.slug.current}`}
                  className="block hover:opacity-90 transition-opacity"
                >
                  <div className="w-full">
                    <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
                      <Image
                        src={
                          item.featuredImage
                            ? urlFor(item.featuredImage).width(600).height(600).fit("crop").url()
                            : `/placeholder.svg?height=800&width=800`
                        }
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        {...(item.lqip ? { placeholder: "blur" as const, blurDataURL: item.lqip } : {})}
                      />
                    </div>
                    <div className="mt-2 w-full text-[#0000ff] text-[12px] md:text-[13px] leading-tight" style={{ paddingTop: "1em" }}>
                      <div className="flex items-baseline justify-between gap-4">
                        <h2 className="text-[16px] md:text-[17px] uppercase leading-[0.95] first-letter:italic whitespace-nowrap" style={{ paddingBottom: '0.5em' }}>
                          <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                            {item.title?.[0] ?? ""}
                          </span>
                          <span className="lowercase">{item.title?.slice(1) ?? ""}</span>
                        </h2>
                        {item.authorName && (
                          <span className="whitespace-nowrap shrink-0">
                            <span className="opacity-70" style={{ marginRight: '1em' }}>{language === 'en' ? 'text by' : 'testo di'}</span>
                            {item.authorName.split(" ").map((word, i) => (
                              <span key={i} className="whitespace-nowrap">
                                <span className="italic uppercase inline-block" style={{ marginRight: "0.02em" }}>
                                  {word[0]}
                                </span>
                                <span className="lowercase">{word.slice(1)}</span>
                                {i < item.authorName!.split(" ").length - 1 && " "}
                              </span>
                            ))}
                          </span>
                        )}
                      </div>
                      {item.artistsLine && (
                        <div className="opacity-70">
                          {item.artistsLine.split(/,| e | and /).map((name, i, arr) => (
                            <span key={i}>
                              {name.trim().split(" ").map((word, j) => (
                                <span key={j} className="whitespace-nowrap">
                                  <span className="italic uppercase inline-block" style={{ marginRight: "0.02em" }}>
                                    {word[0]}
                                  </span>
                                  <span className="lowercase">{word.slice(1)}</span>
                                  {j < name.trim().split(" ").length - 1 && " "}
                                </span>
                              ))}
                              {i < arr.length - 1 && ", "}
                            </span>
                          ))}
                        </div>
                      )}
                      {(item.dateStart || item.dateEnd) && (
                        <div className="lowercase opacity-70">
                          {item.dateStart && new Date(item.dateStart).toLocaleDateString(locale).replaceAll("/", ".")}
                          {item.dateStart && item.dateEnd && " - "}
                          {item.dateEnd && new Date(item.dateEnd).toLocaleDateString(locale).replaceAll("/", ".")}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {relatedFairs.length > 0 && (
          <div className="w-full" style={{ padding: "0 1em", marginTop: "3em", marginBottom: "2em" }}>
            <h2 className="text-[#0000ff] text-[clamp(1.5rem,4vw,2rem)] leading-[0.85] tracking-[-0.03em]" style={{ paddingBottom: '1em' }}>
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                {language === "en" ? "O" : "A"}
              </span>
              <span className="lowercase">{language === "en" ? "ther fairs" : "ltre fiere"}</span>
            </h2>
            <div
              className="grid grid-cols-1 md:grid-cols-2"
              style={{ gap: "10px" }}
            >
              {relatedFairs.map((item) => (
                <Link
                  key={item._id}
                  href={`${language === "en" ? "/en/fairs" : "/fiere"}/${item.slug.current}`}
                  className="block hover:opacity-90 transition-opacity"
                >
                  <div className="w-full">
                    <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
                      <Image
                        src={
                          item.featuredImage
                            ? urlFor(item.featuredImage).width(600).height(600).fit("crop").url()
                            : `/placeholder.svg?height=800&width=800`
                        }
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        {...(item.lqip ? { placeholder: "blur" as const, blurDataURL: item.lqip } : {})}
                      />
                    </div>
                    <div className="mt-2 w-full text-[#0000ff] text-[12px] md:text-[13px] leading-tight" style={{ paddingTop: "1em" }}>
                      <div className="flex items-baseline justify-between gap-4">
                        <h2 className="text-[16px] md:text-[17px] uppercase leading-[0.95] first-letter:italic whitespace-nowrap" style={{ paddingBottom: '0.5em' }}>
                          <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                            {item.title?.[0] ?? ""}
                          </span>
                          <span className="lowercase">{item.title?.slice(1) ?? ""}</span>
                        </h2>
                        {item.authorName && (
                          <span className="whitespace-nowrap shrink-0">
                            <span className="opacity-70" style={{ marginRight: '1em' }}>{language === 'en' ? 'text by' : 'testo di'}</span>
                            {item.authorName.split(" ").map((word, i) => (
                              <span key={i} className="whitespace-nowrap">
                                <span className="italic uppercase inline-block" style={{ marginRight: "0.02em" }}>
                                  {word[0]}
                                </span>
                                <span className="lowercase">{word.slice(1)}</span>
                                {i < item.authorName!.split(" ").length - 1 && " "}
                              </span>
                            ))}
                          </span>
                        )}
                      </div>
                      {item.venue && (
                        <div className="opacity-70">
                          {item.venue.split(' ').map((word, i) => (
                            <span key={i} className="whitespace-nowrap">
                              <span className="italic uppercase inline-block" style={{ marginRight: "0.02em" }}>
                                {word[0]}
                              </span>
                              <span className="lowercase">{word.slice(1)}</span>
                              {i < item.venue!.split(' ').length - 1 && ' '}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.artistsLine && (
                        <div className="opacity-70">
                          {item.artistsLine.split(/,| e | and /).map((name, i, arr) => (
                            <span key={i}>
                              {name.trim().split(' ').map((word, j) => (
                                <span key={j} className="whitespace-nowrap">
                                  <span className="italic uppercase inline-block" style={{ marginRight: "0.02em" }}>
                                    {word[0]}
                                  </span>
                                  <span className="lowercase">{word.slice(1)}</span>
                                  {j < name.trim().split(' ').length - 1 && ' '}
                                </span>
                              ))}
                              {i < arr.length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                      )}
                      {(item.dateStart || item.dateEnd) && (
                        <div className="lowercase opacity-70">
                          {item.dateStart && new Date(item.dateStart).toLocaleDateString(locale).replaceAll("/", ".")}
                          {item.dateStart && item.dateEnd && " - "}
                          {item.dateEnd && new Date(item.dateEnd).toLocaleDateString(locale).replaceAll("/", ".")}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );

  return (
    <>
    {verticalView}
    <div
      ref={scrollerRef}
      className="fixed top-0 left-0 w-screen h-[100svh] pb-14 overflow-hidden overflow-y-hidden no-scrollbar"
      style={{
        zIndex: isVertical ? -1 : 10,
        opacity: isVertical ? 0 : (isTransitioning ? 0.5 : 1),
        transition: 'opacity 0.3s ease-out',
        pointerEvents: isVertical ? 'none' : 'auto',
        visibility: isVertical ? 'hidden' : 'visible',
      }}
    >
      {/* Splash overlay */}
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
      {/* Barra inferiore: titolo - autore (a sinistra) + link indietro (a destra) */}
      <div className="fixed left-0 right-0 bottom-0 bg-white z-40 flex items-center justify-between py-2 md:py-3" style={{ paddingLeft: '10px', paddingRight: '10px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
        {/* Sinistra: titolo - autore */}
        <div className="flex items-baseline text-[#0000ff]">
          <h1 className="uppercase leading-[0.95] text-[13px] md:text-[13px] ">
            <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
              {title?.[0] || ""}
            </span>
            <span className="lowercase">{title ? title.slice(1) : ""}</span>
          </h1>
          {artistsLine && (
            <>
              <span className="mx-2">–</span>
              <span className="text-[12px] md:text-[13px] ">{renderNameList(artistsLine)}</span>
            </>
          )}
        </div>
        {/* Destra: link indietro */}
        <Link
          href={backHref || (language === "it" ? "/mostre" : "/en/exhibitions")}
          className="text-[12px] md:text-[13px]  lowercase hover:opacity-70 transition-opacity"
          style={{ color: '#0000ff' }}
        >
          <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>{language === "it" ? "I" : "B"}</span>
          <span>{language === "it" ? "ndietro" : "ack"}</span>
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
              className="h-[100svh] flex-shrink-0 pb-14"
              style={{ width: `${w}px` }}
            >
              <img
                src={urlFor(item.image).height(1800).quality(85).url() || "/placeholder.svg"}
                alt={title}
                className="h-full w-auto block animate-fade-in"
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
          )
        }

        // text slide (fixed, no scroll). Smaller text, 3 columns, author in header
        return (
          <div key={idx} className="h-[100svh] flex-shrink-0 relative" style={{ width: `${w}px` }}>
            <div className="absolute inset-0 bg-white px-[20px] text-[#0000ff] flex flex-col justify-center" style={{ paddingTop: '5vh', paddingBottom: '60px', marginLeft: '10px' }}>
              {/* Title + artists + text by author */}
              <div style={{ marginBottom: '1em' }}>
                <h1 className="uppercase font-medium" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', lineHeight: '1em', paddingBottom: '0.3em' }}>
                  <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                    {title?.[0] || ""}
                  </span>
                  <span className="lowercase">{title ? title.slice(1) : ""}</span>
                </h1>
                <div className="opacity-70" style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)', lineHeight: '1.3em' }}>
                  {artistsLine && (
                    <span>{renderNameList(artistsLine)}</span>
                  )}
                  {artistsLine && body && authorName && (
                    <span style={{ margin: '0 0.5em' }}>–</span>
                  )}
                  {body && authorName && (
                    <span>
                      <span style={{ marginRight: '0.5em' }}>{language === 'en' ? 'text by' : 'testo di'}</span>
                      {authorName.split(' ').map((word, i) => (
                        <span key={i}>
                          <span className="italic uppercase inline-block" style={{ marginRight: "0.02em" }}>
                            {word[0]}
                          </span>
                          <span className="lowercase">{word.slice(1)}</span>
                          {i < authorName.split(' ').length - 1 && ' '}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </div>

              {/* Body content — fixed, no scroll, 3 columns, smaller text */}
              {body && (
                <div style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)', lineHeight: '1.4', columnCount: 2, columnGap: '1.5rem', columnFill: 'auto', overflow: 'hidden', maxHeight: '65vh', width: `${w - 100}px` }}>
                  <PortableTextRenderer value={body} />
                </div>
              )}
            </div>
          </div>
        )
        })}

      </div>
      {/* Overlay aggiuntivo rimosso: tutto gestito nella barra inferiore */}
    </div>
    </>
  )
}
