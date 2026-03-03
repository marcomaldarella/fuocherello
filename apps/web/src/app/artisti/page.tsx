import type { Metadata } from "next"
import { safeSanityFetch } from "@/lib/sanity.client"
import { ARTISTS_QUERY, SITE_SETTINGS_QUERY, SiteSettings } from "@/lib/queries"
import { Footer } from "@/components/Footer"
import { ArtistCard, ArtistCardItem } from "@/components/cards/ArtistCard"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Artisti",
  description:
    "Gli artisti che espongono presso Fuocherello. Scultura contemporanea e sperimentazione artistica alla Fonderia De Carli di Volvera.",
  openGraph: {
    title: "Artisti | Fuocherello",
    description:
      "Gli artisti che espongono presso Fuocherello. Scultura contemporanea e sperimentazione artistica.",
  },
  alternates: {
    canonical: "/artisti",
    languages: {
      "it-IT": "/artisti",
      "en-US": "/en/artists",
    },
  },
}

async function getArtists(): Promise<ArtistCardItem[]> {
  const result = await safeSanityFetch<ArtistCardItem[]>(ARTISTS_QUERY, { language: "it" }, { next: { revalidate: 60 } })
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
          <div className="pointer-events-none" style={{ paddingTop: "3em", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff] leading-[0.85] tracking-[-0.03em] font-medium text-[clamp(3.5rem,10vw,8rem)]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>A</span>
              <span className="lowercase">rtisti</span>
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}>
            {artists.map((artist, index) => (
              <ArtistCard
                key={artist._id}
                item={artist}
                href={`/artisti/${encodeURIComponent(artist.slug.current)}`}
                isLast={index === artists.length - 1}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer language="it" footerText={settings?.footerText} />
    </div>
  )
}
