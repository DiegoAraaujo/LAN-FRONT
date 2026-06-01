import { AVATAR_COLORS } from '@/constants'

export const cn = (...classes: (string | undefined | false | null)[]): string =>
  classes.filter(Boolean).join(' ')

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export const getInitials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

export const getAvatarColor = (name: string): string =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

export const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('pt-BR').format(date)


export const digitsOnly = (value: string): string => value.replace(/\D/g, '')

export const formatBRPhone = (raw: string): string => {
  const d = digitsOnly(raw)
  if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
  return raw
}

export const normalizeInstagram = (value: string): string =>
  value.trim().replace(/^@+/, '')
