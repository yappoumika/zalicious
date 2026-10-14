import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'

const EMPTY = { name: '', description: '', image_url: '', sort_order: 0 }

export default function AdminCollections() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  async function load() {
    setLoading(true)
    const { data } = await api.get('/collections')
    setCollections(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function startCreate() {
    setEditing(null)
    setShowForm(true)
  }

  function startEdit(collection) {
    setEditing(collection)
    setShowForm(true)
  }

  function handleSaved() {
    setShowForm(false)
    setEditing(null)
    load()
  }

  async function handleDelete(collection) {
    if (!confirm(`Delete "${collection.name}"? Products keep their category — they just won't show up as a collection anymore.`))
      return
    await api.delete(`/collections/${collection.id}`)
    load()
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/admin" className="font-mono text-xs uppercase tracking-widest text-ink/50 hover:text-ink">
            ← Back to Products
          </Link>
          <h1 className="mt-1 font-display text-3xl">Collections</h1>
        </div>
        <button
          onClick={startCreate}
          className="rounded-full bg-lime px-6 py-2.5 font-display text-sm text-white transition-transform hover:scale-105"
        >
          + New Collection
        </button>
      </div>

      {showForm && (
        <div className="mb-10">
          <CollectionForm collection={editing} onSaved={handleSaved} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {loading ? (
        <p className="text-ink/50">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 font-mono text-xs uppercase text-ink/50">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Sort Order</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {collections.map((c) => (
                <tr key={c.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3">
                    {c.image_url ? (
                      <img src={c.image_url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-ink/10" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-ink/60">{c.product_count}</td>
                  <td className="px-4 py-3 text-ink/60">{c.sort_order}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => startEdit(c)} className="mr-3 text-ink/60 hover:text-ink">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(c)} className="text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {collections.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink/50">
                    No collections yet. Click "+ New Collection" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function CollectionForm({ collection, onSaved, onCancel }) {
  const [form, setForm] = useState(EMPTY)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(collection ? { ...EMPTY, ...collection } : EMPTY)
  }, [collection])

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
      const { data } = await api.post('/collections/upload', body, {
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
      if (collection?.id) {
        await api.put(`/collections/${collection.id}`, form)
      } else {
        await api.post('/collections', form)
      }
      onSaved()
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save collection.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-ink/10 bg-white p-6 md:grid-cols-2">
      <h2 className="font-display text-lg md:col-span-2">{collection?.id ? 'Edit Collection' : 'New Collection'}</h2>

      <Field label="Name" className="md:col-span-2">
        <input required value={form.name} onChange={(e) => update('name', e.target.value)} className="input" />
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
          className="input min-h-20"
        />
      </Field>

      <Field label="Image" className="md:col-span-2">
        <div className="flex items-center gap-4">
          {form.image_url && <img src={form.image_url} alt="" className="h-16 w-16 rounded-lg object-cover" />}
          <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
          {uploading && <span className="font-mono text-xs text-ink/50">Uploading…</span>}
        </div>
      </Field>

      {form.name && (
        <p className="text-xs text-ink/50 md:col-span-2">
          Tip: products get tagged into this collection by matching their "Category" field to this name exactly.
        </p>
      )}

      {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}

      <div className="flex gap-3 md:col-span-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-lime px-6 py-2.5 font-display text-sm text-white transition-transform hover:scale-105 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Collection'}
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
