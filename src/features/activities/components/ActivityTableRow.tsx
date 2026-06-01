'use client'
import { Trash2, Pencil, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Display'
import { formatCurrency, getAvatarColor, cn } from '@/lib/utils'
import type { Appointment } from '@/features/appointments/api/appointments.api'

const DOT = ['bg-success', 'bg-gold', 'bg-warning']

const fmt = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))

interface Props {
  appointment: Appointment
  index:       number
  onDelete:    () => void
  onEdit:      () => void
  onMarkPaid:  () => void
}

export const ActivityTableRow = ({ appointment: a, index, onDelete, onEdit, onMarkPaid }: Props) => {
  const t = useTranslations('activities')
  const isPending = a.paymentStatus === 'PENDING'

  return (
    <tr className={index > 0 ? 'border-t border-border' : ''}>

      <td className="px-5 py-4 text-sm text-text">{fmt(a.appointmentDate)}</td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <Avatar initials={a.customerName.charAt(0)} color={getAvatarColor(a.customerName)} />
          <span className="text-sm font-medium">{a.customerName}</span>
        </div>
      </td>

      <td className="px-5 py-4">
        {a.items.map((item, j) => (
          <div key={j} className="mb-1.5">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <span className={cn('w-2 h-2 rounded-full shrink-0', DOT[j % 3])} />
              {item.serviceName}
            </div>
            <div className="text-xs text-text-light pl-3.5">{item.professionalName}</div>
          </div>
        ))}
      </td>

      <td className="px-5 py-4">
        {a.discount > 0 && (
          <div className="text-xs text-text-muted line-through">{formatCurrency(a.subtotal)}</div>
        )}
        <div className="text-sm font-bold">{formatCurrency(a.total)}</div>
      </td>

      <td className="px-5 py-4">
        <Badge variant={isPending ? 'yellow' : 'green'}>
          {isPending ? t('pendingBadge') : t('paidBadge')}
        </Badge>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5">
          {isPending && (
            <button
              onClick={onMarkPaid}
              title={t('markAsPaid')}
              className="w-7 h-7 flex items-center justify-center rounded text-green-600 hover:bg-green-50 transition-colors"
            >
              <CheckCircle size={15} />
            </button>
          )}

          <button
            onClick={onEdit}
            title={t('editAppointment')}
            className="w-7 h-7 flex items-center justify-center rounded text-gold hover:bg-amber-50 transition-colors"
          >
            <Pencil size={14} />
          </button>

          <button
            onClick={onDelete}
            title={t('deleteAppointment')}
            className="w-7 h-7 flex items-center justify-center rounded text-red-400 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  )
}
