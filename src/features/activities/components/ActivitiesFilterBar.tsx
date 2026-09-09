'use client'
import { useUrlFilters } from '@/hooks/useUrlFilters'
import { Input } from '@/components/ui/Input'
import { Search } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { FilterDrawer } from '@/components/ui/FilterDrawer'
import { AppointmentFinanceFilters } from '@/features/finance/AppointmentFinanceFilters'
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

  const { params, setFilters } = useUrlFilters()
  const custom = params.get('dateMode') === 'custom' || !!(params.get('dateFrom') || params.get('dateTo'))
  const changeMode = (value: string) => setFilters({
    dateMode: value === 'custom' ? 'custom' : undefined,
    dateFrom: undefined, dateTo: undefined, month: undefined, year: undefined, page: 1,
  })
  const locale = useLocale()
  const MONTHS = locale === 'en' ? MONTHS_EN : MONTHS_PT

  return (
    <div className="flex items-end gap-3">
        <div className="flex-1 min-w-0">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-1.5">{t('clientLabel')}</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
            <input aria-label={t('clientLabel')} type="text" placeholder={t('searchPlaceholder')} value={search}
              onChange={e => onSearch(e.target.value)}
              className="w-full border border-border rounded-lg pl-8 pr-3 py-2.5 text-sm bg-surface" />
          </div>
        </div>
      <FilterDrawer active={hasFilters} onReset={onReset}>
        <div className="w-full">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-1.5">{t('paymentLabel')}</label>
          <select aria-label={t('paymentLabel')} value={paymentStatus ?? ''} onChange={e => onPaymentStatus((e.target.value as PaymentStatus) || undefined)}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-surface appearance-none cursor-pointer">
            <option value="">{t('allStatuses')}</option>
            <option value="PAID">{t('paid')}</option>
            <option value="PENDING">{t('pending')}</option>
            <option value="PARTIAL">Parcialmente pago</option>
          </select>
        </div>
      <div className="grid grid-cols-1 items-end gap-4 border-t border-border pt-5 [&>*]:min-w-0">
        <div className="min-w-0">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-1.5" htmlFor="appointment-period-mode">{locale === 'en' ? 'Period' : 'Período'}</label>
          <select id="appointment-period-mode" value={custom ? 'custom' : 'month'} onChange={e => changeMode(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-surface">
            <option value="month">{locale === 'en' ? 'Month and year' : 'Mês e ano'}</option>
            <option value="custom">{locale === 'en' ? 'Custom period' : 'Personalizado'}</option>
          </select>
        </div>
        {custom ? <>
          <Input label={locale === 'en' ? 'From' : 'De'} type="date" value={params.get('dateFrom') ?? ''} max={params.get('dateTo') || undefined} onChange={e => setFilters({dateFrom: e.target.value, month: undefined, year: undefined, page: 1})}/>
          <Input label={locale === 'en' ? 'To' : 'Até'} type="date" value={params.get('dateTo') ?? ''} min={params.get('dateFrom') || undefined} onChange={e => setFilters({dateTo: e.target.value, month: undefined, year: undefined, page: 1})}/>
        </> : <>
        <div className="min-w-0">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-1.5">{t('monthLabel')}</label>
          <select aria-label={t('monthLabel')} value={month ?? ''} onChange={e => onMonth(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-surface appearance-none cursor-pointer">
            <option value="">{t('allMonths')}</option>
            {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
          </select>
        </div>
        <div className="min-w-0">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-1.5">{t('yearLabel')}</label>
          <select aria-label={t('yearLabel')} value={year ?? ''} onChange={e => onYear(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-surface appearance-none cursor-pointer">
            <option value="">{t('allYears')}</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        </>}
        <div className="min-w-0">
          <label htmlFor="appointment-date-type" className="text-xs font-medium text-text-light uppercase tracking-wide block mb-1.5">{locale === 'en' ? 'Date of' : 'Filtrar pela data'}</label>
          <select id="appointment-date-type" className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-surface" value={params.get('dateType') || 'appointment'} onChange={e => setFilters({dateType: e.target.value, page: 1})}>
            <option value="appointment">{locale === 'en' ? 'Appointment' : 'Do atendimento'}</option>
            <option value="payment">{locale === 'en' ? 'Payment' : 'Do pagamento'}</option>
          </select>
        </div>

      </div>
        <AppointmentFinanceFilters />
      </FilterDrawer>
    </div>
  )
}
