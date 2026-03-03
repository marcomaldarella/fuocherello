import type { Metadata } from "next"
import { safeSanityFetch } from "@/lib/sanity.client"
import { NEWS_EN_MERGED_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"

import { Footer } from "@/components/Footer"
import { FallbackNotice } from "@/components/FallbackNotice"
import { urlFor } from "@/lib/imageUrl"
import Image from "next/image"

export const revalidate = 60

export const metadata: Metadata = {
  title: "News",
  description:
    "News, events and updates from Fuocherello. Contemporary art, sculpture and exhibitions in Volvera (TO), Italy.",
  openGraph: {
    title: "News | Fuocherello",
    description:
      "News, events and updates from Fuocherello. Contemporary art, sculpture and exhibitions.",
    locale: "en_US",
  },
  alternates: {
    canonical: "/en/news",
    languages: {
      "it-IT": "/news",
      "en-US": "/en/news",
    },
  },
}

interface NewsItem {
  _id: string
  title: string
  date?: string
  summaryLine?: string
  image?: any
  lqip?: string
  externalUrl?: string
  language: string
}


async function getNews(): Promise<NewsItem[]> {
  const result = await safeSanityFetch<NewsItem[]>(NEWS_EN_MERGED_QUERY, {}, { next: { revalidate: 60 } })
  return result || []
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnNewsPage() {
  const [news, settings] = await Promise.all([getNews(), getSettings()])
  const hasUntranslated = news.some((n) => n.language === "it")

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16">
        <div className="w-full">
          {hasUntranslated && <FallbackNotice language="en" />}

          <div className="pointer-events-none" style={{ paddingTop: "2em", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff]  leading-[0.85] tracking-[-0.03em] font-medium text-[clamp(3.5rem,10vw,8rem)]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                N
              </span>
              <span className="lowercase">ews</span>
            </h1>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}
          >
            {news.map((item, index) => {
              const isLast = index === news.length - 1
              const content = (
                <div className="w-full">
                  <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
                    <Image
                      src={
                        item.image
                          ? urlFor(item.image).width(1200).height(900).fit("crop").url() || "/placeholder.svg"
                          : `/placeholder.svg?height=900&width=1200&query=contemporary art exhibition news ${index + 1}`
                      }
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 50vw, 100vw"
                      {...(item.lqip ? { placeholder: "blur" as const, blurDataURL: item.lqip } : {})}
                    />
                  </div>
                  <div className="mt-2 w-full text-[#0000ff]  text-[12px] md:text-[13px] leading-tight" style={{ paddingTop: "1em", paddingBottom: "6px" }}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="text-[16px] md:text-[17px] uppercase leading-[0.95] first-letter:italic whitespace-nowrap" style={{ paddingBottom: '4px' }}>
                        {(item.title ?? "").split(' ').map((word, i, arr) =>
                          word === '~' ? (
                            <span key={i}> ~ </span>
                          ) : (
                            <span key={i} className="whitespace-nowrap">
                              <span className="italic uppercase inline-block" style={{ marginRight: i === 0 ? "0.07em" : "0.02em" }}>
                                {word[0] ?? ""}
                              </span>
                              <span className="lowercase">{word.slice(1)}</span>
                              {i < arr.length - 1 && ' '}
                            </span>
                          )
                        )}
                      </h2>
                      {item.date && (
                        <span className="lowercase opacity-70">{new Date(item.date).toLocaleDateString("en-US").replaceAll("/", ".")}</span>
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
                    style={isLast ? { paddingBottom: 'clamp(2em, 4vw, 3em)' } : undefined}
                  >
                    {content}
                  </a>
                )
              }

              return (
                <div key={item._id} className="block" style={isLast ? { paddingBottom: 'clamp(2em, 4vw, 3em)' } : undefined}>
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
