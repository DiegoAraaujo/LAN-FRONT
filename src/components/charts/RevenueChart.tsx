'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface RevenueChartProps {
  data?: { month: string; revenue: number }[]
}

const DEFAULT_DATA = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][i],
  revenue: 0,
}))

export const RevenueChart = ({ data = DEFAULT_DATA }: RevenueChartProps) => (
  <ResponsiveContainer width="100%" height={200}>
    <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
      <XAxis
        dataKey="month"
        tick={{ fontSize: 11, fill: 'var(--color-text-light)' }}
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        tick={{ fontSize: 11, fill: 'var(--color-text-light)' }}
        axisLine={false}
        tickLine={false}
        tickFormatter={(v) => `R$${v}`}
      />
      <Tooltip
        formatter={(v: number) =>
          new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
        }
        contentStyle={{
          background: 'var(--color-surface)',
          border:     '1px solid var(--color-border)',
          borderRadius: '8px',
          fontSize: '12px',
        }}
      />
      <Bar dataKey="revenue" fill="var(--color-gold-btn)" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
)
