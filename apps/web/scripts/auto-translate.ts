/**
 * Auto-translate Italian Sanity documents to English using Claude API.
 *
 * Required env vars:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID  – Sanity project ID
 *   NEXT_PUBLIC_SANITY_DATASET     – Sanity dataset (default: production)
 *   SANITY_API_TOKEN               – Sanity write token (sanity.io/manage → API → Tokens)
 *   ANTHROPIC_API_KEY              – Anthropic API key (console.anthropic.com)
 *
 * Usage:
 *   pnpm tsx scripts/auto-translate.ts
 *   pnpm tsx scripts/auto-translate.ts --dry-run   (preview without writing)
 */

import { createClient } from "@sanity/client"

const DRY_RUN = process.argv.includes("--dry-run")

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
const token = process.env.SANITY_API_TOKEN
const anthropicKey = process.env.ANTHROPIC_API_KEY

if (!projectId) { console.error("❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID"); process.exit(1) }
if (!token) { console.error("❌ Missing SANITY_API_TOKEN"); process.exit(1) }
if (!anthropicKey) { console.error("❌ Missing ANTHROPIC_API_KEY"); process.exit(1) }

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-03-15",
  token,
  useCdn: false,
})

// ─── Translation helpers ─────────────────────────────────────────────────────

