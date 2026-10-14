const multer = require('multer')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const { createClient } = require('@supabase/supabase-js')

const uploadsDir = path.join(__dirname, '..', 'uploads')

const ALLOWED = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'])

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (!ALLOWED.has(ext)) return cb(new Error('Unsupported file type'))
    cb(null, true)
  },
})

const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    : null

const bucket = process.env.SUPABASE_BUCKET || 'uploads'

function randomFilename(originalname) {
  const ext = path.extname(originalname).toLowerCase()
  const base = path.basename(originalname, ext).replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  return `${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${base}${ext}`
}

// Stores an uploaded file (from multer memoryStorage, so req.file.buffer) and
// returns a public URL. Uses Supabase Storage when SUPABASE_URL /
// SUPABASE_SERVICE_KEY are set (production); otherwise falls back to writing
// the file to server/uploads/ on local disk, so local dev needs no cloud
// account at all.
async function storeUploadedFile(file) {
  const filename = randomFilename(file.originalname)

  if (supabase) {
    const { error } = await supabase.storage.from(bucket).upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    })
    if (error) throw error
    const { data } = supabase.storage.from(bucket).getPublicUrl(filename)
    return data.publicUrl
  }

  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
  fs.writeFileSync(path.join(uploadsDir, filename), file.buffer)
  return `/uploads/${filename}`
}

module.exports = { upload, storeUploadedFile }
