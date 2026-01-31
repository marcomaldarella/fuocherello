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
      className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-4 pointer-events-none"
      style={{ animation: "fadeInUp 0.4s ease-out" }}
    >
      <div
        className="pointer-events-auto mx-auto max-w-lg border border-[#0000ff]/20 bg-white/95 backdrop-blur-sm text-[#0000ff] text-[12px] md:text-[13px] leading-tight px-5 py-4"
        style={{ borderRadius: "2px" }}
      >
        <p className="mb-3 opacity-80">
          Questo sito utilizza cookie tecnici e di analisi per migliorare la tua esperienza.
          Continuando la navigazione acconsenti al loro utilizzo.
        </p>
        <p className="mb-4 opacity-80">
          This site uses technical and analytics cookies to improve your experience.
          By continuing to browse you consent to their use.
        </p>
        <div className="flex gap-3">
          <button
            onClick={accept}
            className="border border-[#0000ff] text-[#0000ff] px-4 py-1.5 text-[12px] uppercase tracking-wide hover:bg-[#0000ff] hover:text-white transition-colors"
          >
            <span className="italic inline-block" style={{ marginRight: "0.07em" }}>A</span>
            <span className="lowercase">ccetta</span>
          </button>
          <button
            onClick={decline}
            className="border border-[#0000ff]/30 text-[#0000ff] px-4 py-1.5 text-[12px] uppercase tracking-wide opacity-60 hover:opacity-100 transition-opacity"
          >
            <span className="italic inline-block" style={{ marginRight: "0.07em" }}>R</span>
            <span className="lowercase">ifiuta</span>
          </button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
