'use client'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { formatCurrency as money } from '@/lib/utils'
import { financeApi, type FinanceEntry } from './finance.api'

const businessDate = (value: string) => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date(value))
export function FinanceHistory({ entries, from, to }: { entries: FinanceEntry[]; from?: string; to?: string }) {
  const t = useTranslations('finance')
  const locale = useLocale()
  const dateTime = (value: string) => new Date(value).toLocaleString(locale, { timeZone: 'America/Sao_Paulo' })
  const kindLabels: Record<string, string> = { PAYMENT:t('appointments'), EXPENSE:t('expenses'), INCOME:t('otherIncome'), CREDIT:t('customerAdvance'), OPENING:t('openingContribution'), REVERSAL:t('reversal') }
  const qc = useQueryClient()
  const [target, setTarget] = useState<FinanceEntry | null>(null)
  const [reason, setReason] = useState('')
  const reverse = useMutation({ mutationFn: () => financeApi.reverse(target!.id, reason), onSuccess: () => { void qc.invalidateQueries(); setTarget(null); setReason(''); toast.success(t('movementUpdated')) } })
  const settle = useMutation({ mutationFn: financeApi.settle, onSuccess: () => { void qc.invalidateQueries(); toast.success(t('paymentConfirmed')) } })
  if (!entries.length) return <p className="p-5 text-sm text-text-muted">{t('noMovements')}</p>

  return <>
    <div className="divide-y divide-border">{entries.map(entry => {
      const appointmentDate = entry.appointment?.appointmentDate
      const appointmentDay = appointmentDate ? businessDate(appointmentDate) : null
      const outsidePeriod = entry.kind === 'PAYMENT' && appointmentDay !== null && !!from && !!to && (appointmentDay < from || appointmentDay > to)
      const creditUsed = entry.kind === 'PAYMENT' ? Math.max(0, entry.appliedCents - entry.cashCents) : 0
      return <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-bg px-2 py-0.5 text-[11px] font-semibold text-text-muted">{kindLabels[entry.kind] ?? entry.kind}</span>
            {outsidePeriod && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">{t('outsidePeriod')}</span>}
          </div>
          <p className="break-words text-sm font-medium">{entry.description}</p>
          <p className="text-xs text-text-muted">{t('movementLabel')}: {dateTime(entry.occurredAt)} · {entry.category}{entry.method ? ` · ${t(`methods.${entry.method}`)}` : ''}{entry.customer ? ` · ${entry.customer.name}` : ''}</p>
          {appointmentDate && <p className="text-xs text-text-muted">{t('appointmentLabel')}: {dateTime(appointmentDate)}</p>}
          <p className="text-xs">
            {entry.kind === 'REVERSAL' ? t('reversal') : entry.status === 'PENDING' ? t('pending') : entry.status === 'CANCELLED' ? t('cancelled') : entry.reversal ? t('reversed') : t('confirmed')}
            {entry.kind === 'PAYMENT' ? ` · ${t('realEntry')}: ${money(entry.cashCents / 100)} · ${t('applied')}: ${money(entry.appliedCents / 100)}` : ''}
            {creditUsed > 0 ? ` · ${t('creditUsed')}: ${money(creditUsed / 100)}` : ''}
            {entry.kind !== 'PAYMENT' && entry.creditCents !== 0 ? ` · ${t('creditGenerated')}: ${money(entry.creditCents / 100)}` : ''}
          </p>
          {outsidePeriod && <p className="text-xs font-medium text-amber-800">{t('outsidePeriodHint')}</p>}
        </div>
        <div className="flex items-center gap-3">
          <strong className={entry.cashCents < 0 ? 'text-rose-700' : 'text-emerald-700'}>{entry.cashCents > 0 ? '+' : ''}{money(entry.cashCents / 100)}</strong>
          {entry.status === 'PENDING' && <Button size="sm" disabled={settle.isPending} onClick={() => settle.mutate(entry.id)}>{t('confirm')}</Button>}
          {entry.status !== 'CANCELLED' && !entry.reversal && entry.kind !== 'REVERSAL' && <Button variant="outline" size="sm" onClick={() => { setTarget(entry); setReason('') }}>{t(entry.status === 'PENDING' ? 'cancelEntry' : 'reverse')}</Button>}
        </div>
      </div>
    })}</div>
    <Modal open={!!target} title={t(target?.status === 'PENDING' ? 'cancelEntryTitle' : 'reverseTitle')} onClose={() => setTarget(null)} busy={reverse.isPending} footer={<Button disabled={reason.trim().length < 3 || reverse.isPending} onClick={() => reverse.mutate()}>{t('confirm')}</Button>}>
      <p className="mb-4 text-sm">{t(target?.status === 'PENDING' ? 'cancelEntryHint' : 'reverseHint')}</p>
      <Input label={t('reason')} value={reason} maxLength={200} onChange={e => setReason(e.target.value)} />
    </Modal>
  </>
}
