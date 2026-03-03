import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/lib/imageUrl"
import { StyledTitle } from "@/components/StyledTitle"

export interface ExhibitCardItem {
  _id: string
  title: string
  slug: { current: string }
  venue?: string
  artistsLine?: string
  authorName?: string
  dateStart?: string
  dateEnd?: string
  featuredImage?: any
  lqip?: string
}

interface ExhibitCardProps {
  item: ExhibitCardItem
  href: string
  language: "it" | "en"
  isLast?: boolean
}

export function ExhibitCard({ item, href, language, isLast }: ExhibitCardProps) {
  const locale = language === "it" ? "it-IT" : "en-US"
  const textBy = language === "it" ? "testo di" : "text by"

  const content = (
    <div className="w-full">
      <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
        <Image
          src={
            item.featuredImage
              ? urlFor(item.featuredImage).width(1200).height(900).fit("crop").url() || "/placeholder.svg"
              : `/placeholder.svg?height=900&width=1200`
          }
          alt={item.title}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
          {...(item.lqip ? { placeholder: "blur" as const, blurDataURL: item.lqip } : {})}
        />
      </div>
      <div className="mt-2 w-full text-[#0000ff] text-[12px] md:text-[13px] leading-tight" style={{ paddingTop: "1em", paddingBottom: "6px" }}>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-[16px] md:text-[17px] uppercase leading-[0.95] first-letter:italic min-w-0" style={{ paddingBottom: "4px" }}>
            <StyledTitle text={item.title} />
          </h2>
          {item.authorName && (
            <span className="whitespace-nowrap shrink-0">
              <span className="opacity-70" style={{ marginRight: "1em" }}>{textBy}</span>
              <StyledTitle text={item.authorName} firstLetterMargin="0.02em" />
            </span>
          )}
        </div>
        {item.venue && (
          <div className="opacity-70">
            <StyledTitle text={item.venue} firstLetterMargin="0.02em" />
          </div>
        )}
        {item.artistsLine && (
          <div className="opacity-70">
            {item.artistsLine.split(/,| e | and /).map((name, i, arr) => (
              <span key={i}>
                <StyledTitle text={name.trim()} firstLetterMargin="0.02em" />
                {i < arr.length - 1 && ", "}
              </span>
            ))}
          </div>
        )}
        {(item.dateStart || item.dateEnd) && (
          <div className="lowercase opacity-70">
            {item.dateStart && new Date(item.dateStart).toLocaleDateString(locale).replaceAll("/", ".")}
            {item.dateStart && item.dateEnd && " - "}
            {item.dateEnd && new Date(item.dateEnd).toLocaleDateString(locale).replaceAll("/", ".")}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <Link
      href={href}
      className="block overflow-hidden hover:opacity-90 transition-opacity"
      style={isLast ? { paddingBottom: "clamp(2em, 4vw, 3em)" } : undefined}
    >
      {content}
    </Link>
  )
}
