const { Router } = require('express')
const bcrypt = require('bcryptjs')
const db = require('../db.js')
const { signAdminToken, requireAdmin } = require('../auth.js')

const router = Router()

router.post('/login', async (req, res) => {
  const { password } = req.body
  const result = await db.execute('SELECT password_hash FROM admin_credentials WHERE id = 1')
  const row = result.rows[0]

  if (!password || !row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'Incorrect password' })
  }

  res.json({ token: signAdminToken() })
})

router.put('/password', requireAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters.' })
  }

  const result = await db.execute('SELECT password_hash FROM admin_credentials WHERE id = 1')
  const row = result.rows[0]

  if (!currentPassword || !row || !bcrypt.compareSync(currentPassword, row.password_hash)) {
    return res.status(401).json({ error: 'Current password is incorrect.' })
  }

  const hash = bcrypt.hashSync(newPassword, 10)
  await db.execute({
    sql: "UPDATE admin_credentials SET password_hash = ?, updated_at = datetime('now') WHERE id = 1",
    args: [hash],
  })

  res.json({ ok: true })
})

module.exports = router
