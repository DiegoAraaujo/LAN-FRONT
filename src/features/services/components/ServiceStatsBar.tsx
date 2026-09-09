'use client'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import type { Service } from '../api/services.api'

interface Props { services: Service[] }

export const ServiceStatsBar = ({ services }: Props) => {
  const t   = useTranslations('services')
  const avg = services.length > 0 ? services.reduce((a, s) => a + s.price, 0) / services.length : 0
  const min = services.length > 0 ? Math.min(...services.map(s => s.price)) : 0

  return (
    <div className="grid grid-cols-1 gap-4 min-[440px]:grid-cols-3">
      <Card className="p-5">
        <div className="mb-2 text-sm font-medium text-text-muted">{t('totalServices')}</div>
        <div className="text-2xl font-semibold tracking-tight text-text">{services.length}</div>
      </Card>
      <Card className="p-5">
        <div className="mb-2 text-sm font-medium text-text-muted">{t('avgPrice')}</div>
        <div className="text-2xl font-semibold tracking-tight text-gold">{formatCurrency(avg)}</div>
      </Card>
      <Card className="p-5">
        <div className="mb-2 text-sm font-medium text-text-muted">{t('minPrice')}</div>
        <div className="text-2xl font-semibold tracking-tight text-text">{services.length > 0 ? formatCurrency(min) : '—'}</div>
      </Card>
    </div>
  )
}
