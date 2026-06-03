'use client'
import { MessageCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { formatBRPhone } from '@/lib/utils'

const InstagramIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)

const formatWhatsappShort = (raw: string): string => {
  if (raw.startsWith('+55')) return formatBRPhone(raw.slice(3))
  return raw
}

interface Props {
  whatsapp?:  string | null
  instagram?: string | null
  compact?:   boolean
}

export const CustomerContactBadges = ({ whatsapp, instagram, compact }: Props) => {
  const t = useTranslations('clients')

  if (!whatsapp && !instagram) {
    if (compact) return (
      <span className="text-xs text-text-light italic">{t('noContacts')}</span>
    )
    return null
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {whatsapp && (
        <span className="inline-flex items-center gap-1 text-[11px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
          <MessageCircle size={10} />
          {compact ? formatWhatsappShort(whatsapp) : `WhatsApp: ${formatWhatsappShort(whatsapp)}`}
        </span>
      )}
      {instagram && (
        <span className="inline-flex items-center gap-1 text-[11px] bg-pink-50 text-pink-600 border border-pink-200 px-2 py-0.5 rounded-full font-medium">
          <InstagramIcon />
          @{instagram.replace(/^@/, '')}
        </span>
      )}
    </div>
  )
}
