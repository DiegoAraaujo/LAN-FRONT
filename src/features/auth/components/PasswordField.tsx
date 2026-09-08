'use client'
import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/Input'
import type { UseFormRegister, FieldError, FieldValues, Path } from 'react-hook-form'

interface Props<T extends FieldValues> {
  register: UseFormRegister<T>
  error?:   FieldError
  name?:    string
  label?:   string
  placeholder?: string
}

export const PasswordField = <T extends FieldValues,>({
  register,
  error,
  name = 'password',
  label = 'Senha',
  placeholder = '••••••••',
}: Props<T>) => {
  const t = useTranslations('experience')
  const [show, setShow] = useState(false)
  return (
    <Input
      label={label}
      type={show ? 'text' : 'password'}
      placeholder={placeholder}
      icon={<Lock size={15} />}
      rightIcon={
        <button aria-label={t(show ? 'hidePassword' : 'showPassword')} type="button" onClick={() => setShow(!show)}>
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      }
      error={error?.message}
      {...register(name as Path<T>)}
    />
  )
}
