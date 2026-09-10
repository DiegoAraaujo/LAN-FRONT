'use client'
import { useTranslations } from 'next-intl'
import type { CustomerStatus } from '../api/customers.api'

export const statusKeys = { ACTIVE: 'active', INACTIVE: 'inactive', OCCASIONAL: 'occasional' } as const
const tones = { ACTIVE: 'bg-emerald-50 text-emerald-700', INACTIVE: 'bg-slate-100 text-slate-600', OCCASIONAL: 'bg-amber-50 text-amber-800' }

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const t = useTranslations('clients')
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${tones[status]}`}>{t(statusKeys[status])}</span>
}

export function CustomerStatusSelect({ value, onChange, disabled, name }: { value: CustomerStatus; onChange: (status: CustomerStatus) => void; disabled?: boolean; name: string }) {
  const t = useTranslations('clients')
  return <select aria-label={`${t('tableStatusCol')}: ${name}`} value={value} disabled={disabled} onChange={event => onChange(event.target.value as CustomerStatus)} className={`min-h-11 w-full min-w-32 rounded-xl border border-border px-3 py-2 text-sm disabled:opacity-50 ${tones[value]}`}>
    {(Object.keys(statusKeys) as CustomerStatus[]).map(status => <option key={status} value={status}>{t(statusKeys[status])}</option>)}
  </select>
}
