'use client'
import { useLocale, useTranslations } from 'next-intl'
interface Props { year: number; month?: number; onYearChange: (y: number) => void; onMonthChange: (m: number | undefined) => void }
export const DashboardPeriodFilter = ({ year, month, onYearChange, onMonthChange }: Props) => {
  const locale = useLocale()
  const t = useTranslations('overview')
  const years = Array.from(new Set([year, ...Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + 1 - i)])).sort((a,b) => b-a)
  return <div className="flex flex-wrap items-center gap-2">
    <select aria-label={t('month')} value={month ?? ''} onChange={e => onMonthChange(e.target.value ? Number(e.target.value) : undefined)} className="border border-border bg-surface rounded-xl px-3 py-2.5 text-sm capitalize">
      <option value="">{t('allYear')}</option>
      {Array.from({ length: 12 }, (_, i) => <option key={i} value={i+1}>{new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2026,i,1)))}</option>)}
    </select>
    <select aria-label={t('year')} value={year} onChange={e => onYearChange(Number(e.target.value))} className="border border-border bg-surface rounded-xl px-3 py-2.5 text-sm">
      {years.map(y => <option key={y} value={y}>{y}</option>)}
    </select>
  </div>
}
