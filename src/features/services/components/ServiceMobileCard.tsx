'use client'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import type { Service } from '../api/services.api'

interface Props { service: Service; onEdit: () => void; onDelete: () => void }

export const ServiceMobileCard = ({ service, onEdit, onDelete }: Props) => {
  const t  = useTranslations('services')
  const common = useTranslations('common')

  return (
    <Card className="p-4 flex items-center justify-between">
      <div>
        <div className="font-semibold text-sm text-text mb-0.5">{service.name}</div>
        <div className="text-xs mb-1 line-clamp-1">
          {service.description
            ? <span className="text-text-muted">{service.description}</span>
            : <span className="italic text-text-light">{t('noDescription')}</span>
          }
        </div>
        <div className="text-base font-bold text-gold">{formatCurrency(service.price)}</div>
      </div>
      <div className="flex gap-2">
        <button aria-label={common('edit')} onClick={onEdit} className="w-10 h-10 border border-border rounded-lg flex items-center justify-center text-gold">
          <Pencil size={14} />
        </button>
        <button aria-label={common('delete')} onClick={onDelete} className="w-10 h-10 border border-red-100 rounded-lg flex items-center justify-center text-red-400">
          <Trash2 size={14} />
        </button>
      </div>
    </Card>
  )
}
