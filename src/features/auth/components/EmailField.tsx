'use client'
import { Mail } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import type { UseFormRegister, FieldError } from 'react-hook-form'

interface Props {
  register: UseFormRegister<any>
  error?:   FieldError
}

export const EmailField = ({ register, error }: Props) => (
  <Input
    label="E-mail"
    type="email"
    placeholder="seu@email.com"
    icon={<Mail size={15} />}
    error={error?.message}
    {...register('email')}
  />
)
