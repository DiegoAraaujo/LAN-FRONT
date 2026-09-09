import { cn } from '@/lib/utils'
import { forwardRef, useId } from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const generatedId = useId()
    const fieldId = id ?? generatedId
    return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={fieldId} className="text-xs font-medium text-text-light uppercase tracking-wide">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={error ? fieldId + '-error' : props['aria-describedby']}
        className={cn(
          'w-full rounded-xl border px-3 py-2.5 text-sm text-text bg-surface placeholder:text-text-light transition-colors resize-none',
          error ? 'border-danger' : 'border-border',
          className,
        )}
        {...props}
      />
      {error && <p id={fieldId + '-error'} role="alert" className="text-xs text-danger">{error}</p>}
    </div>
  )},
)
Textarea.displayName = 'Textarea'
