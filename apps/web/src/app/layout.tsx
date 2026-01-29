import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { LiquidGlassNavWrapper } from "@/components/LiquidGlassNavWrapper"

export const metadata: Metadata = {
  title: "Fuocherello",
  description: "Exhibitions and fairs",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/fuocherello.gif" />
        <link href="https://fonts.googleapis.com/css2?family=Uncut+Sans:wght@400&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#0000ff" />
      </head>
      <body className={`font-sans bg-white text-[#0000ff] px-3 md:px-4`}>
        <LiquidGlassNavWrapper />
        {children}
      </body>
    </html>
  )
}
