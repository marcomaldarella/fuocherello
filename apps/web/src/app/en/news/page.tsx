import { safeSanityFetch, isSanityAvailable } from "@/lib/sanity.client"
import { NEWS_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FallbackNotice } from "@/components/FallbackNotice"
import { urlFor } from "@/lib/imageUrl"
import Image from "next/image"

export const revalidate = 60

interface NewsItem {
  _id: string
  title: string
  date?: string
  summaryLine?: string
  image?: any
  externalUrl?: string
  language: string
}

const mockNews: NewsItem[] = [
  {
    _id: "mock-en-1",
    title: "New Contemporary Exhibition",
    date: "2024-03-15",
    summaryLine:
      "Discover our latest exhibition dedicated to Italian contemporary art featuring works by emerging and established artists.",
    language: "en",
  },
  {
    _id: "mock-en-2",
    title: "International Art Fair Participation",
    date: "2024-05-10",
    summaryLine:
      "Fuocherello will participate in the prestigious international art fair with a curated selection of works from our collection.",
    language: "en",
  },
  {
    _id: "mock-en-3",
    title: "Special Event: Meet the Artist",
    date: "2024-06-20",
    summaryLine:
      "A unique opportunity to meet the artists of the current exhibition and discover the creative processes behind their works.",
    language: "en",
  },
]

async function getNews(): Promise<{ news: NewsItem[]; isFallback: boolean }> {
  let news = await safeSanityFetch<NewsItem[]>(NEWS_QUERY, { language: "en" }, { next: { revalidate: 60 } })

  if (!news || news.length === 0) {
    news = await safeSanityFetch<NewsItem[]>(NEWS_QUERY, { language: "it" }, { next: { revalidate: 60 } })
    return { news: news || [], isFallback: true }
  }

  return { news: news || [], isFallback: false }
}

async function getSettings() {
  return await safeSanityFetch(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnNewsPage() {
  const [{ news, isFallback }, settings] = await Promise.all([getNews(), getSettings()])

  const displayNews = news.length > 0 ? news : mockNews

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language="en" />
      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16">
        <div className="w-full">
          {!isSanityAvailable && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
              Fallback mode: configure Sanity environment variables to view real content.
            </div>
          )}

          {isFallback && isSanityAvailable && <FallbackNotice language="en" />}

          <div className="pointer-events-none" style={{ paddingTop: "1.25rem", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff] font-black leading-[0.85] tracking-[-0.03em] text-[clamp(3.5rem,10vw,8rem)]">
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
                    <Image
                      src={
                        item.image
                          ? urlFor(item.image).width(1200).height(1200).fit("crop").url() || "/placeholder.svg"
                          : `/placeholder.svg?height=800&width=800&query=contemporary art exhibition news ${index + 1}`
                      }
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="mt-2 w-full text-[#0000ff] font-black text-[12px] md:text-[13px] leading-tight">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="uppercase leading-[0.95] first-letter:italic">
                        <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                          {item.title[0]}
                        </span>
                        <span className="lowercase">{item.title.slice(1)}</span>
                      </h2>
                      {item.date && (
                        <span className="lowercase opacity-70">{new Date(item.date).toLocaleDateString("en-US")}</span>
                      )}
                    </div>
                    {item.summaryLine && <div className="lowercase opacity-70">{item.summaryLine}</div>}
                  </div>
                </div>
              )

              if (item.externalUrl) {
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
      <Footer language="en" footerText={settings?.footerText} />
    </div>
  )
}
