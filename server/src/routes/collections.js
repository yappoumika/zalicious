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

// Public: list collections, each with a live product count
router.get('/', async (req, res) => {
  const result = await db.execute(`
    SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category = c.name) AS product_count
    FROM collections c
    ORDER BY c.sort_order ASC, c.name ASC
  `)
  res.json(result.rows)
})

// Admin: create collection
router.post('/', requireAdmin, async (req, res) => {
  const { name, description, image_url, sort_order } = req.body

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' })
  }

  let slug = slugify(name)
  const existingSlug = await db.execute({ sql: 'SELECT id FROM collections WHERE slug = ?', args: [slug] })
  if (existingSlug.rows[0]) slug = `${slug}-${Date.now()}`

  try {
    const info = await db.execute({
      sql: `INSERT INTO collections (name, slug, description, image_url, sort_order)
            VALUES (@name, @slug, @description, @image_url, @sort_order)`,
      args: {
        name: name.trim(),
        slug,
        description: description || '',
        image_url: image_url || '',
        sort_order: Number(sort_order) || 0,
      },
    })
    const result = await db.execute({ sql: 'SELECT * FROM collections WHERE id = ?', args: [Number(info.lastInsertRowid)] })
    res.status(201).json({ ...result.rows[0], product_count: 0 })
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) {
      return res.status(400).json({ error: 'A collection with that name already exists.' })
    }
    throw err
  }
})

// Admin: update collection (renaming re-tags any products using the old name)
router.put('/:id', requireAdmin, async (req, res) => {
  const existingResult = await db.execute({ sql: 'SELECT * FROM collections WHERE id = ?', args: [req.params.id] })
  const existing = existingResult.rows[0]
  if (!existing) return res.status(404).json({ error: 'Collection not found' })

  const { name, description, image_url, sort_order } = req.body
  const newName = (name ?? existing.name).trim()

  try {
    await db.execute({
      sql: `UPDATE collections SET name = @name, description = @description, image_url = @image_url, sort_order = @sort_order
            WHERE id = @id`,
      args: {
        id: req.params.id,
        name: newName,
        description: description ?? existing.description,
        image_url: image_url ?? existing.image_url,
        sort_order: sort_order !== undefined ? Number(sort_order) : existing.sort_order,
      },
    })
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) {
      return res.status(400).json({ error: 'A collection with that name already exists.' })
    }
    throw err
  }

  if (newName !== existing.name) {
    await db.execute({ sql: 'UPDATE products SET category = ? WHERE category = ?', args: [newName, existing.name] })
  }

  const result = await db.execute({
    sql: `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category = c.name) AS product_count
          FROM collections c WHERE c.id = ?`,
    args: [req.params.id],
  })
  res.json(result.rows[0])
})

// Admin: delete collection (products keep their category text, just become unlisted)
router.delete('/:id', requireAdmin, async (req, res) => {
  const info = await db.execute({ sql: 'DELETE FROM collections WHERE id = ?', args: [req.params.id] })
  if (info.rowsAffected === 0) return res.status(404).json({ error: 'Collection not found' })
  res.status(204).end()
})

// Admin: upload a collection image
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
