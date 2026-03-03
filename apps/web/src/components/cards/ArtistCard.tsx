import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/lib/imageUrl"
import { StyledTitle } from "@/components/StyledTitle"

export interface ArtistCardItem {
  _id: string
  title: string
  slug: { current: string }
  featuredImage?: any
  lqip?: string
  birthYear?: number
  nationality?: string
}

interface ArtistCardProps {
  item: ArtistCardItem
  href: string
  isLast?: boolean
}

export function ArtistCard({ item, href, isLast }: ArtistCardProps) {
  return (
    <Link
      href={href}
      className="block hover:opacity-90 transition-opacity"
      style={isLast ? { paddingBottom: "clamp(2em, 4vw, 3em)" } : undefined}
    >
      <div className="w-full">
        <div className="relative w-full aspect-square bg-muted overflow-hidden">
          <Image
            src={
              item.featuredImage
                ? urlFor(item.featuredImage).width(800).height(800).fit("crop").url() || "/placeholder.svg"
                : `/placeholder.svg?height=800&width=800`
            }
            alt={item.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            {...(item.lqip ? { placeholder: "blur" as const, blurDataURL: item.lqip } : {})}
          />
        </div>
        <div className="mt-2 w-full text-[#0000ff] text-[12px] md:text-[13px] leading-tight" style={{ paddingTop: "1em", paddingBottom: "6px" }}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-[16px] md:text-[17px] uppercase leading-[0.95] min-w-0" style={{ paddingBottom: "4px" }}>
              <StyledTitle text={item.title} firstLetterMargin="0.02em" />
            </h2>
          </div>
          {item.birthYear && <div className="lowercase opacity-70">{item.birthYear}</div>}
          {item.nationality && <div className="lowercase opacity-70">{item.nationality}</div>}
        </div>
      </div>
    </Link>
  )
}
