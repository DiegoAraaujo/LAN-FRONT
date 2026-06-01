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
  primary: 'bg-gold-btn text-text font-semibold hover:opacity-90 border border-transparent',
  outline: 'border border-border bg-surface text-text hover:border-gold-btn',
  danger:  'border border-red-200 bg-transparent text-danger hover:bg-red-50',
  ghost:   'bg-transparent text-text-muted hover:bg-bg border border-transparent',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2   text-sm gap-2',
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
      'inline-flex items-center justify-center rounded-lg font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
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
