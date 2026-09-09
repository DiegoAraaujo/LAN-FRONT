'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
import { LoadingState } from '@/components/ui/luma-spin'
import { useTranslations } from 'next-intl'
export const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const { ready, authenticated, error, initFromStorage } = useAuthStore()
  const router = useRouter()
  const t = useTranslations('common')
  useEffect(() => { void initFromStorage() }, [initFromStorage])
  useEffect(() => { if (ready && authenticated && !error) router.replace('/dashboard') }, [ready, authenticated, error, router])
  if (!ready || (authenticated && !error)) return <LoadingState label={t('loading')} className="min-h-screen" />
  return <>{children}</>
}
