import { cn } from '@/lib/utils'

interface CardProps { children: React.ReactNode; className?: string }

export const Card = ({ children, className }: CardProps) => (
  <div className={cn('bg-surface border border-border rounded-2xl shadow-[0_2px_12px_rgba(20,45,35,0.025)]', className)}>
    {children}
  </div>
)
