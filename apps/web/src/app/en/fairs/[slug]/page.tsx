import { safeSanityFetch, isSanityAvailable } from "@/lib/sanity.client"
import { FAIR_BY_SLUG_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"
import { Header } from "@/components/Header"
import { FallbackNotice } from "@/components/FallbackNotice"
import { PortableTextRenderer } from "@/components/PortableTextRenderer"
import { ExhibitHorizontalGallery } from "@/components/ExhibitHorizontalGallery"
import Link from "next/link"

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
  language: string
}

const mockFair: Fair = {
  _id: "mock-fair-en",
  title: "International Art Fair",
  venue: "Milan Fair",
  dateStart: "2024-05-10",
  dateEnd: "2024-05-12",
  body: [
    {
      _type: "block",
      children: [
        {
          _type: "span",
          text: "The most important contemporary art fair in Italy, with exhibitors from around the world.",
        },
      ],
    },
  ],
  language: "en",
}

async function getFair(slug: string): Promise<{ fair: Fair | null; isFallback: boolean }> {
  let fair = await safeSanityFetch<Fair>(
    FAIR_BY_SLUG_QUERY,
    { slug, language: "en" },
    { next: { revalidate: 60 } },
  )

  if (!fair) {
    fair = await safeSanityFetch<Fair>(FAIR_BY_SLUG_QUERY, { slug, language: "it" }, { next: { revalidate: 60 } })
    return { fair: fair || null, isFallback: true }
  }

  return { fair, isFallback: false }
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnFairDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [{ fair, isFallback }, settings] = await Promise.all([getFair(slug), getSettings()])

  const displayFair = fair || (!isSanityAvailable ? mockFair : null)

  if (!displayFair) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header language="en" />
        <main className="flex-1 px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <p>Fair not found.</p>
            <Link href="/en/fairs" className="text-blue-600 hover:underline mt-4 inline-block">
              ← Back to fairs
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
          gallery={displayFair.gallery || []}
          title={displayFair.title}
          authorName={displayFair.authorName || displayFair.venue || ""}
          body={displayFair.body}
          language="en"
        />
      </main>
    </div>
  )
}
