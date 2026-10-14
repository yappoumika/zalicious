require('dotenv/config')
const db = require('./db.js')

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function main() {
  await db.ensureSchema()

  const result = await db.execute("SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != ''")
  const categories = result.rows.map((r) => r.category)

  if (categories.length === 0) {
    console.log('No existing product categories to migrate.')
    return
  }

  await db.batch(
    categories.map((name, i) => ({
      sql: 'INSERT OR IGNORE INTO collections (name, slug, sort_order) VALUES (@name, @slug, @sort_order)',
      args: { name, slug: slugify(name), sort_order: i },
    })),
    'write'
  )

  console.log(`Migrated ${categories.length} existing categories into collections:`, categories)
}

main()
