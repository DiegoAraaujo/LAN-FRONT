'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/stores/auth.store'
import { QueryError } from '@/components/ui/QueryError'
import { LoadingState } from '@/components/ui/luma-spin'
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { ready, authenticated, error, initFromStorage } = useAuthStore()
  const router = useRouter()
  const t = useTranslations('common')
  useEffect(() => { void initFromStorage() }, [initFromStorage])
  useEffect(() => { if (ready && !authenticated && !error) router.replace('/login') }, [ready, authenticated, error, router])
  if (error) return <div className="p-8"><QueryError onRetry={() => void initFromStorage()}/></div>
  if (!ready || !authenticated) return <LoadingState label={t('loading')} className="min-h-screen" />
  return <>{children}</>
}
