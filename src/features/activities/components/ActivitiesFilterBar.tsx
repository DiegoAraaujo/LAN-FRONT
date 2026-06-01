'use client'
import { Search, RotateCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { PaymentStatus } from '@/features/appointments/api/appointments.api'

const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']
const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

interface Props {
  search: string; month?: number; year?: number; paymentStatus?: PaymentStatus
  onSearch: (v: string) => void; onMonth: (v?: number) => void
  onYear: (v?: number) => void; onPaymentStatus: (v?: PaymentStatus) => void
  onReset: () => void; hasFilters: boolean
}

export const ActivitiesFilterBar = ({ search, month, year, paymentStatus, onSearch, onMonth, onYear, onPaymentStatus, onReset, hasFilters }: Props) => {
  const t  = useTranslations('activities')
  const tc = useTranslations('common')

  const MONTHS = typeof window !== 'undefined' && document.cookie.includes('locale=en') ? MONTHS_EN : MONTHS_PT

  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-45">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-1.5">{t('clientLabel')}</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
            <input type="text" placeholder={t('searchPlaceholder')} value={search}
              onChange={e => onSearch(e.target.value)}
              className="w-full border border-border rounded-lg pl-8 pr-3 py-2.5 text-sm bg-surface" />
          </div>
        </div>
        <div className="min-w-35">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-1.5">{t('monthLabel')}</label>
          <select value={month ?? ''} onChange={e => onMonth(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-surface appearance-none cursor-pointer">
            <option value="">{t('allMonths')}</option>
            {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
          </select>
        </div>
        <div className="min-w-25">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-1.5">{t('yearLabel')}</label>
          <select value={year ?? ''} onChange={e => onYear(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-surface appearance-none cursor-pointer">
            <option value="">{t('allYears')}</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="min-w-32.5">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-1.5">{t('paymentLabel')}</label>
          <select value={paymentStatus ?? ''} onChange={e => onPaymentStatus((e.target.value as PaymentStatus) || undefined)}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-surface appearance-none cursor-pointer">
            <option value="">{t('allStatuses')}</option>
            <option value="PAID">{t('paid')}</option>
            <option value="PENDING">{t('pending')}</option>
          </select>
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="self-end">
            <RotateCcw size={13} /> {tc('reset')}
          </Button>
        )}
      </div>
    </Card>
  )
}
