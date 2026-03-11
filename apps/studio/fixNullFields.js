/**
 * Fix Null Fields Migration Script
 *
 * Patches documents that have null values in fields that expect
 * array or object types (causing "Invalid property value" errors in Studio).
 *
 * Usage:
 *   export SANITY_TOKEN="your-editor-token"
 *   node fixNullFields.js
 *
 * Token: https://sanity.io/manage → project → API → Tokens → Editor
 */

const { createClient } = require('@sanity/client')

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'ph2q37z2'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_TOKEN

if (!token) {
  console.error('❌ Error: SANITY_TOKEN environment variable is required')
  console.log('\nSteps:')
  console.log('1. Go to https://sanity.io/manage')
  console.log('2. Select the project')
  console.log('3. Go to API → Tokens → Add API token (Editor permissions)')
  console.log('4. Run: export SANITY_TOKEN="your-token"')
  console.log('5. Run this script again\n')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-03-15',
  useCdn: false,
})

// Fields that must be arrays — fix null → unset
const ARRAY_FIELDS = ['gallery', 'body']

// Fields that must be objects/images — fix null → unset
const IMAGE_FIELDS = ['featuredImage', 'image']

// Document types to check
const DOC_TYPES = ['exhibit', 'exhibition', 'fair', 'artist', 'newsItem', 'aboutPage', 'contactPage', 'siteSettings']

async function fixNullFields() {
  let totalFixed = 0
  let totalErrors = 0

  for (const docType of DOC_TYPES) {
    console.log(`\n🔍 Checking "${docType}" documents...`)

    // Fetch all documents of this type and filter in JS
    // (GROQ can't distinguish null from missing with defined())
    const allFields = [...ARRAY_FIELDS, ...IMAGE_FIELDS]
    const query = `*[_type == $type]{ _id, _type, ${allFields.join(', ')} }`

    const docs = await client.fetch(query, { type: docType })

    const docsToFix = docs.filter(doc =>
      allFields.some(field => Object.prototype.hasOwnProperty.call(doc, field) && doc[field] === null)
    )

    if (docsToFix.length === 0) {
      console.log(`   ✅ No issues found`)
      continue
    }

    console.log(`   ⚠️  Found ${docsToFix.length} document(s) with null fields`)

    for (const doc of docsToFix) {
      const fieldsToUnset = []

      for (const field of allFields) {
        if (Object.prototype.hasOwnProperty.call(doc, field) && doc[field] === null) {
          fieldsToUnset.push(field)
        }
      }

      if (fieldsToUnset.length === 0) continue

      try {
        await client
          .patch(doc._id)
          .unset(fieldsToUnset)
          .commit({ autoGenerateArrayKeys: true })

        console.log(`   ✅ Fixed doc ${doc._id}: unset [${fieldsToUnset.join(', ')}]`)
        totalFixed++
      } catch (err) {
        console.error(`   ❌ Error fixing ${doc._id}:`, err.message)
        totalErrors++
      }
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📋 Summary:')
  console.log(`✅ Documents fixed: ${totalFixed}`)
  console.log(`❌ Errors: ${totalErrors}`)
}

fixNullFields()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('\n💥 Script failed:', err)
    process.exit(1)
  })
