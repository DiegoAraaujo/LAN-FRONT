'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { PaymentMethodSelector } from './PaymentMethodSelector'
import type { PaymentMethod } from '../api/appointments.api'

interface Props {
  open:      boolean
  onClose:   () => void
  onConfirm: (method: PaymentMethod) => void
  isLoading: boolean
}

export const MarkAsPaidModal = ({ open, onClose, onConfirm, isLoading }: Props) => {
  const t = useTranslations('appointments')
  const tc = useTranslations('common')
  const [method, setMethod] = useState<PaymentMethod>('PIX')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('markAsPaid')}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>{tc('cancel')}</Button>
          <Button variant="primary" onClick={() => onConfirm(method)} disabled={isLoading}>
            {isLoading ? tc('saving') : tc('save')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-text-muted">{t('selectPaymentMethod')}</p>
        <PaymentMethodSelector value={method} onChange={setMethod} />
      </div>
    </Modal>
  )
}