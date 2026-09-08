'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatCurrency as money } from '@/lib/utils'
import { QueryError } from '@/components/ui/QueryError'
import type { Appointment, PaymentMethod } from '@/features/appointments/api/appointments.api'
import { financeApi, localDateTime, methodLabels } from './finance.api'

export function PaymentModal({ appointment, onClose }: { appointment: Appointment; onClose: () => void }) {
  const qc = useQueryClient()
  const account = useQuery({ queryKey: ['finance','customer',appointment.customerId], queryFn: () => financeApi.customer(appointment.customerId) })
  const current = account.data?.appointments.find(a => a.id === appointment.id)
  const remaining = current?.remaining ?? appointment.remaining ?? appointment.total
  const [received,setReceived] = useState(remaining)
  const [credit,setCredit] = useState(0)
  const [excess,setExcess] = useState<'CHANGE'|'CREDIT'>('CHANGE')
  const [method,setMethod] = useState<PaymentMethod>('PIX')
  const [date,setDate] = useState(localDateTime)
  const [requestId] = useState(() => crypto.randomUUID())
  const available = account.data?.credit ?? 0
  const surplus = Math.max(0, Math.round((received+credit-remaining)*100)/100)
  const pending = Math.max(0, Math.round((remaining-received-credit)*100)/100)
  const save = useMutation({ mutationFn: () => financeApi.pay(appointment.id, { requestId, received, useCredit: credit, excess, method, occurredAt: new Date(date).toISOString() }),
    onSuccess: () => { void qc.invalidateQueries(); toast.success('Pagamento registrado.'); onClose() } })
  const valid = !!account.data && !!current && Number.isFinite(received) && Number.isFinite(credit) && received>=0 && credit>=0 && credit<=available && credit<=remaining && received+credit>0 && !!date && Number.isFinite(new Date(date).getTime())
  return <Modal open title="Registrar pagamento" onClose={onClose} busy={save.isPending} footer={<Button onClick={() => { if(valid && new Date(date).getTime()<=Date.now()+60000) save.mutate(); else toast.error('Confira o valor, o crédito e a data do pagamento.') }} disabled={save.isPending || account.isLoading}>Confirmar pagamento</Button>}>
    <div className="space-y-4">
      <p className="text-sm text-text-muted">{appointment.customerName} · Valor do atendimento {money(appointment.total)}</p>
      {account.isError && <QueryError onRetry={() => account.refetch()}/>}
      <div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-amber-50 p-3 text-amber-900">Em aberto<strong className="block text-xl">{money(remaining)}</strong></div><div className="rounded-xl bg-emerald-50 p-3 text-emerald-900">Crédito disponível<strong className="block text-xl">{money(available)}</strong></div></div>
      <Input label="Valor recebido agora (R$)" type="number" min="0" step="0.01" value={received} onChange={e=>setReceived(Number(e.target.value))}/>
      <Input label="Usar crédito do cliente (R$)" type="number" min="0" max={Math.min(remaining,available)} step="0.01" value={credit} onChange={e=>setCredit(Number(e.target.value))}/>
      <label className="block text-sm">Forma de pagamento<select className="mt-1 w-full rounded-lg border border-border p-3 bg-surface" value={method} onChange={e=>setMethod(e.target.value as PaymentMethod)}>{Object.entries(methodLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <Input label="Data do pagamento" type="datetime-local" value={date} onChange={e=>setDate(e.target.value)}/>
      {surplus>0 && <label className="block text-sm">Sobram {money(surplus)}<select value={excess} onChange={e=>setExcess(e.target.value as 'CHANGE'|'CREDIT')} className="mt-1 w-full rounded-lg border border-border p-3 bg-surface"><option value="CHANGE">Devolver como troco</option><option value="CREDIT">Guardar como crédito do cliente</option></select></label>}
      <div className="rounded-xl bg-bg p-4 text-sm space-y-2"><p>Entrada no caixa: <strong>{money(received-(excess==='CHANGE'?surplus:0))}</strong></p><p>Restará em aberto: <strong>{money(pending)}</strong></p><p>Crédito após pagamento: <strong>{money(available-credit+(excess==='CREDIT'?surplus:0))}</strong></p></div>
      <p className="text-xs text-text-muted">Pagamento parcial e uso de crédito não alteram o preço nem o desconto do serviço.</p>
    </div>
  </Modal>
}
