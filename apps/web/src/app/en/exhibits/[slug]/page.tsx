// ExhibitInfoDrawer removed: exhibit body now rendered as a slide inside the gallery
import { safeSanityFetch } from "@/lib/sanity.client"
import { EXHIBITION_OR_FAIR_BY_SLUG_QUERY, EXHIBITION_OR_FAIR_BY_SLUG_FALLBACK_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"

import { FallbackNotice } from "@/components/FallbackNotice"
import { ExhibitHorizontalGallery } from "@/components/ExhibitHorizontalGallery"
import { ViewModeSwitch } from "@/components/ViewModeSwitch"
import { ViewModeProvider } from "@/contexts/ViewModeContext"

const RANDOM_EXHIBITIONS_QUERY = `*[(_type == "exhibition" || (_type == "exhibit" && type == "exhibition")) && language == $language && slug.current != $currentSlug] | order(_updatedAt desc)[0...10]{
  _id, title, slug, artistsLine, authorName, dateStart, dateEnd, featuredImage, "lqip": featuredImage.asset->metadata.lqip
}`

const RANDOM_FAIRS_QUERY = `*[(_type == "fair" || (_type == "exhibit" && type == "fair")) && language == $language && slug.current != $currentSlug] | order(_updatedAt desc)[0...10]{
  _id, title, slug, venue, artistsLine, authorName, dateStart, dateEnd, featuredImage, "lqip": featuredImage.asset->metadata.lqip
}`

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
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

async function getRandomExhibitions(currentSlug: string) {
  const result = await safeSanityFetch<any[]>(RANDOM_EXHIBITIONS_QUERY, { language: "en", currentSlug }, { next: { revalidate: 60 } })
  if (!result || result.length === 0) return []
  const shuffled = [...result].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 2)
}

async function getRandomFairs(currentSlug: string) {
  const result = await safeSanityFetch<any[]>(RANDOM_FAIRS_QUERY, { language: "en", currentSlug }, { next: { revalidate: 60 } })
  if (!result || result.length === 0) return []
  const shuffled = [...result].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 2)
}

export default async function EnExhibitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [{ exhibit, isFallback }, settings, randomExhibitions, randomFairs] = await Promise.all([getExhibit(slug), getSettings(), getRandomExhibitions(slug), getRandomFairs(slug)])

  const displayExhibit = exhibit

  if (!displayExhibit) {
    return (
      <div className="min-h-screen flex flex-col bg-background">

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
    <ViewModeProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <ViewModeSwitch />
        {isFallback && <FallbackNotice language="en" />}
        <main className="flex-1 px-0 py-0">
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
            relatedExhibitions={displayExhibit._type === 'fair' || displayExhibit.type === 'fair' ? [] : randomExhibitions}
            relatedFairs={displayExhibit._type === 'fair' || displayExhibit.type === 'fair' ? randomFairs : []}
            backHref="/en/exhibits"
          />
        </main>
      </div>
    </ViewModeProvider>
  )
}
