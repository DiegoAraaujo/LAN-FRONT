'use client'
import { ConfirmDelete } from '@/components/ui/ConfirmDelete'
import { QueryError } from '@/components/ui/QueryError'
import { useUrlFilters } from '@/hooks/useUrlFilters'
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
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)
  const { params, setFilters } = useUrlFilters()
  const search = params.get('search') ?? ''
  const setSearch = (value: string) => setFilters({ search: value, page: 1 })
  const [addOpen, setAddOpen]       = useState(false)
  const [editTarget, setEditTarget] = useState<Service | null>(null)
  const debounced = useDebounce(search, 300)

  const { data: services = [], isLoading, isFetching, isError, refetch } = useServices(debounced)
  const createMutation = useCreateService(() => setAddOpen(false))
  const updateMutation = useUpdateService(() => setEditTarget(null))
  const deleteMutation = useDeleteService()

  const handleSave = (data: { name: string; price: number; description?: string }) =>
    editTarget ? updateMutation.mutate({ id: editTarget.id, data }) : createMutation.mutate(data)

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-4 sm:p-8">
      <ConfirmDelete open={!!deleteTarget} detail={deleteTarget?.name} busy={deleteMutation.isPending} onClose={() => setDeleteTarget(null)} onConfirm={() => {
        if (deleteTarget && !deleteMutation.isPending) deleteMutation.mutate(deleteTarget.id, { onSuccess: () => { setDeleteTarget(null);  } })
      }}/>
      {isError && <QueryError onRetry={() => refetch()}/>}

      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        actions={
          <Button variant="primary" onClick={() => setAddOpen(true)}>
            <Plus size={16} /> {t('newService')}
          </Button>
        }
      />

      <ServiceStatsBar services={services} />

      <div className="relative w-full sm:max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
        <input type="text" placeholder={t('searchPlaceholder')} value={search}
          onChange={e => setSearch(e.target.value)}
          className="min-h-11 w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-2.5 text-sm" />
      </div>

      <Card className={`relative hidden sm:block transition-opacity ${isFetching && !isLoading ? 'opacity-45 pointer-events-none' : ''}`}>
        <div className="border-b border-border px-5 py-4 text-base font-semibold">{t('activeServices')}</div>
        {isError ? null : isLoading ? (
          <div className="min-h-40" />
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
                        onEdit={() => setEditTarget(s)} onDelete={() => setDeleteTarget(s)} />
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

      <div className={`relative sm:hidden flex flex-col gap-3 transition-opacity ${isFetching && !isLoading ? 'opacity-45 pointer-events-none' : ''}`} aria-busy={isFetching}>
        {isLoading ? <div className="min-h-40" /> : services.map(s => (
          <ServiceMobileCard key={s.id} service={s}
            onEdit={() => setEditTarget(s)} onDelete={() => setDeleteTarget(s)} />
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
