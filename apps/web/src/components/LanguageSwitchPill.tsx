"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { getAlternatePath } from "@/lib/languagePath"

const glassStyle = {
  background: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.08)",
}

export function LanguageSwitchPill() {
  const pathname = usePathname()
  const href = getAlternatePath(pathname)
  const isItalian = !pathname.startsWith("/en")

  return (
    <div
      className="hidden md:block fixed right-4 bottom-4 z-50 py-2.5 px-6 text-[#0000ff] text-sm rounded-lg"
      style={glassStyle}
    >
      <div className="flex items-center gap-3" style={{ paddingLeft: "0.5em", paddingRight: "0.5em" }}>
        {isItalian ? (
          <>
            <span className="lowercase px-3 py-1" style={{ opacity: 0.5, pointerEvents: "none" }}>it</span>
            <Link href={href} className="lowercase hover:opacity-70 transition-opacity px-3 py-1">en</Link>
          </>
        ) : (
          <>
            <Link href={href} className="lowercase hover:opacity-70 transition-opacity px-3 py-1">it</Link>
            <span className="lowercase px-3 py-1" style={{ opacity: 0.5, pointerEvents: "none" }}>en</span>
          </>
        )}
      </div>
    </div>
  )
}
