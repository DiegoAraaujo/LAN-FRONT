'use client'
import { useTranslations } from 'next-intl'
import type { Appointment } from '@/features/appointments/api/appointments.api'

export function AppointmentPaymentMethods({ appointment }: { appointment: Appointment }) {
  const t = useTranslations('finance')
  const methods = appointment.paymentMethods ?? (appointment.paymentMethod ? [appointment.paymentMethod] : [])
  const labels = methods.map(method => t(`methods.${method}`))
  if (appointment.usesCredit) labels.push(t('creditUsed'))
  return <p className="mt-2 text-xs text-text-muted">{t('paymentMethod')}: {labels.join(' + ') || '—'}</p>
}
