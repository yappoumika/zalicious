import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function HowToOrder() {
  const { t } = useLanguage()

  const steps = [
    { title: t.howToOrder.step1Title, body: t.howToOrder.step1Body },
    { title: t.howToOrder.step2Title, body: t.howToOrder.step2Body },
    { title: t.howToOrder.step3Title, body: t.howToOrder.step3Body },
  ]

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/50">{t.howToOrder.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">{t.howToOrder.title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-ink/60">{t.howToOrder.intro}</p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title} className="relative rounded-2xl border border-ink/10 bg-white/60 p-6">
            <span className="font-display text-3xl text-lime-dark">{i + 1}</span>
            <h2 className="mt-3 font-display text-lg">{step.title}</h2>
            <p className="mt-3 text-sm text-ink/60">{step.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-lime/30 bg-lime/10 p-6 text-center">
        <p className="font-mono text-sm text-ink/70">{t.howToOrder.note}</p>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/contact"
          className="inline-block rounded-full bg-lime px-8 py-3 font-display text-sm text-white transition-transform hover:scale-105"
        >
          {t.howToOrder.cta}
        </Link>
      </div>
    </div>
  )
}
