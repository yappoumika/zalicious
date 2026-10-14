import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function ProductCard({ product }) {
  const { t } = useLanguage()

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white/60 transition-shadow hover:shadow-lg"
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-ink">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <PlaceholderArt />
        )}
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-lime px-3 py-1 font-display text-[10px] uppercase tracking-wide text-white">
            {product.badge}
          </span>
        )}
        {!product.in_stock && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-3 py-1 font-mono text-[10px] uppercase text-cream">
            {t.product.soldOut}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="font-mono text-[11px] uppercase tracking-wide text-ink/50">{product.tier} · {product.category}</p>
        <h3 className="font-display text-base leading-snug">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-ink/60">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-mono text-sm text-ink/50">{product.thc} · {product.weight}</span>
          <span className="font-display text-lg text-lime-dark">${product.price}</span>
        </div>
      </div>
    </Link>
  )
}

function PlaceholderArt() {
  const { t } = useLanguage()

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink to-ink-soft">
      <span className="font-display text-sm text-white/70">{t.product.placeholderBrand}</span>
    </div>
  )
}
