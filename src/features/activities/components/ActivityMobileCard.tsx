'use client'
import { Trash2, Pencil, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Display'
import { Button } from '@/components/ui/Button'
import { formatCurrency, getAvatarColor } from '@/lib/utils'
import type { Appointment } from '@/features/appointments/api/appointments.api'

const fmt = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))

interface Props {
  appointment: Appointment
  onDelete:    () => void
  onEdit:      () => void
  onMarkPaid:  () => void
}

export const ActivityMobileCard = ({ appointment: a, onDelete, onEdit, onMarkPaid }: Props) => {
  const t = useTranslations('activities')
  const isPending = a.paymentStatus === 'PENDING'

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <Avatar initials={a.customerName.charAt(0)} color={getAvatarColor(a.customerName)} size="md" />
          <div>
            <div className="font-semibold text-sm">{a.customerName}</div>
            <div className="text-xs text-text-light">{fmt(a.appointmentDate)}</div>
          </div>
        </div>
        <Badge variant={isPending ? 'yellow' : 'green'}>
          {isPending ? t('pendingBadge') : t('paidBadge')}
        </Badge>
      </div>

      {a.items.map((item, j) => (
        <div key={j} className="flex justify-between py-1.5 border-b border-divider last:border-0 text-xs">
          <span className="text-text-muted">{item.serviceName} · {item.professionalName}</span>
          <span className="font-medium">{formatCurrency(item.value)}</span>
        </div>
      ))}

      <div className="flex justify-between mt-2 pt-2 border-t border-border">
        <span className="text-xs text-text-light">{t('tableValueCol')}</span>
        <div className="text-right">
          {a.discount > 0 && (
            <div className="text-[10px] text-text-muted line-through">{formatCurrency(a.subtotal)}</div>
          )}
          <span className="text-sm font-bold">{formatCurrency(a.total)}</span>
        </div>
      </div>

      <div className={`grid gap-2 mt-3 ${isPending ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {isPending && (
          <Button
            variant="primary"
            size="sm"
            className="justify-center bg-green-600 hover:bg-green-700 border-green-600"
            onClick={onMarkPaid}
          >
            <CheckCircle size={13} /> {t('markAsPaid')}
          </Button>
        )}
        <Button variant="outline" size="sm" className="justify-center" onClick={onEdit}>
          <Pencil size={13} /> {t('editAppointment')}
        </Button>
        <Button variant="danger" size="sm" className="justify-center" onClick={onDelete}>
          <Trash2 size={13} />
        </Button>
      </div>
    </Card>
  )
}
