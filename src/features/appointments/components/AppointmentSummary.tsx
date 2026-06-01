'use client'
import { CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PaymentMethodSelector } from './PaymentMethodSelector'
import { formatCurrency } from '@/lib/utils'
import type { PaymentMethod, PaymentStatus } from '../api/appointments.api'

interface Props {
  subtotal:        number
  discount:        number
  payment:         PaymentMethod
  paymentStatus:   PaymentStatus
  isLoading:       boolean
  canSubmit:       boolean
  onDiscountChange:    (v: number)        => void
  onPaymentChange:     (v: PaymentMethod) => void
  onPaymentStatusChange: (v: PaymentStatus) => void
  onSubmit: () => void
}

export const AppointmentSummary = ({
  subtotal, discount, payment, paymentStatus,
  isLoading, canSubmit,
  onDiscountChange, onPaymentChange, onPaymentStatusChange, onSubmit,
}: Props) => {
  const t = useTranslations('appointments')
  const total    = Math.max(0, subtotal - discount)
  const isPending = paymentStatus === 'PENDING'

  return (
    <div className="bg-text rounded-xl p-5 text-white">
      <div className="text-sm font-semibold text-gold-btn mb-5">{t('orderSummary')}</div>

      <div className="flex justify-between text-sm text-white/60 mb-3">
        <span>{t('subtotal')}</span>
        <span className="text-white">{formatCurrency(subtotal)}</span>
      </div>

      <div className="flex justify-between items-center text-sm text-white/60 mb-4">
        <span>{t('discount')}</span>
        <div className="relative w-20">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40 text-xs">R$</span>
          <input
            type="number"
            value={discount}
            onChange={e => onDiscountChange(Number(e.target.value))}
            className="w-full bg-transparent border border-white/20 rounded-md py-1 pl-7 pr-2 text-white text-sm"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-5 pt-3 border-t border-white/10">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{t('total')}</span>
        <span className="text-2xl font-black text-gold-btn">{formatCurrency(total)}</span>
      </div>

      <div className="text-xs text-white/40 uppercase tracking-wide mb-2">{t('paymentStatus')}</div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {(['PAID', 'PENDING'] as PaymentStatus[]).map(s => (
          <button
            key={s}
            onClick={() => onPaymentStatusChange(s)}
            className={`py-2.5 rounded-lg text-xs font-semibold border transition-colors ${
              paymentStatus === s
                ? s === 'PAID'
                  ? 'border-green-400 bg-green-400/20 text-green-300'
                  : 'border-amber-400 bg-amber-400/20 text-amber-300'
                : 'border-white/15 text-white/40 hover:border-white/30'
            }`}
          >
            {s === 'PAID' ? t('paid') : t('pending')}
          </button>
        ))}
      </div>

      {!isPending && (
        <>
          <div className="text-xs text-white/40 uppercase tracking-wide mb-2">{t('paymentMethod')}</div>
          <div className="mb-5">
            <PaymentMethodSelector value={payment} onChange={onPaymentChange} dark />
          </div>
        </>
      )}

      {isPending && (
        <div className="mb-5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white/40 italic">
          {t('pendingNote')}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isLoading || !canSubmit}
        className="w-full bg-gold-btn text-text font-semibold rounded-lg py-3 flex items-center justify-center gap-2 text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CheckCircle size={16} />
        {isLoading ? t('finalizing') : t('finalize')}
      </button>
      <p className="mt-4 bg-white/5 rounded-lg p-3 text-[11px] text-white/40 leading-relaxed">{t('finalizeNote')}</p>
    </div>
  )
}
