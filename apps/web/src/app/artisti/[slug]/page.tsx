import { safeSanityFetch, isSanityAvailable } from "@/lib/sanity.client"
import { ARTIST_BY_SLUG_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"
import { Header } from "@/components/Header"
import { ArtistGalleryLayout } from "@/components/ArtistGalleryLayout"
import Link from "next/link"

export const revalidate = 60

interface Artist {
  _id: string
  title: string
  bio?: string
  gallery?: Array<{
    asset: any
    orientation?: string
    alt?: string
  }>
  pdfUrl?: string
}

const mockArtist: Artist = {
  _id: "mock-artist",
  title: "Marco Rossi",
  bio: "Marco Rossi è un artista contemporaneo italiano che esplora le intersezioni tra pittura, scultura e installazione.",
}

async function getArtist(slug: string): Promise<Artist | null> {
  const result = await safeSanityFetch<Artist>(
    ARTIST_BY_SLUG_QUERY,
    { slug, language: "it" },
    { next: { revalidate: 60 } },
  )
  return result
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function ArtistDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [artist, settings] = await Promise.all([getArtist(slug), getSettings()])

  const displayArtist = artist || (!isSanityAvailable ? mockArtist : null)

  if (!displayArtist) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header language="it" />
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
      <Header language="it" />
      <main>
        <ArtistGalleryLayout
          name={displayArtist.title}
          bio={displayArtist.bio}
          gallery={displayArtist.gallery}
          pdfUrl={displayArtist.pdfUrl}
          language="it"
        />
      </main>
    </>
  )
}