async function translateText(text: string): Promise<string> {
  if (!text?.trim()) return text
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": anthropicKey!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{
        role: "user",
        content: `You are a professional translator specialising in art and culture. Translate the following Italian text to English. Return ONLY the translated text with no explanation:\n\n${text}`,
      }],
    }),
  })
  if (!response.ok) throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`)
  const data = await response.json() as any
  return data.content[0].text.trim()
}

/** Translate Portable Text blocks (Sanity rich text) */
async function translateBlocks(blocks: any[]): Promise<any[]> {
  if (!Array.isArray(blocks)) return blocks
  const result: any[] = []
  for (const block of blocks) {
    if (block._type === "block" && Array.isArray(block.children)) {
      const children = await Promise.all(
        block.children.map(async (child: any) =>
          child._type === "span" && child.text?.trim()
            ? { ...child, text: await translateText(child.text) }
            : child
        )
      )
      result.push({ ...block, children })
    } else {
      result.push(block)
    }
    await delay(300)
  }
  return result
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Get set of Italian _ids that already have an English translation */
async function translatedItIds(type: string): Promise<Set<string>> {
  const docs = await client.fetch<Array<{ ref: string }>>(
    `*[_type == $type && language == "en" && defined(translationOf._ref)]{ "ref": translationOf._ref }`,
    { type }
  )
  return new Set(docs.map((d) => d.ref))
}

async function upsert(doc: any) {
  if (DRY_RUN) {
    console.log(`   [dry-run] would create/replace: ${doc._id}`)
    return
  }
  await client.createOrReplace(doc)
}

// ─── Per-type translation functions ─────────────────────────────────────────

async function translateArtists() {
  console.log("\n📋 Artists")
  const already = await translatedItIds("artist")
  const itDocs = await client.fetch(
    `*[_type == "artist" && language == "it"]{ _id, title, slug, bio, authorName, gallery, pdfFile, featuredImage }`
  )
  const todo = itDocs.filter((d: any) => !already.has(d._id))
  console.log(`   ${todo.length} to translate (${itDocs.length - todo.length} already done)`)

  for (const doc of todo) {
    console.log(`   → ${doc.title}`)
    const enDoc: any = {
      _id: `${doc._id}-en`,
      _type: "artist",
      language: "en",
      translationOf: { _type: "reference", _ref: doc._id },
      slug: doc.slug,              // same slug — detail page falls back correctly
      title: doc.title,            // artist name — do NOT translate
      authorName: doc.authorName,  // author name — do NOT translate
      gallery: doc.gallery,
      pdfFile: doc.pdfFile,
      featuredImage: doc.featuredImage,
      translationMeta: { source: "auto-translate", lastAutoTranslatedAt: new Date().toISOString() },
    }
    if (doc.bio) enDoc.bio = await translateText(doc.bio)
    await upsert(enDoc)
    await delay(500)
  }
}

async function translateExhibitions() {
  console.log("\n📋 Exhibitions")
  const already = await translatedItIds("exhibition")
  const itDocs = await client.fetch(
    `*[_type == "exhibition" && language == "it"]{ _id, title, slug, artistsLine, authorName, dateStart, dateEnd, status, featuredImage, gallery, body }`
  )
  const todo = itDocs.filter((d: any) => !already.has(d._id))
  console.log(`   ${todo.length} to translate (${itDocs.length - todo.length} already done)`)

  for (const doc of todo) {
    console.log(`   → ${doc.title}`)
    const enDoc: any = {
      _id: `${doc._id}-en`,
      _type: "exhibition",
      language: "en",
      translationOf: { _type: "reference", _ref: doc._id },
      slug: doc.slug,
      artistsLine: doc.artistsLine,  // list of names — do NOT translate
      authorName: doc.authorName,    // author name — do NOT translate
      dateStart: doc.dateStart,
      dateEnd: doc.dateEnd,
      status: doc.status,
      featuredImage: doc.featuredImage,
      gallery: doc.gallery,
      translationMeta: { source: "auto-translate", lastAutoTranslatedAt: new Date().toISOString() },
    }
    if (doc.title) enDoc.title = await translateText(doc.title)
    if (doc.body) enDoc.body = await translateBlocks(doc.body)
    await upsert(enDoc)
    await delay(500)
  }
}

async function translateFairs() {
  console.log("\n📋 Fairs")
  const already = await translatedItIds("fair")
  const itDocs = await client.fetch(
    `*[_type == "fair" && language == "it"]{ _id, title, slug, venue, artistsLine, authorName, dateStart, dateEnd, status, featuredImage, gallery, body }`
  )
  const todo = itDocs.filter((d: any) => !already.has(d._id))
  console.log(`   ${todo.length} to translate (${itDocs.length - todo.length} already done)`)

  for (const doc of todo) {
    console.log(`   → ${doc.title}`)
    const enDoc: any = {
      _id: `${doc._id}-en`,
      _type: "fair",
      language: "en",
      translationOf: { _type: "reference", _ref: doc._id },
      slug: doc.slug,
      artistsLine: doc.artistsLine,
      authorName: doc.authorName,
      dateStart: doc.dateStart,
      dateEnd: doc.dateEnd,
      status: doc.status,
      featuredImage: doc.featuredImage,
      gallery: doc.gallery,
      translationMeta: { source: "auto-translate", lastAutoTranslatedAt: new Date().toISOString() },
    }
    if (doc.title) enDoc.title = await translateText(doc.title)
    if (doc.venue) enDoc.venue = await translateText(doc.venue)
    if (doc.body) enDoc.body = await translateBlocks(doc.body)
    await upsert(enDoc)
    await delay(500)
  }
}

async function translateNews() {
  console.log("\n📋 News")
  const already = await translatedItIds("newsItem")
  const itDocs = await client.fetch(
    `*[_type == "newsItem" && language == "it"]{ _id, title, date, summaryLine, image, externalUrl }`
  )
  const todo = itDocs.filter((d: any) => !already.has(d._id))
  console.log(`   ${todo.length} to translate (${itDocs.length - todo.length} already done)`)

  for (const doc of todo) {
    console.log(`   → ${doc.title}`)
    const enDoc: any = {
      _id: `${doc._id}-en`,
      _type: "newsItem",
      language: "en",
      translationOf: { _type: "reference", _ref: doc._id },
      date: doc.date,
      image: doc.image,
      externalUrl: doc.externalUrl,
      translationMeta: { source: "auto-translate", lastAutoTranslatedAt: new Date().toISOString() },
    }
    if (doc.title) enDoc.title = await translateText(doc.title)
    if (doc.summaryLine) enDoc.summaryLine = await translateText(doc.summaryLine)
    await upsert(enDoc)
    await delay(500)
  }
}

async function translateAboutPage() {
  console.log("\n📋 About page")
  const itDoc = await client.fetch(`*[_type == "aboutPage" && _id == "aboutPage-it"][0]{ _id, body, image }`)
  if (!itDoc) { console.log("   not found, skipping"); return }
  const existing = await client.fetch(`*[_type == "aboutPage" && _id == "aboutPage-en"][0]{ _id }`)
  if (existing && !DRY_RUN) { console.log("   already exists, skipping"); return }

  const enDoc: any = {
    _id: "aboutPage-en",
    _type: "aboutPage",
    language: "en",
    translationOf: { _type: "reference", _ref: "aboutPage-it" },
    image: itDoc.image,
  }
  if (itDoc.body) enDoc.body = await translateBlocks(itDoc.body)
  await upsert(enDoc)
}

async function translateContactPage() {
  console.log("\n📋 Contact page")
  const itDoc = await client.fetch(`*[_type == "contactPage" && _id == "contactPage-it"][0]{ _id, body }`)
  if (!itDoc) { console.log("   not found, skipping"); return }
  const existing = await client.fetch(`*[_type == "contactPage" && _id == "contactPage-en"][0]{ _id }`)
  if (existing && !DRY_RUN) { console.log("   already exists, skipping"); return }

  const enDoc: any = {
    _id: "contactPage-en",
    _type: "contactPage",
    language: "en",
    translationOf: { _type: "reference", _ref: "contactPage-it" },
  }
  if (itDoc.body) enDoc.body = await translateBlocks(itDoc.body)
  await upsert(enDoc)
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`🌍 Auto-translate IT → EN${DRY_RUN ? " [DRY RUN]" : ""}`)
  console.log(`   Project: ${projectId} / ${dataset}`)

  await translateArtists()
  await translateExhibitions()
  await translateFairs()
  await translateNews()
  await translateAboutPage()
  await translateContactPage()

  console.log("\n✅ Done!")
}

main().catch((err) => { console.error("❌", err); process.exit(1) })
