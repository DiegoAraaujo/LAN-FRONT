'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import sidebarLogo from '../../../public/assets/browser-favicon-source.png'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Briefcase, Users, UserCheck, Clock, LogOut, X, Menu, Wrench, Wallet } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useUIStore } from '@/stores/ui.store'
import { logoutSession } from '@/lib/api'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants'

const NAV_KEYS = [
  { key: 'dashboard',     href: ROUTES.dashboard,     icon: LayoutDashboard },
  { key: 'appointments',  href: ROUTES.appointments,  icon: Briefcase       },
  { key: 'clients',       href: ROUTES.clients,       icon: Users           },
  { key: 'professionals', href: ROUTES.professionals, icon: UserCheck       },
  { key: 'services',      href: ROUTES.services,      icon: Wrench          },
  { key: 'cashFlow', href: ROUTES.cashFlow, icon: Wallet },
  { key: 'activities',    href: ROUTES.activities,    icon: Clock           },
] as const

const SidebarContent = ({ pathname, onNav }: { pathname: string; onNav?: () => void }) => {
  const t  = useTranslations('nav')
  const tc = useTranslations('common')
  const qc = useQueryClient()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (signingOut) return
    setSigningOut(true)
    try {
      await qc.cancelQueries()
      await logoutSession()
      qc.clear()
      window.location.replace(ROUTES.login)
    } catch {
      // The API interceptor shows the error; keep the session so logout can be retried.
      setSigningOut(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-5 py-6 border-b border-white/[0.07] shrink-0">
        <div className="flex h-20 w-full max-w-[200px] items-center overflow-hidden">
          <Image
            src={sidebarLogo}
            alt="LAN — Launched, Noted, Never Forgotten"
            width={1254}
            height={1254}
            sizes="200px"
            preload
            unoptimized
            className="block h-auto w-full shrink-0"
          />
        </div>
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-1 mt-1 overflow-y-auto">
        {NAV_KEYS.map(({ key, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} aria-current={active ? 'page' : undefined} href={href} prefetch onClick={onNav}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150',
                active ? 'bg-[rgba(212,160,23,0.15)] text-gold-btn' : 'text-white/70 hover:bg-white/6 hover:text-white/85',
              )}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
              {t(key)}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-white/[0.07] shrink-0">
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          aria-busy={signingOut}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-white/60 hover:text-white/70 transition-colors"
        >
          <LogOut size={16} /> {tc('signOut')}
        </button>
      </div>
    </div>
  )
}

export const Sidebar = () => {
  const pathname = usePathname()
  const t = useTranslations('experience')
  const panel = useRef<HTMLDialogElement>(null)
  const { sidebarOpen, openSidebar, closeSidebar } = useUIStore()
  useEffect(() => {
    const node = panel.current
    if (!node || !sidebarOpen) return
    const previous = document.activeElement as HTMLElement | null
    node.showModal()
    const onResize = () => { if (window.innerWidth >= 1024) closeSidebar() }
    window.addEventListener('resize', onResize)
    return () => { node.close(); window.removeEventListener('resize', onResize); previous?.focus() }
  }, [sidebarOpen, closeSidebar])
  return (
    <>
      <aside className="hidden lg:flex flex-col w-60 min-w-60 bg-sidebar h-dvh sticky top-0 overflow-hidden">
        <SidebarContent pathname={pathname} />
      </aside>
      <button aria-label={t('openMenu')} aria-expanded={sidebarOpen} className="lg:hidden fixed top-4 left-4 z-30 w-10 h-10 flex items-center justify-center rounded-xl bg-sidebar text-white" onClick={openSidebar}><Menu size={18}/></button>
      <dialog ref={panel} aria-label={t('openMenu')} onCancel={event => { event.preventDefault(); closeSidebar() }} onClick={event => { if (event.target === event.currentTarget && event.clientX > event.currentTarget.getBoundingClientRect().right) closeSidebar() }} className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-72 max-w-[85vw] bg-sidebar text-white p-0 border-0 backdrop:bg-slate-950/60">
        <button aria-label={t('closeMenu')} className="absolute top-5 right-3 p-2 text-white/70 rounded-lg hover:bg-white/10" onClick={closeSidebar}><X size={20}/></button>
        <SidebarContent pathname={pathname} onNav={closeSidebar}/>
      </dialog>
    </>
  )
}
