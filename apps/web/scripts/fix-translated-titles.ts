/**
 * Fix-up script: restore original Italian titles on auto-translated EN exhibition/fair docs.
 * Exhibition and fair names should NOT be translated.
 */
import { createClient } from "@sanity/client"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
const token = process.env.SANITY_API_TOKEN

if (!projectId) { console.error("❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID"); process.exit(1) }
if (!token) { console.error("❌ Missing SANITY_API_TOKEN"); process.exit(1) }

const client = createClient({ projectId, dataset, apiVersion: "2024-03-15", token, useCdn: false })

async function fixTitles(type: "exhibition" | "fair") {
  console.log(`\n📋 Fixing ${type} titles...`)
  const enDocs = await client.fetch(
    `*[_type == $type && language == "en" && defined(translationOf._ref)]{ _id, title, translationOf }`,
    { type }
  )
  console.log(`   Found ${enDocs.length} EN docs`)

  for (const enDoc of enDocs) {
    const itDoc = await client.fetch(
      `*[_id == $id][0]{ title }`,
      { id: enDoc.translationOf._ref }
    )
    if (!itDoc) { console.log(`   ⚠ IT doc not found for ${enDoc._id}`); continue }
    if (itDoc.title === enDoc.title) { console.log(`   ✓ ${enDoc._id} already correct`); continue }
    console.log(`   → ${enDoc._id}: "${enDoc.title}" → "${itDoc.title}"`)
    await client.patch(enDoc._id).set({ title: itDoc.title }).commit()
  }
}

async function main() {
  await fixTitles("exhibition")
  await fixTitles("fair")
  console.log("\n✅ Done!")
}

main().catch((err) => { console.error("❌", err); process.exit(1) })
