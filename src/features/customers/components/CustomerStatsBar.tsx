'use client'
import { useTranslations } from 'next-intl'
import type { CustomerStatus, CustomersDashboard } from '../api/customers.api'

interface Props { data?: CustomersDashboard; selected?: CustomerStatus; onSelect: (status?: CustomerStatus) => void }

export const CustomerStatsBar = ({ data, selected, onSelect }: Props) => {
  const t = useTranslations('clients')
  const items: { label: string; value?: number; status?: CustomerStatus }[] = [
    { label: t('totalClients'), value: data?.total },
    { label: t('activeClients'), value: data?.active, status: 'ACTIVE' },
    { label: t('inactiveClients'), value: data?.inactive, status: 'INACTIVE' },
    { label: t('occasionalClients'), value: data?.occasional, status: 'OCCASIONAL' },
  ]
  return <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
    {items.map(item => <button key={item.label} type="button" aria-pressed={selected === item.status} onClick={() => onSelect(item.status)} className={`rounded-2xl border px-4 py-3 text-left transition-colors ${selected === item.status ? 'border-gold-btn bg-gold-light/30' : 'border-border bg-surface hover:border-gold-btn'}`}>
      <span className="mb-1 block text-xs font-medium text-text-muted">{item.label}</span>
      <strong className="text-xl font-semibold tabular-nums">{item.value ?? '?'}</strong>
    </button>)}
  </div>
}
