import { safeSanityFetch } from "@/lib/sanity.client"
import { SITE_SETTINGS_QUERY, HOME_CANVAS_IMAGES_QUERY, SiteSettings } from "@/lib/queries"
import { Footer } from "@/components/Footer"
import dynamic from "next/dynamic"

const InfiniteCanvasHome = dynamic(
  () => import("@/components/InfiniteCanvasHome").then((mod) => mod.InfiniteCanvasHome),
  { ssr: false }
)

export const revalidate = 60

interface CanvasImage {
  url: string
  width: number
  height: number
}

async function getSiteSettings(): Promise<SiteSettings | null> {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

async function getCanvasImages(): Promise<CanvasImage[]> {
  const images = await safeSanityFetch<CanvasImage[]>(HOME_CANVAS_IMAGES_QUERY, {}, { next: { revalidate: 60 } })
  const filtered = (images || []).filter((img) => img.url && img.width && img.height)

  if (!filtered.length) {
    return [
      { url: "https://picsum.photos/800/600?random=1", width: 800, height: 600 },
      { url: "https://picsum.photos/800/600?random=2", width: 800, height: 600 },
      { url: "https://picsum.photos/800/600?random=3", width: 800, height: 600 },
    ]
  }

  // Resize images for canvas use (512px width like reference demo)
  return filtered.map((img) => {
    const targetW = 512
    const scale = targetW / img.width
    return {
      url: `${img.url}?w=${targetW}&fm=webp&q=75`,
      width: targetW,
      height: Math.round(img.height * scale),
    }
  })
}

export default async function HomePage() {
  const [settings, canvasImages] = await Promise.all([getSiteSettings(), getCanvasImages()])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <InfiniteCanvasHome media={canvasImages} />
      <Footer language="it" footerText={settings?.footerText} variant="home" />
    </div>
  )
}
