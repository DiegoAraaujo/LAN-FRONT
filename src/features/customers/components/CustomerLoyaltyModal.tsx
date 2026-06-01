'use client'
import { useTranslations } from 'next-intl'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Display'
import { CustomerContactBadges } from './CustomerContactBadges'
import { useCustomers } from '../hooks/useCustomers'
import { formatCurrency, getInitials, getAvatarColor } from '@/lib/utils'

interface Props { open: boolean; onClose: () => void }
type Tier = 'VIP GOLD' | 'FREQUENT' | 'ACTIVE'

const getTier = (spent: number, visits: number): Tier => {
  if (spent >= 500 || visits >= 20) return 'VIP GOLD'
  if (spent >= 200 || visits >= 8)  return 'FREQUENT'
  return 'ACTIVE'
}

export const CustomerLoyaltyModal = ({ open, onClose }: Props) => {
  const t  = useTranslations('clients')
  const tc = useTranslations('common')
  const { data } = useCustomers({ limit: 20 })

  const top = (data?.data ?? [])
    .filter(c => (c.totalAppointments ?? 0) > 0)
    .sort((a, b) => (b.totalSpent ?? 0) - (a.totalSpent ?? 0))
    .slice(0, 10)

  return (
    <Modal open={open} onClose={onClose} title={t('loyaltyTitle')} size="lg"
      footer={<Button variant="outline" onClick={onClose}>{tc('close')}</Button>}>
      {top.length === 0 ? (
        <p className="text-center py-8 text-sm text-text-light">{t('noLoyaltyData')}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {top.map(c => {
            const tier = getTier(c.totalSpent ?? 0, c.totalAppointments ?? 0)
            return (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-gold-btn transition-colors">
                <Avatar initials={getInitials(c.name)} color={getAvatarColor(c.name)} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{c.name}</div>
                  <div className="text-xs text-text-light mb-1">{c.totalAppointments ?? 0} {t('visits')}</div>
                  <CustomerContactBadges whatsapp={c.whatsapp} instagram={c.instagram} compact />
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold">{formatCurrency(c.totalSpent ?? 0)}</div>
                  <Badge variant={tier === 'VIP GOLD' ? 'dark' : tier === 'FREQUENT' ? 'yellow' : 'outline'} className="mt-1">
                    {tier}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Modal>
  )
}
