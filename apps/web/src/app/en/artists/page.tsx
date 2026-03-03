import type { Metadata } from "next"
import { safeSanityFetch } from "@/lib/sanity.client"
import { ARTISTS_EN_MERGED_QUERY, SITE_SETTINGS_QUERY, SiteSettings } from "@/lib/queries"
import { Footer } from "@/components/Footer"
import { FallbackNotice } from "@/components/FallbackNotice"
import { ArtistCard, ArtistCardItem } from "@/components/cards/ArtistCard"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Artists",
  description:
    "Artists exhibiting at Fuocherello. Contemporary sculpture and artistic experimentation at the De Carli Foundry in Volvera, Italy.",
  openGraph: {
    title: "Artists | Fuocherello",
    description:
      "Artists exhibiting at Fuocherello. Contemporary sculpture and artistic experimentation.",
    locale: "en_US",
  },
  alternates: {
    canonical: "/en/artists",
    languages: {
      "it-IT": "/artisti",
      "en-US": "/en/artists",
    },
  },
}

interface ArtistWithLang extends ArtistCardItem {
  language: string
  translationRef?: string
}

function mergeByLanguage(all: ArtistWithLang[]): ArtistWithLang[] {
  const enItems = all.filter((i) => i.language === "en")
  const coveredItIds = new Set(enItems.map((i) => i.translationRef).filter(Boolean) as string[])
  return [...enItems, ...all.filter((i) => i.language === "it" && !coveredItIds.has(i._id))]
}

async function getArtists(): Promise<ArtistWithLang[]> {
  const result = await safeSanityFetch<ArtistWithLang[]>(ARTISTS_EN_MERGED_QUERY, {}, { next: { revalidate: 60 } })
  return result || []
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnArtistsPage() {
  const [rawArtists, settings] = await Promise.all([getArtists(), getSettings()])
  const artists = mergeByLanguage((rawArtists || []).filter((a) => a?.slug?.current))
  const hasUntranslated = artists.some((a) => a.language === "it")

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16">
        <div className="w-full">
          {hasUntranslated && <FallbackNotice language="en" />}
          <div className="pointer-events-none" style={{ paddingTop: "3em", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff] leading-[0.85] tracking-[-0.03em] font-medium text-[clamp(3.5rem,10vw,8rem)]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>A</span>
              <span className="lowercase">rtists</span>
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}>
            {artists.map((artist, index) => (
              <ArtistCard
                key={artist._id}
                item={artist}
                href={`/en/artists/${encodeURIComponent(artist.slug.current)}`}
                isLast={index === artists.length - 1}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer language="en" footerText={settings?.footerText} />
    </div>
  )
}
