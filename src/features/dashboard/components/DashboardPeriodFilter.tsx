'use client'
import { useLocale } from 'next-intl'
import { FilterDrawer } from '@/components/ui/FilterDrawer'

type Mode = 'month' | 'year' | 'custom'
interface Props {
  mode: Mode; year: number; month: number; dateFrom: string; dateTo: string; active: boolean
  onModeChange: (mode: Mode) => void; onYearChange: (year: number) => void
  onMonthChange: (month: number) => void
  onDateChange: (key: 'dateFrom' | 'dateTo', value: string) => void; onReset: () => void
}
const field = 'mt-1.5 min-h-11 w-full rounded-xl border border-border bg-surface p-2.5 text-sm'

export const DashboardPeriodFilter = ({ mode, year, month, dateFrom, dateTo, active, onModeChange, onYearChange, onMonthChange, onDateChange, onReset }: Props) => {
  const en = useLocale() === 'en'
  const years = Array.from(new Set([year, ...Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + 1 - i)])).sort((a,b) => b-a)
  const months = Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat(en?'en':'pt-BR', { month:'long', timeZone:'UTC' }).format(new Date(Date.UTC(2026,i,1))))
  return <FilterDrawer active={active} onReset={onReset}>
    <label className="block text-sm">{en?'Period type':'Tipo de período'}
      <select className={field} value={mode} onChange={event=>onModeChange(event.target.value as Mode)}>
        <option value="month">{en?'Month':'Mês'}</option><option value="year">{en?'Year':'Ano'}</option><option value="custom">{en?'Custom':'Personalizado'}</option>
      </select>
    </label>
    {mode==='month'&&<label className="block text-sm">{en?'Month':'Mês'}<select className={field} value={month} onChange={event=>onMonthChange(Number(event.target.value))}>{months.map((label,index)=><option key={index+1} value={index+1}>{label}</option>)}</select></label>}
    {mode!=='custom'&&<label className="block text-sm">{en?'Year':'Ano'}<select className={field} value={year} onChange={event=>onYearChange(Number(event.target.value))}>{years.map(value=><option key={value} value={value}>{value}</option>)}</select></label>}
    {mode==='custom'&&<>
      <label className="block text-sm">{en?'From':'De'}<input type="date" value={dateFrom} min="2000-01-01" max={dateTo||'2100-12-31'} onChange={event=>onDateChange('dateFrom',event.target.value)} className={field}/></label>
      <label className="block text-sm">{en?'To':'Até'}<input type="date" value={dateTo} min={dateFrom||'2000-01-01'} max="2100-12-31" onChange={event=>onDateChange('dateTo',event.target.value)} className={field}/></label>
    </>}
  </FilterDrawer>
}
