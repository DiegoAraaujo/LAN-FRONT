'use client'
import { useUrlFilters } from '@/hooks/useUrlFilters'
import { useServices } from '@/features/services/hooks/useServices'
import { useProfessionals } from '@/features/professionals/hooks/useProfessionals'
import { Card } from '@/components/ui/Card'
import { QueryError } from '@/components/ui/QueryError'
import { formatCurrency as money } from '@/lib/utils'
import { methodLabels } from './finance.api'
const field='mt-1 w-full rounded-lg border border-border p-2.5 bg-surface text-sm'
export function AppointmentFinanceFilters() {
  const {params,setFilters}=useUrlFilters()
  const get=(key:string)=>params.get(key)||''
  const change=(key:string,value:string)=>setFilters({[key]:value,page:1})
  const services=useServices(), professionals=useProfessionals()
  return <Card className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    <label className="text-sm">Serviço<select className={field} value={get('serviceId')} onChange={e=>change('serviceId',e.target.value)}><option value="">Todos os serviços</option>{services.data?.map(s=><option key={s.id} value={s.id}>{s.name} · {money(s.price)}</option>)}</select></label>
    <label className="text-sm">Profissional<select className={field} value={get('professionalId')} onChange={e=>change('professionalId',e.target.value)}><option value="">Todos</option>{professionals.data?.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
    <label className="text-sm">Forma de pagamento<select className={field} value={get('paymentMethod')} onChange={e=>change('paymentMethod',e.target.value)}><option value="">Todas</option>{Object.entries(methodLabels).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
    {services.isError&&<QueryError onRetry={()=>services.refetch()}/>}{professionals.isError&&<QueryError onRetry={()=>professionals.refetch()}/>}
    <p className="sm:col-span-2 lg:col-span-3 text-xs text-text-muted">Os totais consideram o atendimento completo e todos os pagamentos aplicados. Para consultar o dinheiro recebido no período, use o Fluxo de caixa.</p>
  </Card>
}
