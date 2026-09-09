'use client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Plus, ArrowUpRight, RefreshCw, Users, CheckCircle2, CalendarDays } from 'lucide-react'
import { useState } from 'react'
import { useDashboard } from '../hooks/useDashboard'
import { DashboardStatCards } from './DashboardStatCards'
import { DashboardPeriodFilter } from './DashboardPeriodFilter'
import { Card } from '@/components/ui/Card'
import { QueryError } from '@/components/ui/QueryError'
import { LoadingState } from '@/components/ui/luma-spin'
import { PaymentModal } from '@/features/finance/PaymentModal'
import type { DashboardAppointment } from '../api/dashboard.api'
const RevenueChart = dynamic(() => import('@/components/charts/RevenueChart').then(m => m.RevenueChart), { ssr: false, loading: () => <LoadingState label="Carregando gráfico…" className="h-72" /> })

export function DashboardClient() {
  const t = useTranslations('overview')
  const locale = useLocale()
  const router = useRouter()
  const params = useSearchParams()
  const now = new Date()
  const rawYear = Number(params.get('year'))
  const year = Number.isInteger(rawYear) && rawYear >= 2000 && rawYear <= 2100 ? rawYear : now.getFullYear()
  const rawMonth = Number(params.get('month'))
  const month = params.get('month') === 'all' ? undefined : Number.isInteger(rawMonth) && rawMonth >= 1 && rawMonth <= 12 ? rawMonth : now.getMonth()+1
  const dateFrom = params.get('dateFrom') ?? `${year}-${String(month ?? 1).padStart(2, '0')}-01`
  const dateTo = params.get('dateTo') ?? `${year}-${String(month ?? 12).padStart(2, '0')}-${new Date(Date.UTC(year, month ?? 12, 0)).getUTCDate()}`
  const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value && value >= '2000-01-01' && value <= '2100-12-31'
  const validPeriod = validDate(dateFrom) && validDate(dateTo) && dateFrom <= dateTo
  const setCustomDates = (from: string, to: string) => router.replace('/dashboard?' + new URLSearchParams({ dateMode: 'custom', dateFrom: from, dateTo: to }), { scroll: false })
  const query = useDashboard({ dateFrom, dateTo }, validPeriod)
  const [target, setTarget] = useState<DashboardAppointment | null>(null)
  const currency = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(n)
  const date = (s: string) => new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }).format(new Date(s))
  const periodLink = '/activities?' + new URLSearchParams({ dateMode: 'custom', dateFrom, dateTo })
  const data = validPeriod ? query.data : undefined
  const ranking = (title: string, rows: { name: string; count: number; revenue: number }[], customer = false) => <Card className="p-5 sm:p-6">
    <h2 className="font-semibold">{title}</h2><p className="text-xs text-text-muted mt-1 mb-5">{t(customer ? 'customerRankHint' : 'rankHint')}</p>
    {!rows.length ? <p className="text-sm text-text-muted py-6">{t('empty')}</p> : <ol className="space-y-5">{rows.map((r,i) => <li key={r.name+'-'+i} className="flex items-center gap-3">
      <span className="w-8 h-8 shrink-0 rounded-full bg-bg flex items-center justify-center text-xs text-text-muted font-semibold">{String(i+1).padStart(2,'0')}</span>
      <div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{r.name}</p><p className="text-xs text-text-muted mt-1">{t('count', { count: r.count })}</p></div>
      <span className="text-sm font-semibold tabular-nums">{currency(r.revenue)}</span>
    </li>)}</ol>}
  </Card>
  return <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-8 space-y-6">
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
      <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold mb-2">LAN / {t('business')}</p><h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{t('title')}</h1><p className="text-sm text-text-muted mt-2">{t('subtitle')}</p></div>
      <div className="flex flex-wrap items-center gap-2">
        <DashboardPeriodFilter dateFrom={dateFrom} dateTo={dateTo} onDateChange={(key, value) => setCustomDates(key === 'dateFrom' ? value : dateFrom, key === 'dateTo' ? value : dateTo)} />
        <button aria-label={t('refresh')} disabled={query.isFetching || !validPeriod} onClick={() => query.refetch()} className="p-3 rounded-xl border border-border bg-white disabled:opacity-50"><RefreshCw size={16}/></button>
        <Link href="/appointments" className="inline-flex items-center gap-2 rounded-xl px-4 py-3 bg-sidebar text-white text-sm font-medium"><Plus size={16}/>{t('newAppointment')}</Link>
      </div>
    </div>
    <p className="flex items-center gap-2 text-xs text-text-muted"><CalendarDays size={14} className="shrink-0"/>{t('periodHint')}</p>
    {!validPeriod && <p role="alert" className="text-sm text-danger">{locale === 'en' ? 'Enter a valid start and end date.' : 'Informe uma data inicial e final válidas.'}</p>}
    {validPeriod && query.isError && <QueryError onRetry={() => query.refetch()} />}
    {!data && query.isLoading && <LoadingState label={t('loading')} className="min-h-[420px]" />}
    {data && <>
      <DashboardStatCards data={data}/><p className="text-xs text-text-muted mb-4">Valores por data do atendimento, incluindo pagamentos parciais e crédito aplicado. Consulte o Fluxo de caixa para entradas por data de recebimento.</p>
      <div className="grid xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)] gap-5">
        <Card className="p-5 sm:p-6 min-w-0"><div className="mb-6"><h2 className="font-semibold text-lg">{t('evolution')}</h2><p className="text-xs text-text-muted mt-1">{t('period')}</p></div>
          <RevenueChart data={data.evolutionGraph} daily/>
          {data.cards.totalAppointments === 0 && <p className="text-sm text-text-muted text-center mt-3">{t('empty')}</p>}
          <details className="text-xs text-text-muted mt-4"><summary className="cursor-pointer">{t('viewData')}</summary><div className="max-h-48 overflow-auto mt-3"><table className="w-full text-left"><thead><tr><th>{t('period')}</th><th>{t('received')}</th><th>{t('pending')}</th></tr></thead><tbody>{data.evolutionGraph.map(r => <tr key={r.month}><td className="py-1">{r.month}</td><td>{currency(r.revenue)}</td><td>{currency(r.pending)}</td></tr>)}</tbody></table></div></details>
        </Card>
        <Card className="p-5 sm:p-6">
          <div className="flex justify-between gap-2 items-start"><div><h2 className="font-semibold text-lg">{t('toReceive')}</h2><p className="text-xs text-text-muted mt-1">{t('oldestPending')}</p></div><span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg text-xs font-semibold">{data.cards.pendingCount}</span></div>
          <div className="text-3xl font-semibold tracking-tight mt-5 mb-4 tabular-nums">{currency(data.cards.pendingRevenue)}</div>
          {!data.pendingAppointments.length ? <div className="py-10 text-center text-text-muted"><CheckCircle2 className="mx-auto text-emerald-600 mb-3" size={30}/><p className="text-sm">{t('noPending')}</p></div> : <ul className="divide-y divide-border">{data.pendingAppointments.map(a => <li key={a.id} className="flex items-center gap-3 py-3"><div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{a.customerName}</p><p className="text-xs text-text-muted mt-1">{date(a.appointmentDate)}</p></div><span className="text-sm font-semibold">{currency(a.remaining)}</span><button aria-label={t('markPaidFor', { name: a.customerName })} title={t('markPaid')} onClick={() => setTarget(a)} className="p-2.5 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100"><CheckCircle2 size={17}/></button></li>)}</ul>}
          <Link href={periodLink+'&openOnly=true'} className="text-sm font-medium flex items-center justify-between mt-5 pt-4 border-t border-border">{t('viewPending')}<ArrowUpRight size={16}/></Link>
        </Card>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        {ranking(t('services'), data.servicesPieGraph.slice(0,5).map(s => ({ ...s, name: s.serviceName })))}
        {ranking(t('professionals'), data.professionals)}
        <Card className="p-5 sm:p-6"><h2 className="font-semibold">{t('payments')}</h2><p className="text-xs text-text-muted mt-1 mb-5">{t('paidOnly')}</p>
          {!data.paymentMethods.length ? <p className="text-sm text-text-muted py-6">{t('empty')}</p> : <div className="space-y-5">{data.paymentMethods.map(p => <div key={p.method}><div className="flex justify-between gap-2 text-sm mb-2"><span>{t('methods.'+p.method)}</span><span className="font-semibold">{currency(p.revenue)}</span></div><div className="h-2 rounded-full bg-bg overflow-hidden"><div className="h-full rounded-full bg-gold-btn" style={{ width: (data.cards.totalRevenue ? p.revenue/data.cards.totalRevenue*100 : 0)+'%' }}/></div><p className="text-xs text-text-muted mt-1">{t('paidCount', { count: p.count })}</p></div>)}</div>}
        </Card>
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)] gap-5">
        <Card className="p-5 sm:p-6"><div className="flex justify-between gap-3 mb-5"><h2 className="font-semibold">{t('recent')}</h2><Link href={periodLink} className="text-xs font-medium text-gold flex items-center gap-1">{t('viewAll')}<ArrowUpRight size={14}/></Link></div>
          {!data.recentAppointments.length ? <p className="text-sm text-text-muted py-6">{t('empty')}</p> : <ul className="divide-y divide-border">{data.recentAppointments.map(a => <li key={a.id} className="py-4 flex items-center gap-3"><span className="w-10 h-10 shrink-0 rounded-xl bg-bg flex items-center justify-center font-semibold text-text-muted">{a.customerName.charAt(0)}</span><div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{a.customerName}</p><p className="text-xs text-text-muted truncate mt-1">{a.services.join(', ')} · {date(a.appointmentDate)}</p></div><div className="text-right"><p className="text-sm font-semibold">{currency(a.total)}</p><span className={'inline-block text-[11px] px-2 py-0.5 rounded-md mt-1 '+(a.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>{a.paymentStatus === 'PARTIAL' ? 'Parcialmente pago' : t(a.paymentStatus === 'PAID' ? 'paid' : 'pending')}</span></div></li>)}</ul>}
        </Card>
        <div className="space-y-5"><div className="rounded-2xl bg-sidebar text-white px-4 py-3 flex items-center gap-3"><div className="p-2 rounded-lg bg-white/10"><Users size={18} className="text-gold-btn"/></div><div><p className="text-xl font-semibold">{data.cards.newCustomers}</p><p className="text-xs text-white/70">{t('newCustomers')}</p></div></div>{ranking(t('customers'), data.customers, true)}</div>
      </div>
    </>}
    {target && <PaymentModal key={target.id} appointment={{...target, subtotal: target.total, discount: 0, paymentMethod: null, items: []}} onClose={() => setTarget(null)}/>}
  </div>
}
