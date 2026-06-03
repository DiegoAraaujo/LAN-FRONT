'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { PageHeader } from '@/components/ui/Display'
import { Card } from '@/components/ui/Card'
import { RevenueChart } from '@/components/charts/RevenueChart'
import { DashboardStatCards } from '@/features/dashboard/components/DashboardStatCards'
import { DashboardPeriodFilter } from '@/features/dashboard/components/DashboardPeriodFilter'
import { ServiceRevenueTable } from '@/features/dashboard/components/ServiceRevenueTable'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'
import { useCustomersDashboard } from '@/features/customers/hooks/useCustomers'

const DashboardPage = () => {
  const t = useTranslations('dashboard')
  const [year, setYear]   = useState(new Date().getFullYear())
  const [month, setMonth] = useState<number | undefined>()

  const { data, isLoading }    = useDashboard({ year, month })
  const { data: customerDash } = useCustomersDashboard()

  return (
    <div className="p-5 sm:p-8">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        actions={<DashboardPeriodFilter year={year} month={month} onYearChange={setYear} onMonthChange={setMonth} />}
      />

      <div className="flex flex-col gap-5">
        <DashboardStatCards
          totalAppointments={data?.cards.totalAppointments ?? 0}
          totalRevenue={data?.cards.totalRevenue ?? 0}
          newCustomers={customerDash?.newThisMonth ?? 0}
          isLoading={isLoading}
        />

        <Card className="p-5">
          <div className="mb-4">
            <div className="font-semibold text-sm text-text">{t('revenueEvolution')}</div>
            <div className="text-xs text-text-light mt-0.5">{t('monthlyData')}</div>
          </div>
          {isLoading
            ? <div className="h-48 flex items-center justify-center text-sm text-text-light">Carregando…</div>
            : <RevenueChart data={data?.evolutionGraph} />
          }
        </Card>

        <ServiceRevenueTable data={data?.servicesPieGraph ?? []} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default DashboardPage
