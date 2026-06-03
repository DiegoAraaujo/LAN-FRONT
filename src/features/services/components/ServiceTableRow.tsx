'use client'
import { Pencil, Trash2, Wrench } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { formatCurrency } from '@/lib/utils'
import type { Service } from '../api/services.api'

interface Props { service: Service; index: number; onEdit: () => void; onDelete: () => void }

export const ServiceTableRow = ({ service, index, onEdit, onDelete }: Props) => {
  const t = useTranslations('services')

  return (
    <tr className={index > 0 ? 'border-t border-border' : ''}>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-bg rounded-lg flex items-center justify-center text-gold">
            <Wrench size={16} />
          </div>
          <span className="font-medium text-sm text-text">{service.name}</span>
        </div>
      </td>
      <td className="px-5 py-4 text-sm max-w-xs truncate">
        {service.description
          ? <span className="text-text-muted">{service.description}</span>
          : <span className="italic text-text-light">{t('noDescription')}</span>
        }
      </td>
      <td className="px-5 py-4 text-sm font-bold text-text">{formatCurrency(service.price)}</td>
      <td className="px-5 py-4">
        <div className="flex gap-2">
          <button onClick={onEdit} className="w-7 h-7 flex items-center justify-center rounded text-gold hover:bg-amber-50 transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={onDelete} className="w-7 h-7 flex items-center justify-center rounded text-red-400 hover:bg-red-50 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  )
}
