'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PageHeader } from '@/components/ui/Display'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
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

  const [client, setClient]               = useState<Customer | null>(null)
  const [date, setDate]                   = useState('')
  const [items, setItems]                 = useState<ItemRowData[]>([newItem()])
  const [discount, setDiscount]           = useState(0)
  const [payment, setPayment]             = useState<PaymentMethod>('PIX')
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PAID')
  const [notes, setNotes]                 = useState('')

  const { data: services = [] } = useServices()

  const createMutation = useCreateAppointment(() => {
    setClient(null); setDate(''); setItems([newItem()])
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

  const handleSubmit = () => {
    if (!client || !date) return
    const validItems = items.filter(i => i.serviceId && i.professionalId)
    if (!validItems.length) return

    createMutation.mutate({
      customerId:      client.id,
      appointmentDate: new Date(date).toISOString(),
      discount,
      paymentStatus,
      paymentMethod: paymentStatus === 'PENDING' ? 'OTHER' : payment,
      notes:         notes || undefined,
      items:         validItems.map(({ serviceId, professionalId }) => ({ serviceId, professionalId })),
    })
  }

  return (
    <div className="p-5 sm:p-8">
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        <div className="flex flex-col gap-4">

          <Card className="p-5">
            <div className="font-semibold text-sm text-text mb-4">{t('clientSelection')}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <ClientSearchInput selected={client} onSelect={setClient} />
              <div>
                <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-1.5">
                  {t('appointmentDate')}
                </label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-surface"
                />
              </div>
            </div>
            {!client && (
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center text-sm text-text-light">
                {t('noClientHint')}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-sm text-text">{t('servicesProvided')}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={addItem}
                disabled={selectedServiceIds.length >= services.length}
              >
                <Plus size={13} /> {t('addItem')}
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              {items.map(item => (
                <AppointmentItemRow
                  key={item.id}
                  item={item}
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
            canSubmit={!!client && !!date}
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
