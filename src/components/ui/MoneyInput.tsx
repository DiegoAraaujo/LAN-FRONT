'use client';
import { forwardRef } from 'react';
import { Input } from './Input';
import { formatMoneyInput, parseMoneyInput } from '@/lib/currency-input';

type MoneyInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange' | 'type' | 'inputMode' | 'step'
> & {
  value: number | string;
  onValueChange: (value: number | '') => void;
};

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ value, onValueChange, ...props }, ref) => (
    <Input
      {...props}
      ref={ref}
      type="text"
      inputMode="numeric"
      value={formatMoneyInput(value)}
      onChange={(event) => {
        const input = event.currentTarget;
        const text = input.value;
        const digitsAfterCaret = text
          .slice(input.selectionStart ?? text.length)
          .replace(/\D/g, '').length;
        const parsed = parseMoneyInput(text);
        if (parsed === null) {
          input.value = formatMoneyInput(value);
          return;
        }
        const formatted = formatMoneyInput(parsed);
        input.value = formatted;
        onValueChange(parsed);
        let caret = formatted.length;
        let remaining = digitsAfterCaret;
        while (caret > 0 && remaining > 0) {
          caret--;
          if (/\d/.test(formatted[caret])) remaining--;
        }
        input.setSelectionRange(caret, caret);
      }}
    />
  ),
);
MoneyInput.displayName = 'MoneyInput';
