'use client'
import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Save, X, Calendar, Camera, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useUpdateUser } from '../hooks/useUpdateUser'
import { useAuthStore } from '@/stores/auth.store'
import { extractValidationErrors } from '@/lib/api'
import { prepareProfileImage } from '../profileImage'

const schema = z.object({
  name:  z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  profileImage: z.string().max(700_000, 'A foto é muito grande').nullable().optional(),
})
type FormInput = z.infer<typeof schema>

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(iso))

export const ProfileForm = () => {
  const t          = useTranslations('settings')
  const tc         = useTranslations('common')
  const { user }   = useAuthStore()
  const updateUser = useUpdateUser()

  const { register, handleSubmit, reset, setError, setValue, control, formState: { errors, isDirty } } =
    useForm<FormInput>({ resolver: zodResolver(schema) })
  const profileImage = useWatch({ control, name: 'profileImage' })
  const photoInput = useRef<HTMLInputElement>(null)
  const [photoError, setPhotoError] = useState('')

  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email, profileImage: user.profileImage ?? null })
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
      <div className="mb-5 flex items-center gap-2 text-base font-semibold text-text">
        <User size={15} className="text-gold" /> {t('userProfile')}
      </div>

      <div className="mb-5 flex flex-col items-center gap-2">
        <button type="button" disabled={updateUser.isPending} onClick={()=>photoInput.current?.click()} className="group relative size-28 overflow-hidden rounded-full border-2 border-border bg-bg">
          {profileImage ? <img src={profileImage} alt="Foto da barbearia" className="size-full object-cover"/> : <span className="grid size-full place-items-center text-text-muted"><Camera size={32}/></span>}
          <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1.5 text-[11px] text-white">{profileImage?'Editar foto':'Adicionar foto'}</span>
        </button>
        <input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={async event=>{
          const file=event.target.files?.[0]; event.target.value=''; if(!file)return
          setPhotoError('')
          try{setValue('profileImage',await prepareProfileImage(file),{shouldDirty:true,shouldValidate:true})}catch(error){setPhotoError(error instanceof Error?error.message:'Não foi possível preparar a imagem.')}
        }}/>
        {profileImage&&<button type="button" disabled={updateUser.isPending} onClick={()=>setValue('profileImage',null,{shouldDirty:true})} className="flex items-center gap-1 text-xs text-danger"><Trash2 size={13}/>Remover foto</button>}
        {(photoError||errors.profileImage?.message)&&<p className="text-xs text-danger">{photoError||errors.profileImage?.message}</p>}
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
        <Button variant="outline" onClick={() => reset()} disabled={!isDirty}>
          <X size={16} /> {tc('discard')}
        </Button>
        <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={!isDirty || updateUser.isPending}>
          <Save size={16} /> {updateUser.isPending ? tc('saving') : tc('save')}
        </Button>
      </div>
    </Card>
  )
}
