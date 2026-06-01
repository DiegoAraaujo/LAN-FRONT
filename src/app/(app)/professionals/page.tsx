'use client'
import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PageHeader } from '@/components/ui/Display'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProfessionalFormModal } from '@/features/professionals/components/ProfessionalFormModal'
import { ProfessionalTableRow } from '@/features/professionals/components/ProfessionalTableRow'
import { ProfessionalMobileCard } from '@/features/professionals/components/ProfessionalMobileCard'
import { useProfessionals } from '@/features/professionals/hooks/useProfessionals'
import { useCreateProfessional } from '@/features/professionals/hooks/useCreateProfessional'
import { useUpdateProfessional } from '@/features/professionals/hooks/useUpdateProfessional'
import { useDeleteProfessional } from '@/features/professionals/hooks/useDeleteProfessional'
import { useDebounce } from '@/hooks/useDebounce'
import type { ProfessionalInput } from '@/features/professionals/schemas/professional.schemas'
import type { Professional } from '@/features/professionals/api/professionals.api'

const ProfessionalsPage = () => {
  const t = useTranslations('professionals')
  const [search, setSearch]         = useState('')
  const [modalOpen, setModalOpen]   = useState(false)
  const [editTarget, setEditTarget] = useState<Professional | null>(null)
  const debounced = useDebounce(search, 300)

  const { data: professionals = [], isLoading } = useProfessionals(debounced)
  const createMutation = useCreateProfessional(() => setModalOpen(false))
  const updateMutation = useUpdateProfessional(() => setEditTarget(null))
  const deleteMutation = useDeleteProfessional()

  const handleOpen  = (p?: Professional) => { setEditTarget(p ?? null); setModalOpen(true) }
  const handleClose = () => { setEditTarget(null); setModalOpen(false) }
  const handleSave  = (data: ProfessionalInput) =>
    editTarget ? updateMutation.mutate({ id: editTarget.id, data }) : createMutation.mutate(data)

  return (
    <div className="p-5 sm:p-8 flex flex-col gap-5">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        actions={
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
              <input type="text" placeholder={`${t('tableNameCol')}…`} value={search}
                onChange={e => setSearch(e.target.value)}
                className="border border-border rounded-lg pl-8 pr-3 py-2 text-sm bg-bg w-48 focus:w-60 transition-all" />
            </div>
            <Button variant="primary" size="sm" onClick={() => handleOpen()}>
              <Plus size={14} /> {t('newProfessional')}
            </Button>
          </div>
        }
      />

      <Card className="hidden sm:block">
        <div className="px-5 py-4 border-b border-border font-semibold text-sm text-text">
          {t('activeProfessionals')} ({professionals.length})
        </div>
        {isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-text-light">Carregando…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg">
                  {[t('tableNameCol'), 'Telefone', t('tableAddressCol'), t('tableServicesCol'), t('tableActionsCol')].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-text-light uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {professionals.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-text-light">Nenhum profissional encontrado.</td></tr>
                ) : professionals.map((p, i) => (
                  <ProfessionalTableRow key={p.id} professional={p} index={i}
                    onEdit={() => handleOpen(p)} onDelete={() => deleteMutation.mutate(p.id)} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-border bg-bg2">
          <span className="text-xs text-text-light">Exibindo {professionals.length} profissionais</span>
        </div>
      </Card>

      <div className="sm:hidden flex flex-col gap-3">
        {isLoading
          ? <div className="text-center py-10 text-sm text-text-light">Carregando…</div>
          : professionals.map(p => (
              <ProfessionalMobileCard key={p.id} professional={p}
                onEdit={() => handleOpen(p)} onDelete={() => deleteMutation.mutate(p.id)} />
            ))
        }
      </div>

      <ProfessionalFormModal
        open={modalOpen || !!editTarget} onClose={handleClose}
        onSave={handleSave} isLoading={createMutation.isPending || updateMutation.isPending}
        defaultValues={editTarget}
      />
    </div>
  )
}

export default ProfessionalsPage
