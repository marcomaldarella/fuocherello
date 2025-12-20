import { urlFor } from "@/lib/imageUrl"
import Image from "next/image"
import Link from "next/link"

interface ArtistGalleryLayoutProps {
  name: string
  bio?: string
  gallery?: Array<{
    asset: any
    orientation?: string
    alt?: string
  }>
  pdfUrl?: string
  language: "it" | "en"
}

export function ArtistGalleryLayout({ name, bio, gallery, pdfUrl, language }: ArtistGalleryLayoutProps) {
  const isItalian = language === "it"

  // Separate square and horizontal images
  const squareImages = gallery?.filter((img) => img.orientation === "square").slice(0, 2) || []
  const horizontalImage = gallery?.find((img) => img.orientation === "horizontal")

  return (
    <div className="min-h-screen bg-white">
      {/* Header with name and bio - centered */}
      <div className="px-[10px] pt-[10vh] pb-[calc(var(--spacing)*10)] text-center">
        <h1 className="text-[#0000ff] font-black leading-[0.85] tracking-[-0.03em] text-[clamp(3.5rem,10vw,8rem)] mb-[calc(var(--spacing)*6)]">
          {name.split(' ').map((word, i) => (
            <span key={i}>
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                {word[0]}
              </span>
              <span className="lowercase">{word.slice(1)}</span>
              {i < name.split(' ').length - 1 && ' '}
            </span>
          ))}
        </h1>

        {bio && (
          <p className="text-[#0000ff] font-normal text-[14px] md:text-[16px] leading-[1.4] w-full px-[30%] mb-[calc(var(--spacing)*6)]">
            {bio}
          </p>
        )}

        {pdfUrl && (
          <div>
            <Link
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[#0000ff] font-black text-[12px] md:text-[14px] hover:opacity-70 transition-opacity"
            >
              <span className="italic inline-block" style={{ marginRight: "0.07em" }}>
                {isItalian ? "D" : "D"}
              </span>
              <span>{isItalian ? "ownload portfolio" : "ownload portfolio"}</span>
              <span className="ml-2" style={{ fontFamily: "Inter, sans-serif", fontFeatureSettings: '"liga" 1, "calt" 1', fontVariantLigatures: "contextual" }}>↘</span>
            </Link>
          </div>
        )}
      </div>

      {/* Gallery - 2 square images side by side */}
      {squareImages.length > 0 && (
        <div className="px-[10px] mb-[10px]">
          <div className="grid grid-cols-2 gap-0">
            {squareImages.map((img, idx) => (
              <div key={idx} className="relative w-full aspect-square bg-muted overflow-hidden">
                <Image
                  src={urlFor(img.asset).width(1200).height(1200).fit("crop").url()}
                  alt={img.alt || `${name} artwork ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Horizontal image full width */}
      {horizontalImage && (
        <div className="px-[10px] mb-[10px]">
          <div className="relative w-full aspect-[16/9] bg-muted overflow-hidden">
            <Image
              src={urlFor(horizontalImage.asset).width(1920).height(1080).fit("crop").url()}
              alt={horizontalImage.alt || `${name} horizontal artwork`}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      )}

      {/* Back link - centered */}
      <div className="px-[10px] py-[calc(var(--spacing)*10)] text-center">
        <Link
          href={isItalian ? "/artisti" : "/en/artists"}
          className="text-[#0000ff] font-black text-[12px] md:text-[14px] hover:opacity-70 transition-opacity"
        >
          <span style={{ fontFamily: "Inter, sans-serif", fontFeatureSettings: '"liga" 1, "calt" 1', fontVariantLigatures: "contextual" }}>←</span> {isItalian ? "Torna agli artisti" : "Back to artists"}
        </Link>
      </div>
    </div>
  )
}
