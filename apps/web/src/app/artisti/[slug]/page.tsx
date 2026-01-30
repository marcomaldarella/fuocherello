import { safeSanityFetch } from "@/lib/sanity.client"
import { ARTIST_BY_SLUG_QUERY, ARTIST_BY_SLUG_FALLBACK_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"

import { ArtistGalleryLayout } from "@/components/ArtistGalleryLayout"
import { FallbackNotice } from "@/components/FallbackNotice"

export const revalidate = 60

interface Artist {
  _id: string
  title: string
  bio?: string
  authorName?: string
  gallery?: Array<{
    asset: any
    orientation?: string
    alt?: string
  }>
  pdfUrl?: string
}


const slugVariants = (raw: string) => {
  const decoded = (() => { try { return decodeURIComponent(raw) } catch { return raw } })()
  const base = decoded.trim()
  const lower = base.toLowerCase()
  const dash = base.replace(/\s+/g, "-")
  const lowerDash = lower.replace(/[\s_]+/g, "-")
  const squashed = lower.replace(/[-\s_]+/g, "-")
  return Array.from(new Set([raw, base, lower, dash, lowerDash, squashed]))
}

async function getArtist(slug: string): Promise<{ artist: Artist | null; isFallback: boolean }> {
  const candidates = slugVariants(slug)

  for (const lang of ["it", "en"]) {
    for (const cand of candidates) {
      const artist = await safeSanityFetch<Artist>(
        ARTIST_BY_SLUG_QUERY,
        { slug: cand, language: lang },
        { next: { revalidate: 60 } },
      )
      if (artist) return { artist, isFallback: lang !== "it" }
    }
  }

  // ultimate fallback: any language
  for (const cand of candidates) {
    const artist = await safeSanityFetch<Artist>(
      ARTIST_BY_SLUG_FALLBACK_QUERY,
      { slug: cand },
      { next: { revalidate: 60 } },
    )
    if (artist) return { artist, isFallback: true }
  }

  return { artist: null, isFallback: false }
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function ArtistDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [{ artist, isFallback }, settings] = await Promise.all([getArtist(slug), getSettings()])

  const displayArtist = artist

  if (!displayArtist) {
    return (
      <div className="min-h-screen flex flex-col bg-background">

        <main className="flex-1 px-6 py-16">
          <div className="w-screen">
            <p>Artista non trovato.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <>

      <main>
        {isFallback && <FallbackNotice language="it" />}
        <ArtistGalleryLayout
          name={displayArtist.title}
          bio={displayArtist.bio}
          authorName={displayArtist.authorName}
          gallery={displayArtist.gallery}
          pdfUrl={displayArtist.pdfUrl}
          language="it"
        />
      </main>
    </>
  )
}
