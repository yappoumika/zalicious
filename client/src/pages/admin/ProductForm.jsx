import { useEffect, useState } from 'react'
import api from '../../lib/api'

const EMPTY = {
  name: '',
  tier: 'Hybrid',
  category: 'Flower',
  price: '',
  thc: '',
  weight: '3.5g',
  badge: '',
  description: '',
  image_url: '',
  featured: false,
  in_stock: true,
  sort_order: 0,
}

export default function ProductForm({ product, onSaved, onCancel }) {
  const [form, setForm] = useState(EMPTY)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(product ? { ...EMPTY, ...product } : EMPTY)
  }, [product])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const body = new FormData()
      body.append('image', file)
      const { data } = await api.post('/products/upload', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      update('image_url', data.url)
    } catch {
      setError('Upload failed. Check file type (png/jpg/webp/gif/svg) and size (<8MB).')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (product?.id) {
        await api.put(`/products/${product.id}`, form)
      } else {
        await api.post('/products', form)
      }
      onSaved()
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save product.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-ink/10 bg-white p-6 md:grid-cols-2">
      <h2 className="font-display text-lg md:col-span-2">{product?.id ? 'Edit Product' : 'New Product'}</h2>

      <Field label="Name">
        <input
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Badge (optional)">
        <input value={form.badge} onChange={(e) => update('badge', e.target.value)} className="input" />
      </Field>

      <Field label="Tier">
        <select value={form.tier} onChange={(e) => update('tier', e.target.value)} className="input">
          {['Sativa', 'Indica', 'Hybrid'].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>

      <Field label="Category">
        <input value={form.category} onChange={(e) => update('category', e.target.value)} className="input" />
      </Field>

      <Field label="Price ($)">
        <input
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => update('price', e.target.value)}
          className="input"
        />
      </Field>

      <Field label="THC">
        <input value={form.thc} onChange={(e) => update('thc', e.target.value)} className="input" placeholder="28.4%" />
      </Field>

      <Field label="Weight">
        <input value={form.weight} onChange={(e) => update('weight', e.target.value)} className="input" />
      </Field>

      <Field label="Sort Order">
        <input
          type="number"
          value={form.sort_order}
          onChange={(e) => update('sort_order', e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Description" className="md:col-span-2">
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          className="input min-h-24"
        />
      </Field>

      <Field label="Media / Image" className="md:col-span-2">
        <div className="flex items-center gap-4">
          {form.image_url && (
            <img src={form.image_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
          {uploading && <span className="font-mono text-xs text-ink/50">Uploading…</span>}
        </div>
      </Field>

      <div className="flex items-center gap-6 md:col-span-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} />
          Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.in_stock} onChange={(e) => update('in_stock', e.target.checked)} />
          In stock
        </label>
      </div>

      {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}

      <div className="flex gap-3 md:col-span-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-lime px-6 py-2.5 font-display text-sm text-white transition-transform hover:scale-105 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-ink/15 px-6 py-2.5 font-display text-sm text-ink/70 hover:border-ink/40"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="font-mono text-xs uppercase text-ink/50">{label}</span>
      {children}
    </label>
  )
}
