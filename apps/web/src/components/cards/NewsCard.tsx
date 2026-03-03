import Image from "next/image"
import { urlFor } from "@/lib/imageUrl"
import { StyledTitle } from "@/components/StyledTitle"

export interface NewsCardItem {
  _id: string
  title: string
  date?: string
  dateText?: string
  summaryLine?: string
  image?: any
  lqip?: string
  externalUrl?: string
}

interface NewsCardProps {
  item: NewsCardItem
  language: "it" | "en"
  index: number
  isLast?: boolean
}

export function NewsCard({ item, language, index, isLast }: NewsCardProps) {
  const locale = language === "it" ? "it-IT" : "en-US"

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
      <div className="mt-2 w-full text-[#0000ff] text-[12px] md:text-[13px] leading-tight" style={{ paddingTop: "1em", paddingBottom: "6px" }}>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-[16px] md:text-[17px] uppercase leading-[0.95] first-letter:italic whitespace-nowrap" style={{ paddingBottom: "4px" }}>
            <StyledTitle text={item.title} />
          </h2>
          {(item.date || item.dateText) && (
            <span className="lowercase opacity-70">
              {item.date ? new Date(item.date).toLocaleDateString(locale).replaceAll("/", ".") : item.dateText}
            </span>
          )}
        </div>
        {item.summaryLine && (
          <div className="opacity-70">
            <StyledTitle text={item.summaryLine} firstLetterMargin="0.02em" />
          </div>
        )}
      </div>
    </div>
  )

  if (item.externalUrl && /^https?:\/\//.test(item.externalUrl)) {
    return (
      <a
        href={item.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:opacity-90 transition-opacity"
        style={isLast ? { paddingBottom: "clamp(2em, 4vw, 3em)" } : undefined}
      >
        {content}
      </a>
    )
  }

  return (
    <div className="block" style={isLast ? { paddingBottom: "clamp(2em, 4vw, 3em)" } : undefined}>
      {content}
    </div>
  )
}
