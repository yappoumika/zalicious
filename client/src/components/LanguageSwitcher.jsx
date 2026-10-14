import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { LANGUAGES } from '../i18n/translations'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0]

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 font-mono text-xs text-ink/70 transition-colors hover:border-lime"
      >
        <span>{current.flag}</span>
        <span className="uppercase">{current.code}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-36 overflow-hidden rounded-xl border border-ink/10 bg-white shadow-lg"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={lang.code === language}
                onClick={() => {
                  setLanguage(lang.code)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-cream ${
                  lang.code === language ? 'text-lime-dark' : 'text-ink'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
