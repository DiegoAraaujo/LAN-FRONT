'use client'
import { Banknote, CreditCard } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { PaymentMethod } from '../api/appointments.api'

interface Props { value: PaymentMethod; onChange: (v: PaymentMethod) => void; dark?: boolean }

export const PaymentMethodSelector = ({ value, onChange, dark }: Props) => {
  const t = useTranslations('appointments')

  const OPTIONS: { key: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { key: 'PIX',   label: t('pix'),  icon: <Banknote   size={14} /> },
    { key: 'CARD',  label: t('card'), icon: <CreditCard size={14} /> },
    { key: 'CASH',  label: t('cash'), icon: <Banknote   size={14} /> },
    { key: 'OTHER', label: t('other'),icon: <CreditCard size={14} /> },
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {OPTIONS.map(opt => (
        <button key={opt.key} onClick={() => onChange(opt.key)}
          className={cn(
            'flex items-center justify-center gap-1.5 border rounded-lg py-2.5 text-xs font-medium transition-colors',
            value === opt.key
              ? dark ? 'border-gold-btn text-gold-btn' : 'border-gold-btn bg-amber-50 text-text'
              : dark ? 'border-white/15 text-white/50 hover:border-white/30' : 'border-border text-text-muted',
          )}>
          {opt.icon} {opt.label}
        </button>
      ))}
    </div>
  )
}
