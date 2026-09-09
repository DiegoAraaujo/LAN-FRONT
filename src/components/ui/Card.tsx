import { cn } from '@/lib/utils'

interface CardProps { children: React.ReactNode; className?: string }

export const Card = ({ children, className }: CardProps) => (
  <div className={cn('rounded-2xl border border-border bg-surface shadow-[0_2px_12px_rgba(20,45,35,0.035)]', className)}>
    {children}
  </div>
)
