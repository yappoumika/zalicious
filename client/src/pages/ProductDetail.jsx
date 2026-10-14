import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../lib/api'
import { useLanguage } from '../context/LanguageContext'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    api
      .get(`/products/${slug}`)
      .then((res) => setProduct(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return <div className="mx-auto max-w-6xl px-6 py-20 text-center text-ink/50">{t.shop.loading}</div>
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-ink/50">{t.productDetail.notFound}</p>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-full bg-lime px-8 py-3 font-display text-sm text-white transition-transform hover:scale-105"
        >
          {t.productDetail.backToShop}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link to="/shop" className="font-mono text-xs uppercase tracking-widest text-ink/50 hover:text-ink">
        ← {t.productDetail.backToShop}
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-ink">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-sm text-white/70">{t.product.placeholderBrand}</span>
          )}
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-lime px-3 py-1 font-display text-xs uppercase tracking-wide text-white">
              {product.badge}
            </span>
          )}
          {!product.in_stock && (
            <span className="absolute right-4 top-4 rounded-full bg-ink/80 px-3 py-1 font-mono text-xs uppercase text-cream">
              {t.product.soldOut}
            </span>
          )}
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-ink/50">
            {product.tier} · {product.category}
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl">{product.name}</h1>
          <p className="mt-4 font-display text-2xl text-lime-dark">${product.price}</p>

          {product.description && <p className="mt-6 text-ink/60">{product.description}</p>}

          <div className="mt-6 flex gap-8">
            {product.thc && (
              <div>
                <p className="font-mono text-[10px] uppercase text-ink/40">{t.productDetail.thc}</p>
                <p className="font-display text-sm">{product.thc}</p>
              </div>
            )}
            {product.weight && (
              <div>
                <p className="font-mono text-[10px] uppercase text-ink/40">{t.productDetail.weight}</p>
                <p className="font-display text-sm">{product.weight}</p>
              </div>
            )}
          </div>

          <Link
            to="/how-to-order"
            className="mt-10 inline-block rounded-full bg-lime px-8 py-3 font-display text-sm text-white transition-transform hover:scale-105"
          >
            {t.nav.howToOrder}
          </Link>
        </div>
      </div>
    </div>
  )
}
