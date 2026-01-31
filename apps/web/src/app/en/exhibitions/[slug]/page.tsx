import { safeSanityFetch } from "@/lib/sanity.client"
import { EXHIBITION_BY_SLUG_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"

import { FallbackNotice } from "@/components/FallbackNotice"
import { PortableTextRenderer } from "@/components/PortableTextRenderer"
import { ExhibitHorizontalGallery } from "@/components/ExhibitHorizontalGallery"
import { ViewModeSwitch } from "@/components/ViewModeSwitch"
import { ViewModeProvider } from "@/contexts/ViewModeContext"
import Link from "next/link"

const RANDOM_EXHIBITIONS_QUERY = `*[_type == "exhibition" && language == $language && slug.current != $currentSlug] | order(_updatedAt desc)[0...2]{
  _id,
  title,
  slug,
  artistsLine,
  authorName,
  dateStart,
  dateEnd,
  featuredImage
}`

const RANDOM_FAIRS_QUERY = `*[(_type == "fair" || (_type == "exhibit" && type == "fair")) && language == $language] | order(_updatedAt desc)[0...2]{
  _id,
  title,
  slug,
  venue,
  artistsLine,
  authorName,
  dateStart,
  dateEnd,
  featuredImage
}`

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

async function getRandomExhibitions(currentSlug: string) {
  const result = await safeSanityFetch<any[]>(
    RANDOM_EXHIBITIONS_QUERY,
    { language: "en", currentSlug },
    { next: { revalidate: 60 } },
  )
  return result || []
}

async function getRandomFairs() {
  const result = await safeSanityFetch<any[]>(
    RANDOM_FAIRS_QUERY,
    { language: "en" },
    { next: { revalidate: 60 } },
  )
  return result || []
}

export default async function EnExhibitionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [{ exhibition, isFallback }, settings, randomExhibitions, randomFairs] = await Promise.all([getExhibition(slug), getSettings(), getRandomExhibitions(slug), getRandomFairs()])

  const displayExhibition = exhibition

  if (!displayExhibition) {
    return (
      <div className="min-h-screen flex flex-col bg-background">

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
    <ViewModeProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <ViewModeSwitch />
        {isFallback && <FallbackNotice language="en" />}
        <main className="flex-1 px-0 py-0">
          <ExhibitHorizontalGallery
            gallery={displayExhibition.gallery || []}
            title={displayExhibition.title}
            artistsLine={displayExhibition.artistsLine || ""}
            authorName={displayExhibition.authorName || ""}
            body={displayExhibition.body}
            language="en"
            relatedExhibitions={randomExhibitions}
          />
        </main>
      </div>
    </ViewModeProvider>
  )
}
