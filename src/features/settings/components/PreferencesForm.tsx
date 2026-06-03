'use client'
import { useTranslations } from 'next-intl'
import { Globe } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useLocaleStore } from '@/stores/locale.store'
import { cn } from '@/lib/utils'

const TIMEZONES = [
  { value: 'brasilia', label: '(GMT-03:00) Brasília' },
  { value: 'manaus',   label: '(GMT-04:00) Manaus'   },
]

export const PreferencesForm = () => {
  const t = useTranslations('settings')
  const { locale, setLocale } = useLocaleStore()

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 font-semibold text-sm text-text mb-4">
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
            <button key={opt.value} onClick={() => setLocale(opt.value)}
              className={cn(
                'flex items-center justify-center gap-2 border rounded-lg py-2.5 text-sm font-medium transition-all',
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
        <select className="w-full sm:w-64 border border-border rounded-lg px-3 py-2.5 text-sm bg-surface appearance-none">
          {TIMEZONES.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
        </select>
      </div>
    </Card>
  )
}
