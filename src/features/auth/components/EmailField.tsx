'use client'
import { Mail } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import type { UseFormRegister, FieldError, FieldValues, Path } from 'react-hook-form'

interface Props<T extends FieldValues> {
  register: UseFormRegister<T>
  error?:   FieldError
}

export const EmailField = <T extends FieldValues,>({ register, error }: Props<T>) => (
  <Input
    label="E-mail"
    type="email"
    placeholder="seu@email.com"
    icon={<Mail size={15} />}
    error={error?.message}
    {...register('email' as Path<T>)}
  />
)
