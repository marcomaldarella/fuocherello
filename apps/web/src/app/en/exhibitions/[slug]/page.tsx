import { safeSanityFetch, isSanityAvailable } from "@/lib/sanity.client"
import { EXHIBITION_BY_SLUG_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"
import { Header } from "@/components/Header"
import { FallbackNotice } from "@/components/FallbackNotice"
import { PortableTextRenderer } from "@/components/PortableTextRenderer"
import { ExhibitHorizontalGallery } from "@/components/ExhibitHorizontalGallery"
import Link from "next/link"

export const revalidate = 60

interface Exhibition {
  _id: string
  title: string
  artistsLine?: string
  authorName?: string
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

const mockExhibition: Exhibition = {
  _id: "mock-exhibition-en",
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

async function getExhibition(slug: string): Promise<{ exhibition: Exhibition | null; isFallback: boolean }> {
  let exhibition = await safeSanityFetch<Exhibition>(
    EXHIBITION_BY_SLUG_QUERY,
    { slug, language: "en" },
    { next: { revalidate: 60 } },
  )

  if (!exhibition) {
    exhibition = await safeSanityFetch<Exhibition>(
      EXHIBITION_BY_SLUG_QUERY,
      { slug, language: "it" },
      { next: { revalidate: 60 } },
    )
    return { exhibition: exhibition || null, isFallback: true }
  }

  return { exhibition, isFallback: false }
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnExhibitionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [{ exhibition, isFallback }, settings] = await Promise.all([getExhibition(slug), getSettings()])

  const displayExhibition = exhibition || (!isSanityAvailable ? mockExhibition : null)

  if (!displayExhibition) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header language="en" />
        <main className="flex-1 px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <p>Exhibition not found.</p>
            <Link href="/en/exhibitions" className="text-blue-600 hover:underline mt-4 inline-block">
              ← Back to exhibitions
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
      <main className="flex-1 px-0 py-0">
        <ExhibitHorizontalGallery
          gallery={displayExhibition.gallery || []}
          title={displayExhibition.title}
          authorName={displayExhibition.authorName || ""}
          body={displayExhibition.body}
          language="en"
        />
      </main>
    </div>
  )
}
