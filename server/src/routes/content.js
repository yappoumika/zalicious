const { Router } = require('express')
const db = require('../db.js')
const { requireAdmin } = require('../auth.js')
const { upload, storeUploadedFile } = require('../upload.js')

const router = Router()

// Public: get all site content
router.get('/', async (req, res) => {
  const result = await db.execute('SELECT key, value_en, value_es, type, label FROM site_content')
  res.json(result.rows)
})

// Admin: bulk update text/image field values
router.put('/', requireAdmin, async (req, res) => {
  const { updates } = req.body
  if (!Array.isArray(updates)) {
    return res.status(400).json({ error: 'updates must be an array' })
  }

  if (updates.length > 0) {
    await db.batch(
      updates.map((item) => ({
        sql: 'UPDATE site_content SET value_en = @value_en, value_es = @value_es WHERE key = @key',
        args: { key: item.key, value_en: item.value_en ?? '', value_es: item.value_es ?? '' },
      })),
      'write'
    )
  }

  const result = await db.execute('SELECT key, value_en, value_es, type, label FROM site_content')
  res.json(result.rows)
})

// Admin: upload a replacement image for an asset field
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
