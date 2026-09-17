'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { CalendarPlus, Plus, Scissors } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { QueryError } from '@/components/ui/QueryError'
import { extractValidationErrors } from '@/lib/api'
import { useServices } from '@/features/services/hooks/useServices'
import type { Customer } from '@/features/customers/api/customers.api'
import type { Appointment, PaymentMethod, PaymentStatus } from '../api/appointments.api'
import { useCreateAppointment } from '../hooks/useCreateAppointment'
import { ClientSearchInput } from './ClientSearchInput'
import { AppointmentItemRow, type ItemRowData } from './AppointmentItemRow'
import { AppointmentSummary } from './AppointmentSummary'

const newItem = (): ItemRowData => ({ id: crypto.randomUUID(), serviceId: '', professionalId: '' })

interface Props {
  open: boolean
  onClose: () => void
  onPaymentNeeded: (appointment: Appointment) => void
}

export const AppointmentCreateModal = ({ open, onClose, onPaymentNeeded }: Props) => {
  const t = useTranslations('appointments')
  const e = useTranslations('experience')
  const [client, setClient] = useState<Customer | null>(null)
  const [date, setDate] = useState('')
  const [items, setItems] = useState<ItemRowData[]>(() => [newItem()])
  const [discount, setDiscount] = useState(0)
  const [payment, setPayment] = useState<PaymentMethod>('PIX')
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PAID')
  const [notes, setNotes] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [formError, setFormError] = useState('')
  const { data: services = [], isError, refetch } = useServices()

  const resetAndClose = () => {
    setClient(null); setDate(''); setItems([newItem()]); setDiscount(0)
    setPayment('PIX'); setPaymentStatus('PAID'); setNotes(''); setAttempted(false); setFormError('')
    toast.dismiss('appointment-validation')
    onClose()
  }

  const createMutation = useCreateAppointment(appointment => {
    const paymentTarget = paymentStatus === 'PARTIAL'
      ? { ...appointment, customerName: client?.name ?? '', remaining: appointment.total, paidAmount: 0 }
      : null
    resetAndClose()
    if (paymentTarget) onPaymentNeeded(paymentTarget)
  })

  const subtotal = items.reduce((sum, item) => sum + (services.find(service => service.id === item.serviceId)?.price ?? 0), 0)
  const selectedServiceIds = items.map(item => item.serviceId).filter(Boolean)
  const dateValid = !!date && Number.isFinite(new Date(date).getTime())
  const complete = !!client && dateValid && items.length > 0 && items.every(item => item.serviceId && item.professionalId)
  const discountValid = Number.isFinite(discount) && discount >= 0 && discount <= subtotal

  const submit = () => {
    if (createMutation.isPending) return
    setAttempted(true); setFormError('')
    if (!complete || !client) { toast.error(e('invalidAppointment'), { id: 'appointment-validation' }); return }
    if (!discountValid) { toast.error(e('invalidDiscount'), { id: 'appointment-validation' }); return }
    toast.dismiss('appointment-validation')
    createMutation.mutate({
      customerId: client.id,
      appointmentDate: new Date(date).toISOString(),
      discount,
      paymentStatus: paymentStatus === 'PARTIAL' ? 'PENDING' : paymentStatus,
      paymentMethod: paymentStatus === 'PAID' ? payment : null,
      notes: notes || undefined,
      items: items.map(({ serviceId, professionalId }) => ({ serviceId, professionalId })),
    }, { onError: error => {
      const fields = extractValidationErrors(error)
      setFormError(Object.keys(fields).length ? e('formErrors') : e('loadError'))
    } })
  }

  return <Modal open={open} onClose={resetAndClose} busy={createMutation.isPending} size="2xl" title="Novo atendimento">
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-gold shadow-sm"><CalendarPlus size={20}/></span>
        <div><p className="text-sm font-semibold">Registre tudo em um só lugar</p><p className="text-xs text-amber-800/80">Cliente, serviços, profissional e pagamento no mesmo fluxo.</p></div>
      </div>
      {isError && <QueryError onRetry={() => refetch()}/>} 
      {formError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-danger">{formError}</p>}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700">1</span><h3 className="font-semibold">{t('clientSelection')}</h3></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ClientSearchInput selected={client} onSelect={setClient} error={attempted && !client ? e('selectCustomer') : undefined}/>
              <Input label={t('appointmentDate')} type="datetime-local" value={date} error={attempted && !dateValid ? e('requiredDate') : undefined} onChange={event => setDate(event.target.value)}/>
            </div>
          </section>
          <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-amber-50 text-amber-700"><Scissors size={15}/></span><h3 className="font-semibold">{t('servicesProvided')}</h3></div>
              <Button variant="outline" size="sm" onClick={() => setItems(rows => [...rows, newItem()])} disabled={items.length >= services.length || items.some(item => !item.serviceId || !item.professionalId)}><Plus size={13}/>{t('addItem')}</Button>
            </div>
            <div className="space-y-3">{items.map(item => <AppointmentItemRow key={item.id} item={item} services={services} usedServiceIds={selectedServiceIds.filter(id => id !== item.serviceId)} showRemove={items.length > 1} showErrors={attempted} onChange={(id, field, value) => setItems(rows => rows.map(row => row.id === id ? { ...row, [field]: value } : row))} onRemove={id => setItems(rows => rows.filter(row => row.id !== id))}/>)}</div>
            <Textarea label={t('notes')} placeholder={t('notesPlaceholder')} className="mt-4 min-h-20" value={notes} onChange={event => setNotes(event.target.value)}/>
          </section>
        </div>
        <div className="h-fit lg:sticky lg:top-0"><AppointmentSummary subtotal={subtotal} discount={discount} payment={payment} paymentStatus={paymentStatus} isLoading={createMutation.isPending} canSubmit={!isError} onDiscountChange={setDiscount} onPaymentChange={setPayment} onPaymentStatusChange={setPaymentStatus} onSubmit={submit}/></div>
      </div>
    </div>
  </Modal>
}
