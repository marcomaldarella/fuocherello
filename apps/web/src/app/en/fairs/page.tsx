import { safeSanityFetch } from "@/lib/sanity.client"
import { FAIRS_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"

import { Footer } from "@/components/Footer"
import { FallbackNotice } from "@/components/FallbackNotice"
import { urlFor } from "@/lib/imageUrl"
import Image from "next/image"
import Link from "next/link"

export const revalidate = 60

interface Fair {
  _id: string
  title: string
  slug: { current: string }
  venue?: string
  artistsLine?: string
  authorName?: string
  dateStart?: string
  dateEnd?: string
  featuredImage?: any
  language: string
}

async function getFairs(): Promise<{ fairs: Fair[]; isFallback: boolean }> {
  let fairs = await safeSanityFetch<Fair[]>(FAIRS_QUERY, { language: "en" }, { next: { revalidate: 60 } })

  if (!fairs || fairs.length === 0) {
    fairs = await safeSanityFetch<Fair[]>(FAIRS_QUERY, { language: "it" }, { next: { revalidate: 60 } })
    return { fairs: fairs || [], isFallback: true }
  }

  return { fairs, isFallback: false }
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnFairsPage() {
  const [{ fairs, isFallback }, settings] = await Promise.all([getFairs(), getSettings()])

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16">
        <div className="w-full">
          {isFallback && <FallbackNotice language="en" />}

          <div className="pointer-events-none" style={{ paddingTop: "2em", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff] font-bold leading-[0.85] tracking-[-0.03em] text-[clamp(3.5rem,10vw,8rem)]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                F
              </span>
              <span className="lowercase">airs</span>
            </h1>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}
          >
            {fairs.map((fair, index) => {
              const isLast = index === fairs.length - 1
              const content = (
                <div className="w-full">
                  <div className="relative w-full aspect-square bg-muted overflow-hidden">
                    <Image
                      src={
                        fair.featuredImage
                          ? urlFor(fair.featuredImage).width(1200).height(1200).fit("crop").url()
                          : `/placeholder.svg?height=800&width=800`
                      }
                      alt={fair.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="mt-2 w-full text-[#0000ff]  text-[12px] md:text-[13px] leading-tight" style={{ paddingTop: "1em" }}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="text-[16px] md:text-[17px] uppercase leading-[0.95] first-letter:italic whitespace-nowrap">
                        <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                          {fair.title?.[0] ?? ""}
                        </span>
                        <span className="lowercase">{fair.title?.slice(1) ?? ""}</span>
                      </h2>
                      {fair.authorName && (
                        <span>
                          <span className="opacity-70 mr-1">text by</span>
                          {fair.authorName!.split(' ').map((word, i) => (
                            <span key={i}>
                              <span className="italic uppercase inline-block" style={{ marginRight: "0.02em" }}>
                                {word[0]}
                              </span>
                              <span className="lowercase">{word.slice(1)}</span>
                              {i < fair.authorName!.split(' ').length - 1 && ' '}
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                    {fair.venue && (
                      <div className="opacity-70">
                        {fair.venue.split(' ').map((word, i) => (
                          <span key={i}>
                            <span className="italic uppercase inline-block" style={{ marginRight: "0.02em" }}>
                              {word[0]}
                            </span>
                            <span className="lowercase">{word.slice(1)}</span>
                            {i < fair.venue!.split(' ').length - 1 && ' '}
                          </span>
                        ))}
                      </div>
                    )}
                    {fair.artistsLine && (
                      <div className="opacity-70">
                        {fair.artistsLine.split(/,| e | and /).map((name, i, arr) => (
                          <span key={i}>
                            {name.trim().split(' ').map((word, j) => (
                              <span key={j}>
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
                    {(fair.dateStart || fair.dateEnd) && (
                      <div className="lowercase opacity-70">
                        {fair.dateStart && new Date(fair.dateStart).toLocaleDateString("en-US")}
                        {fair.dateStart && fair.dateEnd && " - "}
                        {fair.dateEnd && new Date(fair.dateEnd).toLocaleDateString("en-US")}
                      </div>
                    )}
                  </div>
                </div>
              )

              return (
                <Link
                  key={fair._id}
                  href={`/en/fairs/${fair.slug.current}`}
                  className="block hover:opacity-90 transition-opacity"
                  style={isLast ? { paddingBottom: 'clamp(1em, 3vw, 2em)' } : undefined}
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
