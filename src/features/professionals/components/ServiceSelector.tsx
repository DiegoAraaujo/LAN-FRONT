'use client'
import { X, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Service } from '@/features/services/api/services.api'

interface Props { services: Service[]; selectedIds: string[]; onToggle: (id: string) => void }

export const ServiceSelector = ({ services, selectedIds, onToggle }: Props) => {
  const t = useTranslations('professionals')
  const count = selectedIds.length

  return (
    <div>
      <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-2">
        {t('linkedServices')}
      </label>
      {services.length === 0 ? (
        <p className="text-xs text-text-light italic">{t('noServicesYet')}</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {services.map(svc => {
              const selected = selectedIds.includes(svc.id)
              return (
                <button key={svc.id} type="button" onClick={() => onToggle(svc.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    selected
                      ? 'bg-gold-btn border-gold-btn text-text'
                      : 'border-border text-text-muted hover:border-gold-btn'
                  }`}>
                  {selected ? <X size={11} /> : <Plus size={11} />} {svc.name}
                </button>
              )
            })}
          </div>
          {count > 0 && (
            <p className="text-xs text-text-light mt-2">
              {count} {count > 1 ? t('servicesSelectedPlural') : t('servicesSelected')}
            </p>
          )}
        </>
      )}
    </div>
  )
}
