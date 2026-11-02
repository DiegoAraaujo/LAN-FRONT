import { LayoutDashboard, Briefcase, Users, UserCheck, Wrench, Wallet } from 'lucide-react';
import { ROUTES } from '@/constants';

export const NAV_ITEMS = [
  { key: 'dashboard', href: ROUTES.dashboard, icon: LayoutDashboard },
  { key: 'appointments', href: ROUTES.activities, icon: Briefcase },
  { key: 'clients', href: ROUTES.clients, icon: Users },
  { key: 'professionals', href: ROUTES.professionals, icon: UserCheck },
  { key: 'services', href: ROUTES.services, icon: Wrench },
  { key: 'cashFlow', href: ROUTES.cashFlow, icon: Wallet },
] as const;

export const isNavActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(href + '/');
