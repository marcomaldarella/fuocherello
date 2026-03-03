import type { Metadata } from "next"
import { safeSanityFetch } from "@/lib/sanity.client"
import { EXHIBITIONS_EN_MERGED_QUERY, SITE_SETTINGS_QUERY, SiteSettings } from "@/lib/queries"
import { Footer } from "@/components/Footer"
import { FallbackNotice } from "@/components/FallbackNotice"
import { ExhibitCard, ExhibitCardItem } from "@/components/cards/ExhibitCard"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Exhibitions",
  description:
    "Discover contemporary sculpture exhibitions at Fuocherello, an exhibition space at the De Carli Artistic Foundry in Volvera (TO), Italy.",
  openGraph: {
    title: "Exhibitions | Fuocherello",
    description:
      "Discover contemporary sculpture exhibitions at Fuocherello, an exhibition space at the De Carli Artistic Foundry.",
    locale: "en_US",
  },
  alternates: {
    canonical: "/en/exhibitions",
    languages: {
      "it-IT": "/mostre",
      "en-US": "/en/exhibitions",
    },
  },
}

interface ExhibitionWithLang extends ExhibitCardItem {
  language: string
  translationRef?: string
}

function mergeByLanguage(all: ExhibitionWithLang[]): ExhibitionWithLang[] {
  const enItems = all.filter((i) => i.language === "en")
  const coveredItIds = new Set(enItems.map((i) => i.translationRef).filter(Boolean) as string[])
  return [...enItems, ...all.filter((i) => i.language === "it" && !coveredItIds.has(i._id))]
}

async function getExhibitions(): Promise<ExhibitionWithLang[]> {
  const result = await safeSanityFetch<ExhibitionWithLang[]>(EXHIBITIONS_EN_MERGED_QUERY, {}, { next: { revalidate: 60 } })
  return result || []
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnExhibitionsPage() {
  const [rawExhibitions, settings] = await Promise.all([getExhibitions(), getSettings()])
  const exhibitions = mergeByLanguage((rawExhibitions || []).filter((ex) => ex?.slug?.current))
  const hasUntranslated = exhibitions.some((ex) => ex.language === "it")

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16">
        <div className="w-full">
          {hasUntranslated && <FallbackNotice language="en" />}
          <div className="pointer-events-none" style={{ paddingTop: "3em", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff] leading-[0.85] tracking-[-0.03em] font-medium text-[clamp(3.5rem,10vw,8rem)]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>E</span>
              <span className="lowercase">xhibitions</span>
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}>
            {exhibitions.map((exhibition, index) => (
              <ExhibitCard
                key={exhibition._id}
                item={exhibition}
                href={`/en/exhibitions/${exhibition.slug.current}`}
                language="en"
                isLast={index === exhibitions.length - 1}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer language="en" footerText={settings?.footerText} />
    </div>
  )
}
