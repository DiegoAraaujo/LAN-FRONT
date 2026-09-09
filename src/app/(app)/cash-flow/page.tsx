'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { PageHeader, Pagination } from '@/components/ui/Display'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { QueryError } from '@/components/ui/QueryError'
import { ClientSearchInput } from '@/features/appointments/components/ClientSearchInput'
import type { Customer } from '@/features/customers/api/customers.api'
import type { PaymentMethod } from '@/features/appointments/api/appointments.api'
import { financeApi, localDateTime, methodLabels } from '@/features/finance/finance.api'
import { FinanceHistory } from '@/features/finance/FinanceHistory'
import { formatCurrency as money } from '@/lib/utils'
const field='w-full rounded-lg border border-border p-2.5 text-sm bg-surface'
type EntryMode = 'INCOME' | 'EXPENSE'
function EntryForm({ mode, onClose }: { mode: EntryMode; onClose:()=>void }) {
  const isExpense = mode === 'EXPENSE'
  const qc=useQueryClient()
  const [kind,setKind]=useState<string>(mode),[status,setStatus]=useState('POSTED')
  const [description,setDescription]=useState(''),[category,setCategory]=useState(isExpense ? 'Materiais' : 'Outras receitas')
  const [amount,setAmount]=useState(''),[date,setDate]=useState(localDateTime)
  const [method,setMethod]=useState<PaymentMethod>('PIX'),[customer,setCustomer]=useState<Customer|null>(null)
  const [requestId]=useState(()=>crypto.randomUUID())
  const save=useMutation({mutationFn:()=>financeApi.create({requestId,kind,status:kind==='CREDIT'||kind==='OPENING'?'POSTED':status,amount:Number(amount),description,category,method,occurredAt:new Date(date).toISOString(),...(kind==='CREDIT'&&customer?{customerId:customer.id}:{})}),onSuccess:()=>{void qc.invalidateQueries();toast.success(isExpense ? 'Despesa registrada.' : 'Receita registrada.');onClose()}})
  const valid=Number(amount)>0&&Number(amount)<=999999.99&&description.trim().length>=3&&category.trim().length>=2&&!!date&&Number.isFinite(new Date(date).getTime())&&(kind!=='CREDIT'||!!customer)
  return <Modal open title={isExpense ? 'Nova despesa' : 'Nova receita'} onClose={onClose} busy={save.isPending} footer={<><Button variant="outline" disabled={save.isPending} onClick={onClose}>Cancelar</Button><Button variant="primary" disabled={save.isPending} onClick={()=>valid?save.mutate():toast.error('Confira descrição, categoria, valor, data e cliente.')}>{save.isPending ? 'Salvando…' : isExpense ? 'Salvar despesa' : 'Salvar receita'}</Button></>}><div className="space-y-4">
    {!isExpense && <label className="block text-sm">Tipo de receita<select className={field} value={kind} onChange={e=>{setKind(e.target.value);setCategory(e.target.value==='CREDIT'?'Adiantamentos':e.target.value==='OPENING'?'Saldo inicial':'Outras receitas')}}><option value="INCOME">Outra receita</option><option value="CREDIT">Adiantamento de cliente</option><option value="OPENING">Saldo inicial / aporte</option></select></label>}
    {kind==='CREDIT'&&<ClientSearchInput selected={customer} onSelect={setCustomer}/>}
    {kind==='OPENING'&&<p className="text-sm text-text-muted">Informe somente dinheiro anterior ao controle que ainda não aparece nos lançamentos. Atendimentos antigos pagos já entram no histórico.</p>}
    {kind==='INCOME'&&<p className="text-sm text-text-muted">Para receber um atendimento, use Registrar pagamento no histórico e evite contar o valor duas vezes.</p>}
    <Input label="Descrição" value={description} maxLength={300} onChange={e=>setDescription(e.target.value)}/>
    <label className="block text-sm">Categoria<input className={field} list="finance-categories" maxLength={80} value={category} onChange={e=>setCategory(e.target.value)}/><datalist id="finance-categories">{['Aluguel','Materiais','Energia','Água','Comissões','Manutenção','Outras receitas','Adiantamentos','Saldo inicial'].map(c=><option key={c}>{c}</option>)}</datalist></label>
    <Input label="Valor (R$)" type="number" min="0.01" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)}/>
    {!['CREDIT','OPENING'].includes(kind)&&<label className="block text-sm">Situação<select className={field} value={status} onChange={e=>setStatus(e.target.value)}><option value="POSTED">{isExpense ? "Já paga" : "Já recebida"}</option><option value="PENDING">{isExpense ? "A pagar" : "A receber"}</option></select></label>}
    <Input label={status==='PENDING'&&!['CREDIT','OPENING'].includes(kind)?'Vencimento':'Data da movimentação'} type="datetime-local" value={date} onChange={e=>setDate(e.target.value)}/>
    <label className="block text-sm">Forma de pagamento<select className={field} value={method} onChange={e=>setMethod(e.target.value as PaymentMethod)}>{Object.entries(methodLabels).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
  </div></Modal>
}
export default function CashFlowPage() {
  const today=localDateTime().slice(0,10)
  const [from,setFrom]=useState(today.slice(0,8)+'01'),[to,setTo]=useState(today)
  const [kind,setKind]=useState(''),[method,setMethod]=useState(''),[status,setStatus]=useState(''),[page,setPage]=useState(1)
  const [entryMode,setEntryMode]=useState<EntryMode|null>(null)
  const valid=!!from&&!!to&&from<=to
  const query=useQuery({queryKey:['finance','cash',{from,to,kind,method,status,page}],queryFn:()=>financeApi.list({from,to,page,kind:kind||undefined,method:method||undefined,status:status||undefined}),enabled:valid,placeholderData:keepPreviousData})
  const summary=query.data?.summary
  const cards=[['Saldo inicial do período',summary?.opening],['Entradas no período',summary?.incoming],['Saídas no período',summary?.outgoing],['Saldo final',summary?.balance],['Total a receber',summary?.receivable],['Total a pagar',summary?.payable]] as const
  return <main className="p-5 sm:p-8 space-y-5"><PageHeader title="Fluxo de caixa" subtitle="Recebimentos, despesas e valores em aberto." actions={
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" onClick={()=>setEntryMode('EXPENSE')}><Plus size={16}/> Nova despesa</Button>
        <Button variant="primary" onClick={()=>setEntryMode('INCOME')}><Plus size={16}/> Nova receita</Button>
      </div>
    }/>
    <Card className="p-4 grid grid-cols-2 lg:grid-cols-5 gap-3"><Input label="De" type="date" value={from} onChange={e=>{setFrom(e.target.value);setPage(1)}}/><Input label="Até" type="date" value={to} onChange={e=>{setTo(e.target.value);setPage(1)}}/>
      <label className="text-sm">Tipo<select className={field} value={kind} onChange={e=>{setKind(e.target.value);setPage(1)}}><option value="">Todos</option>{Object.entries({PAYMENT:'Atendimentos',EXPENSE:'Despesas',INCOME:'Outras entradas',CREDIT:'Adiantamentos',OPENING:'Saldo inicial',REVERSAL:'Estornos'}).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
      <label className="text-sm">Forma<select className={field} value={method} onChange={e=>{setMethod(e.target.value);setPage(1)}}><option value="">Todas</option>{Object.entries(methodLabels).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
      <label className="text-sm">Situação<select className={field} value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}}><option value="">Todas</option><option value="POSTED">Confirmado</option><option value="PENDING">Pendente</option><option value="CANCELLED">Cancelado</option></select></label>
    </Card>
    {!valid&&<p role="alert" className="text-danger">Informe um período válido.</p>}{query.isError&&<QueryError onRetry={()=>query.refetch()}/>}
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">{cards.map(([label,value],i)=><Card key={label} className={`p-5 ${i===3?'border-emerald-300 bg-emerald-50':''}`}><p className="text-xs text-text-muted">{label}</p><p className="text-2xl font-bold mt-2 tabular-nums">{value===undefined?'—':money(value)}</p></Card>)}</div>
    <p className="text-xs text-text-muted">Saldos e entradas/saídas consideram todo o período, independentemente dos filtros da lista. A receber e a pagar mostram todos os valores ainda em aberto. Uso de crédito não gera nova entrada.</p>
    <Card className="relative p-5"><h2 className="font-semibold">Movimentações · {query.data?.total??0}</h2>{query.isLoading?<div className="min-h-40"/>:<div className={`transition-opacity ${query.isFetching?'opacity-45 pointer-events-none':''}`} aria-busy={query.isFetching}><FinanceHistory entries={query.data?.data??[]}/></div>}<Pagination current={page} total={Math.max(1,Math.ceil((query.data?.total??0)/25))} onPageChange={setPage} loading={query.isFetching}/></Card>
    {entryMode&&<EntryForm key={entryMode} mode={entryMode} onClose={()=>setEntryMode(null)}/>}
  </main>
}
