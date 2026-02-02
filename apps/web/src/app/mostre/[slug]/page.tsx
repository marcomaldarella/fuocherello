import { safeSanityFetch } from "@/lib/sanity.client"
import { SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"
import { ExhibitHorizontalGallery } from "@/components/ExhibitHorizontalGallery"
import { ViewModeSwitch } from "@/components/ViewModeSwitch"
import { ViewModeProvider } from "@/contexts/ViewModeContext"

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
  "lqip": featuredImage.asset->metadata.lqip,
  gallery[]{
    image,
    "lqip": image.asset->metadata.lqip,
    caption
  },
  body,
  language,
  translationOf
}`

const RANDOM_EXHIBITIONS_QUERY = `*[(_type == "exhibition" || (_type == "exhibit" && type == "exhibition")) && language == $language && slug.current != $currentSlug] | order(_updatedAt desc)[0...10]{
  _id,
  title,
  slug,
  artistsLine,
  authorName,
  dateStart,
  dateEnd,
  featuredImage,
  "lqip": featuredImage.asset->metadata.lqip
}`

const RANDOM_FAIRS_QUERY = `*[(_type == "fair" || (_type == "exhibit" && type == "fair")) && language == $language] | order(_updatedAt desc)[0...10]{
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
  slug: { current: string }
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

async function getRandomExhibitions(currentSlug: string): Promise<Exhibition[]> {
  const result = await safeSanityFetch<Exhibition[]>(
    RANDOM_EXHIBITIONS_QUERY,
    { language: "it", currentSlug },
    { next: { revalidate: 60 } },
  )
  if (!result || result.length === 0) return []
  // Shuffle and pick 2
  const shuffled = [...result].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 2)
}

async function getRandomFairs() {
  const result = await safeSanityFetch<any[]>(
    RANDOM_FAIRS_QUERY,
    { language: "it" },
    { next: { revalidate: 60 } },
  )
  if (!result || result.length === 0) return []
  const shuffled = [...result].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 2)
}

export default async function ExhibitionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [exhibition, settings, randomExhibitions, randomFairs] = await Promise.all([
    getExhibition(slug),
    getSettings(),
    getRandomExhibitions(slug),
    getRandomFairs()
  ])

  const displayExhibition = exhibition

  if (!displayExhibition) {
    return (
      <div className="min-h-screen flex flex-col bg-background">

        <main className="flex-1 px-6 py-16">
          <div className="w-screen">
            <p>Mostra non trovata.</p>
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
            featuredImage={displayExhibition.featuredImage}
            gallery={displayExhibition.gallery || []}
            title={displayExhibition.title}
            artistsLine={displayExhibition.artistsLine || ""}
            authorName={displayExhibition.authorName || ""}
            body={displayExhibition.body}
            language="it"
            relatedExhibitions={randomExhibitions}
            backHref="/mostre"
          />
        </main>
      </div>
    </ViewModeProvider>
  )
}
