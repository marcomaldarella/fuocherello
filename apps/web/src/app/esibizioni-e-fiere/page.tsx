import { safeSanityFetch } from "@/lib/sanity.client"
import { EXHIBITIONS_AND_FAIRS_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"

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


async function getExhibits(): Promise<Exhibit[]> {
  const result = await safeSanityFetch<Exhibit[]>(EXHIBITIONS_AND_FAIRS_QUERY, { language: "it" }, { next: { revalidate: 60 } })
  return result || []
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function ExhibitsPage() {
  const [exhibits, settings] = await Promise.all([getExhibits(), getSettings()])

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16">
        <div className="w-full">

          <div className="pointer-events-none" style={{ paddingTop: "2em", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff]  leading-[0.85] tracking-[-0.03em] font-medium text-[clamp(3.5rem,10vw,8rem)]">
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
            {exhibits.map((exhibit, index) => {
              const isLast = index === exhibits.length - 1
              const content = (
                <div className="w-full">
                  <div className="relative w-full aspect-square bg-muted overflow-hidden">
                    <Image
                      src={
                        exhibit.featuredImage
                          ? urlFor(exhibit.featuredImage).width(800).height(800).fit("crop").url()
                          : `/placeholder.svg?height=800&width=800`
                      }
                      alt={exhibit.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="mt-2 w-full text-[#0000ff]  text-[12px] md:text-[13px] leading-tight">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="text-[16px] md:text-[17px] uppercase leading-[0.95] first-letter:italic whitespace-nowrap">
                        <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                          {exhibit.title?.[0] ?? ""}
                        </span>
                        <span className="lowercase">{exhibit.title?.slice(1) ?? ""}</span>
                      </h2>
                      {exhibit.authorName && (
                        <span className="whitespace-nowrap shrink-0">
                          <span className="opacity-70 mr-[0.5em]">testo di</span>
                          {exhibit.authorName!.split(' ').map((word, i) => (
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
                        {exhibit.dateStart && new Date(exhibit.dateStart).toLocaleDateString("it-IT").replaceAll("/", ".")}
                        {exhibit.dateStart && exhibit.dateEnd && " - "}
                        {exhibit.dateEnd && new Date(exhibit.dateEnd).toLocaleDateString("it-IT").replaceAll("/", ".")}
                      </div>
                    )}
                  </div>
                </div>
              )

              return (
                <Link
                  key={exhibit._id}
                  href={`/esibizioni-e-fiere/${exhibit.slug.current}`}
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
      <Footer language="it" footerText={settings?.footerText} />
    </div>
  )
}
