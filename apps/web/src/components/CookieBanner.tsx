"use client"
import { useState, useEffect } from "react"

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 md:top-auto md:bottom-0 z-[9997] px-4 pt-4 md:pt-0 md:pb-4 pointer-events-none"
      style={{ animation: "fadeInUp 0.4s ease-out" }}
    >
      <div
        className="pointer-events-auto mx-auto max-w-lg text-[#0000ff] text-[12px] md:text-[13px] leading-tight"
        style={{
          padding: "14px 20px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.08)",
        }}
      >
        <p className="mb-2 opacity-80">
          Questo sito utilizza cookie tecnici e di analisi per migliorare la tua esperienza.
          Continuando la navigazione acconsenti al loro utilizzo.
        </p>
        <p className="mb-[1em] opacity-80">
          This site uses technical and analytics cookies to improve your experience.
          By continuing to browse you consent to their use.
        </p>
        <div className="flex gap-3">
          <button
            onClick={accept}
            className="text-[#0000ff] text-[12px] uppercase tracking-wide hover:opacity-70 transition-opacity"
            style={{
              padding: "10px 16px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.5)",
              boxShadow: "0 4px 30px rgba(0,0,0,0.08)",
            }}
          >
            <span className="italic inline-block" style={{ marginRight: "0.02em" }}>A</span>
            <span style={{ marginLeft: "0.1em" }}>ccetta</span>
          </button>
          <button
            onClick={decline}
            className="text-[#0000ff] text-[12px] uppercase tracking-wide opacity-60 hover:opacity-100 transition-opacity"
            style={{
              padding: "10px 16px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.5)",
              boxShadow: "0 4px 30px rgba(0,0,0,0.08)",
            }}
          >
            <span className="italic inline-block" style={{ marginRight: "0.02em" }}>R</span>
            <span style={{ marginLeft: "0.1em" }}>ifiuta</span>
          </button>
        </div>
      </div>
    </div>
  )
}
