import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../lib/api'
import ProductCard from '../components/ProductCard'
import { useLanguage } from '../context/LanguageContext'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || 'All'
  const { t } = useLanguage()

  function setCategory(next) {
    setSearchParams(next === 'All' ? {} : { category: next })
  }

  useEffect(() => {
    api
      .get('/products')
      .then((res) => setProducts(res.data))
      .catch(() => setError('Could not load products.'))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.category))], [products])
  const visible = category === 'All' ? products : products.filter((p) => p.category === category)

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/50">{t.shop.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">{t.shop.title}</h1>
        <Link to="/how-to-order" className="mt-4 inline-block text-sm text-lime-dark underline underline-offset-4">
          {t.nav.howToOrder}
        </Link>
      </div>

      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full border px-5 py-2 font-display text-xs uppercase transition-colors ${
              category === cat
                ? 'border-lime bg-lime text-white'
                : 'border-ink/15 text-ink/60 hover:border-lime hover:text-ink'
            }`}
          >
            {cat === 'All' ? t.shop.all : cat}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-ink/50">{t.shop.loading}</p>}
      {error && <p className="text-center text-red-600">{t.shop.error}</p>}
      {!loading && !error && visible.length === 0 && (
        <p className="text-center text-ink/50">{t.shop.empty}</p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
