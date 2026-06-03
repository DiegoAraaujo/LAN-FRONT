'use client'
import { Briefcase, CreditCard, UserPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { StatCard } from '@/components/ui/Display'
import { formatCurrency } from '@/lib/utils'

interface Props {
  totalAppointments: number
  totalRevenue:      number
  newCustomers:      number
  isLoading:         boolean
}

export const DashboardStatCards = ({ totalAppointments, totalRevenue, newCustomers, isLoading }: Props) => {
  const t = useTranslations('dashboard')
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label={t('totalAppointments')}
        value={isLoading ? '…' : String(totalAppointments)}
        icon={<Briefcase size={28} className="text-gold" strokeWidth={1.5} />}
      />
      <StatCard
        label={t('totalRevenue')}
        value={isLoading ? '…' : formatCurrency(totalRevenue)}
        valueClassName="text-gold"
        icon={<CreditCard size={28} className="text-gold" strokeWidth={1.5} />}
      />
      <StatCard
        label={t('newClientsMonth')}
        value={isLoading ? '…' : String(newCustomers)}
        icon={<UserPlus size={28} className="text-gold" strokeWidth={1.5} />}
      />
    </div>
  )
}
