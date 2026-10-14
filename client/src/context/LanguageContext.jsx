import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { translations as staticTranslations } from '../i18n/translations'
import api from '../lib/api'

const LanguageContext = createContext(null)

const DEFAULT_ASSETS = {
  logo: '/logo-wordmark.png',
  heroBanner: '/hero-banner.png',
  shopNowBg: '/shop-now-bg.png',
  tiersBadge: '/tiers-badge.jpg',
}

function getInitialLanguage() {
  const saved = localStorage.getItem('ps_language')
  if (saved === 'en' || saved === 'es') return saved
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

function setDeep(obj, path, value) {
  const parts = path.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]
    if (typeof cur[key] !== 'object' || cur[key] === null) cur[key] = {}
    cur = cur[key]
  }
  cur[parts[parts.length - 1]] = value
}

function deepMerge(base, override) {
  if (!override) return base
  const result = { ...base }
  for (const key of Object.keys(override)) {
    const value = override[key]
    result[key] =
      value && typeof value === 'object' && !Array.isArray(value) ? deepMerge(base?.[key] ?? {}, value) : value
  }
  return result
}

function buildFromRows(rows) {
  const en = {}
  const es = {}
  const assets = {}
  for (const row of rows) {
    if (row.type === 'image') {
      setDeep(assets, row.key.replace(/^assets\./, ''), row.value_en)
    } else {
      setDeep(en, row.key, row.value_en)
      setDeep(es, row.key, row.value_es)
    }
  }
  return { en, es, assets }
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage)
  const [dbContent, setDbContent] = useState(null)

  const refreshContent = useCallback(() => {
    return api
      .get('/content')
      .then((res) => setDbContent(buildFromRows(res.data)))
      .catch(() => setDbContent(null))
  }, [])

  useEffect(() => {
    refreshContent()
  }, [refreshContent])

  const setLanguage = useCallback((next) => {
    localStorage.setItem('ps_language', next)
    setLanguageState(next)
  }, [])

  const t = useMemo(() => {
    const base = staticTranslations[language]
    const merged = deepMerge(base, dbContent?.[language])
    return { ...merged, assets: { ...DEFAULT_ASSETS, ...dbContent?.assets } }
  }, [language, dbContent])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, refreshContent }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
