import { safeSanityFetch } from "@/lib/sanity.client"
import { EXHIBITIONS_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"

import { Footer } from "@/components/Footer"
import { FallbackNotice } from "@/components/FallbackNotice"
import { urlFor } from "@/lib/imageUrl"
import Image from "next/image"
import Link from "next/link"

export const revalidate = 60

interface Exhibition {
  _id: string
  title: string
  slug: { current: string }
  artistsLine?: string
  authorName?: string
  dateStart?: string
  dateEnd?: string
  featuredImage?: any
  lqip?: string
  language: string
}

async function getExhibitions(): Promise<{ exhibitions: Exhibition[]; isFallback: boolean }> {
  let exhibitions = await safeSanityFetch<Exhibition[]>(EXHIBITIONS_QUERY, { language: "en" }, { next: { revalidate: 60 } })

  if (!exhibitions || exhibitions.length === 0) {
    exhibitions = await safeSanityFetch<Exhibition[]>(EXHIBITIONS_QUERY, { language: "it" }, { next: { revalidate: 60 } })
    return { exhibitions: exhibitions || [], isFallback: true }
  }

  return { exhibitions, isFallback: false }
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnExhibitionsPage() {
  const [{ exhibitions: rawExhibitions, isFallback }, settings] = await Promise.all([getExhibitions(), getSettings()])

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
          {isFallback && <FallbackNotice language="en" />}

          <div className="pointer-events-none" style={{ paddingTop: "3em", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff] leading-[0.85] tracking-[-0.03em] font-medium text-[clamp(3.5rem,10vw,8rem)]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                E
              </span>
              <span className="lowercase">xhibitions</span>
            </h1>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}
          >
            {exhibitions.map((exhibition, index) => {
              const isLast = index === exhibitions.length - 1
              const content = (
                <div className="w-full">
                  <div className="relative w-full aspect-square bg-muted overflow-hidden">
                    <Image
                      src={
                        exhibition.featuredImage
                          ? urlFor(exhibition.featuredImage).width(800).height(800).fit("crop").url()
                          : `/placeholder.svg?height=800&width=800`
                      }
                      alt={exhibition.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      {...(exhibition.lqip ? { placeholder: "blur" as const, blurDataURL: exhibition.lqip } : {})}
                    />
                  </div>
                  <div className="mt-2 w-full text-[#0000ff]  text-[12px] md:text-[13px] leading-tight" style={{ paddingTop: "1em", paddingBottom: "6px" }}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="text-[16px] md:text-[17px] uppercase leading-[0.95] first-letter:italic whitespace-nowrap" style={{ paddingBottom: '4px' }}>
                        <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                          {exhibition.title?.[0] ?? ""}
                        </span>
                        <span className="lowercase">{exhibition.title?.slice(1) ?? ""}</span>
                      </h2>
                      {exhibition.authorName && (
                        <span className="whitespace-nowrap shrink-0">
                          <span className="opacity-70" style={{ marginRight: '1em' }}>text by</span>
                          {exhibition.authorName!.split(' ').map((word, i) => (
                            <span key={i} className="whitespace-nowrap">
                              <span className="italic uppercase inline-block" style={{ marginRight: "0.02em" }}>
                                {word[0]}
                              </span>
                              <span className="lowercase">{word.slice(1)}</span>
                              {i < exhibition.authorName!.split(' ').length - 1 && ' '}
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                    {exhibition.artistsLine && (
                      <div className="opacity-70">
                        {exhibition.artistsLine.split(/,| e | and /).map((name, i, arr) => (
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
                    {(exhibition.dateStart || exhibition.dateEnd) && (
                      <div className="lowercase opacity-70">
                        {exhibition.dateStart && new Date(exhibition.dateStart).toLocaleDateString("en-US").replaceAll("/", ".")}
                        {exhibition.dateStart && exhibition.dateEnd && " - "}
                        {exhibition.dateEnd && new Date(exhibition.dateEnd).toLocaleDateString("en-US").replaceAll("/", ".")}
                      </div>
                    )}
                  </div>
                </div>
              )

              return (
                <Link
                  key={exhibition._id}
                  href={`/en/exhibitions/${exhibition.slug.current}`}
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
