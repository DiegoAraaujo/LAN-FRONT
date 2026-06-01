'use client'
import { useTranslations } from 'next-intl'
import { PageHeader } from '@/components/ui/Display'
import { ProfileForm } from './ProfileForm'
import { PreferencesForm } from './PreferencesForm'
import { SecurityCard } from './SecurityCard'

export const SettingsClient = () => {
  const t = useTranslations('settings')
  return (
    <div className="p-5 sm:p-8">
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        <div className="flex flex-col gap-4">
          <ProfileForm />
          <PreferencesForm />
        </div>
        <SecurityCard />
      </div>
    </div>
  )
}
