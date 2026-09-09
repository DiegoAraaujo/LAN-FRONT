import { cn } from '@/lib/utils'
import { forwardRef, useId } from 'react'

interface SelectOption { value: string; label: string }
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?:   string
  options:  SelectOption[]
  error?:   string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, disabled, id, ...props }, ref) => {
    const generatedId = useId()
    const fieldId = id ?? generatedId
    return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={fieldId} className="text-xs font-medium text-text-light uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        ref={ref}
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={error ? fieldId + '-error' : props['aria-describedby']}
        disabled={disabled}
        className={cn(
          'min-h-11 w-full rounded-xl border px-3 py-2.5 text-sm text-text bg-surface transition-colors appearance-none',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          error ? 'border-danger' : 'border-border',
          className,
        )}
        {...props}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p id={fieldId + '-error'} role="alert" className="text-xs text-danger">{error}</p>}
    </div>
  )},
)
Select.displayName = 'Select'
