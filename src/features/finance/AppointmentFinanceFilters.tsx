'use client'
import { useUrlFilters } from '@/hooks/useUrlFilters'
import { useServices } from '@/features/services/hooks/useServices'
import { useProfessionals } from '@/features/professionals/hooks/useProfessionals'
import { QueryError } from '@/components/ui/QueryError'
import { formatCurrency as money } from '@/lib/utils'
import { methodLabels } from './finance.api'
import { useLocale, useTranslations } from 'next-intl'
const field='mt-1.5 min-h-11 w-full rounded-xl border border-border bg-surface p-2.5 text-sm'
export function AppointmentFinanceFilters() {
  const locale=useLocale(), en=locale==='en', tf=useTranslations('finance')
  const {params,setFilters}=useUrlFilters()
  const get=(key:string)=>params.get(key)||''
  const change=(key:string,value:string)=>setFilters({[key]:value,page:1})
  const services=useServices(), professionals=useProfessionals()
  const selectedServices=(params.get('serviceIds')||params.get('serviceId')||'').split(',').filter(Boolean)
  const toggleService=(id:string)=>{
    const next=selectedServices.includes(id)?selectedServices.filter(value=>value!==id):[...selectedServices,id]
    setFilters({serviceIds:next.join(','),serviceId:undefined,page:1})
  }
  return <div className="grid grid-cols-1 gap-4 border-t border-border pt-5">
    <fieldset className="min-w-0"><legend className="text-sm">{en?'Services':'Serviços'}</legend><div className="mt-1.5 max-h-52 space-y-1 overflow-y-auto rounded-xl border border-border bg-surface p-2">
      {services.data?.map(s=><label key={s.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-bg"><input type="checkbox" checked={selectedServices.includes(s.id)} onChange={()=>toggleService(s.id)} className="size-4 accent-amber-500"/><span className="min-w-0 flex-1 truncate">{s.name}</span><span className="shrink-0 text-xs text-text-muted">{money(s.price)}</span></label>)}
      {!services.isLoading&&!services.data?.length&&<p className="p-2 text-sm text-text-muted">{en?'No services registered.':'Nenhum serviço cadastrado.'}</p>}
    </div>{selectedServices.length>0&&<button type="button" className="mt-2 text-xs font-medium text-gold" onClick={()=>setFilters({serviceIds:undefined,serviceId:undefined,page:1})}>{en?'Clear services':'Limpar serviços'} ({selectedServices.length})</button>}</fieldset>
    <label className="text-sm">{en?'Professional':'Profissional'}<select className={field} value={get('professionalId')} onChange={e=>change('professionalId',e.target.value)}><option value="">{tf('all')}</option>{professionals.data?.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
    <label className="text-sm">{tf('paymentMethod')}<select className={field} value={get('paymentMethod')} onChange={e=>change('paymentMethod',e.target.value)}><option value="">{tf('allFeminine')}</option>{Object.keys(methodLabels).map(v=><option key={v} value={v}>{tf(`methods.${v}`)}</option>)}</select></label>
    {services.isError&&<QueryError onRetry={()=>services.refetch()}/>}{professionals.isError&&<QueryError onRetry={()=>professionals.refetch()}/>}
    <p className="text-xs text-text-muted">{en?'Totals include the full appointment and all applied payments. Use Cash flow to view funds received during the period.':'Os totais consideram o atendimento completo e todos os pagamentos aplicados. Para consultar o dinheiro recebido no período, use o Fluxo de caixa.'}</p>
  </div>
}
