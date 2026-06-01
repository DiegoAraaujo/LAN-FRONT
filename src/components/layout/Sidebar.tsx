'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Briefcase, Users, UserCheck, Clock, HelpCircle, LogOut, X, Menu, Wrench } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useUIStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants'

const NAV_KEYS = [
  { key: 'dashboard',     href: ROUTES.dashboard,     icon: LayoutDashboard },
  { key: 'appointments',  href: ROUTES.appointments,  icon: Briefcase       },
  { key: 'clients',       href: ROUTES.clients,       icon: Users           },
  { key: 'professionals', href: ROUTES.professionals, icon: UserCheck       },
  { key: 'services',      href: ROUTES.services,      icon: Wrench          },
  { key: 'activities',    href: ROUTES.activities,    icon: Clock           },
] as const

const SidebarContent = ({ pathname, onNav }: { pathname: string; onNav?: () => void }) => {
  const t  = useTranslations('nav')
  const tc = useTranslations('common')
  const router = useRouter()
  const { clearSession } = useAuthStore()

  const handleSignOut = () => {
    clearSession()
    router.push(ROUTES.login)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-5 py-6 border-b border-white/[0.07] shrink-0">
        <div className="text-gold-btn text-2xl font-extrabold tracking-tight">LAN</div>
        <div className="text-white/40 text-[10px] leading-snug mt-1">Launched, Noted, Never Forgotten</div>
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-0.5 mt-1 overflow-hidden">
        {NAV_KEYS.map(({ key, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} prefetch onClick={onNav}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors duration-150',
                active ? 'bg-[rgba(212,160,23,0.15)] text-gold-btn' : 'text-white/55 hover:bg-white/6 hover:text-white/85',
              )}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
              {t(key)}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-white/[0.07] shrink-0">
        <Link
          href={ROUTES.support}
          onClick={onNav}
          className={cn(
            'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] transition-colors',
            pathname === ROUTES.support ? 'text-gold-btn' : 'text-white/40 hover:text-white/70',
          )}
        >
          <HelpCircle size={16} /> {tc('support')}
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-white/40 hover:text-white/70 transition-colors"
        >
          <LogOut size={16} /> {tc('signOut')}
        </button>
      </div>
    </div>
  )
}

export const Sidebar = () => {
  const pathname = usePathname()
  const { sidebarOpen, openSidebar, closeSidebar } = useUIStore()
  return (
    <>
      <aside className="hidden lg:flex flex-col w-55 min-w-55 bg-sidebar h-screen sticky top-0 overflow-hidden">
        <SidebarContent pathname={pathname} />
      </aside>
      <button aria-label="Open menu" className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-lg bg-sidebar text-white shadow-md" onClick={openSidebar}>
        <Menu size={18} />
      </button>
      {sidebarOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={closeSidebar} />}
      <aside className={cn('lg:hidden fixed top-0 left-0 z-50 w-64 h-full bg-sidebar transition-transform duration-200 ease-in-out', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <button aria-label="Close menu" className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors" onClick={closeSidebar}>
          <X size={20} />
        </button>
        <SidebarContent pathname={pathname} onNav={closeSidebar} />
      </aside>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-border flex justify-around py-2">
        {NAV_KEYS.slice(0, 5).map(({ key, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} prefetch className={cn('flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[9px] font-medium transition-colors', active ? 'text-gold-btn' : 'text-text-light')}>
              <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
              <SidebarNavLabel navKey={key} />
            </Link>
          )
        })}
      </nav>
    </>
  )
}

const SidebarNavLabel = ({ navKey }: { navKey: string }) => {
  const t = useTranslations('nav')
  return <>{t(navKey as Parameters<typeof t>[0])}</>
}
