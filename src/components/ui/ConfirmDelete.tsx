'use client'
import { useTranslations } from 'next-intl'
import { Modal } from './Modal'
import { Button } from './Button'
export function ConfirmDelete({ open, detail, description, busy, onClose, onConfirm }: { open: boolean; detail?: string; description?: string; busy: boolean; onClose: () => void; onConfirm: () => void }) {
  const t = useTranslations('experience')
  return <Modal open={open} onClose={onClose} busy={busy} title={t('deleteTitle')} footer={<><Button onClick={onClose} disabled={busy}>{t('cancel')}</Button><Button variant="danger" disabled={busy} onClick={onConfirm}>{t('delete')}</Button></>}>
    <p className="text-sm text-text-muted">{description ?? t('deleteDescription')}</p>{detail && <p className="mt-4 rounded-lg bg-bg p-3 text-sm font-medium">{detail}</p>}
  </Modal>
}
