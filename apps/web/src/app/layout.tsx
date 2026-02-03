import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { LiquidGlassNavWrapper } from "@/components/LiquidGlassNavWrapper"
import { CookieBanner } from "@/components/CookieBanner"

const siteUrl = "https://fuocherello.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fuocherello | Galleria d'Arte Contemporanea",
    template: "%s | Fuocherello",
  },
  description:
    "Fuocherello è uno spazio espositivo dedicato alla scultura contemporanea, nato all'interno della Fonderia Artistica De Carli di Volvera (TO). Mostre, fiere e artisti emergenti.",
  keywords: [
    "arte contemporanea",
    "scultura",
    "galleria",
    "mostre",
    "fiere d'arte",
    "Volvera",
    "Torino",
    "Fonderia De Carli",
    "Fuocherello",
    "contemporary art",
    "sculpture",
    "gallery",
    "exhibitions",
  ],
  authors: [{ name: "Fuocherello" }],
  creator: "Fuocherello",
  publisher: "Fuocherello",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    alternateLocale: "en_US",
    url: siteUrl,
    siteName: "Fuocherello",
    title: "Fuocherello | Galleria d'Arte Contemporanea",
    description:
      "Spazio espositivo dedicato alla scultura contemporanea presso la Fonderia Artistica De Carli di Volvera (TO). Mostre, fiere e artisti emergenti.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fuocherello - Galleria d'Arte Contemporanea",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fuocherello | Galleria d'Arte Contemporanea",
    description:
      "Spazio espositivo dedicato alla scultura contemporanea presso la Fonderia Artistica De Carli di Volvera (TO).",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "it-IT": siteUrl,
      "en-US": `${siteUrl}/en`,
    },
  },
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

        <meta name="theme-color" content="#0000ff" />
      </head>
      <body className={`font-sans font-medium bg-white text-[#0000ff] px-3 md:px-4`}>
        <LiquidGlassNavWrapper />
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
