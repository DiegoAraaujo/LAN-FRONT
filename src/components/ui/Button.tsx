import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost'
type ButtonSize    = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant
  size?:      ButtonSize
  fullWidth?: boolean
  children:   React.ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-sidebar text-white font-medium hover:opacity-90',
  outline: 'border border-border bg-surface text-text hover:border-gold-btn',
  danger:  'border border-red-200 bg-transparent text-danger hover:bg-red-50',
  ghost:   'bg-transparent text-text-muted hover:bg-bg border border-transparent',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 py-1.5 text-xs gap-1.5',
  md: 'min-h-11 px-4 py-3   text-sm gap-2',
  lg: 'px-5 py-3   text-sm gap-2',
}

export const Button = ({
  variant   = 'outline',
  size      = 'md',
  fullWidth = false,
  children,
  className,
  ...props
}: ButtonProps) => (
  <button
    className={cn(
      'inline-flex items-center justify-center rounded-xl font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
      variants[variant],
      sizes[size],
      fullWidth && 'w-full',
      className,
    )}
    {...props}
  >
    {children}
  </button>
)
