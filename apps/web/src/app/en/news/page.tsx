import type { Metadata } from "next"
import { safeSanityFetch } from "@/lib/sanity.client"
import { NEWS_EN_MERGED_QUERY, SITE_SETTINGS_QUERY, SiteSettings } from "@/lib/queries"
import { Footer } from "@/components/Footer"
import { FallbackNotice } from "@/components/FallbackNotice"
import { NewsCard, NewsCardItem } from "@/components/cards/NewsCard"

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

interface NewsWithLang extends NewsCardItem {
  language: string
  translationRef?: string
}

function mergeByLanguage(all: NewsWithLang[]): NewsWithLang[] {
  const enItems = all.filter((i) => i.language === "en")
  const coveredItIds = new Set(enItems.map((i) => i.translationRef).filter(Boolean) as string[])
  return [...enItems, ...all.filter((i) => i.language === "it" && !coveredItIds.has(i._id))]
}

async function getNews(): Promise<NewsWithLang[]> {
  const result = await safeSanityFetch<NewsWithLang[]>(NEWS_EN_MERGED_QUERY, {}, { next: { revalidate: 60 } })
  return result || []
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnNewsPage() {
  const [rawNews, settings] = await Promise.all([getNews(), getSettings()])
  const news = mergeByLanguage(rawNews || [])
  const hasUntranslated = news.some((n) => n.language === "it")

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16">
        <div className="w-full">
          {hasUntranslated && <FallbackNotice language="en" />}
          <div className="pointer-events-none" style={{ paddingTop: "2em", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff] leading-[0.85] tracking-[-0.03em] font-medium text-[clamp(3.5rem,10vw,8rem)]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>N</span>
              <span className="lowercase">ews</span>
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}>
            {news.map((item, index) => (
              <NewsCard
                key={item._id}
                item={item}
                language="en"
                index={index}
                isLast={index === news.length - 1}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer language="en" footerText={settings?.footerText} />
    </div>
  )
}
