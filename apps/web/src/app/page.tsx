import { safeSanityFetch } from "@/lib/sanity.client"
import { SITE_SETTINGS_QUERY, SiteSettings } from "@/lib/queries"
import { Footer } from "@/components/Footer"
import dynamic from "next/dynamic"
import * as fs from "fs"
import * as path from "path"

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

function getCanvasImages(): CanvasImage[] {
  const manifestPath = path.join(process.cwd(), "public/canvas/manifest.json")
  try {
    const data = fs.readFileSync(manifestPath, "utf-8")
    const manifest: CanvasImage[] = JSON.parse(data)
    if (manifest.length > 0) {
      return manifest.map((img) => ({ ...img, url: `/${img.url}` }))
    }
  } catch {
    // manifest doesn't exist
  }

  return [
    { url: "https://picsum.photos/800/600?random=1", width: 800, height: 600 },
    { url: "https://picsum.photos/800/600?random=2", width: 800, height: 600 },
    { url: "https://picsum.photos/800/600?random=3", width: 800, height: 600 },
  ]
}

export default async function HomePage() {
  const settings = await getSiteSettings()
  const canvasImages = getCanvasImages()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <InfiniteCanvasHome media={canvasImages} />
      <Footer language="it" footerText={settings?.footerText} variant="home" />
    </div>
  )
}
