import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import { useAdminAuth } from '../../context/AdminAuthContext'
import ProductForm from './ProductForm'

export default function AdminDashboard() {
  const { logout } = useAdminAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  async function load() {
    setLoading(true)
    const { data } = await api.get('/products')
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function startCreate() {
    setEditing(null)
    setShowForm(true)
  }

  function startEdit(product) {
    setEditing(product)
    setShowForm(true)
  }

  function handleSaved() {
    setShowForm(false)
    setEditing(null)
    load()
  }

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    await api.delete(`/products/${product.id}`)
    load()
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink/50">Admin</p>
          <h1 className="font-display text-3xl">Product Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/content"
            className="rounded-full border border-ink/15 px-6 py-2.5 font-display text-sm text-ink/70 hover:border-ink/40"
          >
            Site Content
          </Link>
          <Link
            to="/admin/collections"
            className="rounded-full border border-ink/15 px-6 py-2.5 font-display text-sm text-ink/70 hover:border-ink/40"
          >
            Collections
          </Link>
          <Link
            to="/admin/account"
            className="rounded-full border border-ink/15 px-6 py-2.5 font-display text-sm text-ink/70 hover:border-ink/40"
          >
            Account
          </Link>
          <button
            onClick={startCreate}
            className="rounded-full bg-lime px-6 py-2.5 font-display text-sm text-white transition-transform hover:scale-105"
          >
            + New Product
          </button>
          <button
            onClick={logout}
            className="rounded-full border border-ink/15 px-6 py-2.5 font-display text-sm text-ink/70 hover:border-ink/40"
          >
            Log Out
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-10">
          <ProductForm product={editing} onSaved={handleSaved} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {loading ? (
        <p className="text-ink/50">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 font-mono text-xs uppercase text-ink/50">
              <tr>
                <th className="px-4 py-3">Media</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-ink/10" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-ink/60">{p.category}</td>
                  <td className="px-4 py-3">${p.price}</td>
                  <td className="px-4 py-3">{p.featured ? '✓' : ''}</td>
                  <td className="px-4 py-3">{p.in_stock ? 'In stock' : 'Sold out'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => startEdit(p)} className="mr-3 text-ink/60 hover:text-ink">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p)} className="text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-ink/50">
                    No products yet. Click "+ New Product" to add one.
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
