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
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <Card className="p-5">
        <div className="text-xs text-text-light mb-1.5">{t('totalServices')}</div>
        <div className="text-2xl font-bold text-text">{services.length}</div>
      </Card>
      <Card className="p-5 hidden sm:block">
        <div className="text-xs text-text-light mb-1.5">{t('avgPrice')}</div>
        <div className="text-2xl font-bold text-gold">{formatCurrency(avg)}</div>
      </Card>
      <Card className="p-5">
        <div className="text-xs text-text-light mb-1.5">{t('minPrice')}</div>
        <div className="text-2xl font-bold text-text">{services.length > 0 ? formatCurrency(min) : '—'}</div>
      </Card>
    </div>
  )
}
