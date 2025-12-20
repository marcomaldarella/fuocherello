import { safeSanityFetch, isSanityAvailable } from "@/lib/sanity.client"
import { EXHIBITIONS_AND_FAIRS_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FallbackNotice } from "@/components/FallbackNotice"
import { urlFor } from "@/lib/imageUrl"
import Image from "next/image"
import Link from "next/link"

export const revalidate = 60

interface Exhibit {
  _id: string
  _type?: string
  title: string
  slug: { current: string }
  type?: string
  venue?: string
  artistsLine?: string
  authorName?: string
  dateStart?: string
  dateEnd?: string
  featuredImage?: any
  language: string
}

const mockExhibits: Exhibit[] = [
  {
    _id: "mock-en-1",
    _type: "exhibition",
    title: "Italian Contemporary Art",
    slug: { current: "italian-contemporary-art" },
    artistsLine: "Marco Rossi, Laura Bianchi, Giuseppe Verdi",
    dateStart: "2024-03-01",
    dateEnd: "2024-04-30",
    language: "en",
  },
  {
    _id: "mock-en-2",
    _type: "exhibition",
    title: "Modern Sculptures",
    slug: { current: "modern-sculptures" },
    artistsLine: "Anna Ferretti",
    dateStart: "2024-05-15",
    dateEnd: "2024-07-15",
    language: "en",
  },
  {
    _id: "mock-en-3",
    _type: "fair",
    title: "International Art Fair",
    slug: { current: "art-fair-2024" },
    venue: "Milan Fair",
    dateStart: "2024-05-10",
    dateEnd: "2024-05-12",
    language: "en",
  },
]

async function getExhibits(): Promise<{ exhibits: Exhibit[]; isFallback: boolean }> {
  let exhibits = await safeSanityFetch<Exhibit[]>(EXHIBITIONS_AND_FAIRS_QUERY, { language: "en" }, { next: { revalidate: 60 } })

  if (!exhibits || exhibits.length === 0) {
    exhibits = await safeSanityFetch<Exhibit[]>(EXHIBITS_QUERY, { language: "it" }, { next: { revalidate: 60 } })
    return { exhibits: exhibits || [], isFallback: true }
  }

  return { exhibits: exhibits || [], isFallback: false }
}

async function getSettings() {
  return await safeSanityFetch(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnExhibitsPage() {
  const [{ exhibits, isFallback }, settings] = await Promise.all([getExhibits(), getSettings()])

  const displayExhibits = exhibits.length > 0 ? exhibits : mockExhibits

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language="en" />
      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16">
        <div className="w-full">
          {!isSanityAvailable && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
              Fallback mode: configure Sanity environment variables to view real content.
            </div>
          )}

          {isFallback && isSanityAvailable && <FallbackNotice language="en" />}

          <div className="pt-6 md:pt-8">
            <h1 className="pointer-events-none text-center text-[#0000ff] font-black leading-[0.85] tracking-[-0.03em] text-[clamp(3.5rem,10vw,8rem)] mb-10 min-h-[5rem]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                E
              </span>
              <span className="lowercase">xhibits</span>
            </h1>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}
          >
            {displayExhibits.map((exhibit, index) => {
              const content = (
                <div className="w-full">
                  <div className="relative w-full aspect-square bg-muted overflow-hidden">
                    <Image
                      src={
                        exhibit.featuredImage
                          ? urlFor(exhibit.featuredImage).width(1200).height(1200).fit("crop").url() || "/placeholder.svg"
                          : `/placeholder.svg?height=800&width=800&query=art exhibition ${exhibit.type} ${index + 1}`
                      }
                      alt={exhibit.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="mt-2 w-full text-[#0000ff] font-black text-[12px] md:text-[13px] leading-tight">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="uppercase leading-[0.95] first-letter:italic">
                        <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                          {exhibit.title[0]}
                        </span>
                        <span className="lowercase">{exhibit.title.slice(1)}</span>
                      </h2>
                      {exhibit.authorName && <span className="lowercase">{exhibit.authorName}</span>}
                    </div>
                    {exhibit.artistsLine && <div className="lowercase opacity-70">{exhibit.artistsLine}</div>}
                    {(exhibit.dateStart || exhibit.dateEnd) && (
                      <div className="lowercase opacity-70">
                        {exhibit.dateStart && new Date(exhibit.dateStart).toLocaleDateString("en-US")}
                        {exhibit.dateStart && exhibit.dateEnd && " - "}
                        {exhibit.dateEnd && new Date(exhibit.dateEnd).toLocaleDateString("en-US")}
                      </div>
                    )}
                  </div>
                </div>
              )

              if (!isSanityAvailable) {
                return (
                  <div key={exhibit._id} className="block">
                    {content}
                  </div>
                )
              }

              return (
                <Link
                  key={exhibit._id}
                  href={`/en/exhibits/${exhibit.slug.current}`}
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
