'use client'
import { useTranslations } from 'next-intl'

interface Props { onClick: () => void }

export const CustomerLoyaltyBanner = ({ onClick }: Props) => {
  const t = useTranslations('clients')
  return (
    <div
      className="rounded-xl p-6 sm:p-8 cursor-pointer"
      style={{ background: 'linear-gradient(135deg, var(--color-banner-from) 0%, var(--color-banner-to) 100%)' }}
      onClick={onClick}
    >
      <div className="max-w-md">
        <h3 className="text-lg font-bold text-white mb-2">{t('loyaltyTitle')}</h3>
        <p className="text-sm text-white/60 leading-relaxed mb-4">{t('loyaltySubtitle')}</p>
        <button className="bg-white text-text font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          {t('viewReport')}
        </button>
      </div>
    </div>
  )
}
