import { safeSanityFetch } from "@/lib/sanity.client"
import { ARTISTS_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"

import { Footer } from "@/components/Footer"
import { urlFor } from "@/lib/imageUrl"
import Image from "next/image"
import Link from "next/link"

export const revalidate = 60

interface Artist {
  _id: string
  title: string
  slug: { current: string }
  featuredImage?: any
  birthYear?: number
  nationality?: string}

async function getArtists(): Promise<Artist[]> {
  const result = await safeSanityFetch<Artist[]>(ARTISTS_QUERY, { language: "it" }, { next: { revalidate: 60 } })
  return result || []
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function ArtistsPage() {
  const [rawArtists, settings] = await Promise.all([getArtists(), getSettings()])

  const artists = Array.from(
    new Map(
      (rawArtists || [])
        .filter((a) => a?.slug?.current)
        .map((a) => [a.slug.current, a])
    ).values()
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16">
        <div className="w-full">
        <div className="pointer-events-none" style={{ paddingTop: "2em", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff] font-bold leading-[0.85] tracking-[-0.03em] text-[clamp(3.5rem,10vw,8rem)]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                A
              </span>
              <span className="lowercase">rtisti</span>
            </h1>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}
          >
            {artists.map((artist) => {
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
                  <div className="mt-2 w-full text-[#0000ff]  text-[12px] md:text-[13px] leading-tight" style={{ paddingTop: "1em" }}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="uppercase leading-[0.95] first-letter:italic text-[16px] md:text-[17px] whitespace-nowrap">
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

              return (
                <Link
                  key={artist._id}
                  href={`/artisti/${encodeURIComponent(artist.slug.current)}`}
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
