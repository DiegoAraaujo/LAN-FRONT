'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PageHeader } from '@/components/ui/Display'
import { Button } from '@/components/ui/Button'
import { CustomerStatsBar } from '@/features/customers/components/CustomerStatsBar'
import { CustomerSearchBar } from '@/features/customers/components/CustomerSearchBar'
import { CustomerTable } from '@/features/customers/components/CustomerTable'
import { CustomerMobileList } from '@/features/customers/components/CustomerMobileList'
import { CustomerFormModal } from '@/features/customers/components/CustomerFormModal'
import { CustomerDetailModal } from '@/features/customers/components/CustomerDetailModal'
import { CustomerLoyaltyBanner } from '@/features/customers/components/CustomerLoyaltyBanner'
import { CustomerLoyaltyModal } from '@/features/customers/components/CustomerLoyaltyModal'
import { useCustomers, useCustomersDashboard } from '@/features/customers/hooks/useCustomers'
import { useCreateCustomer } from '@/features/customers/hooks/useCreateCustomer'
import { useUpdateCustomer } from '@/features/customers/hooks/useUpdateCustomer'
import { useDeleteCustomer } from '@/features/customers/hooks/useDeleteCustomer'
import { useDebounce } from '@/hooks/useDebounce'
import type { CustomerInput } from '@/features/customers/schemas/customer.schemas'
import type { Customer } from '@/features/customers/api/customers.api'

const LIMIT = 10

const CustomersPage = () => {
  const t = useTranslations('clients')

  const [search, setSearch]             = useState('')
  const [page, setPage]                 = useState(1)
  const [formOpen, setFormOpen]         = useState(false)
  const [loyaltyOpen, setLoyaltyOpen]   = useState(false)
  const [editTarget, setEditTarget]     = useState<Customer | null>(null)
  const [detailTarget, setDetailTarget] = useState<Customer | null>(null)

  const debounced = useDebounce(search, 300)

  const { data, isLoading }  = useCustomers({ search: debounced, page, limit: LIMIT })
  const { data: dashData }   = useCustomersDashboard()
  const createMutation       = useCreateCustomer(() => setFormOpen(false))
  const updateMutation       = useUpdateCustomer(() => setEditTarget(null))
  const deleteMutation       = useDeleteCustomer()
  const toggleMutation       = useUpdateCustomer()

  const customers  = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1
  const total      = data?.meta.total ?? 0

  const handleSubmit = (formData: CustomerInput) => {
    if (editTarget) updateMutation.mutate({ id: editTarget.id, data: formData })
    else            createMutation.mutate(formData)
  }

  const handleToggle = (c: Customer) =>
    toggleMutation.mutate({ id: c.id, data: { status: c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } })

  const handleEditFromDetail = () => {
    setEditTarget(detailTarget)
    setDetailTarget(null)
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  return (
    <div className="p-5 sm:p-8 flex flex-col gap-5">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        actions={
          <div className="flex items-center gap-2">
            <CustomerSearchBar
              value={search}
              onChange={v => { setSearch(v); setPage(1) }}
              className="hidden sm:block w-48 focus-within:w-60 transition-all"
            />
            <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
              <Plus size={14} /> {t('newClient')}
            </Button>
          </div>
        }
      />

      <CustomerSearchBar value={search} onChange={v => { setSearch(v); setPage(1) }} className="sm:hidden" />

      <CustomerStatsBar data={dashData} />

      <CustomerTable
        customers={customers} total={total} page={page} totalPages={totalPages}
        isLoading={isLoading}
        onToggle={handleToggle}
        onEdit={setEditTarget}
        onDelete={id => deleteMutation.mutate(id)}
        onPageChange={setPage}
        onViewDetail={setDetailTarget}
      />

      <CustomerMobileList
        customers={customers} isLoading={isLoading}
        onEdit={setEditTarget}
        onDelete={id => deleteMutation.mutate(id)}
        onViewDetail={setDetailTarget}
      />

      <CustomerLoyaltyBanner onClick={() => setLoyaltyOpen(true)} />

      <CustomerDetailModal
        open={!!detailTarget}
        customer={detailTarget}
        onClose={() => setDetailTarget(null)}
        onEdit={handleEditFromDetail}
      />

      <CustomerFormModal
        open={formOpen || !!editTarget}
        isLoading={isSaving}
        defaultValues={editTarget}
        onClose={() => { setFormOpen(false); setEditTarget(null) }}
        onSubmit={handleSubmit}
      />

      <CustomerLoyaltyModal open={loyaltyOpen} onClose={() => setLoyaltyOpen(false)} />
    </div>
  )
}

export default CustomersPage
