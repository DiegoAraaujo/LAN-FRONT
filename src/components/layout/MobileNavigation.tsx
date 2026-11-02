'use client';

import { useEffect, useId, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  CalendarDays,
  ChevronRight,
  ContactRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Wallet,
  X,
} from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { cn, getInitials } from '@/lib/utils';
import { ROUTES } from '@/constants';
import { NAV_ITEMS, isNavActive } from './navigation';
import { useSignOut } from './useSignOut';

const SHORTCUTS = [
  { key: 'dashboard', href: ROUTES.dashboard, icon: LayoutDashboard },
  { key: 'clients', href: ROUTES.clients, icon: ContactRound },
  { key: 'appointments', href: ROUTES.activities, icon: CalendarDays },
  { key: 'cashFlow', href: ROUTES.cashFlow, icon: Wallet },
] as const;

export function MobileNavigation() {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const e = useTranslations('experience');
  const { user } = useAuthStore();
  const { sidebarOpen, openSidebar, closeSidebar } = useUIStore();
  const { signOut, signingOut } = useSignOut();
  const panel = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<number | null>(null);
  const panelId = useId();
  const titleId = useId();
  const menuActive = sidebarOpen || !SHORTCUTS.some((item) => isNavActive(pathname, item.href));

  useEffect(() => {
    const node = panel.current;
    if (!node || !sidebarOpen) return;
    if (window.matchMedia('(min-width: 1024px)').matches) {
      closeSidebar();
      return;
    }
    const previous = document.activeElement as HTMLElement | null;
    node.showModal();
    const onResize = () => {
      if (window.innerWidth >= 1024) closeSidebar();
    };
    window.addEventListener('resize', onResize);
    return () => {
      node.close();
      window.removeEventListener('resize', onResize);
      if (previous?.isConnected) previous.focus();
    };
  }, [sidebarOpen, closeSidebar]);

  return (
    <>
      <nav
        aria-label={t('mobileNavigation')}
        className="fixed bottom-[calc(0.75rem_+_env(safe-area-inset-bottom))] left-1/2 z-30 grid h-16 w-[calc(100%_-_1.5rem)] max-w-md -translate-x-1/2 grid-cols-5 items-center gap-1 rounded-full border border-border bg-surface/95 p-1.5 shadow-[0_8px_32px_rgba(27,48,45,0.14)] backdrop-blur-xl lg:hidden"
      >
        {SHORTCUTS.map(({ key, href, icon: Icon }) => {
          const active = !sidebarOpen && isNavActive(pathname, href);
          return (
            <Link
              key={key}
              href={href}
              prefetch
              aria-label={t(key)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex h-full min-w-0 items-center justify-center rounded-full transition-colors',
                active ? 'bg-emerald-50 text-sidebar' : 'text-text-muted hover:bg-bg',
              )}
            >
              <Icon size={23} strokeWidth={active ? 2.2 : 1.7} />
            </Link>
          );
        })}
        <button
          type="button"
          onClick={openSidebar}
          aria-label={e('openMenu')}
          aria-haspopup="dialog"
          aria-expanded={sidebarOpen}
          aria-controls={panelId}
          className={cn(
            'flex h-full items-center justify-center rounded-full transition-colors',
            menuActive ? 'bg-emerald-50 text-sidebar' : 'text-text-muted hover:bg-bg',
          )}
        >
          <Menu size={24} strokeWidth={menuActive ? 2.2 : 1.7} />
        </button>
      </nav>

      <dialog
        ref={panel}
        id={panelId}
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault();
          closeSidebar();
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientY < bounds.top ||
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY > bounds.bottom
          )
            closeSidebar();
        }}
        className="mobile-menu-sheet fixed inset-x-0 bottom-0 top-auto m-0 max-h-[88dvh] w-full max-w-none rounded-t-[28px] border-0 bg-surface p-0 text-text shadow-[0_-12px_48px_rgba(27,48,45,0.12)] backdrop:bg-slate-950/35 lg:hidden"
      >
        <div className="flex max-h-[88dvh] flex-col pb-[env(safe-area-inset-bottom)]">
          <div className="shrink-0 px-5 pt-3">
            <div
              className="flex touch-none justify-center pb-4"
              onTouchStart={(event) => {
                touchStart.current = event.touches[0]?.clientY ?? null;
              }}
              onTouchEnd={(event) => {
                const start = touchStart.current;
                touchStart.current = null;
                if (start !== null && (event.changedTouches[0]?.clientY ?? start) - start > 60)
                  closeSidebar();
              }}
            >
              <span aria-hidden="true" className="h-1.5 w-11 rounded-full bg-border" />
            </div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-sm font-extrabold tracking-tight text-sidebar"
                >
                  LAN
                </span>
                <h2 id={titleId} className="text-lg font-semibold">
                  {t('menu')}
                </h2>
              </div>
              <button
                type="button"
                autoFocus
                aria-label={e('closeMenu')}
                onClick={closeSidebar}
                className="grid size-11 shrink-0 place-items-center rounded-full text-text-muted hover:bg-bg"
              >
                <X size={21} />
              </button>
            </div>
            <Link
              href={ROUTES.settings}
              onClick={closeSidebar}
              className="mb-4 flex min-w-0 items-center gap-3 rounded-xl py-1"
            >
              <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-emerald-50 text-lg font-semibold text-emerald-800">
                {user?.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt=""
                    width={56}
                    height={56}
                    unoptimized
                    className="size-full object-cover"
                  />
                ) : (
                  getInitials(user?.name ?? 'LAN')
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-base font-semibold">
                  {user?.name ?? 'LAN'}
                </span>
                <span className="mt-0.5 block text-sm text-text-muted">{t('myAccount')}</span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-text-muted" />
            </Link>
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              aria-busy={signingOut}
              className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm text-text-muted hover:bg-bg disabled:opacity-50"
            >
              <LogOut size={18} />
              {signingOut ? tc('loading') : tc('signOut')}
            </button>
            <div className="h-px bg-border" />
          </div>
          <nav
            aria-label={t('menu')}
            className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 py-3"
          >
            {[
              ...NAV_ITEMS,
              { key: 'settings', href: ROUTES.settings, icon: Settings } as const,
            ].map(({ key, href, icon: Icon }) => {
              const active = isNavActive(pathname, href);
              return (
                <Link
                  key={key}
                  href={href}
                  prefetch
                  onClick={closeSidebar}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-14 items-center gap-3.5 rounded-xl px-4 text-sm transition-colors',
                    active
                      ? 'bg-emerald-50 font-semibold text-sidebar'
                      : 'text-text-muted hover:bg-bg',
                  )}
                >
                  <Icon size={21} strokeWidth={active ? 2.1 : 1.7} className="shrink-0" />
                  <span className="min-w-0 flex-1">{t(key)}</span>
                  <ChevronRight size={16} className="shrink-0 opacity-50" />
                </Link>
              );
            })}
          </nav>
        </div>
      </dialog>
    </>
  );
}
