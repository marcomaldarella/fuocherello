import { safeSanityFetch } from "@/lib/sanity.client"
import { EXHIBITIONS_AND_FAIRS_EN_MERGED_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"

import { Footer } from "@/components/Footer"
import { FallbackNotice } from "@/components/FallbackNotice"
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
  lqip?: string
  language: string
  translationRef?: string
}

function mergeByLanguage<T extends { _id: string; language: string; translationRef?: string }>(all: T[]): T[] {
  const enItems = all.filter((i) => i.language === "en")
  const coveredItIds = new Set(enItems.map((i) => i.translationRef).filter(Boolean) as string[])
  return [...enItems, ...all.filter((i) => i.language === "it" && !coveredItIds.has(i._id))]
}

async function getExhibits(): Promise<Exhibit[]> {
  const result = await safeSanityFetch<Exhibit[]>(EXHIBITIONS_AND_FAIRS_EN_MERGED_QUERY, {}, { next: { revalidate: 60 } })
  return result || []
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnExhibitsPage() {
  const [rawExhibits, settings] = await Promise.all([getExhibits(), getSettings()])
  const exhibits = mergeByLanguage((rawExhibits || []).filter((e) => e?.slug?.current))
  const hasUntranslated = exhibits.some((e) => e.language === "it")

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16">
        <div className="w-full">
          {hasUntranslated && <FallbackNotice language="en" />}

          <div className="pointer-events-none" style={{ paddingTop: "3em", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff]  leading-[0.85] tracking-[-0.03em] font-medium text-[clamp(3.5rem,10vw,8rem)]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                E
              </span>
              <span className="lowercase">xhibits</span>
            </h1>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}
          >
            {exhibits.map((exhibit, index) => {
              const isLast = index === exhibits.length - 1
              const content = (
                <div className="w-full">
                  <div className="relative w-full aspect-square bg-muted overflow-hidden">
                    <Image
                      src={
                        exhibit.featuredImage
                          ? urlFor(exhibit.featuredImage).width(800).height(800).fit("crop").url() || "/placeholder.svg"
                          : `/placeholder.svg?height=800&width=800&query=art exhibition ${exhibit.type} ${index + 1}`
                      }
                      alt={exhibit.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      {...(exhibit.lqip ? { placeholder: "blur" as const, blurDataURL: exhibit.lqip } : {})}
                    />
                  </div>
                  <div className="mt-2 w-full text-[#0000ff]  text-[12px] md:text-[13px] leading-tight">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="text-[16px] md:text-[17px] uppercase leading-[0.95] first-letter:italic whitespace-nowrap" style={{ paddingBottom: '4px' }}>
                        {(exhibit.title ?? "").split(' ').map((word, i, arr) =>
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
                      {exhibit.authorName && (
                        <span className="whitespace-nowrap shrink-0">
                          <span className="opacity-70" style={{ marginRight: '1em' }}>text by</span>
                          {exhibit.authorName.split(' ').map((word, i) => (
                            <span key={i} className="whitespace-nowrap">
                              <span className="italic uppercase inline-block" style={{ marginRight: "0.02em" }}>
                                {word[0]}
                              </span>
                              <span className="lowercase">{word.slice(1)}</span>
                              {i < exhibit.authorName!.split(' ').length - 1 && ' '}
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                    {exhibit.artistsLine && (
                      <div className="opacity-70">
                        {exhibit.artistsLine.split(/,| e | and /).map((name, i, arr) => (
                          <span key={i}>
                            {name.trim().split(' ').map((word, j) => (
                              <span key={j} className="whitespace-nowrap">
                                <span className="italic uppercase inline-block" style={{ marginRight: "0.02em" }}>
                                  {word[0]}
                                </span>
                                <span className="lowercase">{word.slice(1)}</span>
                                {j < name.trim().split(' ').length - 1 && ' '}
                              </span>
                            ))}
                            {i < arr.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    )}
                    {(exhibit.dateStart || exhibit.dateEnd) && (
                      <div className="lowercase opacity-70">
                        {exhibit.dateStart && new Date(exhibit.dateStart).toLocaleDateString("en-US").replaceAll("/", ".")}
                        {exhibit.dateStart && exhibit.dateEnd && " - "}
                        {exhibit.dateEnd && new Date(exhibit.dateEnd).toLocaleDateString("en-US").replaceAll("/", ".")}
                      </div>
                    )}
                  </div>
                </div>
              )

              return (
                <Link
                  key={exhibit._id}
                  href={`/en/exhibits/${exhibit.slug.current}`}
                  className="block hover:opacity-90 transition-opacity"
                  style={isLast ? { paddingBottom: 'clamp(2em, 4vw, 3em)' } : undefined}
                >
                  {content}
                </Link>
              )
            })}
          </div>
        </div>
      </main>
      <Footer language="en" footerText={settings?.footerText} />
    </div>
  )
}
