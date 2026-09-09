'use client'
import { useLocale, useTranslations } from 'next-intl'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Display'
import { CustomerContactBadges } from './CustomerContactBadges'
import { useCustomerLoyalty } from '../hooks/useCustomers'
import { formatCurrency, getInitials, getAvatarColor } from '@/lib/utils'
import { QueryError } from '@/components/ui/QueryError'

interface Props { open: boolean; onClose: () => void }
export const CustomerLoyaltyModal = ({ open, onClose }: Props) => {
  const t  = useTranslations('clients')
  const tc = useTranslations('common')
  const locale = useLocale()
  const report = useCustomerLoyalty(open)
  const top = report.data ?? []
  const tierLabel = { VIP_GOLD: t('tierVip'), FREQUENT: t('tierFrequent'), ACTIVE: t('tierActive') }

  return (
    <Modal open={open} onClose={onClose} title={t('loyaltyTitle')} size="lg"
      footer={<Button variant="outline" onClick={onClose}>{tc('close')}</Button>}>
      {report.isError ? <QueryError onRetry={() => report.refetch()} /> : top.length === 0 ? (
        <p className="text-center py-8 text-sm text-text-light">{t('noLoyaltyData')}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {top.map(c => {
            return (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-gold-btn transition-colors">
                <Avatar initials={getInitials(c.name)} color={getAvatarColor(c.name)} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{c.name}</div>
                  <div className="text-xs text-text-light mb-1">{c.totalAppointments ?? 0} {t('visits')}</div>
                  <div className="text-xs text-text-light mb-1">{t('lastVisit')}: {new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'America/Sao_Paulo' }).format(new Date(c.lastVisit))}</div>
                  <CustomerContactBadges whatsapp={c.whatsapp} instagram={c.instagram} compact />
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold">{formatCurrency(c.totalSpent ?? 0)}</div>
                  <Badge variant={c.tier === 'VIP_GOLD' ? 'dark' : c.tier === 'FREQUENT' ? 'yellow' : 'outline'} className="mt-1">
                    {tierLabel[c.tier]}
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
