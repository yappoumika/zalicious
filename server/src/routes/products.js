const { Router } = require('express')
const db = require('../db.js')
const { requireAdmin } = require('../auth.js')
const { upload, storeUploadedFile } = require('../upload.js')

const router = Router()

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function serialize(row) {
  return {
    ...row,
    featured: !!row.featured,
    in_stock: !!row.in_stock,
  }
}

// Public: list products
router.get('/', async (req, res) => {
  const { category, featured } = req.query
  let sql = 'SELECT * FROM products WHERE 1=1'
  const args = []

  if (category) {
    sql += ' AND category = ?'
    args.push(category)
  }
  if (featured === 'true') {
    sql += ' AND featured = 1'
  }
  sql += ' ORDER BY sort_order ASC, created_at DESC'

  const result = await db.execute({ sql, args })
  res.json(result.rows.map(serialize))
})

// Public: get single product
router.get('/:slug', async (req, res) => {
  const result = await db.execute({ sql: 'SELECT * FROM products WHERE slug = ?', args: [req.params.slug] })
  const row = result.rows[0]
  if (!row) return res.status(404).json({ error: 'Product not found' })
  res.json(serialize(row))
})

// Admin: create product
router.post('/', requireAdmin, async (req, res) => {
  const { name, tier, category, price, thc, weight, badge, description, image_url, featured, in_stock, sort_order } = req.body

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' })
  }

  let slug = slugify(name)
  const existing = await db.execute({ sql: 'SELECT id FROM products WHERE slug = ?', args: [slug] })
  if (existing.rows[0]) slug = `${slug}-${Date.now()}`

  const info = await db.execute({
    sql: `
      INSERT INTO products (name, slug, tier, category, price, thc, weight, badge, description, image_url, featured, in_stock, sort_order)
      VALUES (@name, @slug, @tier, @category, @price, @thc, @weight, @badge, @description, @image_url, @featured, @in_stock, @sort_order)
    `,
    args: {
      name,
      slug,
      tier: tier || 'Hybrid',
      category: category || 'Flower',
      price: Number(price) || 0,
      thc: thc || '',
      weight: weight || '3.5g',
      badge: badge || '',
      description: description || '',
      image_url: image_url || '',
      featured: featured ? 1 : 0,
      in_stock: in_stock === false ? 0 : 1,
      sort_order: Number(sort_order) || 0,
    },
  })

  const result = await db.execute({ sql: 'SELECT * FROM products WHERE id = ?', args: [Number(info.lastInsertRowid)] })
  res.status(201).json(serialize(result.rows[0]))
})

// Admin: update product
router.put('/:id', requireAdmin, async (req, res) => {
  const existingResult = await db.execute({ sql: 'SELECT * FROM products WHERE id = ?', args: [req.params.id] })
  const existing = existingResult.rows[0]
  if (!existing) return res.status(404).json({ error: 'Product not found' })

  const { name, tier, category, price, thc, weight, badge, description, image_url, featured, in_stock, sort_order } = req.body

  await db.execute({
    sql: `
      UPDATE products SET
        name = @name, tier = @tier, category = @category, price = @price,
        thc = @thc, weight = @weight, badge = @badge, description = @description,
        image_url = @image_url, featured = @featured, in_stock = @in_stock, sort_order = @sort_order
      WHERE id = @id
    `,
    args: {
      id: req.params.id,
      name: name ?? existing.name,
      tier: tier ?? existing.tier,
      category: category ?? existing.category,
      price: price !== undefined ? Number(price) : existing.price,
      thc: thc ?? existing.thc,
      weight: weight ?? existing.weight,
      badge: badge ?? existing.badge,
      description: description ?? existing.description,
      image_url: image_url ?? existing.image_url,
      featured: featured !== undefined ? (featured ? 1 : 0) : existing.featured,
      in_stock: in_stock !== undefined ? (in_stock ? 1 : 0) : existing.in_stock,
      sort_order: sort_order !== undefined ? Number(sort_order) : existing.sort_order,
    },
  })

  const result = await db.execute({ sql: 'SELECT * FROM products WHERE id = ?', args: [req.params.id] })
  res.json(serialize(result.rows[0]))
})

// Admin: delete product
router.delete('/:id', requireAdmin, async (req, res) => {
  const info = await db.execute({ sql: 'DELETE FROM products WHERE id = ?', args: [req.params.id] })
  if (info.rowsAffected === 0) return res.status(404).json({ error: 'Product not found' })
  res.status(204).end()
})

// Admin: upload media (image), returns a URL to use as image_url
router.post('/upload', requireAdmin, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  try {
    const url = await storeUploadedFile(req.file)
    res.status(201).json({ url })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Upload failed' })
  }
})

module.exports = router
