'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
export const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const { ready, authenticated, error, initFromStorage } = useAuthStore()
  const router = useRouter()
  useEffect(() => { void initFromStorage() }, [initFromStorage])
  useEffect(() => { if (ready && authenticated && !error) router.replace('/dashboard') }, [ready, authenticated, error, router])
  if (!ready || (authenticated && !error)) return null
  return <>{children}</>
}
