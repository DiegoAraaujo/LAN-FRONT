'use client'
import { useTranslations, useLocale } from 'next-intl'
import { Globe } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useLocaleStore } from '@/stores/locale.store'
import { cn } from '@/lib/utils'

export const PreferencesForm = () => {
  const t = useTranslations('settings')
  const locale = useLocale()
  const { setLocale } = useLocaleStore()

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2 text-base font-semibold text-text">
        <Globe size={15} className="text-gold" /> {t('systemPreferences')}
      </div>
      <div className="mb-4">
        <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-2">
          {t('language')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'en' as const, label: t('langEnglish'),    flag: '🇺🇸' },
            { value: 'pt' as const, label: t('langPortuguese'), flag: '🇧🇷' },
          ].map(opt => (
            <button type="button" aria-pressed={locale === opt.value} key={opt.value} onClick={() => setLocale(opt.value)}
              className={cn(
                'flex min-h-11 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all',
                locale === opt.value
                  ? 'border-gold-btn bg-amber-50 text-text'
                  : 'border-border text-text-muted hover:border-gold-btn',
              )}>
              <span className="text-base">{opt.flag}</span> {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-1.5">
          {t('timezone')}
        </label>
        <p className="flex min-h-11 items-center rounded-xl border border-border px-3 py-2.5 text-sm text-text-muted">America/Sao_Paulo · Brasília</p>
      </div>
    </Card>
  )
}
