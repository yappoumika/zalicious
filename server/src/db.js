const { createClient } = require('@libsql/client')
const path = require('path')

// In production (Netlify), set TURSO_DATABASE_URL to a libsql://... URL and
// TURSO_AUTH_TOKEN to your Turso auth token as environment variables.
// Locally, with no env vars set, this falls back to a plain SQLite file on
// disk — no Turso account needed for local development.
const url = process.env.TURSO_DATABASE_URL || `file:${path.join(__dirname, '..', 'data.sqlite')}`
const authToken = process.env.TURSO_AUTH_TOKEN || undefined

const db = createClient({ url, authToken })

async function ensureSchema() {
  await db.batch(
    [
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        tier TEXT NOT NULL DEFAULT 'Hybrid',
        category TEXT NOT NULL DEFAULT 'Flower',
        price REAL NOT NULL DEFAULT 0,
        thc TEXT DEFAULT '',
        weight TEXT DEFAULT '3.5g',
        badge TEXT DEFAULT '',
        description TEXT DEFAULT '',
        image_url TEXT DEFAULT '',
        featured INTEGER NOT NULL DEFAULT 0,
        in_stock INTEGER NOT NULL DEFAULT 1,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
      `CREATE TABLE IF NOT EXISTS site_content (
        key TEXT PRIMARY KEY,
        value_en TEXT NOT NULL DEFAULT '',
        value_es TEXT NOT NULL DEFAULT '',
        type TEXT NOT NULL DEFAULT 'text',
        label TEXT NOT NULL DEFAULT ''
      )`,
      `CREATE TABLE IF NOT EXISTS admin_credentials (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        password_hash TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
      `CREATE TABLE IF NOT EXISTS collections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT DEFAULT '',
        image_url TEXT DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
    ],
    'write'
  )
}

module.exports = db
module.exports.ensureSchema = ensureSchema
