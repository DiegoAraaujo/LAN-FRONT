"use client";
import { ConfirmDelete } from '@/components/ui/ConfirmDelete'
import { QueryError } from '@/components/ui/QueryError'
import { useUrlFilters } from '@/hooks/useUrlFilters'

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHeader, Pagination } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { CustomerStatsBar } from "@/features/customers/components/CustomerStatsBar";
import { CustomerSearchBar } from "@/features/customers/components/CustomerSearchBar";
import { CustomerTable } from "@/features/customers/components/CustomerTable";
import { CustomerMobileList } from "@/features/customers/components/CustomerMobileList";
import { CustomerFormModal } from "@/features/customers/components/CustomerFormModal";
import { CustomerDetailModal } from "@/features/customers/components/CustomerDetailModal";
import { CustomerLoyaltyBanner } from "@/features/customers/components/CustomerLoyaltyBanner";
import { CustomerLoyaltyModal } from "@/features/customers/components/CustomerLoyaltyModal";
import {
  useCustomers,
  useCustomersDashboard,
} from "@/features/customers/hooks/useCustomers";
import { useCreateCustomer } from "@/features/customers/hooks/useCreateCustomer";
import { useUpdateCustomer } from "@/features/customers/hooks/useUpdateCustomer";
import { useDeleteCustomer } from "@/features/customers/hooks/useDeleteCustomer";
import { useDebounce } from "@/hooks/useDebounce";
import type { CustomerInput } from "@/features/customers/schemas/customer.schemas";
import type { Customer, CustomerStatus } from "@/features/customers/api/customers.api";

const LIMIT = 10;

const CustomersPage = () => {
  const t = useTranslations("clients");
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null)
  const { params, setFilters } = useUrlFilters()

  const statusParam = params.get('status')
  const status: CustomerStatus | undefined = statusParam === 'ACTIVE' || statusParam === 'INACTIVE' || statusParam === 'OCCASIONAL' ? statusParam : undefined
  const setStatus = (value?: CustomerStatus) => setFilters({ status: value, page: 1 })
  const search = params.get('search') ?? ''
  const setSearch = (value: string) => setFilters({ search: value, page: 1 })
  const page = Math.max(1, Number(params.get('page')) || 1)
  const setPage = (value: number) => setFilters({ page: value })
  const [formOpen, setFormOpen] = useState(false);
  const [loyaltyOpen, setLoyaltyOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Customer | null>(null);
  const [detailTarget, setDetailTarget] = useState<Customer | null>(null);

  const debounced = useDebounce(search, 300);

  const { data, isLoading, isFetching, isError, refetch } = useCustomers({
    search: debounced,
    status,
    page,
    limit: LIMIT,
  });

  const { data: dashData } = useCustomersDashboard();

  const createMutation = useCreateCustomer(() => setFormOpen(false));
  const updateMutation = useUpdateCustomer(() => setEditTarget(null));
  const deleteMutation = useDeleteCustomer();
  const toggleMutation = useUpdateCustomer();

  const customers = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPages ?? 1;

  const pagination = (
    <Pagination current={page} total={totalPages} onPageChange={setPage} loading={isFetching} />
  );

  const handleSubmit = (formData: CustomerInput) => {
    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, data: formData }, {
        onSuccess: () => {
          if (status && formData.status && status !== formData.status && customers.length === 1 && page > 1) setPage(page - 1);
        },
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleStatusChange = (customer: Customer, nextStatus: CustomerStatus) => {
    if (toggleMutation.isPending || customer.status === nextStatus) return;
    toggleMutation.mutate({ id: customer.id, data: { status: nextStatus } }, {
      onSuccess: () => {
        if (status && status !== nextStatus && customers.length === 1 && page > 1) setPage(page - 1);
      },
    });
  };

  const handleEditFromDetail = () => {
    setEditTarget(detailTarget);
    setDetailTarget(null);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-4 sm:p-8">
      <ConfirmDelete open={!!deleteTarget} detail={deleteTarget?.name} busy={deleteMutation.isPending} onClose={() => setDeleteTarget(null)} onConfirm={() => {
        if (deleteTarget && !deleteMutation.isPending) deleteMutation.mutate(deleteTarget.id, { onSuccess: () => { setDeleteTarget(null); setPage(Math.max(1, page - (customers.length === 1 ? 1 : 0))); } })
      }}/>
      {isError && <QueryError onRetry={() => refetch()}/>}

      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        actions={
          <Button variant="primary" onClick={() => setFormOpen(true)}>
            <Plus size={16} /> {t("newClient")}
          </Button>
        }
      />

      <CustomerStatsBar data={dashData} selected={status} onSelect={setStatus} />

      <div className="flex flex-wrap items-center gap-3">
      <CustomerSearchBar
        value={search}
        onChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
      />

      <select aria-label={t('statusFilter')} value={status ?? ''} onChange={event => setStatus((event.target.value || undefined) as CustomerStatus | undefined)} className="min-h-11 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm">
        <option value="">{t('allStatuses')}</option>
        <option value="ACTIVE">{t('active')}</option>
        <option value="INACTIVE">{t('inactive')}</option>
        <option value="OCCASIONAL">{t('occasional')}</option>
      </select>
      </div>

      <div className="relative hidden sm:block" aria-busy={isFetching}>
        <div className={`transition-opacity ${isFetching && !isLoading ? 'opacity-45 pointer-events-none' : ''}`}><CustomerTable
          customers={customers}
          total={total}
          page={page}
          totalPages={totalPages}
          isLoading={isLoading}
          onStatusChange={handleStatusChange}
          statusBusy={toggleMutation.isPending}
          onEdit={setEditTarget}
          onDelete={(id) => setDeleteTarget(customers.find(c => c.id === id) ?? null)}
          onPageChange={setPage}
          onViewDetail={setDetailTarget}
        /></div>
      </div>

      <div className="sm:hidden flex flex-col gap-3">
        {isError ? null : isLoading ? (
          <div className="min-h-40" />
        ) : customers.length === 0 ? (
          <div className="text-center py-10 text-sm text-text-light">
            {t("noClientsFound")}
          </div>
        ) : (
          <div className="relative" aria-busy={isFetching}><div className={`transition-opacity ${isFetching ? 'opacity-45 pointer-events-none' : ''}`}><CustomerMobileList
            onStatusChange={handleStatusChange}
            statusBusy={toggleMutation.isPending}
            customers={customers}
            isLoading={isLoading}
            onEdit={setEditTarget}
            onDelete={(id) => setDeleteTarget(customers.find(c => c.id === id) ?? null)}
            onViewDetail={setDetailTarget}
          /></div></div>
        )}
      </div>

      <div className="px-5 py-3 flex items-center sm:justify-between border border-border bg-bg2 rounded-xl flex-col sm:flex-row items gap-2">
        <span className="text-xs text-text-light">
          {t("showing")} {customers.length} {t("of")} {total}
        </span>
        {pagination}
      </div>

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
        onClose={() => {
          setFormOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleSubmit}
      />

      <CustomerLoyaltyModal
        open={loyaltyOpen}
        onClose={() => setLoyaltyOpen(false)}
      />
    </div>
  );
};

export default CustomersPage;
