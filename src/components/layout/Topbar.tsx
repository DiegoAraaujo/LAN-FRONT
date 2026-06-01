'use client'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { getInitials } from '@/lib/utils'

export const Topbar = () => {
  const { user } = useAuthStore()

  return (
    <header className="h-14 bg-bg2 border-b border-border flex items-center px-6 gap-3 shrink-0">
      {user && (
        <div className="flex items-center gap-2 mr-auto">
          <div className="w-7 h-7 rounded-full bg-gold-btn flex items-center justify-center text-xs font-bold text-text">
            {getInitials(user.name)}
          </div>
          <span className="text-sm text-text-muted hidden sm:block">{user.name}</span>
        </div>
      )}
      <Link
        href="/settings"
        aria-label="Settings"
        className="w-8 h-8 flex items-center justify-center rounded-full text-text-light hover:bg-border transition-colors"
      >
        <Settings size={18} />
      </Link>
    </header>
  )
}
