"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { PortableText } from "@portabletext/react"

interface ExhibitInfoDrawerProps {
  body?: any
  language: "it" | "en"
  title?: string
  authorName?: string
}

export function ExhibitInfoDrawer({ body, language, title, authorName }: ExhibitInfoDrawerProps) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const startY = useRef<number | null>(null)
  const currentY = useRef<number>(0)

  const label = open ? (language === "it" ? "close" : "close") : (language === "it" ? "info" : "info")
  const backHref = language === "it" ? "/esibizioni-e-fiere" : "/en/exhibits"
  const backLabel = language === "it" ? "indietro" : "back"

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    const onTouchStart = (e: TouchEvent) => {
      startY.current = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      if (startY.current == null) return
      const y = e.touches[0].clientY
      const delta = y - startY.current
      // Solo mobile: trascina verso il basso per chiudere, verso l'alto per aprire
      if (window.innerWidth < 768) {
        currentY.current = Math.max(0, Math.min(window.innerHeight * 0.6, delta < 0 ? 0 : delta))
        panel.style.transform = `translateY(${currentY.current}px)`
      }
    }
    const onTouchEnd = () => {
      if (window.innerWidth < 768) {
        // Soglia: se trascinato > 1/4 altezza, chiudi
        const threshold = window.innerHeight * 0.15
        if (currentY.current > threshold) {
          setOpen(false)
        }
        currentY.current = 0
        panel.style.transform = "translateY(0px)"
      }
      startY.current = null
    }

    panel.addEventListener("touchstart", onTouchStart)
    panel.addEventListener("touchmove", onTouchMove)
    panel.addEventListener("touchend", onTouchEnd)

    return () => {
      panel.removeEventListener("touchstart", onTouchStart)
      panel.removeEventListener("touchmove", onTouchMove)
      panel.removeEventListener("touchend", onTouchEnd)
    }
  }, [])

  // External toggle handler via CustomEvent
  useEffect(() => {
    const onToggle = (e: Event) => {
      const ce = e as CustomEvent<{ open?: boolean }>
      const desired = ce.detail?.open
      setOpen((prev) => (typeof desired === "boolean" ? desired : !prev))
    }
    window.addEventListener("exhibit-info-toggle", onToggle as EventListener)
    return () => {
      window.removeEventListener("exhibit-info-toggle", onToggle as EventListener)
    }
  }, [])

  // Broadcast open state changes
  useEffect(() => {
    const evt = new CustomEvent("exhibit-info-state", { detail: { open } })
    window.dispatchEvent(evt)
  }, [open])

  return (
    <>
      {/* Bottom-right inline from 50%: controls (info/close + back) */}
      <div className="fixed left-1/2 right-0 bottom-0 z-50 bg-white flex items-center justify-end gap-3 px-[1em] py-2 md:py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-[#0000ff]  text-[12px] md:text-[13px] lowercase hover:opacity-70"
        >
          {label}
        </button>
        <Link
          href={backHref}
          aria-label={language === "it" ? "Torna alla lista mostre" : "Back to exhibits list"}
          className="text-[#0000ff]  text-[12px] md:text-[13px] lowercase hover:opacity-70"
        >
          {backLabel}
        </Link>
      </div>

      {/* Drawer */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50"
          onClick={() => setOpen(false)}
        >
          {/* backdrop click to close */}
          <div className="absolute inset-0" />
          <div
            ref={panelRef}
            onClick={(e) => e.stopPropagation()}
            className="md:fixed md:right-0 md:top-0 md:h-screen md:w-1/2 fixed bottom-0 left-0 right-0 h-[60vh]
                       bg-white/70 backdrop-blur-md border border-[#0000ff]/15 shadow-none
                       text-[#0000ff]  overflow-y-auto px-3 md:px-4 py-3 text-[11px] md:text-[12px] leading-snug"
          >
            {(title || authorName) && (
              <div className="mb-4">
                <div className="flex items-baseline justify-between gap-3">
                  {title && (
                    <div className="uppercase leading-[0.95]">
                      <span className="italic uppercase">{title[0]}</span>
                      <span className="lowercase">{title.slice(1)}</span>
                    </div>
                  )}
                  {authorName && <div className="lowercase opacity-70">{authorName}</div>}
                </div>
              </div>
            )}

            {body ? (
              <PortableText
                value={body}
                components={{
                  block: {
                    h1: ({ children }) => <h2 className="text-[12px] md:text-[13px] mb-3">{children}</h2>,
                    h2: ({ children }) => <h2 className="text-[12px] md:text-[13px] mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-[11px] md:text-[12px] mb-2">{children}</h3>,
                    normal: ({ children }) => <p className="mb-3 leading-snug">{children}</p>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l border-[#0000ff]/30 pl-3 italic my-3">{children}</blockquote>
                    ),
                  },
                  marks: {
                    link: ({ children, value }) => (
                      <a
                        href={value?.href}
                        className="underline hover:opacity-70"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                  },
                }}
              />
            ) : (
              <div>{language === "it" ? "Nessun contenuto." : "No content."}</div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
