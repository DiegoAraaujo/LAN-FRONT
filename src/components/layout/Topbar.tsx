'use client'
import Link from 'next/link'
import { Settings, ArrowUpRight } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useAuthStore } from '@/stores/auth.store'
export const Topbar = () => {
  const { user } = useAuthStore()
  const locale = useLocale()
  const t = useTranslations('nav')
  return <header className="h-[72px] bg-surface/90 border-b border-border flex items-center justify-between pl-16 lg:pl-8 pr-4 sm:pr-8 gap-3 shrink-0">
    <span className="text-sm text-text-muted capitalize hidden sm:block">{new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Sao_Paulo' }).format(new Date())}</span>
    <div className="ml-auto flex items-center gap-3"><Link href="/appointments" className="hidden md:flex text-xs items-center gap-1 text-text-muted">{t('appointments')}<ArrowUpRight size={13}/></Link><div className="h-6 w-px bg-border hidden md:block"/><span className="text-sm font-medium hidden sm:block max-w-48 truncate">{user?.name}</span><span className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-800 grid place-items-center text-sm font-semibold">{user?.name?.charAt(0) ?? 'L'}</span><Link href="/settings" aria-label={locale === 'en' ? 'Settings' : 'Configurações'} className="p-2.5 rounded-xl text-text-muted hover:bg-bg"><Settings size={18}/></Link></div>
  </header>
}
