'use client'
import { useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { MessageCircle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { customerSchema, type CustomerInput, WHATSAPP_DDI_OPTIONS } from '../schemas/customer.schemas'
import { digitsOnly, normalizeInstagram } from '@/lib/utils'
import type { Customer } from '../api/customers.api'

const InstagramIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)

const applyBRMask = (digits: string): string => {
  const d = digits.slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2)  return `(${d}`
  if (d.length <= 7)  return `(${d.slice(0,2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
}

const detectDdi = (whatsapp?: string | null): string => {
  if (!whatsapp) return '+55'
  for (const opt of WHATSAPP_DDI_OPTIONS) {
    if (whatsapp.startsWith(opt.value)) return opt.value
  }
  return '+55'
}

const extractLocalFormatted = (whatsapp?: string | null): string => {
  if (!whatsapp) return ''
  for (const opt of WHATSAPP_DDI_OPTIONS) {
    if (whatsapp.startsWith(opt.value)) {
      const local = whatsapp.slice(opt.value.length)
      return opt.value === '+55' ? applyBRMask(digitsOnly(local)) : local
    }
  }
  return whatsapp
}

interface Props {
  open:           boolean
  onClose:        () => void
  onSubmit:       (data: CustomerInput) => void
  isLoading:      boolean
  defaultValues?: Customer | null
}

export const CustomerFormModal = ({ open, onClose, onSubmit, isLoading, defaultValues }: Props) => {
  const t  = useTranslations('clients')
  const tc = useTranslations('common')

  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } =
    useForm<CustomerInput>({ resolver: zodResolver(customerSchema), defaultValues: { whatsappDdi: '+55' } })

  const selectedDdi = watch('whatsappDdi')

  useEffect(() => {
    if (defaultValues) {
      const ddi = detectDdi(defaultValues.whatsapp)
      reset({
        name:        defaultValues.name,
        address:     defaultValues.address   ?? '',
        whatsappDdi: ddi,
        whatsapp:    extractLocalFormatted(defaultValues.whatsapp),
        instagram:   defaultValues.instagram ? normalizeInstagram(defaultValues.instagram) : '',
      })
    } else {
      reset({ name: '', address: '', whatsappDdi: '+55', whatsapp: '', instagram: '' })
    }
  }, [defaultValues, reset, open])

  const handleWhatsappInput = (e: React.ChangeEvent<HTMLInputElement>, onChange: (v: string) => void) => {
    if (selectedDdi === '+55') {
      const digits = digitsOnly(e.target.value)
      onChange(applyBRMask(digits))
    } else {
      onChange(e.target.value)
    }
  }

  const handleInstagramBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setValue('instagram', normalizeInstagram(e.target.value))
  }

  return (
    <Modal open={open} onClose={onClose}
      title={defaultValues ? t('editClient') : t('addClient')}
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

        <Input
          label={tc('name')}
          placeholder="Ex: João da Silva"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label={`${tc('address')} (${tc('optional')})`}
          placeholder="Rua das Flores, 123"
          {...register('address')}
        />

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] text-text-light uppercase tracking-wide font-medium">
            {t('contacts')} ({tc('optional')})
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide">
            WhatsApp
          </label>
          <div className="flex gap-2">
            <select
              {...register('whatsappDdi')}
              className="border border-border rounded-lg px-2 py-2.5 text-sm bg-surface text-text cursor-pointer shrink-0"
            >
              {WHATSAPP_DDI_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <Controller
              name="whatsapp"
              control={control}
              render={({ field }) => (
                <div className="relative flex-1">
                  <MessageCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none" />
                  <input
                    type="tel"
                    placeholder={selectedDdi === '+55' ? '(11) 99999-9999' : '999999999'}
                    value={field.value ?? ''}
                    onChange={e => handleWhatsappInput(e, field.onChange)}
                    onBlur={field.onBlur}
                    className="w-full border border-border rounded-lg pl-8 pr-3 py-2.5 text-sm bg-surface text-text"
                  />
                </div>
              )}
            />
          </div>
          {errors.whatsapp && <p className="text-xs text-danger">{errors.whatsapp.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide">
            Instagram
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500 pointer-events-none">
              <InstagramIcon size={14} />
            </span>
            <input
              type="text"
              placeholder="usuario (sem @)"
              className="w-full border border-border rounded-lg pl-8 pr-3 py-2.5 text-sm bg-surface text-text"
              {...register('instagram')}
              onBlur={handleInstagramBlur}
            />
          </div>
          {errors.instagram && <p className="text-xs text-danger">{errors.instagram.message}</p>}
        </div>

      </div>
    </Modal>
  )
}
