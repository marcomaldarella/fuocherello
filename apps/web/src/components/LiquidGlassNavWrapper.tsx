"use client"

import { usePathname } from "next/navigation"
import { LiquidGlassNav } from "./LiquidGlassNav"

export function LiquidGlassNavWrapper() {
  const pathname = usePathname()
  const language = pathname.startsWith("/en") ? "en" : "it"

  return <LiquidGlassNav language={language} />
}
