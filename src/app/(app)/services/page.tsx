'use client'
import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PageHeader } from '@/components/ui/Display'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ServiceStatsBar } from '@/features/services/components/ServiceStatsBar'
import { ServiceTableRow } from '@/features/services/components/ServiceTableRow'
import { ServiceMobileCard } from '@/features/services/components/ServiceMobileCard'
import { ServiceFormModal } from '@/features/services/components/ServiceFormModal'
import { useServices } from '@/features/services/hooks/useServices'
import { useCreateService } from '@/features/services/hooks/useCreateService'
import { useUpdateService } from '@/features/services/hooks/useUpdateService'
import { useDeleteService } from '@/features/services/hooks/useDeleteService'
import { useDebounce } from '@/hooks/useDebounce'
import type { Service } from '@/features/services/api/services.api'

const ServicesPage = () => {
  const t = useTranslations('services')
  const [search, setSearch]         = useState('')
  const [addOpen, setAddOpen]       = useState(false)
  const [editTarget, setEditTarget] = useState<Service | null>(null)
  const debounced = useDebounce(search, 300)

  const { data: services = [], isLoading } = useServices(debounced)
  const createMutation = useCreateService(() => setAddOpen(false))
  const updateMutation = useUpdateService(() => setEditTarget(null))
  const deleteMutation = useDeleteService()

  const handleSave = (data: { name: string; price: number; description?: string }) =>
    editTarget ? updateMutation.mutate({ id: editTarget.id, data }) : createMutation.mutate(data)

  return (
    <div className="p-5 sm:p-8 flex flex-col gap-5">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        actions={
          <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
            <Plus size={14} /> {t('newService')}
          </Button>
        }
      />

      <ServiceStatsBar services={services} />

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
        <input type="text" placeholder={t('searchPlaceholder')} value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-64 border border-border rounded-lg pl-8 pr-3 py-2.5 text-sm bg-surface" />
      </div>

      <Card className="hidden sm:block">
        <div className="px-5 py-4 border-b border-border font-semibold text-sm">{t('activeServices')}</div>
        {isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-text-light">Carregando…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg">
                  {[t('tableNameCol'), 'Descrição', t('tablePriceCol'), t('tableActionsCol')].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-text-light uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.length === 0
                  ? <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-text-light">Nenhum serviço encontrado.</td></tr>
                  : services.map((s, i) => (
                      <ServiceTableRow key={s.id} service={s} index={i}
                        onEdit={() => setEditTarget(s)} onDelete={() => deleteMutation.mutate(s.id)} />
                    ))
                }
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-border bg-bg2">
          <span className="text-xs text-text-light">Exibindo {services.length} serviços</span>
        </div>
      </Card>

      <div className="sm:hidden flex flex-col gap-3">
        {services.map(s => (
          <ServiceMobileCard key={s.id} service={s}
            onEdit={() => setEditTarget(s)} onDelete={() => deleteMutation.mutate(s.id)} />
        ))}
      </div>

      <ServiceFormModal
        open={addOpen || !!editTarget} isLoading={createMutation.isPending || updateMutation.isPending}
        defaultValues={editTarget} onSave={handleSave}
        onClose={() => { setAddOpen(false); setEditTarget(null) }}
      />
    </div>
  )
}

export default ServicesPage
