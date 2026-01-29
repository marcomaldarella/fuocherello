import { safeSanityFetch, isSanityAvailable } from "@/lib/sanity.client"
import { EXHIBITIONS_AND_FAIRS_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
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
}

const mockExhibits: Exhibit[] = [
  {
    _id: "mock-1",
    _type: "exhibition",
    title: "Arte Contemporanea Italiana",
    slug: { current: "arte-contemporanea-italiana" },
    artistsLine: "Marco Rossi, Laura Bianchi, Giuseppe Verdi",
    dateStart: "2024-03-01",
    dateEnd: "2024-04-30",
  },
  {
    _id: "mock-2",
    _type: "exhibition",
    title: "Sculture Moderne",
    slug: { current: "sculture-moderne" },
    artistsLine: "Anna Ferretti",
    dateStart: "2024-05-15",
    dateEnd: "2024-07-15",
  },
  {
    _id: "mock-3",
    _type: "fair",
    title: "Fiera Internazionale d'Arte",
    slug: { current: "fiera-arte-2024" },
    venue: "Fiera Milano",
    dateStart: "2024-05-10",
    dateEnd: "2024-05-12",
  },
]

async function getExhibits(): Promise<Exhibit[]> {
  const result = await safeSanityFetch<Exhibit[]>(EXHIBITIONS_AND_FAIRS_QUERY, { language: "it" }, { next: { revalidate: 60 } })
  return result || []
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function ExhibitsPage() {
  const [exhibits, settings] = await Promise.all([getExhibits(), getSettings()])

  const displayExhibits = exhibits.length > 0 ? exhibits : mockExhibits

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language="it" />
      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16">
        <div className="w-full">
          {!isSanityAvailable && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
              Modalità fallback: configura le variabili d'ambiente di Sanity per visualizzare contenuti reali.
            </div>
          )}

          <div className="pointer-events-none" style={{ paddingTop: "1.25rem", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff]  leading-[0.85] tracking-[-0.03em] text-[clamp(3.5rem,10vw,8rem)]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                M
              </span>
              <span className="lowercase">ostre</span>
              <span className="lowercase"> &amp; </span>
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                F
              </span>
              <span className="lowercase">iere</span>
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
                          ? urlFor(exhibit.featuredImage).width(1200).height(1200).fit("crop").url()
                          : `/placeholder.svg?height=800&width=800`
                      }
                      alt={exhibit.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="mt-2 w-full text-[#0000ff]  text-[12px] md:text-[13px] leading-tight">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="uppercase leading-[0.95] first-letter:italic">
                        <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                          {exhibit.title?.[0] ?? ""}
                        </span>
                        <span className="lowercase">{exhibit.title?.slice(1) ?? ""}</span>
                      </h2>
                      {exhibit.authorName && <span className="lowercase">{exhibit.authorName}</span>}
                    </div>
                    {exhibit.artistsLine && <div className="lowercase opacity-70">{exhibit.artistsLine}</div>}
                    {(exhibit.dateStart || exhibit.dateEnd) && (
                      <div className="lowercase opacity-70">
                        {exhibit.dateStart && new Date(exhibit.dateStart).toLocaleDateString("it-IT")}
                        {exhibit.dateStart && exhibit.dateEnd && " - "}
                        {exhibit.dateEnd && new Date(exhibit.dateEnd).toLocaleDateString("it-IT")}
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
                  href={`/esibizioni-e-fiere/${exhibit.slug.current}`}
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
