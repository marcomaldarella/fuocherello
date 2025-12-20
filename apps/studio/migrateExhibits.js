/**
 * Migration Script: Exhibit → Exhibition/Fair
 * 
 * This script migrates documents from the old unified "exhibit" schema
 * to the new separate "exhibition" and "fair" schemas.
 * 
 * Usage:
 * 1. Set your Sanity token: export SANITY_TOKEN="your-token-here"
 * 2. Run: node migrateExhibits.js
 * 
 * To get a token:
 * - Go to https://sanity.io/manage
 * - Select your project
 * - Go to API → Tokens
 * - Create a token with "Editor" permissions
 */

const { createClient } = require('@sanity/client')

// Read config from environment or use defaults
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id-here'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_TOKEN

if (!token) {
  console.error('❌ Error: SANITY_TOKEN environment variable is required')
  console.log('\nTo create a token:')
  console.log('1. Go to https://sanity.io/manage')
  console.log('2. Select your project')
  console.log('3. Go to API → Tokens')
  console.log('4. Create a token with "Editor" permissions')
  console.log('5. Run: export SANITY_TOKEN="your-token-here"')
  console.log('6. Run this script again\n')
  process.exit(1)
}

console.log(`📡 Connecting to Sanity project: ${projectId}`)
console.log(`📊 Dataset: ${dataset}\n`)

// Initialize Sanity client
const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function migrateExhibits() {
  console.log('🔍 Fetching all exhibit documents...')
  
  // Fetch all exhibit documents
  const exhibits = await client.fetch(`*[_type == "exhibit"]`)
  
  console.log(`📊 Found ${exhibits.length} exhibit documents to migrate\n`)
  
  const results = {
    exhibitions: 0,
    fairs: 0,
    errors: 0,
  }
  
  for (const exhibit of exhibits) {
    try {
      const { _id, _type, type, ...fields } = exhibit
      
      // Determine new document type
      const newType = type === 'fair' ? 'fair' : 'exhibition'
      
      // Create new document
      const newDoc = {
        _type: newType,
        ...fields,
        // Remove the old "type" field as it's no longer needed
      }
      
      console.log(`📝 Migrating: "${fields.title}" (${fields.language}) → ${newType}`)
      
      // Create the new document
      await client.create(newDoc)
      
      if (newType === 'exhibition') {
        results.exhibitions++
      } else {
        results.fairs++
      }
      
      console.log(`   ✅ Created new ${newType} document\n`)
      
    } catch (error) {
      console.error(`   ❌ Error migrating ${exhibit.title}:`, error.message, '\n')
      results.errors++
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('📋 Migration Summary:')
  console.log('='.repeat(50))
  console.log(`✅ Exhibitions created: ${results.exhibitions}`)
  console.log(`✅ Fairs created: ${results.fairs}`)
  console.log(`❌ Errors: ${results.errors}`)
  console.log('\n⚠️  Old "exhibit" documents still exist.')
  console.log('   Review the new documents in Sanity Studio before deleting them.')
}

// Run migration
migrateExhibits()
  .then(() => {
    console.log('\n✨ Migration complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error)
    process.exit(1)
  })
