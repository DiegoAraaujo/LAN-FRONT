'use client'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { CustomersDashboard } from '../api/customers.api'

interface Props { data?: CustomersDashboard }

export const CustomerStatsBar = ({ data }: Props) => {
  const t = useTranslations('clients')
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {[
        { label: t('totalClients'), value: data?.total        ?? '—', gold: false },
        { label: t('activeClients'),value: data?.active       ?? '—', gold: true  },
        { label: t('newMonth'),     value: `+${data?.newThisMonth ?? 0}`, gold: false },
      ].map((s) => (
        <Card key={s.label} className="p-4 sm:p-5">
          <div className="text-[10px] sm:text-xs text-text-light mb-1.5">{s.label}</div>
          <div className={cn('text-xl sm:text-2xl font-bold', s.gold ? 'text-gold' : 'text-text')}>
            {s.value}
          </div>
        </Card>
      ))}
    </div>
  )
}
