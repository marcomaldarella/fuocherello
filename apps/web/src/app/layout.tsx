import type React from "react"
import type { Metadata } from "next"
import { Inter_Tight } from "next/font/google"
import "./globals.css"

export const metadata: Metadata = {
  title: "Fuocherello",
  description: "Exhibitions and fairs",
}

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-sans",
  display: "swap",
})

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
        <meta name="theme-color" content="#0000ff" />
      </head>
      <body className={`${interTight.variable} font-sans font-black bg-white text-[#0000ff] px-3 md:px-4`}>
        {children}
      </body>
    </html>
  )
}
