require('dotenv/config')
const express = require('express')
const cors = require('cors')
const path = require('path')

const { ensureSchema } = require('./db.js')
const productsRouter = require('./routes/products.js')
const authRouter = require('./routes/auth.js')
const contentRouter = require('./routes/content.js')
const collectionsRouter = require('./routes/collections.js')

const app = express()

const schemaReady = ensureSchema()
app.use(async (req, res, next) => {
  await schemaReady
  next()
})

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/api/products', productsRouter)
app.use('/api/auth', authRouter)
app.use('/api/content', contentRouter)
app.use('/api/collections', collectionsRouter)

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Server error' })
})

module.exports = app
