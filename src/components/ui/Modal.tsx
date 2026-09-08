'use client'
import { useEffect, useId, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
interface ModalProps { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'; busy?: boolean }
const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-xl', xl: 'max-w-2xl' }
export const Modal = ({ open, onClose, title, children, footer, size = 'md', busy = false }: ModalProps) => {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const t = useTranslations('experience')
  useEffect(() => {
    const node = dialog.current
    if (!node || !open) return
    const previous = document.activeElement as HTMLElement | null
    node.showModal()
    return () => { node.close(); if (previous?.isConnected) previous.focus() }
  }, [open])
  if (!open) return null
  return <dialog ref={dialog} aria-labelledby={titleId} aria-busy={busy} onCancel={e => { e.preventDefault(); if (!busy) onClose() }}
    onClick={e => { if (e.target === e.currentTarget && !busy) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose() } }}
    className={cn('m-auto w-[calc(100%-2rem)] max-h-[90dvh] rounded-2xl border border-border bg-surface p-0 text-text shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm', sizes[size])}>
    <div className="flex max-h-[90dvh] flex-col">
      <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-border shrink-0"><h2 id={titleId} className="text-lg font-semibold">{title}</h2><button type="button" disabled={busy} onClick={onClose} aria-label={t('close')} className="p-2 rounded-lg hover:bg-bg text-text-muted"><X size={20}/></button></div>
      <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
      {footer && <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0 bg-bg2">{footer}</div>}
    </div>
  </dialog>
}
