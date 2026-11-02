'use client';

import Link from 'next/link';
import Image from 'next/image';
import sidebarLogo from '../../../public/assets/browser-favicon-source.png';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, isNavActive } from './navigation';
import { useSignOut } from './useSignOut';
import { MobileNavigation } from './MobileNavigation';

const SidebarContent = ({ pathname, onNav }: { pathname: string; onNav?: () => void }) => {
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const { signOut, signingOut } = useSignOut();

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
        {NAV_ITEMS.map(({ key, href, icon: Icon }) => {
          const active = isNavActive(pathname, href);
          return (
            <Link
              key={href}
              aria-current={active ? 'page' : undefined}
              href={href}
              prefetch
              onClick={onNav}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150',
                active
                  ? 'bg-[rgba(212,160,23,0.15)] text-gold-btn'
                  : 'text-white/70 hover:bg-white/6 hover:text-white/85',
              )}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
              {t(key)}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/[0.07] shrink-0">
        <button
          onClick={signOut}
          disabled={signingOut}
          aria-busy={signingOut}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-white/60 hover:text-white/70 transition-colors"
        >
          <LogOut size={16} /> {tc('signOut')}
        </button>
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <>
      <aside className="hidden lg:flex flex-col w-60 min-w-60 bg-sidebar h-dvh sticky top-0 overflow-hidden">
        <SidebarContent pathname={pathname} />
      </aside>
      <MobileNavigation />
    </>
  );
};
