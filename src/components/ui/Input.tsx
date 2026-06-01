import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:     string
  icon?:      React.ReactNode
  rightIcon?: React.ReactNode
  error?:     string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, rightIcon, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-text-light uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light">{icon}</span>}
        <input
          ref={ref}
          className={cn(
            'w-full border rounded-lg py-2.5 text-sm text-text bg-surface placeholder:text-text-light transition-colors',
            error ? 'border-danger' : 'border-border',
            icon      ? 'pl-9 pr-3' : 'px-3',
            rightIcon ? 'pr-9'      : '',
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light cursor-pointer">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  ),
)
Input.displayName = 'Input'
