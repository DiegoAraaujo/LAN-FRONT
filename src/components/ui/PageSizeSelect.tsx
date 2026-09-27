'use client'
import { useTranslations } from 'next-intl'
import { PAGE_SIZES } from '@/hooks/usePageSize'

export function PageSizeSelect({ value, onChange, disabled = false }: { value: number; onChange: (value: number) => void; disabled?: boolean }) {
  const t = useTranslations('experience')
  return <label className="flex items-center gap-2 text-xs text-text-muted">
    {t('itemsPerPage')}
    <select value={value} onChange={event => onChange(Number(event.target.value))} disabled={disabled}
      className="rounded-md border border-border bg-surface px-2 py-2 text-sm text-text focus-visible:outline-2 focus-visible:outline-gold-btn disabled:opacity-50">
      {PAGE_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
    </select>
  </label>
}
