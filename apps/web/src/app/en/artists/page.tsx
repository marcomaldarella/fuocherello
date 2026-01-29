import { safeSanityFetch, isSanityAvailable } from "@/lib/sanity.client"
import { ARTISTS_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FallbackNotice } from "@/components/FallbackNotice"
import { urlFor } from "@/lib/imageUrl"
import Image from "next/image"
import Link from "next/link"

export const revalidate = 60

interface Artist {
  _id: string
  title: string
  slug: { current: string }
  featuredImage?: any
  language: string
  birthYear?: number
  nationality?: string
}

const mockArtists: Artist[] = [
  {
    _id: "mock-artist-en-1",
    title: "Marco Rossi",
    slug: { current: "marco-rossi" },
    language: "en",
  },
  {
    _id: "mock-artist-en-2",
    title: "Laura Bianchi",
    slug: { current: "laura-bianchi" },
    language: "en",
  },
  {
    _id: "mock-artist-en-3",
    title: "Giuseppe Verdi",
    slug: { current: "giuseppe-verdi" },
    birthYear: 1968,
    language: "en",
  },
]

async function getArtists(): Promise<{ artists: Artist[]; isFallback: boolean }> {
  let artists = await safeSanityFetch<Artist[]>(ARTISTS_QUERY, { language: "en" }, { next: { revalidate: 60 } })

  if (!artists || artists.length === 0) {
    artists = await safeSanityFetch<Artist[]>(ARTISTS_QUERY, { language: "it" }, { next: { revalidate: 60 } })
    return { artists: artists || [], isFallback: true }
  }

  return { artists, isFallback: false }
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnArtistsPage() {
  const [{ artists, isFallback }, settings] = await Promise.all([getArtists(), getSettings()])

  const displayArtists = artists.length > 0 ? artists : mockArtists

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
            <h1 className="text-center text-[#0000ff]  leading-[0.85] tracking-[-0.03em] text-[clamp(3.5rem,10vw,8rem)]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                A
              </span>
              <span className="lowercase">rtists</span>
            </h1>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}
          >
            {displayArtists.map((artist) => {
              const content = (
                <div className="w-full">
                  <div className="relative w-full aspect-square bg-muted overflow-hidden">
                    <Image
                      src={
                        artist.featuredImage
                          ? urlFor(artist.featuredImage).width(1200).height(1200).fit("crop").url()
                          : `/placeholder.svg?height=800&width=800`
                      }
                      alt={artist.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="mt-2 w-full text-[#0000ff]  text-[12px] md:text-[13px] leading-tight">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="uppercase leading-[0.95] first-letter:italic">
                        <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                          {artist.title?.[0] ?? ""}
                        </span>
                        <span className="lowercase">{artist.title?.slice(1) ?? ""}</span>
                      </h2>
                    </div>
                    {artist.birthYear && <div className="lowercase opacity-70">{artist.birthYear}</div>}
                    {artist.nationality && <div className="lowercase opacity-70">{artist.nationality}</div>}
                  </div>
                </div>
              )

              if (!isSanityAvailable) {
                return (
                  <div key={artist._id} className="block">
                    {content}
                  </div>
                )
              }

              return (
                <Link
                  key={artist._id}
                  href={`/en/artists/${artist.slug.current}`}
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
