import { safeSanityFetch } from "@/lib/sanity.client"
import { EXHIBITION_OR_FAIR_BY_SLUG_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"

import { ExhibitHorizontalGallery } from "@/components/ExhibitHorizontalGallery"

const RANDOM_EXHIBITIONS_QUERY = `*[(_type == "exhibition" || (_type == "exhibit" && type == "exhibition")) && language == $language && slug.current != $currentSlug] | order(_updatedAt desc)[0...2]{
  _id, title, slug, artistsLine, authorName, dateStart, dateEnd, featuredImage
}`

const RANDOM_FAIRS_QUERY = `*[(_type == "fair" || (_type == "exhibit" && type == "fair")) && language == $language && slug.current != $currentSlug] | order(_updatedAt desc)[0...2]{
  _id, title, slug, venue, artistsLine, authorName, dateStart, dateEnd, featuredImage
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
}


async function getExhibit(slug: string): Promise<Exhibit | null> {
  const result = await safeSanityFetch<Exhibit>(
    EXHIBITION_OR_FAIR_BY_SLUG_QUERY,
    { slug, language: "it" },
    { next: { revalidate: 60 } },
  )
  return result
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

async function getRandomExhibitions(currentSlug: string) {
  const result = await safeSanityFetch<any[]>(RANDOM_EXHIBITIONS_QUERY, { language: "it", currentSlug }, { next: { revalidate: 60 } })
  return result || []
}

async function getRandomFairs(currentSlug: string) {
  const result = await safeSanityFetch<any[]>(RANDOM_FAIRS_QUERY, { language: "it", currentSlug }, { next: { revalidate: 60 } })
  return result || []
}

export default async function ExhibitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [exhibit, settings, randomExhibitions, randomFairs] = await Promise.all([getExhibit(slug), getSettings(), getRandomExhibitions(slug), getRandomFairs(slug)])

  const displayExhibit = exhibit

  if (!displayExhibit) {
    return (
      <div className="min-h-screen flex flex-col bg-background">

        <main className="flex-1 px-6 py-16">
          <div className="w-screen">
            <p>Esibizione non trovata.</p>
          </div>
        </main>
        {/* Footer rimosso anche nello stato di not found */}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <main className="flex-1 px-0 py-0">
        <div className="w-screen">
          <ExhibitHorizontalGallery
            title={displayExhibit.title}
            authorName={(displayExhibit as any).authorName}
            artistsLine={displayExhibit.artistsLine}
            dateStart={displayExhibit.dateStart}
            dateEnd={displayExhibit.dateEnd}
            featuredImage={displayExhibit.featuredImage}
            gallery={displayExhibit.gallery}
            body={displayExhibit.body}
            language="it"
            relatedExhibitions={displayExhibit._type === 'fair' || displayExhibit.type === 'fair' ? [] : randomExhibitions}
            relatedFairs={displayExhibit._type === 'fair' || displayExhibit.type === 'fair' ? randomFairs : []}
          />

          {/* Testo ora incluso come ultima slide nella galleria (mobile: scroll verticale) */}

          {/* Back "x" centralizzato nel ExhibitInfoDrawer per inline con info */}
        </div>
      </main>
      {/* Footer rimosso nelle pagine galleria */}
    </div>
  )
}
