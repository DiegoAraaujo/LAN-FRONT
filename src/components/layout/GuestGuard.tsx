'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants'

export const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const router  = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken')
    if (token) {
      router.replace(ROUTES.dashboard)
    } else {
      setReady(true)
    }
  }, [router])

  if (!ready) return null

  return <>{children}</>
}
