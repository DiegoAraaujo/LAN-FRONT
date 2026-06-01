import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-text-light uppercase tracking-wide">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'w-full border rounded-lg px-3 py-2.5 text-sm text-text bg-surface placeholder:text-text-light transition-colors resize-none',
          error ? 'border-danger' : 'border-border',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  ),
)
Textarea.displayName = 'Textarea'
