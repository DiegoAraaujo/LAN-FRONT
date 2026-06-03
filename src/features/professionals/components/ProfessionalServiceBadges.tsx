'use client'
import { useTranslations } from 'next-intl'

interface Props { services: { id: string; name: string }[] }

export const ProfessionalServiceBadges = ({ services }: Props) => {
  const t = useTranslations('professionals')
  if (services.length === 0)
    return <span className="text-xs text-text-light italic">{t('noServicesLinked')}</span>
  return (
    <div className="flex flex-wrap gap-1">
      {services.map(s => (
        <span key={s.id} className="bg-text text-white/85 text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
          {s.name}
        </span>
      ))}
    </div>
  )
}
