'use client'
import { useTranslations } from 'next-intl'
import { Shield } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/stores/auth.store'

export const SecurityCard = () => {
  const t        = useTranslations('settings')
  const { user } = useAuthStore()

  const rows = [
    {
      label: t('createdAt'),
      value: user?.createdAt
        ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(user.createdAt))
        : '—',
    },
    { label: t('emailVerified'), value: t('twoFactorActive'),   color: 'text-success' },
    { label: t('twoFactor'),     value: t('twoFactorInactive'), color: 'text-text-muted' },
  ]

  return (
    <Card className="p-5 h-fit">
      <div className="flex items-center gap-2 font-semibold text-sm text-text mb-3">
        <Shield size={15} className="text-gold" /> {t('security')}
      </div>
      <p className="text-xs text-text-muted leading-relaxed mb-4">
        {t('securityNote')}
      </p>
      <div className="flex flex-col">
        {rows.map((row, i) => (
          <div key={row.label}
            className={`flex justify-between py-3 ${i < rows.length - 1 ? 'border-b border-border' : ''}`}>
            <span className="text-xs text-text-light">{row.label}</span>
            <span className={`text-xs font-semibold ${row.color ?? 'text-text'}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
