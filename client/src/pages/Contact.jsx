import { useLanguage } from '../context/LanguageContext'

export default function Contact() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/50">{t.contact.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">{t.contact.title}</h1>
        <p className="mx-auto mt-6 max-w-md text-ink/60">{t.contact.intro}</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <a
          href={`mailto:${t.contact.email}`}
          className="rounded-2xl border border-ink/10 bg-white/60 p-6 transition-colors hover:border-lime"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-ink/50">{t.contact.emailLabel}</p>
          <p className="mt-2 font-display text-base">{t.contact.email}</p>
        </a>

        <a
          href="/wholesale"
          className="rounded-2xl border border-ink/10 bg-white/60 p-6 transition-colors hover:border-lime"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-ink/50">{t.contact.wholesaleLabel}</p>
          <p className="mt-2 font-display text-base">{t.contact.wholesaleValue}</p>
        </a>
      </div>
    </div>
  )
}
