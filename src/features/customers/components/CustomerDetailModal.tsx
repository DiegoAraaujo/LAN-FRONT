'use client'
import { useTranslations } from 'next-intl'
import { MessageCircle, MapPin, Calendar } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Display'
import { getInitials, getAvatarColor, formatCurrency, formatBRPhone, digitsOnly, cn } from '@/lib/utils'
import type { Customer } from '../api/customers.api'

const InstagramIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(iso))

/** Format stored whatsapp (e.g. +5511999999999) for display */
const formatWhatsappDisplay = (raw: string): string => {
  if (raw.startsWith('+55')) {
    const local = raw.slice(3)
    return `+55 ${formatBRPhone(local)}`
  }
  return raw
}

interface InfoRowProps { icon: React.ReactNode; label: string; value: React.ReactNode }

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
    <div className="w-7 h-7 rounded-lg bg-bg flex items-center justify-center text-gold shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[11px] text-text-light uppercase tracking-wide font-medium mb-0.5">{label}</div>
      <div className="text-sm text-text font-medium">{value}</div>
    </div>
  </div>
)

interface Props {
  open:     boolean
  customer: Customer | null
  onClose:  () => void
  onEdit:   () => void
}

export const CustomerDetailModal = ({ open, customer, onClose, onEdit }: Props) => {
  const t  = useTranslations('clients')
  const tc = useTranslations('common')

  if (!customer) return null

  return (
    <Modal open={open} onClose={onClose} title={t('clientDetails')} size="md"
      footer={
        <div className="flex gap-2 w-full">
          <Button variant="outline" onClick={onClose} className="flex-1 justify-center">{tc('close')}</Button>
          <Button variant="primary" onClick={onEdit} className="flex-1 justify-center">{tc('edit')}</Button>
        </div>
      }
    >
      <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border">
        <Avatar initials={getInitials(customer.name)} color={getAvatarColor(customer.name)} size="lg" />
        <div>
          <h3 className="text-lg font-bold text-text">{customer.name}</h3>
          <span className={cn('text-[11px] px-2.5 py-0.5 rounded-full font-semibold',
            customer.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
            {customer.status === 'ACTIVE' ? t('active') : t('inactive')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-bg rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gold">
            {formatCurrency(customer.totalSpent ?? 0)}
          </div>
          <div className="text-[11px] text-text-light mt-0.5">{t('tableTotalSpentCol')}</div>
        </div>
        <div className="bg-bg rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-text">
            {customer.totalAppointments ?? 0}
          </div>
          <div className="text-[11px] text-text-light mt-0.5">{t('tableAppointmentsCol')}</div>
        </div>
      </div>

      <div>
        <InfoRow
          icon={<Calendar size={14} />}
          label={t('registeredSince')}
          value={formatDate(customer.createdAt)}
        />

        {customer.address && (
          <InfoRow
            icon={<MapPin size={14} />}
            label={tc('address')}
            value={customer.address}
          />
        )}

        {customer.whatsapp && (
          <InfoRow
            icon={<MessageCircle size={14} className="text-green-500" />}
            label="WhatsApp"
            value={formatWhatsappDisplay(customer.whatsapp)}
          />
        )}

        {customer.instagram && (
          <InfoRow
            icon={<span className="text-pink-500"><InstagramIcon size={14} /></span>}
            label="Instagram"
            value={`@${customer.instagram.replace(/^@/, '')}`}
          />
        )}

        {!customer.whatsapp && !customer.instagram && (
          <InfoRow
            icon={<MessageCircle size={14} />}
            label={t('contacts')}
            value={<span className="italic text-text-light">{t('noContacts')}</span>}
          />
        )}
      </div>
    </Modal>
  )
}
