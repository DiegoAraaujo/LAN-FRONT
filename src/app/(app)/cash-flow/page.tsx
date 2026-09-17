'use client'
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { PageHeader, Pagination } from '@/components/ui/Display'
import { Card } from '@/components/ui/Card'
import { CollapsibleStats } from '@/components/ui/CollapsibleStats'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { QueryError } from '@/components/ui/QueryError'
import { FilterDrawer } from '@/components/ui/FilterDrawer'
import { ClientSearchInput } from '@/features/appointments/components/ClientSearchInput'
import type { Customer } from '@/features/customers/api/customers.api'
import type { PaymentMethod } from '@/features/appointments/api/appointments.api'
import { financeApi, localDateTime, methodLabels } from '@/features/finance/finance.api'
import { FinanceHistory } from '@/features/finance/FinanceHistory'
import { formatCurrency as money } from '@/lib/utils'
const field='mt-1.5 min-h-11 w-full rounded-xl border border-border bg-surface p-2.5 text-sm'
type EntryMode = 'INCOME' | 'EXPENSE'
function EntryForm({ mode, onClose }: { mode: EntryMode; onClose:()=>void }) {
  const t=useTranslations('finance')
  const en=useLocale()==='en'
  const isExpense = mode === 'EXPENSE'
  const qc=useQueryClient()
  const [kind,setKind]=useState<string>(mode),[status,setStatus]=useState('POSTED')
  const [description,setDescription]=useState(''),[category,setCategory]=useState(isExpense ? (en?'Materials':'Materiais') : (en?'Other income':'Outras receitas'))
  const [amount,setAmount]=useState(''),[date,setDate]=useState(localDateTime)
  const [method,setMethod]=useState<PaymentMethod>('PIX'),[customer,setCustomer]=useState<Customer|null>(null)
  const [requestId]=useState(()=>crypto.randomUUID())
  const save=useMutation({mutationFn:()=>financeApi.create({requestId,kind,status:kind==='CREDIT'||kind==='OPENING'?'POSTED':status,amount:Number(amount),description,category,method,occurredAt:new Date(date).toISOString(),...(kind==='CREDIT'&&customer?{customerId:customer.id}:{})}),onSuccess:()=>{void qc.invalidateQueries();toast.success(t(isExpense ? 'expenseSaved' : 'incomeSaved'));onClose()}})
  const valid=Number(amount)>0&&Number(amount)<=999999.99&&description.trim().length>=3&&category.trim().length>=2&&!!date&&Number.isFinite(new Date(date).getTime())&&(kind!=='CREDIT'||!!customer)
  return <Modal open title={t(isExpense ? 'newExpense' : 'newIncome')} onClose={onClose} busy={save.isPending} footer={<><Button variant="outline" disabled={save.isPending} onClick={onClose}>{t('cancelEntry')}</Button><Button variant="primary" disabled={save.isPending} onClick={()=>valid?save.mutate():toast.error(t('checkFields'))}>{save.isPending ? t('saveIncome')+'…' : t(isExpense ? 'saveExpense' : 'saveIncome')}</Button></>}><div className="space-y-4">
    {!isExpense && <label className="block text-sm">{t('incomeType')}<select className={field} value={kind} onChange={e=>{setKind(e.target.value);setCategory(e.target.value==='CREDIT'?(en?'Advances':'Adiantamentos'):e.target.value==='OPENING'?(en?'Opening balance':'Saldo inicial'):(en?'Other income':'Outras receitas'))}}><option value="INCOME">{t('otherIncome')}</option><option value="CREDIT">{t('customerAdvance')}</option><option value="OPENING">{t('openingContribution')}</option></select></label>}
    {kind==='CREDIT'&&<ClientSearchInput selected={customer} onSelect={setCustomer}/>}
    {kind==='OPENING'&&<p className="text-sm text-text-muted">{t('openingHint')}</p>}
    {kind==='INCOME'&&<p className="text-sm text-text-muted">{t('incomeHint')}</p>}
    <Input label={t('description')} value={description} maxLength={300} onChange={e=>setDescription(e.target.value)}/>
    <label className="block text-sm">{t('category')}<input className={field} list="finance-categories" maxLength={80} value={category} onChange={e=>setCategory(e.target.value)}/><datalist id="finance-categories">{(en?['Rent','Materials','Energy','Water','Commissions','Maintenance','Other income','Advances','Opening balance']:['Aluguel','Materiais','Energia','Água','Comissões','Manutenção','Outras receitas','Adiantamentos','Saldo inicial']).map(c=><option key={c}>{c}</option>)}</datalist></label>
    <Input label={t('amount')} type="number" min="0.01" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)}/>
    {!['CREDIT','OPENING'].includes(kind)&&<label className="block text-sm">{t('situation')}<select className={field} value={status} onChange={e=>setStatus(e.target.value)}><option value="POSTED">{t(isExpense ? 'paidExpense' : 'receivedIncome')}</option><option value="PENDING">{t(isExpense ? 'toPay' : 'toReceive')}</option></select></label>}
    <Input label={t(status==='PENDING'&&!['CREDIT','OPENING'].includes(kind)?'dueDate':'movementDate')} type="datetime-local" value={date} onChange={e=>setDate(e.target.value)}/>
    <label className="block text-sm">{t('paymentMethod')}<select className={field} value={method} onChange={e=>setMethod(e.target.value as PaymentMethod)}>{Object.keys(methodLabels).map(v=><option key={v} value={v}>{t(`methods.${v}`)}</option>)}</select></label>
  </div></Modal>
}
export default function CashFlowPage() {
  const t=useTranslations('finance')
  const locale=useLocale()
  const today=localDateTime().slice(0,10)
  const currentYear=Number(today.slice(0,4)), currentMonth=Number(today.slice(5,7))
  const [dateMode,setDateMode]=useState('month')
  const [year,setYear]=useState(currentYear),[month,setMonth]=useState<number | undefined>(currentMonth)
  const [customFrom,setFrom]=useState(today.slice(0,8)+'01'),[customTo,setTo]=useState(today)
  const from=dateMode==='custom'?customFrom:`${year}-${String(month ?? 1).padStart(2,'0')}-01`
  const to=dateMode==='custom'?customTo:`${year}-${String(month ?? 12).padStart(2,'0')}-${new Date(Date.UTC(year,month ?? 12,0)).getUTCDate()}`
  const years=Array.from(new Set([year,...Array.from({length:10},(_,i)=>currentYear+1-i)])).sort((a,b)=>b-a)
  const [kind,setKind]=useState(''),[method,setMethod]=useState(''),[status,setStatus]=useState(''),[page,setPage]=useState(1)
  const [entryMode,setEntryMode]=useState<EntryMode|null>(null)
  const valid=!!from&&!!to&&from<=to
  const query=useQuery({queryKey:['finance','cash',{from,to,kind,method,status,page}],queryFn:()=>financeApi.list({from,to,page,kind:kind||undefined,method:method||undefined,status:status||undefined}),enabled:valid,placeholderData:keepPreviousData,meta:{backgroundWhenCached:'finance-list'}})
  const summary=query.data?.summary
  const cards=[[t('openingPeriod'),summary?.opening],[t('incomingPeriod'),summary?.incoming],[t('outgoingPeriod'),summary?.outgoing],[t('closingBalance'),summary?.balance],[t('totalReceivable'),summary?.receivable],[t('totalPayable'),summary?.payable]] as const
  return <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-8"><PageHeader title={t('title')} subtitle={t('subtitle')} actions={
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" onClick={()=>setEntryMode('EXPENSE')}><Plus size={16}/> {t('newExpense')}</Button>
        <Button variant="primary" onClick={()=>setEntryMode('INCOME')}><Plus size={16}/> {t('newIncome')}</Button>
      </div>
    }/>
    <div className="flex justify-end"><FilterDrawer active={!!kind || !!method || !!status || dateMode==='custom' || year!==currentYear || month!==currentMonth} onReset={()=>{setDateMode('month');setYear(currentYear);setMonth(currentMonth);setFrom(today.slice(0,8)+'01');setTo(today);setKind('');setMethod('');setStatus('');setPage(1)}}>
      <div className="grid grid-cols-1 gap-4">
      <label className="text-sm">{t('period')}<select className={field} value={dateMode} onChange={e=>{if(e.target.value==='custom'){setFrom(from);setTo(to)}setDateMode(e.target.value);setPage(1)}}><option value="month">{t('monthYear')}</option><option value="custom">{t('custom')}</option></select></label>
      {dateMode==='custom'?<>
        <Input label={t('from')} type="date" value={from} max={to || undefined} onChange={e=>{setFrom(e.target.value);setPage(1)}}/><Input label={t('to')} type="date" value={to} min={from || undefined} onChange={e=>{setTo(e.target.value);setPage(1)}}/>
      </>:<>
        <label className="text-sm">{t('month')}<select className={field} value={month ?? ''} onChange={e=>{setMonth(e.target.value?Number(e.target.value):undefined);setPage(1)}}><option value="">{t('allMonths')}</option>{Array.from({length:12},(_,i)=><option key={i+1} value={i+1}>{new Intl.DateTimeFormat(locale,{month:'long',timeZone:'UTC'}).format(new Date(Date.UTC(year,i,1)))}</option>)}</select></label>
        <label className="text-sm">{t('year')}<select className={field} value={year} onChange={e=>{setYear(Number(e.target.value));setPage(1)}}>{years.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
      </>}
      </div>
      {!valid && <p role="alert" className="text-sm text-danger">{t('invalidPeriod')}</p>}
      <div className="grid grid-cols-1 gap-4 border-t border-border pt-5">
      <h3 className="text-xs font-medium uppercase tracking-wide text-text-light">{t('movement')}</h3>
      <label className="text-sm">{t('type')}<select className={field} value={kind} onChange={e=>{setKind(e.target.value);setPage(1)}}><option value="">{t('all')}</option>{Object.entries({PAYMENT:'appointments',EXPENSE:'expenses',INCOME:'otherEntries',CREDIT:'advances',OPENING:'openingBalance',REVERSAL:'reversals'}).map(([v,l])=><option key={v} value={v}>{t(l)}</option>)}</select></label>
      <label className="text-sm">{t('method')}<select className={field} value={method} onChange={e=>{setMethod(e.target.value);setPage(1)}}><option value="">{t('allFeminine')}</option>{Object.keys(methodLabels).map(v=><option key={v} value={v}>{t(`methods.${v}`)}</option>)}</select></label>
      <label className="text-sm">{t('situation')}<select className={field} value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}}><option value="">{t('allFeminine')}</option><option value="POSTED">{t('confirmed')}</option><option value="PENDING">{t('pending')}</option><option value="CANCELLED">{t('cancelled')}</option></select></label>
      </div>
    </FilterDrawer></div>
    {!valid&&<p role="alert" className="text-danger">{t('invalidPeriod')}</p>}{query.isError&&<QueryError onRetry={()=>query.refetch()}/>}
    <CollapsibleStats items={cards.map(([label,value],i)=>({label,value:value===undefined?'—':money(value),className:i===3?'text-emerald-700':undefined}))}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-6">{cards.map(([label,value],i)=><Card key={label} className={`min-w-0 px-3 py-3 sm:px-4 ${i===3?'border-emerald-300 bg-emerald-50':''}`}><p className="text-xs font-medium text-text-muted">{label}</p><p className="mt-1 text-lg sm:text-xl break-words font-semibold tracking-tight tabular-nums">{value===undefined?'—':money(value)}</p></Card>)}</div>
    </CollapsibleStats>
    <p className="text-xs text-text-muted">{t('summaryHint')}</p>
    <div id="cash-flow-results" className="scroll-mt-4"><Card className="relative p-5"><h2 className="text-base font-semibold">{t('movements')} · {query.data?.total??0}</h2>{query.isLoading?<div className="min-h-40"/>:<div className={`transition-opacity ${query.isFetching?'opacity-45 pointer-events-none':''}`} aria-busy={query.isFetching}><FinanceHistory entries={query.data?.data??[]} from={from} to={to}/></div>}<Pagination current={page} total={Math.max(1,Math.ceil((query.data?.total??0)/25))} onPageChange={setPage} loading={query.isFetching} scrollTargetId="cash-flow-results"/></Card></div>
    {entryMode&&<EntryForm key={entryMode} mode={entryMode} onClose={()=>setEntryMode(null)}/>}
  </div>
}
