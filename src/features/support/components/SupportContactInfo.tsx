'use client'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'

export const SupportContactInfo = () => {
  const t = useTranslations('support')
  const rows = [
    { label: t('emailLabel'),    value: 'suporte@lan.app',  color: '' },
    { label: t('hoursLabel'),    value: t('hoursValue'),    color: '' },
    { label: t('responseLabel'), value: t('responseValue'), color: 'text-success' },
  ]
  return (
    <Card className="p-5">
      <h4 className="font-semibold text-sm text-text mb-3">{t('channelsTitle')}</h4>
      <div className="flex flex-col">
        {rows.map((row, i) => (
          <div key={row.label} className={`flex justify-between py-3 ${i < rows.length - 1 ? 'border-b border-border' : ''}`}>
            <span className="text-xs text-text-light">{row.label}</span>
            <span className={`text-xs font-medium ${row.color || 'text-text'}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
