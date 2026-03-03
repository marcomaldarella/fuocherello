import type { Metadata } from "next"
import { safeSanityFetch } from "@/lib/sanity.client"
import { EXHIBITIONS_QUERY, SITE_SETTINGS_QUERY, SiteSettings } from "@/lib/queries"
import { Footer } from "@/components/Footer"
import { ExhibitCard, ExhibitCardItem } from "@/components/cards/ExhibitCard"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Mostre",
  description:
    "Scopri le mostre di scultura contemporanea presso Fuocherello, spazio espositivo alla Fonderia Artistica De Carli di Volvera (TO).",
  openGraph: {
    title: "Mostre | Fuocherello",
    description:
      "Scopri le mostre di scultura contemporanea presso Fuocherello, spazio espositivo alla Fonderia Artistica De Carli.",
  },
  alternates: {
    canonical: "/mostre",
    languages: {
      "it-IT": "/mostre",
      "en-US": "/en/exhibitions",
    },
  },
}

async function getExhibitions(): Promise<ExhibitCardItem[]> {
  const result = await safeSanityFetch<ExhibitCardItem[]>(EXHIBITIONS_QUERY, { language: "it" }, { next: { revalidate: 60 } })
  return result || []
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function MostrePage() {
  const [rawExhibitions, settings] = await Promise.all([getExhibitions(), getSettings()])

  const exhibitions = Array.from(
    new Map(
      (rawExhibitions || [])
        .filter((ex) => ex?.slug?.current)
        .map((ex) => [ex.slug.current, ex])
    ).values()
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16">
        <div className="w-full">
          <div className="pointer-events-none" style={{ paddingTop: "3em", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff] leading-[0.85] tracking-[-0.03em] font-medium text-[clamp(3.5rem,10vw,8rem)]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>M</span>
              <span className="lowercase">ostre</span>
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}>
            {exhibitions.map((exhibition, index) => (
              <ExhibitCard
                key={exhibition._id}
                item={exhibition}
                href={`/mostre/${exhibition.slug.current}`}
                language="it"
                isLast={index === exhibitions.length - 1}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer language="it" footerText={settings?.footerText} />
    </div>
  )
}
