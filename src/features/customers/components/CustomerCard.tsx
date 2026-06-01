'use client'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Display'
import { CustomerContactBadges } from './CustomerContactBadges'
import { getInitials, getAvatarColor, formatCurrency, cn } from '@/lib/utils'
import type { Customer } from '../api/customers.api'

interface Props {
  customer:     Customer
  onEdit:       () => void
  onDelete:     () => void
  onViewDetail: () => void
}

export const CustomerCard = ({ customer, onEdit, onDelete, onViewDetail }: Props) => {
  const t  = useTranslations('clients')
  const tc = useTranslations('common')

  return (
    <Card className="p-4">
      <button onClick={onViewDetail} className="flex items-center gap-2.5 mb-3 w-full text-left group">
        <Avatar initials={getInitials(customer.name)} color={getAvatarColor(customer.name)} size="md" />
        <div>
          <div className="font-semibold text-sm text-text group-hover:text-gold transition-colors group-hover:underline underline-offset-2">
            {customer.name}
          </div>
          <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-semibold',
            customer.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
            {customer.status === 'ACTIVE' ? t('active') : t('inactive')}
          </span>
        </div>
      </button>

      <div className="flex flex-col gap-1.5 text-xs text-text-muted mb-3">
        {customer.address
          ? <span>{customer.address}</span>
          : <span className="italic text-text-light">{t('noAddress')}</span>
        }
        <span className="font-medium text-text">
          {customer.totalAppointments ?? 0} {t('tableAppointmentsCol').toLowerCase()} · {formatCurrency(customer.totalSpent ?? 0)}
        </span>
        <div className="pt-0.5">
          {customer.whatsapp || customer.instagram ? (
            <CustomerContactBadges whatsapp={customer.whatsapp} instagram={customer.instagram} />
          ) : (
            <span className="italic text-text-light">{t('noContacts')}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="primary" size="sm" className="justify-center" onClick={onEdit}>
          <Pencil size={12} /> {tc('edit')}
        </Button>
        <Button variant="danger" size="sm" className="justify-center" onClick={onDelete}>
          <Trash2 size={12} /> {tc('delete')}
        </Button>
      </div>
    </Card>
  )
}
