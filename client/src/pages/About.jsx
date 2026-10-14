import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function About() {
  const { t } = useLanguage()

  const values = [
    { title: t.about.value1Title, body: t.about.value1Body },
    { title: t.about.value2Title, body: t.about.value2Body },
    { title: t.about.value3Title, body: t.about.value3Body },
  ]

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/50">{t.about.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">{t.about.title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-ink/60">{t.about.intro}</p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="rounded-2xl border border-ink/10 bg-white/60 p-6">
            <h2 className="font-display text-lg">{v.title}</h2>
            <p className="mt-3 text-sm text-ink/60">{v.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          to="/shop"
          className="inline-block rounded-full bg-lime px-8 py-3 font-display text-sm text-white transition-transform hover:scale-105"
        >
          {t.about.cta}
        </Link>
      </div>
    </div>
  )
}
