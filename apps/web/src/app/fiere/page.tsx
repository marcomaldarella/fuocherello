import { safeSanityFetch, isSanityAvailable } from "@/lib/sanity.client"
import { FAIRS_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"

// Also query old exhibit documents with type="fair" for backward compatibility
const FAIRS_COMBINED_QUERY = `*[(_type == "fair" || (_type == "exhibit" && type == "fair")) && language == $language] | order(dateStart desc){
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
  language,
  translationOf
}`
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { urlFor } from "@/lib/imageUrl"
import Image from "next/image"
import Link from "next/link"

export const revalidate = 60

interface Fair {
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

const mockFairs: Fair[] = [
  {
    _id: "mock-fair-1",
    title: "Fiera Internazionale d'Arte",
    slug: { current: "fiera-arte-2024" },
    venue: "Fiera Milano",
    dateStart: "2024-05-10",
    dateEnd: "2024-05-12",
  },
  {
    _id: "mock-fair-2",
    title: "Art Basel",
    slug: { current: "art-basel-2024" },
    venue: "Basel",
    dateStart: "2024-06-15",
    dateEnd: "2024-06-18",
  },
]

async function getFairs(): Promise<Fair[]> {
  const result = await safeSanityFetch<Fair[]>(FAIRS_COMBINED_QUERY, { language: "it" }, { next: { revalidate: 60 } })
  return result || []
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function FierePage() {
  const [fairs, settings] = await Promise.all([getFairs(), getSettings()])

  const displayFairs = fairs.length > 0 ? fairs : mockFairs

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language="it" />
      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16">
        <div className="w-full">
          {!isSanityAvailable && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
              Modalità fallback: configura le variabili d'ambiente di Sanity per visualizzare contenuti reali.
            </div>
          )}

          <div className="pointer-events-none" style={{ paddingTop: "1.25rem", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff]  leading-[0.85] tracking-[-0.03em] text-[clamp(3.5rem,10vw,8rem)]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                F
              </span>
              <span className="lowercase">iere</span>
            </h1>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}
          >
            {displayFairs.map((fair) => {
              const content = (
                <div className="w-full">
                  <div className="relative w-full aspect-square bg-muted overflow-hidden">
                    <Image
                      src={
                        fair.featuredImage
                          ? urlFor(fair.featuredImage).width(1200).height(1200).fit("crop").url()
                          : `/placeholder.svg?height=800&width=800`
                      }
                      alt={fair.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="mt-2 w-full text-[#0000ff]  text-[12px] md:text-[13px] leading-tight">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="uppercase leading-[0.95] first-letter:italic">
                        <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                          {fair.title?.[0] ?? ""}
                        </span>
                        <span className="lowercase">{fair.title?.slice(1) ?? ""}</span>
                      </h2>
                      {fair.authorName && <span className="lowercase">{fair.authorName}</span>}
                    </div>
                    {fair.venue && <div className="lowercase opacity-70">{fair.venue}</div>}
                    {fair.artistsLine && <div className="lowercase opacity-70">{fair.artistsLine}</div>}
                    {(fair.dateStart || fair.dateEnd) && (
                      <div className="lowercase opacity-70">
                        {fair.dateStart && new Date(fair.dateStart).toLocaleDateString("it-IT")}
                        {fair.dateStart && fair.dateEnd && " - "}
                        {fair.dateEnd && new Date(fair.dateEnd).toLocaleDateString("it-IT")}
                      </div>
                    )}
                  </div>
                </div>
              )

              if (!isSanityAvailable) {
                return (
                  <div key={fair._id} className="block">
                    {content}
                  </div>
                )
              }

              return (
                <Link
                  key={fair._id}
                  href={`/fiere/${fair.slug.current}`}
                  className="block hover:opacity-90 transition-opacity"
                >
                  {content}
                </Link>
              )
            })}
          </div>
        </div>
      </main>
      <Footer language="it" footerText={settings?.footerText} />
    </div>
  )
}
