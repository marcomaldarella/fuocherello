"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

interface LiquidGlassNavProps {
  language: "it" | "en"
}

const navItemsIt = [
  { label: "Mostre", href: "/mostre" },
  { label: "Fiere", href: "/fiere" },
  { label: "Artisti", href: "/artisti" },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
  { label: "Contatti", href: "/contact" },
]

const navItemsEn = [
  { label: "Exhibitions", href: "/en/exhibitions" },
  { label: "Fairs", href: "/en/fairs" },
  { label: "Artists", href: "/en/artists" },
  { label: "News", href: "/en/news" },
  { label: "About", href: "/en/about" },
  { label: "Contact", href: "/en/contact" },
]

function FlameIcon() {
  return (
    <img
      src="/fuocherello.gif"
      alt="Fuocherello"
      className="w-8 h-8 shrink-0"
    />
  )
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-5 h-4 flex flex-col justify-center gap-[5px] relative">
      <span
        className="block w-full h-[1.5px] bg-[#0000ff] transition-all duration-300 origin-center"
        style={{
          transform: open ? "rotate(45deg) translateY(3.25px)" : "none",
        }}
      />
      <span
        className="block w-full h-[1.5px] bg-[#0000ff] transition-all duration-300 origin-center"
        style={{
          transform: open ? "rotate(-45deg) translateY(-3.25px)" : "none",
        }}
      />
    </div>
  )
}

export function LiquidGlassNav({ language }: LiquidGlassNavProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems = language === "it" ? navItemsIt : navItemsEn
  const homeHref = language === "it" ? "/" : "/en"

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const glassStyle = {
    background: "rgba(255, 255, 255, 0.45)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
  }

  return (
    <>
      {/* Desktop nav */}
      <nav
        className="fixed top-4 left-4 z-[9999] hidden md:flex items-center gap-1 px-4 py-2.5 rounded-full"
        style={glassStyle}
      >
        <Link
          href={homeHref}
          className="flex items-center gap-2 text-[#0000ff] mr-3 hover:opacity-70 transition-opacity"
        >
          <FlameIcon />
          <span className="font-semibold text-[15px] tracking-[-0.01em]">
            <span className="italic uppercase inline-block" style={{ marginRight: "0.04em" }}>F</span>
            <span className="lowercase">uocherello</span>
          </span>
        </Link>

        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[13px] px-3 py-1 rounded-full transition-all duration-200 ${
                isActive
                  ? "text-[#0000ff] bg-[rgba(0,0,255,0.08)] font-medium"
                  : "text-[#0000ff] hover:bg-[rgba(0,0,255,0.05)] font-normal"
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Mobile: pill button bottom-left */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed bottom-4 left-4 z-[10000] md:hidden flex items-center gap-2 px-4 py-2.5 rounded-full"
        style={glassStyle}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        <FlameIcon />
        <HamburgerIcon open={mobileOpen} />
      </button>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[9998] md:hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
        }}
      >
        <div className="flex flex-col items-start justify-center h-full px-8">
          <Link
            href={homeHref}
            onClick={() => setMobileOpen(false)}
            className="text-[#0000ff] font-semibold text-[28px] mb-10 hover:opacity-70 transition-opacity"
          >
            <span className="italic uppercase inline-block" style={{ marginRight: "0.06em" }}>F</span>
            <span className="lowercase">uocherello</span>
          </Link>

          {navItems.map((item, i) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`text-[#0000ff] text-[32px] font-normal leading-[1.4] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? "font-medium" : "opacity-70 hover:opacity-100"
                }`}
                style={{
                  transform: mobileOpen ? "translateY(0)" : `translateY(${20 + i * 8}px)`,
                  opacity: mobileOpen ? (isActive ? 1 : 0.7) : 0,
                  transitionDelay: mobileOpen ? `${80 + i * 50}ms` : "0ms",
                }}
              >
                <span className="italic uppercase inline-block" style={{ marginRight: "0.05em" }}>
                  {item.label[0]}
                </span>
                <span className="lowercase">{item.label.slice(1)}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
