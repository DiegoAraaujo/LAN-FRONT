'use client'

import { useState } from 'react'
import { LogOut, ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { revokeAllSessions } from '@/lib/api'

export const SecuritySessions = () => {
  const t = useTranslations('settings')
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const revoke = async () => {
    if (pending) return
    setPending(true)
    try {
      await revokeAllSessions()
      toast.success(t('sessionsRevoked'))
      router.replace('/login')
      router.refresh()
    } finally {
      setPending(false)
    }
  }

  return (
    <Card className="p-5 md:col-span-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
            <ShieldCheck size={19} />
          </span>
          <div>
            <h2 className="font-semibold text-text">{t('sessionSecurity')}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-5 text-text-muted">{t('sessionSecurityHint')}</p>
          </div>
        </div>
        <Button type="button" variant="danger" onClick={revoke} disabled={pending} className="shrink-0">
          <LogOut size={16} /> {pending ? t('revokingSessions') : t('revokeSessions')}
        </Button>
      </div>
    </Card>
  )
}
