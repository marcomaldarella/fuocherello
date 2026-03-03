import type { Metadata } from "next"
import { safeSanityFetch } from "@/lib/sanity.client"
import { FAIRS_EN_MERGED_QUERY, SITE_SETTINGS_QUERY, SiteSettings } from "@/lib/queries"
import { Footer } from "@/components/Footer"
import { FallbackNotice } from "@/components/FallbackNotice"
import { ExhibitCard, ExhibitCardItem } from "@/components/cards/ExhibitCard"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Fairs",
  description:
    "Fuocherello at art fairs. Contemporary sculpture and emerging artists from the De Carli Foundry in Volvera (TO), Italy.",
  openGraph: {
    title: "Fairs | Fuocherello",
    description:
      "Fuocherello at art fairs. Contemporary sculpture and emerging artists.",
    locale: "en_US",
  },
  alternates: {
    canonical: "/en/fairs",
    languages: {
      "it-IT": "/fiere",
      "en-US": "/en/fairs",
    },
  },
}

interface FairWithLang extends ExhibitCardItem {
  language: string
  translationRef?: string
}

function mergeByLanguage(all: FairWithLang[]): FairWithLang[] {
  const enItems = all.filter((i) => i.language === "en")
  const coveredItIds = new Set(enItems.map((i) => i.translationRef).filter(Boolean) as string[])
  return [...enItems, ...all.filter((i) => i.language === "it" && !coveredItIds.has(i._id))]
}

async function getFairs(): Promise<FairWithLang[]> {
  const result = await safeSanityFetch<FairWithLang[]>(FAIRS_EN_MERGED_QUERY, {}, { next: { revalidate: 60 } })
  return result || []
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnFairsPage() {
  const [rawFairs, settings] = await Promise.all([getFairs(), getSettings()])
  const fairs = mergeByLanguage((rawFairs || []).filter((f) => f?.slug?.current))
  const hasUntranslated = fairs.some((f) => f.language === "it")

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16">
        <div className="w-full">
          {hasUntranslated && <FallbackNotice language="en" />}
          <div className="pointer-events-none" style={{ paddingTop: "3em", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff] leading-[0.85] tracking-[-0.03em] font-medium text-[clamp(3.5rem,10vw,8rem)]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>F</span>
              <span className="lowercase">airs</span>
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}>
            {fairs.map((fair, index) => (
              <ExhibitCard
                key={fair._id}
                item={fair}
                href={`/en/fairs/${fair.slug.current}`}
                language="en"
                isLast={index === fairs.length - 1}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer language="en" footerText={settings?.footerText} />
    </div>
  )
}
