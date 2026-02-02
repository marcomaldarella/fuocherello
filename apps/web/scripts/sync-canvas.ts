import { createClient } from "@sanity/client"
import * as fs from "fs"
import * as path from "path"

const HOME_CANVAS_IMAGES_QUERY = `*[_type in ["exhibition", "fair"] && language == "it" && defined(gallery)]{
  gallery[]{
    "url": image.asset->url,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  }
}.gallery[]`

interface CanvasImage {
  url: string
  width: number
  height: number
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-03-15"

  if (!projectId) {
    console.error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set")
    process.exit(1)
  }

  const client = createClient({ projectId, dataset, apiVersion, useCdn: true })

  console.log("Fetching canvas images from Sanity...")
  const images = await client.fetch<CanvasImage[]>(HOME_CANVAS_IMAGES_QUERY)
  const filtered = (images || []).filter((img) => img.url && img.width && img.height).slice(0, 30)

  if (!filtered.length) {
    console.error("No images found")
    process.exit(1)
  }

  console.log(`Found ${filtered.length} images`)

  const outDir = path.resolve(__dirname, "../public/canvas")
  fs.mkdirSync(outDir, { recursive: true })

  const manifest: { url: string; width: number; height: number }[] = []

  for (let i = 0; i < filtered.length; i++) {
    const img = filtered[i]
    const targetW = 512
    const scale = targetW / img.width
    const targetH = Math.round(img.height * scale)
    const fetchUrl = `${img.url}?w=${targetW}&auto=format&q=75&fm=jpg`

    const filename = `img-${String(i).padStart(3, "0")}.jpg`
    const filePath = path.join(outDir, filename)

    console.log(`Downloading ${i + 1}/${filtered.length}: ${filename}`)
    const res = await fetch(fetchUrl)
    if (!res.ok) {
      console.warn(`  Failed to download: ${res.status}`)
      continue
    }

    const buffer = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(filePath, buffer)

    manifest.push({ url: `canvas/${filename}`, width: targetW, height: targetH })
  }

  const manifestPath = path.join(outDir, "manifest.json")
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(`Done! ${manifest.length} images saved, manifest at ${manifestPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
