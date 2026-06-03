'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants'

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router  = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken')
    if (!token) {
      router.replace(ROUTES.login)
    } else {
      setReady(true)
    }
  }, [router])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gold-btn border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-text-light">Verificando sessão…</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
