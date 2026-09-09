'use client'

import { useId, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Button } from './Button'

export function FilterDrawer({ children, active = false, onReset }: { children: ReactNode; active?: boolean; onReset?: () => void }) {
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLDivElement>(null)
  const id = useId()
  const reducedMotion = useReducedMotion()
  const en = useLocale() === 'en'
  const title = en ? 'Filters' : 'Filtros'

  return <>
    <div ref={trigger} className="shrink-0">
      <Button type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls={id} onClick={() => {
        dialog.current?.showModal()
        setOpen(true)
      }}>
        <SlidersHorizontal size={17} aria-hidden="true" /> {title}
        {active && <span className="size-2 rounded-full bg-gold" role="img" aria-label={en ? 'Active filters' : 'Filtros ativos'} />}
      </Button>
    </div>
    <motion.dialog
      ref={dialog}
      id={id}
      aria-labelledby={`${id}-title`}
      initial={{ x: '100%' }}
      animate={{ x: open ? 0 : '100%' }}
      transition={{ duration: reducedMotion ? 0 : 0.25, ease: 'easeOut' }}
      onAnimationComplete={() => {
        if (!open && dialog.current?.open) {
          dialog.current.close()
          trigger.current?.querySelector('button')?.focus()
        }
      }}
      onCancel={event => { event.preventDefault(); setOpen(false) }}
      onClick={event => {
        if (event.target === event.currentTarget && event.clientX < event.currentTarget.getBoundingClientRect().left) setOpen(false)
      }}
      className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-dvh w-full max-w-md border-0 bg-surface p-0 text-text shadow-2xl backdrop:bg-slate-950/40"
    >
      <div className="flex h-full flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <h2 id={`${id}-title`} className="text-lg font-semibold">{title}</h2>
          <button type="button" autoFocus aria-label={en ? 'Close filters' : 'Fechar filtros'} onClick={() => setOpen(false)} className="rounded-lg p-2 text-text-muted hover:bg-bg"><X size={20} /></button>
        </header>
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">{children}</div>
        <footer className="shrink-0 space-y-2 border-t border-border p-5">
          {active && onReset && <Button type="button" variant="ghost" fullWidth onClick={onReset}>
            <RotateCcw size={15} aria-hidden="true" /> {en ? 'Clear filters' : 'Limpar filtros'}
          </Button>}
          <Button type="button" variant="primary" fullWidth onClick={() => setOpen(false)}>{en ? 'View results' : 'Ver resultados'}</Button>
        </footer>
      </div>
    </motion.dialog>
  </>
}
