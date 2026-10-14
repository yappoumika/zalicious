require('dotenv/config')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const db = require('./db.js')

async function main() {
  await db.ensureSchema()

  const existing = await db.execute('SELECT id FROM admin_credentials WHERE id = 1')

  if (existing.rows[0]) {
    console.log('Admin credentials already set — refusing to overwrite. Use the "Change Password" form in /admin to update it.')
    return
  }

  const words = ['coral', 'basil', 'ember', 'quartz', 'delta', 'marsh', 'onyx', 'tundra', 'clover', 'granite']
  const word = words[crypto.randomInt(words.length)]
  const digits = crypto.randomInt(1000, 9999)
  const tempPassword = `${word[0].toUpperCase()}${word.slice(1)}-${digits}`

  const hash = bcrypt.hashSync(tempPassword, 10)
  await db.execute({ sql: 'INSERT INTO admin_credentials (id, password_hash) VALUES (1, ?)', args: [hash] })

  console.log(`Temporary admin password: ${tempPassword}`)
  console.log('Share this with your client and have them change it from /admin → Account.')
}

main()