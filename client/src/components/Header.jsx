import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useLanguage()

  const NAV_LINKS = [
    { label: t.nav.home, to: '/' },
    { label: t.nav.shop, to: '/shop' },
    { label: t.nav.collections, to: '/collections' },
    { label: t.nav.wholesale, to: '/wholesale' },
    { label: t.nav.howToOrder, to: '/how-to-order' },
    { label: t.nav.about, to: '/about' },
    { label: t.nav.contact, to: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-cream">

      <div className="relative">
        <div className="absolute right-6 top-3 z-20">
          <LanguageSwitcher />
        </div>

        <div className="hidden items-center justify-center px-6 py-2 font-mono text-xs text-ink/80 md:flex">
          <p>
            {t.header.promoPrefix} <span className="font-bold text-ink">{t.header.promoCode}</span>
          </p>
        </div>

        <div className="flex flex-col items-center justify-between px-6 py-5">
          <button
            className="text-2xl md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={t.header.toggleMenu}
          >
            ☰
          </button>

          <Link to="/" className="mx-auto mt-4 block overflow-hidden rounded-lg md:mx-0">
            <img src={t.assets.logo} alt="Papertrail" className="h-12 w-auto" />
          </Link>

          <nav className="hidden items-center gap-9 mt-8 font-display text-xs md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-lg text-ink underline-offset-4 transition-colors hover:text-ink/60 ${isActive ? 'underline decoration-2' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-7 border-t border-ink/10 px-6 py-4 font-display text-sm md:hidden">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>

            <Marquee />

    </header>
  )
}

function Marquee() {
  const { t } = useLanguage()

  return (
    <div className="overflow-hidden bg-lime py-3 text-white">
      <div className="animate-marquee flex w-max whitespace-nowrap font-display text-sm">
        <span className="px-6">{t.marquee.repeat(2)}</span>
        <span className="px-6">{t.marquee.repeat(2)}</span>
      </div>
    </div>
  )
}
