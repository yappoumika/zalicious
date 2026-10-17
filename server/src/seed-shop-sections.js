require('dotenv/config')
const db = require('./db.js')

// The sections shown on the Shop Now page, in order. Each one is a collection,
// so they can be renamed, reordered or added to from Admin → Collections.
const sections = [
  { name: 'Infused Prerolls', slug: 'infused-prerolls', description: 'Pre-rolls boosted with concentrate for a heavier hit.' },
  { name: 'Dispo Carts', slug: 'dispo-carts', description: 'Disposable vapes, ready to go out of the box.' },
  { name: 'Edibles', slug: 'edibles', description: 'Gummies, chocolates and more. Start low, go slow.' },
  { name: '3.5 - Zips', slug: '3-5-zips', description: 'Top-shelf flower from an eighth up to a full zip.' },
  { name: 'Lows', slug: 'lows', description: 'Budget-friendly flower that still gets the job done.' },
]

async function main() {
  await db.ensureSchema()

  await db.batch(
    sections.map((section, i) => ({
      sql: `INSERT OR IGNORE INTO collections (name, slug, description, sort_order)
            VALUES (@name, @slug, @description, @sort_order)`,
      args: { ...section, sort_order: i },
    })),
    'write'
  )

  // Existing 3.5g flower belongs in the 3.5 - Zips section.
  const moved = await db.execute("UPDATE products SET category = '3.5 - Zips' WHERE category = 'Flower'")

  console.log(`Seeded ${sections.length} shop sections; moved ${moved.rowsAffected} flower products into 3.5 - Zips.`)
}

main()
