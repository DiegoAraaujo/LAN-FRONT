'use client'
import { Wallet, Clock3, Layers3, ReceiptText, TrendingUp, TrendingDown } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { DashboardData } from '../api/dashboard.api'
export const DashboardStatCards = ({ data }: { data: DashboardData }) => {
  const t = useTranslations('overview')
  const locale = useLocale()
  const currency = (v: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(v)
  const c = data.cards
  const items = [
    { label: t('received'), value: c.totalRevenue, count: t('paidCount', { count: c.paidCount }), icon: Wallet, change: data.comparison.revenue, tone: 'text-emerald-700 bg-emerald-50' },
    { label: t('pending'), value: c.pendingRevenue, count: t('pendingCount', { count: c.pendingCount }), icon: Clock3, change: undefined, tone: 'text-amber-700 bg-amber-50' },
    { label: t('total'), value: c.totalValue, count: t('count', { count: c.totalAppointments }), icon: Layers3, change: data.comparison.totalValue, tone: 'text-slate-700 bg-slate-100' },
    { label: t('ticket'), value: c.averageTicket, count: t('ticketHint'), icon: ReceiptText, change: data.comparison.averageTicket, tone: 'text-indigo-700 bg-indigo-50' },
  ]
  return <div className="grid grid-cols-1 min-[440px]:grid-cols-2 xl:grid-cols-4 gap-3">
    {items.map(({ label, value, count, icon: Icon, change, tone }) => <section key={label} className="bg-surface border border-border rounded-2xl min-w-0 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-2"><h2 className="text-xs font-medium text-text-muted">{label}</h2><span className={'p-1.5 rounded-lg '+tone}><Icon size={16} /></span></div>
      <div className="text-xl break-words font-semibold tracking-tight tabular-nums mt-2">{currency(value)}</div>
      <p className="text-xs text-text-muted mt-1">{count}</p>
      {change !== undefined && <div className={'flex items-center gap-1 text-xs mt-2 pt-2 border-t border-border '+(change !== null && change < 0 ? 'text-rose-700' : 'text-text-muted')}>
        {change !== null && (change < 0 ? <TrendingDown size={13}/> : <TrendingUp size={13}/>)}
        {change === null ? t('noComparison') : t('change', { value: new Intl.NumberFormat(locale, { signDisplay: 'exceptZero', maximumFractionDigits: 1 }).format(change) })}
      </div>}
    </section>)}
  </div>
}
