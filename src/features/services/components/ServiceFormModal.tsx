'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import type { Service } from '../api/services.api'

const schema = z.object({
  name:        z.string().min(2, 'Mínimo 2 caracteres'),
  price:       z.string().min(1, 'Preço obrigatório'),
  description: z.string().optional(),
})
type FormInput = z.infer<typeof schema>

interface Props {
  open: boolean; onClose: () => void; isLoading: boolean
  defaultValues?: Service | null
  onSave: (data: { name: string; price: number; description?: string }) => void
}

export const ServiceFormModal = ({ open, onClose, onSave, isLoading, defaultValues }: Props) => {
  const t  = useTranslations('services')
  const tc = useTranslations('common')

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<FormInput>({ resolver: zodResolver(schema) })

  useEffect(() => {
    reset(defaultValues
      ? { name: defaultValues.name, price: String(defaultValues.price), description: defaultValues.description ?? '' }
      : { name: '', price: '', description: '' })
  }, [defaultValues, reset, open])

  const onSubmit = (d: FormInput) =>
    onSave({ name: d.name, price: parseFloat(d.price), description: d.description })

  return (
    <Modal open={open} onClose={onClose}
      title={defaultValues ? t('editService') : t('addService')}
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
        <Input label={t('tableNameCol')} placeholder={t('serviceNamePlaceholder')}
          error={errors.name?.message} {...register('name')} />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide">
            {tc('price')} (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-light">R$</span>
            <input type="number" step="0.01" placeholder={t('pricePlaceholder')}
              className="w-full border border-border rounded-lg pl-8 pr-3 py-2.5 text-sm bg-surface"
              {...register('price')} />
          </div>
          {errors.price && <p className="text-xs text-danger">{errors.price.message}</p>}
        </div>
        <Textarea label={t('descriptionLabel')} placeholder={t('descriptionPlaceholder')}
          className="min-h-20" {...register('description')} />
      </div>
    </Modal>
  )
}
