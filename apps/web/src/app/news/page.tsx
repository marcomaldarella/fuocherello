import type { Metadata } from "next"
import { safeSanityFetch } from "@/lib/sanity.client"
import { NEWS_QUERY, SITE_SETTINGS_QUERY, SiteSettings } from "@/lib/queries"
import { Footer } from "@/components/Footer"
import { NewsCard, NewsCardItem } from "@/components/cards/NewsCard"

export const revalidate = 60

export const metadata: Metadata = {
  title: "News",
  description:
    "Novità, eventi e aggiornamenti dal mondo di Fuocherello. Arte contemporanea, scultura e mostre a Volvera (TO).",
  openGraph: {
    title: "News | Fuocherello",
    description:
      "Novità, eventi e aggiornamenti dal mondo di Fuocherello. Arte contemporanea, scultura e mostre.",
  },
  alternates: {
    canonical: "/news",
    languages: {
      "it-IT": "/news",
      "en-US": "/en/news",
    },
  },
}

async function getNews(): Promise<NewsCardItem[]> {
  const result = await safeSanityFetch<NewsCardItem[]>(NEWS_QUERY, { language: "it" }, { next: { revalidate: 60 } })
  return result || []
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function NewsPage() {
  const [news, settings] = await Promise.all([getNews(), getSettings()])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16">
        <div className="w-full">
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
                language="it"
                index={index}
                isLast={index === news.length - 1}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer language="it" footerText={settings?.footerText} />
    </div>
  )
}
