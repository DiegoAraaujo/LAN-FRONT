'use client'

import { cn } from '@/lib/utils'

export const Component = ({ className }: { className?: string }) => (
  <div aria-hidden="true" className={cn('relative size-[52px] sm:size-[65px]', className)}>
    <span className="luma-spin-segment shadow-[inset_0_0_0_3px] shadow-sidebar" />
    <span className="luma-spin-segment luma-spin-delay shadow-[inset_0_0_0_3px] shadow-gold-btn" />
  </div>
)

export const LumaSpin = Component

export const LoadingState = ({ label, className }: { label: string; className?: string }) => (
  <div role="status" aria-live="polite" className={cn('grid place-items-center py-10', className)}>
    <LumaSpin />
    <span className="sr-only">{label}</span>
  </div>
)
