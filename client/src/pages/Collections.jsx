import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { useLanguage } from '../context/LanguageContext'

export default function Collections() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    api
      .get('/collections')
      .then((res) => setCollections(res.data))
      .catch(() => setCollections([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/50">{t.collections.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">{t.collections.title}</h1>
      </div>

      {loading ? (
        <p className="text-center text-ink/50">{t.collections.loading}</p>
      ) : collections.length === 0 ? (
        <p className="text-center text-ink/50">{t.collections.empty}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <Link
              key={c.id}
              to={`/shop?category=${encodeURIComponent(c.name)}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white/60 transition-colors hover:border-lime"
            >
              {c.image_url ? (
                <div className="aspect-[4/3] overflow-hidden bg-ink">
                  <img
                    src={c.image_url}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col justify-between p-8">
                <div>
                  <h2 className="font-display text-2xl">{c.name}</h2>
                  {c.description && <p className="mt-2 text-sm text-ink/60">{c.description}</p>}
                </div>
                <p className="mt-6 font-mono text-xs uppercase tracking-wide text-ink/50">
                  {c.product_count} {c.product_count === 1 ? t.collections.product : t.collections.products}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          to="/shop"
          className="inline-block rounded-full bg-lime px-8 py-3 font-display text-sm text-white transition-transform hover:scale-105"
        >
          {t.collections.shopAll}
        </Link>
      </div>
    </div>
  )
}
