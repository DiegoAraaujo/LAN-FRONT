'use client'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Toggle, Avatar } from '@/components/ui/Display'
import { CustomerContactBadges } from './CustomerContactBadges'
import { getInitials, getAvatarColor, formatCurrency } from '@/lib/utils'
import type { Customer } from '../api/customers.api'

interface Props {
  customer:   Customer
  index:      number
  onToggle:   () => void
  onEdit:     () => void
  onDelete:   () => void
  onViewDetail: () => void
}

export const CustomerTableRow = ({ customer, index, onToggle, onEdit, onDelete, onViewDetail }: Props) => {
  const t = useTranslations('clients')

  return (
    <tr className={index > 0 ? 'border-t border-border' : ''}>

      <td className="px-5 py-4">
        <button onClick={onViewDetail} className="flex items-center gap-3 group text-left cursor-pointer">
          <Avatar initials={getInitials(customer.name)} color={getAvatarColor(customer.name)} />
          <span className="font-semibold text-sm text-text group-hover:text-gold transition-colors underline-offset-2 group-hover:underline">
            {customer.name}
          </span>
        </button>
      </td>

      <td className="px-5 py-4 text-sm text-text-muted">
        {customer.address || (
          <span className="italic text-text-light">{t('noAddress')}</span>
        )}
      </td>

      <td className="px-5 py-4">
        {customer.whatsapp || customer.instagram ? (
          <CustomerContactBadges whatsapp={customer.whatsapp} instagram={customer.instagram} compact />
        ) : (
          <span className="text-xs italic text-text-light">{t('noContacts')}</span>
        )}
      </td>

      <td className="px-5 py-4 text-sm text-text-muted">
        {customer.totalAppointments ?? 0}
      </td>

      <td className="px-5 py-4 text-sm font-medium">
        {formatCurrency(customer.totalSpent ?? 0)}
      </td>

      <td className="px-5 py-4">
        <Toggle checked={customer.status === 'ACTIVE'} onChange={onToggle} />
      </td>

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
