'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
export const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const { ready, accessToken, error, initFromStorage } = useAuthStore()
  const router = useRouter()
  useEffect(() => { void initFromStorage() }, [initFromStorage])
  useEffect(() => { if (ready && accessToken && !error) router.replace('/dashboard') }, [ready, accessToken, error, router])
  if (!ready || (accessToken && !error)) return null
  return <>{children}</>
}
