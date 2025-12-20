import { safeSanityFetch, isSanityAvailable } from "@/lib/sanity.client"
import { FAIR_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries"

// Also query old exhibit documents with type="fair" for backward compatibility
const FAIR_BY_SLUG_COMBINED_QUERY = `*[(_type == "fair" || (_type == "exhibit" && type == "fair")) && slug.current == $slug && language == $language][0]{
  _id,
  title,
  slug,
  venue,
  artistsLine,
  authorName,
  dateStart,
  dateEnd,
  status,
  featuredImage,
  gallery[]{
    image,
    caption
  },
  body,
  language,
  translationOf
}`
import { Header } from "@/components/Header"
import { PortableTextRenderer } from "@/components/PortableTextRenderer"
import Link from "next/link"
import { ExhibitHorizontalGallery } from "@/components/ExhibitHorizontalGallery"

export const revalidate = 60

interface Fair {
  _id: string
  title: string
  venue?: string
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
}

const mockFair: Fair = {
  _id: "mock-fair",
  title: "Fiera Internazionale d'Arte",
  venue: "Fiera Milano",
  dateStart: "2024-05-10",
  dateEnd: "2024-05-12",
  body: [
    {
      _type: "block",
      children: [
        {
          _type: "span",
          text: "La più importante fiera d'arte contemporanea in Italia, con espositori da tutto il mondo.",
        },
      ],
    },
  ],
}

async function getFair(slug: string): Promise<Fair | null> {
  const result = await safeSanityFetch<Fair>(
    FAIR_BY_SLUG_COMBINED_QUERY,
    { slug, language: "it" },
    { next: { revalidate: 60 } },
  )
  return result
}

async function getSettings() {
  return await safeSanityFetch(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function FairDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [fair, settings] = await Promise.all([getFair(slug), getSettings()])

  const displayFair = fair || (!isSanityAvailable ? mockFair : null)

  if (!displayFair) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header language="it" />
        <main className="flex-1 px-6 py-16">
          <div className="w-screen">
            <p>Fiera non trovata.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language="it" />
      <main className="flex-1 px-0 py-0">
        <ExhibitHorizontalGallery
          gallery={displayFair.gallery || []}
          title={displayFair.title}
          authorName={displayFair.authorName || displayFair.venue || ""}
          body={displayFair.body}
          language="it"
        />
      </main>
    </div>
  )
}
