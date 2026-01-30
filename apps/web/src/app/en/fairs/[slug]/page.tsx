import { safeSanityFetch } from "@/lib/sanity.client"
import { FAIR_BY_SLUG_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"

import { FallbackNotice } from "@/components/FallbackNotice"
import { PortableTextRenderer } from "@/components/PortableTextRenderer"
import { ExhibitHorizontalGallery } from "@/components/ExhibitHorizontalGallery"
import { ViewModeSwitch } from "@/components/ViewModeSwitch"
import { ViewModeProvider } from "@/contexts/ViewModeContext"
import Link from "next/link"

const RANDOM_EXHIBITIONS_QUERY = `*[_type == "exhibition" && language == $language] | order(_updatedAt desc)[0...2]{
  _id,
  title,
  slug,
  artistsLine,
  authorName,
  dateStart,
  dateEnd,
  featuredImage
}`

const RANDOM_FAIRS_QUERY = `*[(_type == "fair" || (_type == "exhibit" && type == "fair")) && language == $language && slug.current != $currentSlug] | order(_updatedAt desc)[0...2]{
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

async function getRandomExhibitions() {
  const result = await safeSanityFetch<any[]>(
    RANDOM_EXHIBITIONS_QUERY,
    { language: "en" },
    { next: { revalidate: 60 } },
  )
  return result || []
}

async function getRandomFairs(currentSlug: string) {
  const result = await safeSanityFetch<any[]>(
    RANDOM_FAIRS_QUERY,
    { language: "en", currentSlug },
    { next: { revalidate: 60 } },
  )
  return result || []
}

export default async function EnFairDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [{ fair, isFallback }, settings, randomExhibitions, randomFairs] = await Promise.all([getFair(slug), getSettings(), getRandomExhibitions(), getRandomFairs(slug)])

  const displayFair = fair

  if (!displayFair) {
    return (
      <div className="min-h-screen flex flex-col bg-background">

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
    <ViewModeProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <ViewModeSwitch />
        {isFallback && <FallbackNotice language="en" />}
        <main className="flex-1 px-0 py-0">
          <ExhibitHorizontalGallery
            gallery={displayFair.gallery || []}
            title={displayFair.title}
            artistsLine={displayFair.artistsLine || ""}
            authorName={displayFair.authorName || ""}
            body={displayFair.body}
            language="en"
            relatedExhibitions={randomExhibitions}
            relatedFairs={randomFairs}
          />
        </main>
      </div>
    </ViewModeProvider>
  )
}
