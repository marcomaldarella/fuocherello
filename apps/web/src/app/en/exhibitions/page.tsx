import { safeSanityFetch, isSanityAvailable } from "@/lib/sanity.client"
import { EXHIBITIONS_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries"

const EXHIBITIONS_COMBINED_QUERY = `*[(_type == "exhibition" || (_type == "exhibit" && type == "exhibition")) && language == $language] | order(dateStart desc){
  _id,
  title,
  slug,
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
import { FallbackNotice } from "@/components/FallbackNotice"
import { urlFor } from "@/lib/imageUrl"
import Image from "next/image"
import Link from "next/link"

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
  language: string
}

const mockExhibitions: Exhibition[] = [
  {
    _id: "mock-en-1",
    title: "Italian Contemporary Art",
    slug: { current: "italian-contemporary-art" },
    artistsLine: "Marco Rossi, Laura Bianchi, Giuseppe Verdi",
    dateStart: "2024-03-01",
    dateEnd: "2024-04-30",
    language: "en",
  },
  {
    _id: "mock-en-2",
    title: "Modern Sculptures",
    slug: { current: "modern-sculptures" },
    artistsLine: "Anna Ferretti",
    dateStart: "2024-05-15",
    dateEnd: "2024-07-15",
    language: "en",
  },
]

async function getExhibitions(): Promise<{ exhibitions: Exhibition[]; isFallback: boolean }> {
  let exhibitions = await safeSanityFetch<Exhibition[]>(EXHIBITIONS_COMBINED_QUERY, { language: "en" }, { next: { revalidate: 60 } })

  if (!exhibitions || exhibitions.length === 0) {
    exhibitions = await safeSanityFetch<Exhibition[]>(EXHIBITIONS_QUERY, { language: "it" }, { next: { revalidate: 60 } })
    return { exhibitions: exhibitions || [], isFallback: true }
  }

  return { exhibitions, isFallback: false }
}

async function getSettings() {
  return await safeSanityFetch(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnExhibitionsPage() {
  const [{ exhibitions, isFallback }, settings] = await Promise.all([getExhibitions(), getSettings()])

  const displayExhibitions = exhibitions.length > 0 ? exhibitions : mockExhibitions

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language="en" />
      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16">
        <div className="w-full">
          {!isSanityAvailable && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
              Fallback mode: configure Sanity environment variables to display real content.
            </div>
          )}
          {isFallback && <FallbackNotice language="en" />}

          <div className="pointer-events-none" style={{ paddingTop: "1.25rem", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff] font-black leading-[0.85] tracking-[-0.03em] text-[clamp(3.5rem,10vw,8rem)]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                E
              </span>
              <span className="lowercase">xhibitions</span>
            </h1>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}
          >
            {displayExhibitions.map((exhibition) => {
              const content = (
                <div className="w-full">
                  <div className="relative w-full aspect-square bg-muted overflow-hidden">
                    <Image
                      src={
                        exhibition.featuredImage
                          ? urlFor(exhibition.featuredImage).width(1200).height(1200).fit("crop").url()
                          : `/placeholder.svg?height=800&width=800`
                      }
                      alt={exhibition.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="mt-2 w-full text-[#0000ff] font-black text-[12px] md:text-[13px] leading-tight">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="uppercase leading-[0.95] first-letter:italic">
                        <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                          {exhibition.title[0]}
                        </span>
                        <span className="lowercase">{exhibition.title.slice(1)}</span>
                      </h2>
                      {exhibition.authorName && <span className="lowercase">{exhibition.authorName}</span>}
                    </div>
                    {exhibition.artistsLine && <div className="lowercase opacity-70">{exhibition.artistsLine}</div>}
                    {(exhibition.dateStart || exhibition.dateEnd) && (
                      <div className="lowercase opacity-70">
                        {exhibition.dateStart && new Date(exhibition.dateStart).toLocaleDateString("en-US")}
                        {exhibition.dateStart && exhibition.dateEnd && " - "}
                        {exhibition.dateEnd && new Date(exhibition.dateEnd).toLocaleDateString("en-US")}
                      </div>
                    )}
                  </div>
                </div>
              )

              if (!isSanityAvailable) {
                return (
                  <div key={exhibition._id} className="block">
                    {content}
                  </div>
                )
              }

              return (
                <Link
                  key={exhibition._id}
                  href={`/en/exhibitions/${exhibition.slug.current}`}
                  className="block hover:opacity-90 transition-opacity"
                >
                  {content}
                </Link>
              )
            })}
          </div>
        </div>
      </main>
      <Footer language="en" footerText={settings?.footerText} />
    </div>
  )
}
