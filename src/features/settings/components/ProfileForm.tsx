'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Save, X, Calendar } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useUpdateUser } from '../hooks/useUpdateUser'
import { useAuthStore } from '@/stores/auth.store'
import { extractValidationErrors } from '@/lib/api'

const schema = z.object({
  name:  z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
})
type FormInput = z.infer<typeof schema>

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(iso))

export const ProfileForm = () => {
  const t          = useTranslations('settings')
  const tc         = useTranslations('common')
  const { user }   = useAuthStore()
  const updateUser = useUpdateUser()

  const { register, handleSubmit, reset, setError, formState: { errors, isDirty } } =
    useForm<FormInput>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email })
  }, [user, reset])

  const onSubmit = (data: FormInput) => {
    updateUser.mutate(data, {
      onError: (err) => {
        const fe = extractValidationErrors(err)
        Object.entries(fe).forEach(([f, m]) => setError(f as keyof FormInput, { message: m }))
      },
    })
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 font-semibold text-sm text-text mb-5">
        <User size={15} className="text-gold" /> {t('userProfile')}
      </div>

      <div className="bg-bg rounded-xl p-4 mb-5">
        <div className="text-[11px] text-text-light uppercase tracking-wide font-medium mb-3">
          {t('currentData')}
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-text-muted">{t('fullName')}</span>
            <span className="text-sm font-semibold text-text">{user?.name ?? '—'}</span>
          </div>
          <div className="flex justify-between items-center border-t border-border pt-2.5">
            <span className="text-xs text-text-muted">{tc('email')}</span>
            <span className="text-sm font-semibold text-text">{user?.email ?? '—'}</span>
          </div>
          {user?.createdAt && (
            <div className="flex justify-between items-center border-t border-border pt-2.5">
              <span className="text-xs text-text-muted flex items-center gap-1">
                <Calendar size={11} /> {t('createdAt')}
              </span>
              <span className="text-xs text-text-muted">{formatDate(user.createdAt)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        <Input
          label={t('fullName')}
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label={tc('email')}
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={() => reset()} disabled={!isDirty}>
          <X size={13} /> {tc('discard')}
        </Button>
        <Button variant="primary" size="sm" onClick={handleSubmit(onSubmit)} disabled={!isDirty || updateUser.isPending}>
          <Save size={13} /> {updateUser.isPending ? tc('saving') : tc('save')}
        </Button>
      </div>
    </Card>
  )
}
