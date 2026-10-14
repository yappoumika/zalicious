const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

function signAdminToken() {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '12h' })
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Missing auth token' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload.role !== 'admin') throw new Error('not admin')
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

module.exports = { signAdminToken, requireAdmin }
