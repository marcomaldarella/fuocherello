// ExhibitInfoDrawer removed: exhibit body now rendered as a slide inside the gallery
import { safeSanityFetch, isSanityAvailable } from "@/lib/sanity.client"
import { EXHIBITION_OR_FAIR_BY_SLUG_QUERY, EXHIBITION_OR_FAIR_BY_SLUG_FALLBACK_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries"
import { Header } from "@/components/Header"
import { FallbackNotice } from "@/components/FallbackNotice"
import { PortableTextRenderer } from "@/components/PortableTextRenderer"
import { ExhibitHorizontalGallery } from "@/components/ExhibitHorizontalGallery"
import Link from "next/link"

export const revalidate = 60

interface Exhibit {
  _id: string
  _type?: string
  title: string
  type?: string
  venue?: string
  artistsLine?: string
  dateStart?: string
  dateEnd?: string
  featuredImage?: any
  gallery?: Array<{
    image: any
    caption?: string
  }>
  body?: any
  language: string
}

const mockExhibit: Exhibit = {
  _id: "mock-exhibit-en",
  _type: "exhibition",
  title: "Italian Contemporary Art",
  artistsLine: "Marco Rossi, Laura Bianchi, Giuseppe Verdi",
  dateStart: "2024-03-01",
  dateEnd: "2024-04-30",
  body: [
    {
      _type: "block",
      children: [
        {
          _type: "span",
          text: "A curated selection of the most significant works of Italian contemporary art, exploring current themes through innovative visual languages.",
        },
      ],
    },
  ],
  language: "en",
}

async function getExhibit(slug: string): Promise<{ exhibit: Exhibit | null; isFallback: boolean }> {
  let exhibit = await safeSanityFetch<Exhibit>(
    EXHIBITION_OR_FAIR_BY_SLUG_QUERY,
    { slug, language: "en" },
    { next: { revalidate: 60 } },
  )

  if (!exhibit) {
    exhibit = await safeSanityFetch<Exhibit>(EXHIBITION_OR_FAIR_BY_SLUG_FALLBACK_QUERY, { slug }, { next: { revalidate: 60 } })
    return { exhibit: exhibit || null, isFallback: true }
  }

  return { exhibit, isFallback: false }
}

async function getSettings() {
  return await safeSanityFetch(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnExhibitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [{ exhibit, isFallback }, settings] = await Promise.all([getExhibit(slug), getSettings()])

  const displayExhibit = exhibit || (!isSanityAvailable ? mockExhibit : null)

  if (!displayExhibit) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header language="en" />
        <main className="flex-1 px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <p>Exhibit not found.</p>
          </div>
        </main>
        {/* Footer removed also in not found state */}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language="en" />
      <main className="flex-1 px-0 py-0">
        <div className="w-screen">
          {!isSanityAvailable && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
              Fallback mode: configure Sanity environment variables to view real content.
            </div>
          )}

          {isFallback && isSanityAvailable && <FallbackNotice language="en" />}

          <ExhibitHorizontalGallery
            title={displayExhibit.title}
            authorName={(displayExhibit as any).authorName}
            artistsLine={displayExhibit.artistsLine}
            dateStart={displayExhibit.dateStart}
            dateEnd={displayExhibit.dateEnd}
            featuredImage={displayExhibit.featuredImage}
            gallery={displayExhibit.gallery}
            body={displayExhibit.body}
            language="en"
          />

          {/* Testo incluso come ultima slide (drawer rimosso) */}

          {/* Back "x" centralized in ExhibitInfoDrawer for inline with info */}
        </div>
      </main>
      {/* Footer removed on gallery pages */}
    </div>
  )
}
