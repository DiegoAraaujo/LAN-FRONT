import { cn } from '@/lib/utils'

interface CardProps { children: React.ReactNode; className?: string }

export const Card = ({ children, className }: CardProps) => (
  <div className={cn('bg-surface border border-border rounded-xl', className)}>
    {children}
  </div>
)
