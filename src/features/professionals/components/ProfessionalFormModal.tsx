'use client'
import { useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ServiceSelector } from './ServiceSelector'
import { useServices } from '@/features/services/hooks/useServices'
import { professionalSchema, type ProfessionalInput } from '../schemas/professional.schemas'
import type { Professional } from '../api/professionals.api'
import { digitsOnly, formatBRPhone } from '@/lib/utils'
import { prepareProfileImage } from '@/features/settings/profileImage'
import { Camera, Trash2 } from 'lucide-react'

interface Props {
  open: boolean; onClose: () => void; isLoading: boolean
  defaultValues?: Professional | null
  onSave: (data: ProfessionalInput) => void
}

export const ProfessionalFormModal = (props: Props) => props.open ? <ProfessionalForm key={props.defaultValues?.id ?? 'new'} {...props}/> : null
const ProfessionalForm = ({ open, onClose, onSave, isLoading, defaultValues }: Props) => {
  const t  = useTranslations('professionals')
  const tc = useTranslations('common')
  const { data: services = [] } = useServices()
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultValues?.services.map(s => s.id) ?? [])

  const { register, handleSubmit, control, setValue, formState: { errors } } =
    useForm<ProfessionalInput>({ resolver: zodResolver(professionalSchema), defaultValues: { name: defaultValues?.name ?? '', address: defaultValues?.address ?? '', phone: defaultValues?.phone ? formatBRPhone(defaultValues.phone) : '', profileImage: defaultValues?.profileImage ?? null } })
  const profileImage = useWatch({ control, name: 'profileImage' })
  const photoInput = useRef<HTMLInputElement>(null)
  const [photoError,setPhotoError] = useState('')

  const toggleService = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])

  const onSubmit = (data: ProfessionalInput) => onSave({ ...data, phone: digitsOnly(data.phone), servicesIds: selectedIds })

  return (
    <Modal busy={isLoading} open={open} onClose={onClose} size="xl"
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
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-bg p-4">
          <button type="button" onClick={()=>photoInput.current?.click()} disabled={isLoading} className="group relative size-32 overflow-hidden rounded-2xl border-2 border-white bg-surface shadow-md">
            {profileImage?<img src={profileImage} alt={defaultValues?.name ?? t('newProfessional')} className="size-full object-cover"/>:<span className="grid size-full place-items-center text-text-muted"><Camera size={34}/></span>}
            <span className="absolute inset-x-0 bottom-0 bg-black/65 py-2 text-xs text-white">{profileImage?t('editPhoto'):t('addPhoto')}</span>
          </button>
          <input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={async event=>{const file=event.target.files?.[0];event.target.value='';if(!file)return;setPhotoError('');try{setValue('profileImage',await prepareProfileImage(file),{shouldDirty:true,shouldValidate:true})}catch(error){setPhotoError(error instanceof Error?error.message:t('photoError'))}}}/>
          {profileImage&&<button type="button" onClick={()=>setValue('profileImage',null,{shouldDirty:true})} className="inline-flex items-center gap-1 text-xs text-danger"><Trash2 size={13}/>{t('removePhoto')}</button>}
          {(photoError||errors.profileImage?.message)&&<p className="text-xs text-danger">{photoError||errors.profileImage?.message}</p>}
        </div>
        <Input label={tc('name')} placeholder={t('fullNamePlaceholder')} error={errors.name?.message} {...register('name')} />
        <Input label={tc('address')} placeholder={t('addressPlaceholder')} error={errors.address?.message} {...register('address')} />
        <Input label={tc('phone')} placeholder={t('phonePlaceholder')} error={errors.phone?.message} {...register('phone')} />
        <ServiceSelector services={services} selectedIds={selectedIds} onToggle={toggleService} />
      </div>
    </Modal>
  )
}
