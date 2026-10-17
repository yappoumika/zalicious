import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import ProductCard from '../components/ProductCard'
import { useLanguage } from '../context/LanguageContext'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    api
      .get('/products', { params: { featured: 'true' } })
      .then((res) => setFeatured(res.data))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className=''>
      <WordmarkHero />
      <ShopNowBanner />
      <DiamondsSection />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-8 text-center font-display text-3xl">{t.home.freshDrops}</h2>
        {loading ? (
          <p className="text-center text-ink/50">{t.home.loadingProducts}</p>
        ) : featured.length === 0 ? (
          <p className="text-center text-ink/50">{t.home.noFeatured}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
       
      </section>
    </div>
  )
}

function WordmarkHero() {
  const { t } = useLanguage()

  return (
    <section className="relative mx-5 mt-2 overflow-hidden px-2 pb-10 pt-6 text-center">
      <h1 className="font-display text-[17vw] leading-[0.85] sm:text-[15vw] lg:text-[12rem]">
        <span className="block">ZALI</span>
        <span className="text-outline block">CIOUS</span>
      </h1>
      <p className="mx-auto mt-8 max-w-md text-ink/60">
        {t.home.tiersTitle1} {t.home.tiersTitle2}
      </p>
      <Link
        to="/shop"
        className="mt-6 inline-block rounded-full bg-ink px-8 py-3 font-display text-sm text-cream transition-transform hover:-rotate-2 hover:scale-105"
      >
        {t.home.heroShopCta}
      </Link>
      <SpinningSticker text={t.home.stickerText} />
    </section>
  )
}

function SpinningSticker({ text }) {
  return (
    <Link
      to="/shop"
      aria-label={text}
      className="absolute right-2 top-2 hidden h-28 w-28 sm:block md:right-8 md:h-36 md:w-36"
    >
      <svg viewBox="0 0 100 100" className="animate-spin-slow h-full w-full">
        <defs>
          <path id="sticker-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <circle cx="50" cy="50" r="49" fill="var(--color-ink)" />
        <text fill="var(--color-cream)" fontSize="8" className="font-display">
          <textPath href="#sticker-circle" textLength="236" lengthAdjust="spacingAndGlyphs">{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-2xl text-cream">✦</span>
    </Link>
  )
}

function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative m-5 overflow-hidden rounded-[40px] bg-lime">
      <img src={t.assets.heroBanner} alt="Zalicious" className="block h-auto w-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Link
          to="/shop"
          className="rounded-full bg-white px-6 py-2.5 font-display text-xs text-ink transition-transform hover:scale-105 sm:px-8 sm:py-3 sm:text-sm md:px-10 md:py-4 md:text-base"
        >
          {t.home.heroShopCta}
        </Link>
      </div>
    </section>
  )
}

function TiersSection() {
  const { t } = useLanguage()

  return (
    <section className="relative m-5 rounded-[40px] overflow-hidden bg-cream-dark px-6 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div className="text-center">
          <p className="font-display text-lg text-lime-dark">{t.home.tiersEyebrow}</p>
          <h2 className="mt-4 font-display text-3xl leading-tight sm:text-3xl">
            {t.home.tiersTitle1}
            <br />
            {t.home.tiersTitle2}
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-ink/60">{t.home.tiersSub}</p>
        </div>
        <div className="mx-auto flex aspect-[3/4] w-56 items-center justify-center overflow-hidden rounded-2xl bg-ink shadow-xl">
          <img src={t.assets.tiersBadge} alt="Zalicious" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  )
}

function ShopNowBanner() {
  const { t } = useLanguage()

  return (
    <section
      className="relative m-5 rounded-[40px] flex min-h-[26rem] items-center justify-center overflow-hidden bg-ink-soft bg-cover bg-center px-6 py-24"
      style={{ backgroundImage: `url(${t.assets.shopNowBg})` }}
    >
      <Link
        to="/shop"
        className="relative rounded-full bg-white px-10 py-4 font-display text-base text-ink shadow-lg transition-transform hover:scale-105"
      >
        {t.home.shopNow}
      </Link>
    </section>
  )
}

function DiamondsSection() {
  const { t } = useLanguage()

  return (
    <section className="mx-auto max-w-2xl px-6 py-24">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/50">{t.home.diamondsEyebrow}</p>
        <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
          {t.home.diamondsTitle1}
          <br />
          {t.home.diamondsTitle2}
        </h2>
        <p className="mx-auto mt-6 max-w-md text-ink/60">{t.home.diamondsBody}</p>
        <Link
          to="/shop"
          className="mt-8 inline-block rounded-full bg-lime px-8 py-3 font-display text-sm text-white transition-transform hover:scale-105"
        >
          {t.home.shopNow}
        </Link>
      </div>
    </section>
  )
}
