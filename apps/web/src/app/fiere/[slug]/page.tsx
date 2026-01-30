import { safeSanityFetch } from "@/lib/sanity.client"
import { SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"

// Query fair documents (both fair type and legacy exhibit with type=fair)
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

import { ExhibitHorizontalGallery } from "@/components/ExhibitHorizontalGallery"
import { ViewModeSwitch } from "@/components/ViewModeSwitch"
import { ViewModeProvider } from "@/contexts/ViewModeContext"

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

interface RelatedFair {
  _id: string
  title: string
  slug: { current: string }
  venue?: string
  artistsLine?: string
  authorName?: string
  dateStart?: string
  dateEnd?: string
  featuredImage?: any
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
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

async function getRandomFairs(currentSlug: string): Promise<RelatedFair[]> {
  const result = await safeSanityFetch<RelatedFair[]>(
    RANDOM_FAIRS_QUERY,
    { language: "it", currentSlug },
    { next: { revalidate: 60 } },
  )
  return result || []
}

async function getRandomExhibitions() {
  const result = await safeSanityFetch<any[]>(
    RANDOM_EXHIBITIONS_QUERY,
    { language: "it" },
    { next: { revalidate: 60 } },
  )
  return result || []
}

export default async function FairDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [fair, settings, randomFairs, randomExhibitions] = await Promise.all([getFair(slug), getSettings(), getRandomFairs(slug), getRandomExhibitions()])

  const displayFair = fair

  if (!displayFair) {
    return (
      <div className="min-h-screen flex flex-col bg-background">

        <main className="flex-1 px-6 py-16">
          <div className="w-screen">
            <p>Fiera non trovata.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <ViewModeProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <ViewModeSwitch />
        <main className="flex-1 px-0 py-0">
          <ExhibitHorizontalGallery
            gallery={displayFair.gallery || []}
            title={displayFair.title}
            artistsLine={displayFair.artistsLine || ""}
            authorName={displayFair.authorName || ""}
            body={displayFair.body}
            language="it"
            relatedExhibitions={randomExhibitions}
            relatedFairs={randomFairs}
          />
        </main>
      </div>
    </ViewModeProvider>
  )
}
