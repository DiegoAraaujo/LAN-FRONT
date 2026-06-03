'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { EmailField } from './EmailField'
import { PasswordField } from './PasswordField'
import { useSignup } from '../hooks/useSignup'
import { extractValidationErrors } from '@/lib/api'
import { signupSchema, type SignupInput } from '../schemas/auth.schemas'
import { ROUTES } from '@/constants'

export const SignupForm = () => {
  const t    = useTranslations('auth')
  const signup = useSignup()
  const { register, handleSubmit, setError, formState: { errors } } =
    useForm<SignupInput>({ resolver: zodResolver(signupSchema) })

  const onSubmit = ({ name, email, password }: SignupInput) => {
    signup.mutate({ name, email, password }, {
      onError: (err) => {
        const fe = extractValidationErrors(err)
        Object.entries(fe).forEach(([f, m]) => setError(f as keyof SignupInput, { message: m }))
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <Input label={t('fullName')} placeholder={t('fullNamePlaceholder')} icon={<User size={15} />}
        error={errors.name?.message} {...register('name')} />
      <EmailField register={register} error={errors.email} />
      <PasswordField register={register} error={errors.password} label={t('passwordLabel')} placeholder={t('passwordPlaceholder')} />
      <PasswordField register={register} error={errors.confirmPassword}
        name="confirmPassword" label={t('confirmPassword')} placeholder={t('passwordPlaceholder')} />
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-gold-btn" {...register('terms')} />
          {t('acceptTerms')}
        </label>
        {errors.terms && <p className="text-xs text-danger">{errors.terms.message}</p>}
      </div>
      <Button variant="primary" fullWidth size="lg" onClick={handleSubmit(onSubmit)} disabled={signup.isPending}>
        {signup.isPending ? t('creatingAccount') : t('createAccount')}
      </Button>
      <hr className="border-border" />
      <p className="text-sm text-center text-text-muted">
        {t('alreadyHaveAccount')}{' '}
        <Link href={ROUTES.login} className="text-gold font-semibold hover:underline">{t('signInLink')}</Link>
      </p>
    </div>
  )
}
