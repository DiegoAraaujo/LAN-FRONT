'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { useLocale, useTranslations } from 'next-intl'
export const RevenueChart = ({ data = [], daily = false }: { data?: { month: string; revenue: number; pending?: number }[]; daily?: boolean }) => {
  const locale = useLocale()
  const t = useTranslations('overview')
  const currency = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(n)
  const chartData = data.map(b => ({ ...b, label: daily ? b.month : new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, Number(b.month)-1, 1))) }))
  return <div role="img" aria-label={t('chartDescription')} className="h-72 w-full min-w-0">
    <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 600, height: 288 }}>
      <BarChart data={chartData} margin={{ top: 10, right: 8, bottom: 0, left: 0 }} accessibilityLayer>
        <CartesianGrid strokeDasharray="3 5" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} minTickGap={12} />
        <YAxis width={64} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => new Intl.NumberFormat(locale, { notation: 'compact' }).format(v)} />
        <Tooltip cursor={{ fill: 'var(--color-bg)' }} formatter={v => currency(Number(v ?? 0))} contentStyle={{ borderRadius: 14, border: '1px solid var(--color-border)', fontSize: 13 }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
        <Bar isAnimationActive={false} name={t('received')} dataKey="revenue" fill="#16856a" radius={[4,4,0,0]} maxBarSize={24} />
        <Bar isAnimationActive={false} name={t('pending')} dataKey="pending" fill="#d3a348" radius={[4,4,0,0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  </div>
}
