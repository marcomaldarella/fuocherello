import type { Metadata } from "next"
import { safeSanityFetch } from "@/lib/sanity.client"
import { FAIRS_QUERY, SITE_SETTINGS_QUERY, SiteSettings } from "@/lib/queries"
import { Footer } from "@/components/Footer"
import { ExhibitCard, ExhibitCardItem } from "@/components/cards/ExhibitCard"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Fiere",
  description:
    "Fuocherello alle fiere d'arte. Scultura contemporanea e artisti emergenti dalla Fonderia De Carli di Volvera (TO).",
  openGraph: {
    title: "Fiere | Fuocherello",
    description:
      "Fuocherello alle fiere d'arte. Scultura contemporanea e artisti emergenti.",
  },
  alternates: {
    canonical: "/fiere",
    languages: {
      "it-IT": "/fiere",
      "en-US": "/en/fairs",
    },
  },
}

async function getFairs(): Promise<ExhibitCardItem[]> {
  const result = await safeSanityFetch<ExhibitCardItem[]>(FAIRS_QUERY, { language: "it" }, { next: { revalidate: 60 } })
  return result || []
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function FierePage() {
  const [fairs, settings] = await Promise.all([getFairs(), getSettings()])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16">
        <div className="w-full">
          <div className="pointer-events-none" style={{ paddingTop: "3em", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff] leading-[0.85] tracking-[-0.03em] font-medium text-[clamp(3.5rem,10vw,8rem)]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>F</span>
              <span className="lowercase">iere</span>
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}>
            {fairs.map((fair, index) => (
              <ExhibitCard
                key={fair._id}
                item={fair}
                href={`/fiere/${fair.slug.current}`}
                language="it"
                isLast={index === fairs.length - 1}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer language="it" footerText={settings?.footerText} />
    </div>
  )
}
