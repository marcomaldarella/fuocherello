import { safeSanityFetch } from "@/lib/sanity.client"
import { EXHIBITIONS_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"
import { Footer } from "@/components/Footer"
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
}

async function getExhibitions(): Promise<Exhibition[]> {
  const result = await safeSanityFetch<Exhibition[]>(EXHIBITIONS_QUERY, { language: "it" }, { next: { revalidate: 60 } })
  return result || []
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function MostrePage() {
  const [rawExhibitions, settings] = await Promise.all([getExhibitions(), getSettings()])

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
          <div className="pointer-events-none" style={{ paddingTop: "2em", marginBottom: "2.5rem", minHeight: "5rem" }}>
            <h1 className="text-center text-[#0000ff] font-bold leading-[0.85] tracking-[-0.03em] text-[clamp(3.5rem,10vw,8rem)]">
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                M
              </span>
              <span className="lowercase">ostre</span>
            </h1>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: "10px", marginLeft: "10px", marginRight: "10px" }}
          >
            {exhibitions.map((exhibition, index) => {
              const isLast = index === exhibitions.length - 1
              const content = (
                <div className="w-full">
                  <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
                    <Image
                      src={
                        exhibition.featuredImage
                          ? urlFor(exhibition.featuredImage).width(1200).height(1200).fit("crop").url()
                          : `/placeholder.svg?height=800&width=800`
                      }
                      alt={exhibition.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="mt-2 w-full text-[#0000ff]  text-[12px] md:text-[13px] leading-tight" style={{ paddingTop: "1em" }}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="text-[16px] md:text-[17px] uppercase leading-[0.95] first-letter:italic whitespace-nowrap">
                        <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                          {exhibition.title?.[0] ?? ""}
                        </span>
                        <span className="lowercase">{exhibition.title?.slice(1) ?? ""}</span>
                      </h2>
                      {exhibition.authorName && (
                        <span>
                          <span className="opacity-70 mr-1">testo di</span>
                          {exhibition.authorName!.split(' ').map((word, i) => (
                            <span key={i}>
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
                    {(exhibition.dateStart || exhibition.dateEnd) && (
                      <div className="lowercase opacity-70">
                        {exhibition.dateStart && new Date(exhibition.dateStart).toLocaleDateString("it-IT")}
                        {exhibition.dateStart && exhibition.dateEnd && " - "}
                        {exhibition.dateEnd && new Date(exhibition.dateEnd).toLocaleDateString("it-IT")}
                      </div>
                    )}
                  </div>
                </div>
              )

              return (
                <Link
                  key={exhibition._id}
                  href={`/mostre/${exhibition.slug.current}`}
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
      <Footer language="it" footerText={settings?.footerText} />
    </div>
  )
}
