'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ServiceSelector } from './ServiceSelector'
import { useServices } from '@/features/services/hooks/useServices'
import { professionalSchema, type ProfessionalInput } from '../schemas/professional.schemas'
import type { Professional } from '../api/professionals.api'

interface Props {
  open: boolean; onClose: () => void; isLoading: boolean
  defaultValues?: Professional | null
  onSave: (data: ProfessionalInput) => void
}

export const ProfessionalFormModal = ({ open, onClose, onSave, isLoading, defaultValues }: Props) => {
  const t  = useTranslations('professionals')
  const tc = useTranslations('common')
  const { data: services = [] } = useServices()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<ProfessionalInput>({ resolver: zodResolver(professionalSchema) })

  useEffect(() => {
    if (defaultValues) {
      reset({ name: defaultValues.name, address: defaultValues.address, phone: defaultValues.phone })
      setSelectedIds(defaultValues.services.map(s => s.id))
    } else {
      reset({ name: '', address: '', phone: '' })
      setSelectedIds([])
    }
  }, [defaultValues, reset, open])

  const toggleService = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])

  const onSubmit = (data: ProfessionalInput) => onSave({ ...data, servicesIds: selectedIds })

  return (
    <Modal open={open} onClose={onClose} size="lg"
      title={defaultValues ? t('editProfessional') : t('addProfessional')}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>{tc('cancel')}</Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? tc('saving') : tc('save')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input label={tc('name')} placeholder={t('fullNamePlaceholder')} error={errors.name?.message} {...register('name')} />
        <Input label={tc('address')} placeholder={t('addressPlaceholder')} error={errors.address?.message} {...register('address')} />
        <Input label={tc('phone')} placeholder={t('phonePlaceholder')} error={errors.phone?.message} {...register('phone')} />
        <ServiceSelector services={services} selectedIds={selectedIds} onToggle={toggleService} />
      </div>
    </Modal>
  )
}
