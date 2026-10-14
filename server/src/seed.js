require('dotenv/config')
const db = require('./db.js')

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const products = [
  {
    name: "Neo's Pick — Wedding Cake",
    tier: 'Hybrid',
    category: 'Flower',
    price: 30,
    thc: '28.4%',
    weight: '3.5g',
    badge: "Neo's Pick",
    description: "This month's top pick. Only $30 for an eighth of Neo's top pick of the month.",
    image_url: '',
    featured: 1,
    sort_order: 0,
  },
  {
    name: 'Gelato #41',
    tier: 'Hybrid',
    category: 'Flower',
    price: 35,
    thc: '26.1%',
    weight: '3.5g',
    badge: '',
    description: 'California-grown premium THC flower with a sweet, creamy terpene profile.',
    image_url: '',
    featured: 1,
    sort_order: 1,
  },
  {
    name: 'Runtz',
    tier: 'Hybrid',
    category: 'Flower',
    price: 32,
    thc: '27.8%',
    weight: '3.5g',
    badge: 'Fire Deal',
    description: 'Fire deals on top-tier flower. Fruity, gassy, and smooth.',
    image_url: '',
    featured: 1,
    sort_order: 2,
  },
  {
    name: 'Blue Dream',
    tier: 'Sativa',
    category: 'Flower',
    price: 28,
    thc: '24.5%',
    weight: '3.5g',
    badge: '',
    description: 'Classic sativa-leaning hybrid with a smooth blueberry finish.',
    image_url: '',
    featured: 0,
    sort_order: 3,
  },
  {
    name: 'OG Kush',
    tier: 'Indica',
    category: 'Flower',
    price: 30,
    thc: '25.9%',
    weight: '3.5g',
    badge: '',
    description: 'Heavy-hitting indica with earthy pine and lemon notes.',
    image_url: '',
    featured: 0,
    sort_order: 4,
  },
  {
    name: 'High Elevation Pre-Roll Pack',
    tier: 'Hybrid',
    category: 'Pre-Rolls',
    price: 25,
    thc: '<.3% Δ9 THC',
    weight: '5-pack',
    badge: '',
    description: 'High Elevation. Fire quality pre-rolls at unbeatable prices.',
    image_url: '',
    featured: 0,
    sort_order: 5,
  },
]

async function main() {
  await db.ensureSchema()

  await db.batch(
    products.map((item) => ({
      sql: `
        INSERT OR IGNORE INTO products (name, slug, tier, category, price, thc, weight, badge, description, image_url, featured, sort_order)
        VALUES (@name, @slug, @tier, @category, @price, @thc, @weight, @badge, @description, @image_url, @featured, @sort_order)
      `,
      args: { ...item, slug: slugify(item.name) },
    })),
    'write'
  )

  console.log(`Seeded ${products.length} products.`)
}

main()