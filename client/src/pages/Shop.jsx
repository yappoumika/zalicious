import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../lib/api'
import ProductCard from '../components/ProductCard'
import { useLanguage } from '../context/LanguageContext'

const SHAPES = ['shape-hexagon', 'shape-slant', 'shape-arrow', 'shape-octagon', 'shape-ticket']

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function Shop() {
  const [products, setProducts] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeId, setActiveId] = useState(null)
  const [searchParams] = useSearchParams()
  const { t } = useLanguage()

  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/collections').catch(() => ({ data: [] }))])
      .then(([productsRes, collectionsRes]) => {
        setProducts(productsRes.data)
        setCollections(collectionsRes.data)
      })
      .catch(() => setError('Could not load products.'))
      .finally(() => setLoading(false))
  }, [])

  // One section per collection, in the admin's order, then any product
  // categories that don't have a collection yet so nothing goes missing.
  const sections = useMemo(() => {
    const named = collections.map((c) => ({ name: c.name, description: c.description }))
    const known = new Set(named.map((s) => s.name))
    const extra = [...new Set(products.map((p) => p.category))]
      .filter((name) => name && !known.has(name))
      .map((name) => ({ name, description: '' }))
    return [...named, ...extra].map((s) => ({
      ...s,
      id: slugify(s.name),
      items: products.filter((p) => p.category === s.name),
    }))
  }, [collections, products])

  // Old links like /shop?category=Edibles jump straight to that section.
  const linkedCategory = searchParams.get('category')
  useEffect(() => {
    if (!loading && linkedCategory) {
      setActiveId(slugify(linkedCategory))
      document.getElementById(slugify(linkedCategory))?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [loading, linkedCategory])

  function jumpTo(id) {
    setActiveId(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/50">{t.shop.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">{t.shop.title}</h1>
        <Link to="/how-to-order" className="mt-4 inline-block text-sm text-lime-dark underline underline-offset-4">
          {t.nav.howToOrder}
        </Link>
      </div>

      {sections.length > 0 && (
        <div className="mb-14 flex flex-wrap justify-center gap-4">
          {sections.map((section, i) => {
            const shape = SHAPES[i % SHAPES.length]
            const pressed = activeId === section.id
            // The outer shape is the outline; the inner shape, inset by 2px,
            // is the hollow middle until the button is pressed.
            return (
              <button
                key={section.id}
                onClick={() => jumpTo(section.id)}
                aria-pressed={pressed}
                className={`${shape} group bg-ink p-[2px] font-display text-xs uppercase transition-transform duration-200 hover:-rotate-3 hover:scale-110`}
              >
                <span
                  className={`${shape} block px-8 py-3 transition-colors ${
                    pressed ? 'bg-ink text-cream' : 'bg-cream text-ink group-active:bg-ink group-active:text-cream'
                  }`}
                >
                  {section.name}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {loading && <p className="text-center text-ink/50">{t.shop.loading}</p>}
      {error && <p className="text-center text-red-600">{t.shop.error}</p>}

      {!loading && !error && (
        <div className="flex flex-col gap-20">
          {sections.map((section) => (
            <ShopSection key={section.id} section={section} />
          ))}
        </div>
      )}
    </div>
  )
}

function ShopSection({ section }) {
  const { t } = useLanguage()

  return (
    <section id={section.id} className="scroll-mt-48">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2 border-b-2 border-ink pb-3">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl">{section.name}</h2>
          {section.description && <p className="mt-1 text-sm text-ink/60">{section.description}</p>}
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-ink/50">
          {String(section.items.length).padStart(2, '0')}
        </span>
      </div>

      {section.items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/20 py-12 text-center font-mono text-sm text-ink/50">
          {t.shop.comingSoon}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {section.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
