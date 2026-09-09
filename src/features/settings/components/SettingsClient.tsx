'use client'
import { useTranslations } from 'next-intl'
import { PageHeader } from '@/components/ui/Display'
import { ProfileForm } from './ProfileForm'
import { PreferencesForm } from './PreferencesForm'

export const SettingsClient = () => {
  const t = useTranslations('settings')
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-8">
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <div className="flex flex-col gap-5">
        <ProfileForm />
        <PreferencesForm />
      </div>
    </div>
  )
}
