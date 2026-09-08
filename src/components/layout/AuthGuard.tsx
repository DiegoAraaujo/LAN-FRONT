'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/stores/auth.store'
import { QueryError } from '@/components/ui/QueryError'
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { ready, accessToken, error, initFromStorage } = useAuthStore()
  const router = useRouter()
  const t = useTranslations('common')
  useEffect(() => { void initFromStorage() }, [initFromStorage])
  useEffect(() => { if (ready && !accessToken && !error) router.replace('/login') }, [ready, accessToken, error, router])
  if (error) return <div className="p-8"><QueryError onRetry={() => void initFromStorage()}/></div>
  if (!ready || !accessToken) return <div role="status" className="min-h-screen grid place-content-center gap-3 text-center text-sm text-text-muted"><div className="mx-auto h-8 w-8 rounded-full border-2 border-gold-btn border-t-transparent animate-spin"/>{t('loading')}</div>
  return <>{children}</>
}
