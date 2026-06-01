'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Locale = 'en' | 'pt'

interface LocaleState {
  locale:    Locale
  setLocale: (locale: Locale) => void
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'pt',
      setLocale: (locale) => {
        document.cookie = `locale=${locale}; path=/; max-age=31536000`
        set({ locale })
        window.location.reload()
      },
    }),
    { name: 'lan-locale' },
  ),
)
