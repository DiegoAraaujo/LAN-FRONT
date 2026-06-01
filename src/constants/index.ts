export const APP_NAME    = 'LAN' as const
export const APP_TAGLINE = 'Launched, Noted, Never Forgotten' as const

export const ROUTES = {
  home:          '/',
  login:         '/login',
  signup:        '/signup',
  dashboard:     '/dashboard',
  clients:       '/clients',
  professionals: '/professionals',
  services:      '/services',
  appointments:  '/appointments',
  activities:    '/activities',
  settings:      '/settings',
  support:       '/support',
} as const

export const AVATAR_COLORS = [
  'bg-amber-500',
  'bg-slate-500',
  'bg-teal-600',
  'bg-rose-500',
  'bg-violet-500',
  'bg-sky-500',
  'bg-emerald-600',
  'bg-orange-500',
] as const
