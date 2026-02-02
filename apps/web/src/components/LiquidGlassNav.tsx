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
      className="w-[31px] h-[31px] shrink-0"
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
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.08)",
  }

  return (
    <>
      {/* Desktop nav */}
      <nav
        className="fixed top-4 left-4 z-[9999] hidden md:flex items-center gap-3 pl-5 pr-12 py-3 rounded-lg"
        style={glassStyle}
      >
        <Link
          href={homeHref}
          className="flex items-center gap-2 mr-4 hover:opacity-70 transition-opacity"
          style={{ color: "#0000ff" }}
        >
          <FlameIcon />
          <span className="text-[16px] tracking-[-0.01em]" style={{ color: "#0000ff" }}>
            <span className="italic uppercase inline-block" style={{ marginRight: "0.02em" }}>F</span>
            <span className="lowercase">uocherello</span>
          </span>
        </Link>

        {navItems.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const isLast = index === navItems.length - 1
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[14px] rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[rgba(0,0,255,0.08)]"
                  : "hover:bg-[rgba(0,0,255,0.05)]"
              }`}
              style={Object.assign({ color: "#0000ff", padding: "4px 0.3em" }, isLast ? { marginRight: "0.5em" } : {})}
            >
              <span className="italic uppercase inline-block" style={{ marginRight: "0.05em" }}>
                {item.label[0]}
              </span>
              <span className="lowercase">{item.label.slice(1)}</span>
            </Link>
          )
        })}
      </nav>

      {/* Mobile: pill button bottom-left */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed bottom-4 left-4 right-4 z-[10000] md:hidden flex items-center justify-between px-4 h-12 rounded-xl"
        style={glassStyle}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        <Link href={homeHref} className="flex items-center gap-2" style={{ color: "#0000ff" }}>
          <FlameIcon />
          <span className="text-[16px] tracking-[-0.01em]" style={{ color: "#0000ff" }}>
            <span className="italic uppercase inline-block" style={{ marginRight: "0.02em" }}>F</span>
            <span className="lowercase">uocherello</span>
          </span>
        </Link>
        <div style={{ marginRight: "1em" }}>
          <HamburgerIcon open={mobileOpen} />
        </div>
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
        <div className="flex flex-col items-center justify-center h-full px-8">
          {navItems.map((item, i) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`text-[#0000ff] text-[32px] leading-[1.4] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? "" : "opacity-70 hover:opacity-100"
                }`}
                style={{
                  fontWeight: "500",
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

          <a
            href="https://www.instagram.com/fuocherellogallery/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="text-[#0000ff] text-[32px] leading-[1.4] opacity-70 hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              fontWeight: "500",
              transform: mobileOpen ? "translateY(0)" : `translateY(${20 + navItems.length * 8}px)`,
              opacity: mobileOpen ? 0.7 : 0,
              transitionDelay: mobileOpen ? `${80 + navItems.length * 50}ms` : "0ms",
            }}
          >
            <span className="italic uppercase inline-block" style={{ marginRight: "0.05em" }}>
              I
            </span>
            <span className="lowercase">nstagram</span>
          </a>
        </div>
      </div>
    </>
  )
}
