import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import { useLanguage } from '../../context/LanguageContext'

const SECTION_LABELS = {
  nav: 'Navigation',
  header: 'Header',
  footer: 'Footer',
  home: 'Home Page',
  shop: 'Shop Page',
  collections: 'Collections Page',
  howToOrder: 'How To Order Page',
  about: 'About Page',
  contact: 'Contact Page',
  product: 'Product Cards',
  productDetail: 'Product Detail Page',
  general: 'Header',
  assets: 'Images',
}

function sectionOf(key) {
  if (key === 'marquee') return 'general'
  const prefix = key.split('.')[0]
  return SECTION_LABELS[prefix] ? prefix : 'general'
}

const SECTION_ORDER = [
  'nav',
  'header',
  'general',
  'footer',
  'home',
  'shop',
  'collections',
  'howToOrder',
  'about',
  'contact',
  'product',
  'productDetail',
  'assets',
]

export default function AdminContent() {
  const { refreshContent } = useLanguage()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(null)
  const [uploadingKey, setUploadingKey] = useState(null)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    const { data } = await api.get('/content')
    setRows(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function updateField(key, field, value) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)))
  }

  async function saveAll() {
    setSaving(true)
    setError('')
    try {
      const updates = rows
        .filter((r) => r.type !== 'image')
        .map((r) => ({ key: r.key, value_en: r.value_en, value_es: r.value_es }))
      await api.put('/content', { updates })
      await refreshContent()
      setSavedAt(Date.now())
    } catch {
      setError('Could not save changes.')
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(key, file) {
    setUploadingKey(key)
    setError('')
    try {
      const body = new FormData()
      body.append('image', file)
      const { data } = await api.post('/content/upload', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await api.put('/content', { updates: [{ key, value_en: data.url, value_es: data.url }] })
      setRows((prev) => prev.map((r) => (r.key === key ? { ...r, value_en: data.url, value_es: data.url } : r)))
      await refreshContent()
    } catch {
      setError('Image upload failed. Check file type (png/jpg/webp/gif/svg) and size (<8MB).')
    } finally {
      setUploadingKey(null)
    }
  }

  const grouped = SECTION_ORDER.map((section) => ({
    section,
    title: SECTION_LABELS[section],
    rows: rows.filter((r) => sectionOf(r.key) === section),
  })).filter((g) => g.rows.length > 0)

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/admin" className="font-mono text-xs uppercase tracking-widest text-ink/50 hover:text-ink">
            ← Back to Products
          </Link>
          <h1 className="mt-1 font-display text-3xl">Site Content</h1>
          <p className="mt-2 max-w-xl text-sm text-ink/60">
            Edit any text or image on the storefront. Changes go live on save — no code changes needed.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && <span className="font-mono text-xs text-lime-dark">Saved ✓</span>}
          <button
            onClick={saveAll}
            disabled={saving || loading}
            className="rounded-full bg-lime px-6 py-2.5 font-display text-sm text-white transition-transform hover:scale-105 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {error && <p className="mb-6 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-ink/50">Loading…</p>
      ) : (
        <div className="flex flex-col gap-10">
          {grouped.map((group) => (
            <section key={group.section}>
              <h2 className="mb-4 font-display text-lg text-lime-dark">{group.title}</h2>
              <div className="flex flex-col gap-4">
                {group.rows.map((row) =>
                  row.type === 'image' ? (
                    <ImageField
                      key={row.key}
                      row={row}
                      uploading={uploadingKey === row.key}
                      onUpload={(file) => handleImageUpload(row.key, file)}
                    />
                  ) : (
                    <TextField key={row.key} row={row} onChange={updateField} />
                  )
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

function TextField({ row, onChange }) {
  const long = row.value_en.length > 60 || row.value_es.length > 60

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/60 p-4">
      <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink/50">{row.label}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field
          label="EN"
          long={long}
          value={row.value_en}
          onChange={(v) => onChange(row.key, 'value_en', v)}
        />
        <Field
          label="ES"
          long={long}
          value={row.value_es}
          onChange={(v) => onChange(row.key, 'value_es', v)}
        />
      </div>
    </div>
  )
}

function Field({ label, long, value, onChange }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase text-ink/40">{label}</span>
      {long ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className="input min-h-20 text-sm" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="input text-sm" />
      )}
    </label>
  )
}

function ImageField({ row, uploading, onUpload }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white/60 p-4">
      <p className="mb-3 font-mono text-xs uppercase tracking-wide text-ink/50">{row.label}</p>
      <div className="flex items-center gap-4">
        <img src={row.value_en} alt={row.label} className="h-16 w-16 rounded-lg border border-ink/10 object-cover" />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          className="text-sm"
        />
        {uploading && <span className="font-mono text-xs text-ink/50">Uploading…</span>}
      </div>
    </div>
  )
}
