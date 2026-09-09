'use client'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { CustomersDashboard } from '../api/customers.api'

interface Props { data?: CustomersDashboard }

export const CustomerStatsBar = ({ data }: Props) => {
  const t = useTranslations('clients')
  return (
    <div className="grid grid-cols-1 gap-4 min-[440px]:grid-cols-3">
      {[
        { label: t('totalClients'), value: data?.total        ?? '—', gold: false },
        { label: t('activeClients'),value: data?.active       ?? '—', gold: true  },
        { label: t('newMonth'),     value: `+${data?.newThisMonth ?? 0}`, gold: false },
      ].map((s) => (
        <Card key={s.label} className="p-5">
          <div className="mb-2 text-sm font-medium text-text-muted">{s.label}</div>
          <div className={cn('text-2xl font-semibold tracking-tight', s.gold ? 'text-gold' : 'text-text')}>
            {s.value}
          </div>
        </Card>
      ))}
    </div>
  )
}
