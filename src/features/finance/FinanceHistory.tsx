'use client'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { formatCurrency as money } from '@/lib/utils'
import { financeApi, methodLabels, type FinanceEntry } from './finance.api'
export function FinanceHistory({ entries }: { entries: FinanceEntry[] }) {
  const qc=useQueryClient()
  const [target,setTarget]=useState<FinanceEntry|null>(null)
  const [reason,setReason]=useState('')
  const reverse=useMutation({mutationFn:()=>financeApi.reverse(target!.id,reason),onSuccess:()=>{void qc.invalidateQueries();setTarget(null);setReason('');toast.success('Movimentação atualizada.')}})
  const settle=useMutation({mutationFn:financeApi.settle,onSuccess:()=>{void qc.invalidateQueries();toast.success('Pagamento confirmado.')}})
  if(!entries.length)return <p className="p-5 text-sm text-text-muted">Nenhuma movimentação encontrada.</p>
  return <><div className="divide-y divide-border">{entries.map(entry=><div key={entry.id} className="py-4 flex flex-wrap items-center justify-between gap-3">
    <div className="min-w-0"><p className="font-medium text-sm break-words">{entry.description}</p><p className="text-xs text-text-muted mt-1">{new Date(entry.occurredAt).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})} · {entry.category}{entry.method?` · ${methodLabels[entry.method]}`:''}{entry.customer?` · ${entry.customer.name}`:''}</p>
    <p className="text-xs mt-1">{entry.kind==='REVERSAL'?'Estorno':entry.status==='PENDING'?'Pendente':entry.status==='CANCELLED'?'Cancelado':entry.reversal?'Estornado':'Confirmado'}{entry.creditCents!==0?` · Crédito: ${money(entry.creditCents/100)}`:''}{entry.appliedCents!==0?` · Aplicado no atendimento: ${money(entry.appliedCents/100)}`:''}</p></div>
    <div className="flex items-center gap-3"><strong className={entry.cashCents<0?'text-rose-700':'text-emerald-700'}>{money(entry.cashCents/100)}</strong>
      {entry.status==='PENDING'&&<Button size="sm" disabled={settle.isPending} onClick={()=>settle.mutate(entry.id)}>Confirmar</Button>}
      {entry.status!=='CANCELLED'&&!entry.reversal&&entry.kind!=='REVERSAL'&&<Button variant="outline" size="sm" onClick={()=>{setTarget(entry);setReason('')}}>{entry.status==='PENDING'?'Cancelar':'Estornar'}</Button>}
    </div></div>)}</div>
    <Modal open={!!target} title={target?.status==='PENDING'?'Cancelar lançamento':'Estornar movimentação'} onClose={()=>setTarget(null)} busy={reverse.isPending} footer={<Button disabled={reason.trim().length<3||reverse.isPending} onClick={()=>reverse.mutate()}>Confirmar</Button>}><p className="text-sm mb-4">{target?.status==='PENDING'?'O lançamento ficará registrado como cancelado.':'O estorno será registrado na data de hoje e reverterá os valores de caixa, crédito e pagamento relacionados.'}</p><Input label="Motivo" value={reason} maxLength={200} onChange={e=>setReason(e.target.value)}/></Modal>
  </>
}
