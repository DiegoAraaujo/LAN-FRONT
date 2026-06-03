import { cn } from '@/lib/utils'

type BadgeVariant = 'green' | 'yellow' | 'gold' | 'outline' | 'dark'

interface BadgeProps { children: React.ReactNode; variant?: BadgeVariant; className?: string }

const variants: Record<BadgeVariant, string> = {
  green:   'bg-green-100 text-green-700',
  yellow:  'bg-amber-100 text-amber-700',
  gold:    'bg-gold-btn text-text',
  outline: 'border border-border text-text-muted',
  dark:    'bg-text text-gold-btn',
}

export const Badge = ({ children, variant = 'outline', className }: BadgeProps) => (
  <span className={cn('inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold', variants[variant], className)}>
    {children}
  </span>
)
