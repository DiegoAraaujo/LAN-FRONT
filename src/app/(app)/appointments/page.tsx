'use client'
import Link from 'next/link'
import { PaymentModal } from '@/features/finance/PaymentModal'
import type { Appointment } from '@/features/appointments/api/appointments.api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { QueryError } from '@/components/ui/QueryError'
import { extractValidationErrors } from '@/lib/api'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PageHeader } from '@/components/ui/Display'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { ClientSearchInput } from '@/features/appointments/components/ClientSearchInput'
import { AppointmentItemRow, type ItemRowData } from '@/features/appointments/components/AppointmentItemRow'
import { AppointmentSummary } from '@/features/appointments/components/AppointmentSummary'
import { useCreateAppointment } from '@/features/appointments/hooks/useCreateAppointment'
import { useServices } from '@/features/services/hooks/useServices'
import type { Customer } from '@/features/customers/api/customers.api'
import type { PaymentMethod, PaymentStatus } from '@/features/appointments/api/appointments.api'

const newItem = (): ItemRowData => ({ id: crypto.randomUUID(), serviceId: '', professionalId: '' })

const AppointmentsPage = () => {
  const t = useTranslations('appointments')
  const e = useTranslations('experience')
  const [payTarget, setPayTarget] = useState<Appointment | null>(null)
  const [formError, setFormError] = useState('')
  const [attempted, setAttempted] = useState(false)

  const [client, setClient]               = useState<Customer | null>(null)
  const [date, setDate]                   = useState('')
  const [items, setItems]                 = useState<ItemRowData[]>(() => [newItem()])
  const [discount, setDiscount]           = useState(0)
  const [payment, setPayment]             = useState<PaymentMethod>('PIX')
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PAID')
  const [notes, setNotes]                 = useState('')

  const { data: services = [], isError, refetch } = useServices()

  const createMutation = useCreateAppointment(appointment => {
    if (paymentStatus === "PARTIAL") setPayTarget({ ...appointment, customerName: client?.name ?? "", remaining: appointment.total, paidAmount: 0 })
    setAttempted(false)
    toast.dismiss('appointment-validation')
    setFormError(''); setClient(null); setDate(''); setItems([newItem()])
    setDiscount(0); setPayment('PIX'); setPaymentStatus('PAID'); setNotes('')
  })

  const addItem    = () => setItems(prev => [...prev, newItem()])
  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))
  const updateItem = (id: string, field: 'serviceId' | 'professionalId', value: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))

  const subtotal         = items.reduce((acc, item) => {
    const svc = services.find(s => s.id === item.serviceId)
    return acc + (svc?.price ?? 0)
  }, 0)
  const selectedServiceIds = items.map(i => i.serviceId).filter(Boolean)

  const dateValid = !!date && Number.isFinite(new Date(date).getTime())
  const complete = !!client && dateValid && items.length > 0 && items.every(i => i.serviceId && i.professionalId)
  const discountValid = Number.isFinite(discount) && discount >= 0 && discount <= subtotal
  const handleSubmit = () => {
    if (createMutation.isPending) return
    setAttempted(true)
    setFormError('')
    if (!complete || !client) { toast.error(e('invalidAppointment'), { id: 'appointment-validation' }); return }
    if (!discountValid) { toast.error(e('invalidDiscount'), { id: 'appointment-validation' }); return }
    toast.dismiss('appointment-validation')

    createMutation.mutate({
      customerId:      client.id,
      appointmentDate: new Date(date).toISOString(),
      discount,
      paymentStatus: paymentStatus === "PARTIAL" ? "PENDING" : paymentStatus,
      paymentMethod: paymentStatus !== 'PAID' ? null : payment,
      notes:         notes || undefined,
      items:         items.map(({ serviceId, professionalId }) => ({ serviceId, professionalId })),
    }, { onError: error => {
      const fields = extractValidationErrors(error)
      setFormError(Object.keys(fields).length ? e('formErrors') : e('loadError'))
    } })
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-8">
      {payTarget && <PaymentModal key={payTarget.id} appointment={payTarget} onClose={() => setPayTarget(null)}/>}
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <Link href="/activities" className="inline-flex min-h-11 items-center rounded-xl border border-border bg-surface px-4 text-sm font-medium text-text hover:border-gold-btn">Consultar atendimentos e pagamentos</Link>
      {isError && <QueryError onRetry={() => refetch()}/>}
      {formError && <p role="alert" className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-danger">{formError}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        <div className="flex flex-col gap-4">

          <Card className="p-5">
            <h2 className="mb-4 text-base font-semibold text-text">{t('clientSelection')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <ClientSearchInput selected={client} onSelect={setClient} error={attempted && !client ? e('selectCustomer') : undefined} />
                <Input
                  label={t('appointmentDate')} type="datetime-local"
                  error={attempted && !dateValid ? e('requiredDate') : undefined}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
            </div>
            {!client && (
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center text-sm text-text-light">
                {t('noClientHint')}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-text">{t('servicesProvided')}</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={addItem}
                disabled={items.length >= services.length || items.some(i => !i.serviceId || !i.professionalId)}
              >
                <Plus size={13} /> {t('addItem')}
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              {items.map(item => (
                <AppointmentItemRow
                  key={item.id}
                  item={item}
                  showErrors={attempted}
                  services={services}
                  usedServiceIds={selectedServiceIds.filter(id => id !== item.serviceId)}
                  showRemove={items.length > 1}
                  onChange={updateItem}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <Textarea
              label={t('notes')}
              placeholder={t('notesPlaceholder')}
              className="mt-4 min-h-22.5"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </Card>
        </div>

        <div className="lg:sticky lg:top-4 h-fit">
          <AppointmentSummary
            subtotal={subtotal}
            discount={discount}
            payment={payment}
            paymentStatus={paymentStatus}
            isLoading={createMutation.isPending}
            canSubmit={!isError}
            onDiscountChange={setDiscount}
            onPaymentChange={setPayment}
            onPaymentStatusChange={setPaymentStatus}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}

export default AppointmentsPage
