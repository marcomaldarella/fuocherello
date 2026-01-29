import { safeSanityFetch, isSanityAvailable } from "@/lib/sanity.client"
import { EXHIBITION_BY_SLUG_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"

const EXHIBITION_BY_SLUG_COMBINED_QUERY = `*[(_type == "exhibition" || (_type == "exhibit" && type == "exhibition")) && slug.current == $slug && language == $language][0]{
  _id,
  title,
  slug,
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
}

const mockExhibition: Exhibition = {
  _id: "mock-exhibition",
  title: "Arte Contemporanea Italiana",
  artistsLine: "Marco Rossi, Laura Bianchi, Giuseppe Verdi",
  dateStart: "2024-03-01",
  dateEnd: "2024-04-30",
  body: [
    {
      _type: "block",
      children: [
        {
          _type: "span",
          text: "Una selezione curata delle opere più significative dell'arte contemporanea italiana, esplorando temi attuali attraverso linguaggi visivi innovativi.",
        },
      ],
    },
  ],
}

async function getExhibition(slug: string): Promise<Exhibition | null> {
  const result = await safeSanityFetch<Exhibition>(
    EXHIBITION_BY_SLUG_COMBINED_QUERY,
    { slug, language: "it" },
    { next: { revalidate: 60 } },
  )
  return result
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function ExhibitionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [exhibition, settings] = await Promise.all([getExhibition(slug), getSettings()])

  const displayExhibition = exhibition || (!isSanityAvailable ? mockExhibition : null)

  if (!displayExhibition) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header language="it" />
        <main className="flex-1 px-6 py-16">
          <div className="w-screen">
            <p>Mostra non trovata.</p>
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
          gallery={displayExhibition.gallery || []}
          title={displayExhibition.title}
          authorName={displayExhibition.authorName || ""}
          body={displayExhibition.body}
          language="it"
        />
      </main>
    </div>
  )
}
