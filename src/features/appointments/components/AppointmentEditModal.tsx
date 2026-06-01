'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { PaymentMethodSelector } from './PaymentMethodSelector'
import { formatCurrency } from '@/lib/utils'
import type { Appointment, PaymentMethod, PaymentStatus } from '../api/appointments.api'

interface Props {
  open:        boolean
  appointment: Appointment | null
  isLoading:   boolean
  onClose:     () => void
  onSave:      (id: string, data: {
    paymentStatus:  PaymentStatus
    paymentMethod?: PaymentMethod
    discount:       number
    notes?:         string
    appointmentDate: string
  }) => void
}

export const AppointmentEditModal = ({ open, appointment: a, isLoading, onClose, onSave }: Props) => {
  const t = useTranslations('appointments')
  const tc = useTranslations('common')

  const [paymentStatus,  setPaymentStatus]  = useState<PaymentStatus>('PENDING')
  const [paymentMethod,  setPaymentMethod]  = useState<PaymentMethod>('PIX')
  const [discount,       setDiscount]       = useState(0)
  const [notes,          setNotes]          = useState('')
  const [date,           setDate]           = useState('')

  useEffect(() => {
    if (!a) return
    setPaymentStatus(a.paymentStatus)
    setPaymentMethod(a.paymentMethod)
    setDiscount(a.discount)
    setNotes(a.notes ?? '')
    const local = new Date(a.appointmentDate)
    const pad = (n: number) => String(n).padStart(2, '0')
    setDate(`${local.getFullYear()}-${pad(local.getMonth()+1)}-${pad(local.getDate())}T${pad(local.getHours())}:${pad(local.getMinutes())}`)
  }, [a, open])

  if (!a) return null

  const isPending = paymentStatus === 'PENDING'
  const total     = Math.max(0, a.subtotal - discount)

  const handleSave = () => {
    onSave(a.id, {
      paymentStatus,
      paymentMethod: isPending ? undefined : paymentMethod,
      discount,
      notes:         notes || undefined,
      appointmentDate: new Date(date).toISOString(),
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('editAppointment')}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>{tc('cancel')}</Button>
          <Button variant="primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? tc('saving') : tc('save')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="bg-bg rounded-xl p-4">
          <div className="text-xs text-text-light uppercase tracking-wide font-medium mb-2">
            {t('clientSelection')}
          </div>
          <div className="font-semibold text-sm text-text mb-2">{a.customerName}</div>
          <div className="flex flex-col gap-1">
            {a.items.map((item, i) => (
              <div key={i} className="flex justify-between text-xs text-text-muted">
                <span>{item.serviceName} · {item.professionalName}</span>
                <span className="font-medium">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs font-bold text-text mt-2 pt-2 border-t border-border">
            <span>{t('subtotal')}</span>
            <span>{formatCurrency(a.subtotal)}</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-1.5">
            {t('appointmentDate')}
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-surface text-text"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-1.5">
            {t('discount')} (R$)
          </label>
          <div className="flex items-center gap-3">
            <div className="relative w-32">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-light">R$</span>
              <input
                type="number"
                min={0}
                max={a.subtotal}
                step={0.01}
                value={discount}
                onChange={e => setDiscount(Number(e.target.value))}
                className="w-full border border-border rounded-lg pl-7 pr-3 py-2.5 text-sm bg-surface text-text"
              />
            </div>
            <div className="text-sm text-text-muted">
              {t('total')}: <span className="font-bold text-text">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-2">
            {t('paymentStatus')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['PAID', 'PENDING'] as PaymentStatus[]).map(s => (
              <button
                key={s}
                onClick={() => setPaymentStatus(s)}
                className={`py-2.5 rounded-lg text-xs font-semibold border transition-colors ${
                  paymentStatus === s
                    ? s === 'PAID'
                      ? 'border-success bg-green-50 text-green-700'
                      : 'border-warning bg-amber-50 text-amber-700'
                    : 'border-border text-text-muted'
                }`}
              >
                {s === 'PAID' ? t('paid') : t('pending')}
              </button>
            ))}
          </div>
        </div>

        {!isPending && (
          <div>
            <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-2">
              {t('paymentMethod')}
            </label>
            <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
          </div>
        )}

        <Textarea
          label={`${t('notes')} (${tc('optional')})`}
          placeholder={t('notesPlaceholder')}
          className="min-h-20"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>
    </Modal>
  )
}
