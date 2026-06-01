'use client'
import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import type { UseFormRegister, FieldError } from 'react-hook-form'

interface Props {
  register: UseFormRegister<any>
  error?:   FieldError
  name?:    string
  label?:   string
  placeholder?: string
}

export const PasswordField = ({
  register,
  error,
  name = 'password',
  label = 'Senha',
  placeholder = '••••••••',
}: Props) => {
  const [show, setShow] = useState(false)
  return (
    <Input
      label={label}
      type={show ? 'text' : 'password'}
      placeholder={placeholder}
      icon={<Lock size={15} />}
      rightIcon={
        <button type="button" onClick={() => setShow(!show)}>
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      }
      error={error?.message}
      {...register(name)}
    />
  )
}
