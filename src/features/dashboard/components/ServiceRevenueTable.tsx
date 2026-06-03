'use client'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

interface Props { data: { serviceName: string; revenue: number }[]; isLoading: boolean }

export const ServiceRevenueTable = ({ data, isLoading }: Props) => {
  const t  = useTranslations('dashboard')
  const tc = useTranslations('common')

  return (
    <Card>
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-sm text-text">{t('revenueByServiceDetail')}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-bg">
              {[t('service'), t('grossTotal')].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-text-light uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={2} className="px-5 py-8 text-center text-sm text-text-light">{tc('loading')}</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={2} className="px-5 py-8 text-center text-sm text-text-light">{t('noPeriodData')}</td></tr>
            ) : data.map((row, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-5 py-4 text-sm text-text">{row.serviceName}</td>
                <td className="px-5 py-4 text-sm font-bold text-text">{formatCurrency(row.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
