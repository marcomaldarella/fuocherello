import { safeSanityFetch, isSanityAvailable } from "@/lib/sanity.client"
import { ARTIST_BY_SLUG_QUERY, ARTIST_BY_SLUG_FALLBACK_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"
import { Header } from "@/components/Header"
import { FallbackNotice } from "@/components/FallbackNotice"
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
  language: string
}

const mockArtist: Artist = {
  _id: "mock-artist-en",
  title: "Marco Rossi",
  bio: "Marco Rossi is an Italian contemporary artist who explores the intersections between painting, sculpture, and installation.",
  language: "en",
}

async function getArtist(slug: string): Promise<{ artist: Artist | null; isFallback: boolean }> {
  let artist = await safeSanityFetch<Artist>(
    ARTIST_BY_SLUG_QUERY,
    { slug, language: "en" },
    { next: { revalidate: 60 } },
  )

  if (!artist) {
    artist = await safeSanityFetch<Artist>(ARTIST_BY_SLUG_FALLBACK_QUERY, { slug }, { next: { revalidate: 60 } })
    return { artist: artist || null, isFallback: true }
  }

  return { artist, isFallback: false }
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnArtistDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [{ artist, isFallback }, settings] = await Promise.all([getArtist(slug), getSettings()])

  const displayArtist = artist || (!isSanityAvailable ? mockArtist : null)

  if (!displayArtist) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header language="en" />
        <main className="flex-1 px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <p>Artist not found.</p>
            <Link href="/en/artists" className="text-blue-600 hover:underline mt-4 inline-block">
              ← Back to artists
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language="en" />
      {isFallback && <FallbackNotice language="en" />}
      <main className="flex-1">
        <ArtistGalleryLayout
          name={displayArtist.title}
          bio={displayArtist.bio}
          gallery={displayArtist.gallery}
          pdfUrl={displayArtist.pdfUrl}
          language="en"
        />
      </main>
    </div>
  )
}
