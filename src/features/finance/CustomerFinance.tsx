'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { financeApi } from './finance.api'
import { FinanceHistory } from './FinanceHistory'
import { PaymentModal } from './PaymentModal'
import { formatCurrency as money } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { QueryError } from '@/components/ui/QueryError'
import type { Appointment } from '@/features/appointments/api/appointments.api'
export function CustomerFinance({ customerId, customerName }: { customerId: string; customerName: string }) {
  const account=useQuery({queryKey:['finance','customer',customerId],queryFn:()=>financeApi.customer(customerId)})
  const [pay,setPay]=useState<Appointment|null>(null)
  if(account.isError)return <QueryError onRetry={()=>account.refetch()}/>
  if(!account.data)return <p role="status">Carregando saldo…</p>
  return <section className="mt-5 border-t border-border pt-5"><h3 className="font-semibold mb-3">Conta do cliente</h3>
    <div className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-amber-50 p-3">Em aberto<strong className="block text-lg">{money(account.data.outstanding)}</strong></div><div className="rounded-xl bg-emerald-50 p-3">Crédito disponível<strong className="block text-lg">{money(account.data.credit)}</strong></div></div>
    {account.data.appointments.map(a=><div key={a.id} className="flex justify-between items-center gap-2 py-3 text-sm"><span>{new Date(a.appointmentDate).toLocaleDateString('pt-BR')} · Falta {money(a.remaining)}</span><Button size="sm" onClick={()=>setPay({...a,customerName})}>Receber</Button></div>)}
    <h4 className="font-medium text-sm mt-4">Últimas 100 movimentações</h4><FinanceHistory entries={account.data.history}/>
    {pay&&<PaymentModal key={pay.id} appointment={pay} onClose={()=>setPay(null)}/>}
  </section>
}
