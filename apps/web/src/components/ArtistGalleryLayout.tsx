import { urlFor } from "@/lib/imageUrl"
import Image from "next/image"
import Link from "next/link"

interface ArtistGalleryLayoutProps {
  name: string
  bio?: string
  authorName?: string
  gallery?: Array<{
    asset: any
    orientation?: string
    alt?: string
  }>
  pdfUrl?: string
  language: "it" | "en"
}

export function ArtistGalleryLayout({ name, bio, authorName, gallery, pdfUrl, language }: ArtistGalleryLayoutProps) {
  const isItalian = language === "it"

  // Separate square and horizontal images
  let squareImages = gallery?.filter((img) => img.orientation === "square" && img.asset).slice(0, 2) || []
  let horizontalImage = gallery?.find((img) => img.orientation === "horizontal" && img.asset)

  // Fallback: if orientations are not set, take first two as square and third as horizontal
  if (!squareImages.length && (!horizontalImage)) {
    const fallback = (gallery || []).filter((g) => g.asset).slice(0, 3)
    squareImages = fallback.slice(0, 2)
    horizontalImage = fallback[2] ?? fallback[0]
  }

  return (
    <div className="min-h-screen bg-white pt-16 md:pt-0">
      {/* Header with name and bio - centered */}
      <div className="w-full px-6 md:px-12 lg:px-[12%] xl:px-[15%] pt-32 md:pt-40 pb-[calc(var(--spacing)*12)] text-center flex flex-col items-center">
        <h1
          className="text-[#0000ff] font-bold leading-[0.85] tracking-[-0.03em] text-[clamp(3.5rem,10vw,8rem)] mb-[calc(var(--spacing)*8)] pt-[1em] max-w-5xl mx-auto"
          style={{ paddingTop: "1em" }}
        >
          {name.split(' ').filter(Boolean).map((word, i, arr) => (
            <span
              key={i}
              className="inline-block whitespace-nowrap"
              style={{ marginRight: i < arr.length - 1 ? "0.28em" : 0 }}
            >
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
                {word[0]}
              </span>
              <span className="lowercase">{word.slice(1)}</span>
            </span>
          ))}
        </h1>

        {bio && (
          <div className="text-[#0000ff] font-normal text-[14px] md:text-[16px] leading-[1.6] w-full mb-[calc(var(--spacing)*8)] px-6 md:px-10 lg:px-12 flex justify-center" style={{ paddingTop: "1.4em", paddingBottom: "1em" }}>
            <div className="max-w-3xl md:max-w-4xl w-full text-center flex flex-col items-center">
              <p className="mb-4 text-center">{bio}</p>
              {authorName && (
                <p className="text-[12px] md:text-[13px] opacity-70 flex items-center justify-center">
                  {authorName.split(' ').map((word, i) => (
                    <span key={i}>
                      <span className="italic uppercase inline-block" style={{ marginRight: "0.04em" }}>
                        {word[0]}
                      </span>
                      <span className="lowercase">{word.slice(1)}</span>
                      {i < authorName.split(' ').length - 1 && ' '}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>
        )}

        {pdfUrl && (
          <div className="mt-4" style={{ paddingBottom: "1em" }}>
            <Link
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#0000ff] text-[12px] md:text-[14px] hover:opacity-80 transition-all"
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.5)",
                boxShadow: "0 4px 30px rgba(0,0,0,0.08)",
                padding: "10px 16px",
                borderRadius: "12px"
              }}
            >
              <span className="italic inline-block" style={{ marginRight: "0.02em" }}>
                {isItalian ? "S" : "D"}
              </span>
              <span style={{ marginLeft: "0.1em", marginRight: "0.2em" }}>{isItalian ? "carica portfolio" : "ownload portfolio"}</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontFeatureSettings: '"liga" 1, "calt" 1', fontVariantLigatures: "contextual" }}>↘</span>
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
          className="text-[#0000ff]  text-[12px] md:text-[14px] hover:opacity-70 transition-opacity"
        >
          <span style={{ fontFamily: "Inter, sans-serif", fontFeatureSettings: '"liga" 1, "calt" 1', fontVariantLigatures: "contextual" }}>←</span>{' '}
          {isItalian ? (
            <>
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>T</span>
              <span className="lowercase">orna agli artisti</span>
            </>
          ) : (
            <>
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>B</span>
              <span className="lowercase">ack to artists</span>
            </>
          )}
        </Link>
      </div>
    </div>
  )
}
