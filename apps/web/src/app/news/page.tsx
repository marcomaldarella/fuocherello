import { safeSanityFetch, isSanityAvailable } from "@/lib/sanity.client"
import { NEWS_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { urlFor } from "@/lib/imageUrl"
import Image from "next/image"
import PlaceholderSVG from "@/components/PlaceholderSVG"

export const revalidate = 60

interface NewsItem {
  _id: string
  title: string
  date?: string
  dateText?: string
  summaryLine?: string
  image?: any
  externalUrl?: string
}

const mockNews: NewsItem[] = [
  {
    _id: "mock-1",
    title: "Nuova Esposizione Contemporanea",
    dateText: "15 Marzo 2024 - 30 Aprile 2024",
    summaryLine:
      "Scopri la nostra ultima esposizione dedicata all'arte contemporanea italiana con opere di artisti emergenti e affermati.",
  },
  {
    _id: "mock-2",
    title: "Partecipazione alla Fiera d'Arte Internazionale",
    dateText: "10 Maggio 2024 - 12 Maggio 2024",
    summaryLine:
      "Fuocherello parteciperà alla prestigiosa fiera d'arte internazionale con una selezione curata di opere della nostra collezione.",
  },
  {
    _id: "mock-3",
    title: "Evento Speciale: Incontro con l'Artista",
    dateText: "20 Giugno 2024",
    summaryLine:
      "Un'occasione unica per incontrare gli artisti della mostra in corso e scoprire i processi creativi dietro le loro opere.",
  },
]

async function getNews(): Promise<NewsItem[]> {
  const result = await safeSanityFetch<NewsItem[]>(NEWS_QUERY, { language: "it" }, { next: { revalidate: 60 } })
  return result || []
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function NewsPage() {
  const [news, settings] = await Promise.all([getNews(), getSettings()])

  const displayNews = news.length > 0 ? news : mockNews

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
                N
              </span>
              <span className="lowercase">ews</span>
            </h1>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}
          >
            {displayNews.map((item, index) => {
              const content = (
                <div className="w-full">
                  <div className="relative w-full aspect-square bg-muted overflow-hidden">
                    {item.image ? (
                      <Image
                        src={urlFor(item.image).width(1200).height(1200).fit("crop").url() || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    ) : (
                      <PlaceholderSVG height={800} width={800} query={`contemporary art exhibition news ${index + 1}`} />
                    )}
                  </div>
                  <div className="mt-2 w-full text-[#0000ff]  text-[12px] md:text-[13px] leading-tight">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="uppercase leading-[0.95] first-letter:italic">
                        <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                          {item.title?.[0] ?? ""}
                        </span>
                        <span className="lowercase">{item.title?.slice(1) ?? ""}</span>
                      </h2>
                      {(item.date || item.dateText) && (
                        <span className="lowercase opacity-70">
                          {item.date ? new Date(item.date).toLocaleDateString("it-IT") : item.dateText}
                        </span>
                      )}
                    </div>
                    {item.summaryLine && <div className="lowercase opacity-70">{item.summaryLine}</div>}
                  </div>
                </div>
              )

              if (item.externalUrl && /^https?:\/\//.test(item.externalUrl)) {
                return (
                  <a
                    key={item._id}
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:opacity-90 transition-opacity"
                  >
                    {content}
                  </a>
                )
              }

              return (
                <div key={item._id} className="block">
                  {content}
                </div>
              )
            })}
          </div>
        </div>
      </main>
      <Footer language="it" footerText={settings?.footerText} />
    </div>
  )
}
