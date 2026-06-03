'use client'
import { Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Select } from '@/components/ui/Select'
import { formatCurrency } from '@/lib/utils'
import { useProfessionalsByService } from '@/features/professionals/hooks/useProfessionalsByService'
import type { Service } from '@/features/services/api/services.api'

export interface ItemRowData { id: string; serviceId: string; professionalId: string }

interface Props {
  item:           ItemRowData
  services:       Service[]
  usedServiceIds: string[]
  showRemove:     boolean
  onChange:       (id: string, field: 'serviceId' | 'professionalId', value: string) => void
  onRemove:       (id: string) => void
}

export const AppointmentItemRow = ({ item, services, usedServiceIds, showRemove, onChange, onRemove }: Props) => {
  const t  = useTranslations('appointments')
  const svc = services.find(s => s.id === item.serviceId)

  const { data: filteredProfessionals = [], isLoading: loadingPros } =
    useProfessionalsByService(item.serviceId || undefined)

  const availableServices = services.filter(s => s.id === item.serviceId || !usedServiceIds.includes(s.id))

  const serviceOptions = [
    { value: '', label: t('selectService') },
    ...availableServices.map(s => ({ value: s.id, label: `${s.name} — ${formatCurrency(s.price)}` })),
  ]

  const professionalOptions = item.serviceId
    ? [
        { value: '', label: loadingPros ? t('loadingProfessionals') : filteredProfessionals.length === 0 ? t('noProfessionalsForService') : t('selectProfessional') },
        ...filteredProfessionals.map(p => ({ value: p.id, label: p.name })),
      ]
    : [{ value: '', label: t('selectServiceFirst') }]

  const handleServiceChange = (value: string) => {
    onChange(item.id, 'serviceId', value)
    onChange(item.id, 'professionalId', '')
  }

  return (
    <div className="border border-border rounded-lg p-3">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end">
        <Select label={t('serviceLabel')} options={serviceOptions} value={item.serviceId}
          onChange={e => handleServiceChange(e.target.value)} />
        <Select label={t('professionalLabel')} options={professionalOptions} value={item.professionalId}
          disabled={!item.serviceId || loadingPros}
          onChange={e => onChange(item.id, 'professionalId', e.target.value)} />
        <div>
          <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-1.5">
            {t('valueLabel')}
          </label>
          <div className="border border-border rounded-lg px-3 py-2.5 text-sm w-28 bg-bg text-text-muted">
            {svc ? formatCurrency(svc.price) : '—'}
          </div>
        </div>
        {showRemove && (
          <button onClick={() => onRemove(item.id)} className="text-red-400 hover:text-red-600 pb-1">
            <Trash2 size={16} />
          </button>
        )}
      </div>
      {item.serviceId && !loadingPros && filteredProfessionals.length === 0 && (
        <p className="text-xs text-warning mt-2 pl-1">{t('noProfessionalsWarning')}</p>
      )}
    </div>
  )
}
