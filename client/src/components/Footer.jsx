import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-ink px-6 py-14 text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div>
          <p className="font-display text-lg text-white">{t.footer.brandName}</p>
          <p className="mt-3 max-w-xs text-sm text-cream/60">{t.footer.tagline}</p>
        </div>

        <FooterColumn
          title={t.footer.shopTitle}
          links={[
            { label: t.footer.shopNow, to: '/shop' },
            { label: t.footer.collections, to: '/collections' },
            { label: t.footer.wholesale, to: '/wholesale' },
            { label: t.nav.howToOrder, to: '/how-to-order' },
          ]}
        />
        <FooterColumn
          title={t.footer.companyTitle}
          links={[
            { label: t.footer.about, to: '/about' },
            { label: t.footer.contact, to: '/contact' },
          ]}
        />
        <FooterColumn
          title={t.footer.adminTitle}
          links={[
            { label: t.footer.adminLogin, to: '/admin/login' },
            { label: t.footer.dashboard, to: '/admin' },
          ]}
        />
      </div>

      <p className="mx-auto mt-12 max-w-6xl border-t border-cream/10 pt-6 font-mono text-xs text-cream/40">
        © {new Date().getFullYear()} {t.footer.copyrightSuffix}
      </p>
    </footer>
  )
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <p className="font-display text-sm text-cream/80">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-cream/60">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
