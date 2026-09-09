"use client";
import { ConfirmDelete } from '@/components/ui/ConfirmDelete'
import { QueryError } from '@/components/ui/QueryError'
import { useUrlFilters } from '@/hooks/useUrlFilters'
import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader, Pagination } from "@/components/ui/Display";
import { Card } from "@/components/ui/Card";
import { ActivitiesFilterBar } from "@/features/activities/components/ActivitiesFilterBar";
import { ActivityTableRow } from "@/features/activities/components/ActivityTableRow";
import { ActivityMobileCard } from "@/features/activities/components/ActivityMobileCard";
import { AppointmentEditModal } from "@/features/appointments/components/AppointmentEditModal";
import { PaymentModal } from "@/features/finance/PaymentModal";
import { AppointmentFinanceFilters } from "@/features/finance/AppointmentFinanceFilters";
import { formatCurrency } from "@/lib/utils";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { useDeleteAppointment } from "@/features/appointments/hooks/useDeleteAppointment";
import { useUpdateAppointment } from "@/features/appointments/hooks/useUpdateAppointment";
import { useDebounce } from "@/hooks/useDebounce";
import type {
  Appointment,
  PaymentMethod,
  PaymentStatus,
} from "@/features/appointments/api/appointments.api";
import { ActivityDetailModal } from "@/features/activities/components/ActivityDetailModal";

const LIMIT = 10;

const HEADERS_KEYS = [
  "tableDateCol",
  "tableClientCol",
  "tableServicesCol",
  "tableValueCol",
  "tablePaymentCol",
  "tableActionsCol",
] as const;

const ActivitiesPage = () => {
  const t = useTranslations("activities");
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null)
  const { params, setFilters } = useUrlFilters()

  const search = params.get('search') ?? ''
  const setSearch = (value: string) => setFilters({ search: value, page: 1 })
  const customPeriod = params.get('dateMode') === 'custom' || !!(params.get('dateFrom') || params.get('dateTo'))
  const monthValue = Number(params.get('month'))
  const yearValue = Number(params.get('year'))
  const month = !customPeriod && monthValue >= 1 && monthValue <= 12 ? monthValue : undefined
  const year = !customPeriod && yearValue >= 2000 && yearValue <= 2100 ? yearValue : undefined
  const paymentStatus: PaymentStatus | undefined = params.get('paymentStatus') === 'PARTIAL' ? 'PARTIAL' : params.get('paymentStatus') === 'PAID' ? 'PAID' : params.get('paymentStatus') === 'PENDING' ? 'PENDING' : undefined
  const setMonth = (value: number | undefined) => setFilters({ month: value, dateMode: undefined, dateFrom: undefined, dateTo: undefined, page: 1 })
  const setYear = (value: number | undefined) => setFilters({ year: value, dateMode: undefined, dateFrom: undefined, dateTo: undefined, page: 1 })
  const setPaymentStatus = (value: PaymentStatus | undefined) => setFilters({ paymentStatus: value, openOnly: undefined, page: 1 })
  const page = Math.max(1, Number(params.get('page')) || 1)
  const setPage = (value: number) => setFilters({ page: value })
  const [editTarget, setEditTarget] = useState<Appointment | null>(null);
  const [markPaidTarget, setMarkPaidTarget] = useState<Appointment | null>(
    null,
  );
  const [detailTarget, setDetailTarget] = useState<Appointment | null>(null);

  const debounced = useDebounce(search, 300);
  const deleteMutation = useDeleteAppointment();
  const updateMutation = useUpdateAppointment(() => {
    setEditTarget(null);
    setMarkPaidTarget(null);
  });

  const { data, isLoading, isFetching, isError, refetch } = useAppointments({
    search: debounced || undefined,
    openOnly: params.get("openOnly") === "true" ? "true" : undefined,
    serviceId: params.get("serviceId") || undefined, professionalId: params.get("professionalId") || undefined,
    paymentMethod: (params.get("paymentMethod") || undefined) as PaymentMethod | undefined,
    dateFrom: params.get("dateFrom") || undefined, dateTo: params.get("dateTo") || undefined,
    dateType: params.get("dateType") === "payment" ? "payment" : "appointment",
    month,
    year,
    paymentStatus,
    page,
    limit: LIMIT,
  });

  const appointments = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const pendingCount = data?.totalPending ?? 0;
  const hasFilters = [...params.keys()].some(key => key !== 'page');

  const resetFilters = () => {
    setFilters({search: undefined, month: undefined, year: undefined, paymentStatus: undefined,
      dateMode: undefined, dateFrom: undefined, dateTo: undefined, dateType: undefined,
      serviceId: undefined, professionalId: undefined, paymentMethod: undefined, openOnly: undefined, page: 1});
  };

  const handleSaveEdit = (
    id: string,
    data: {
      discount: number;
      notes?: string;
      appointmentDate: string;
    },
  ) => {
    updateMutation.mutate({
      id,
      data: {
        discount: data.discount,
        notes: data.notes,
        appointmentDate: data.appointmentDate,
      },
    });
  };

  const pagination = (
    <Pagination current={page} total={totalPages} onPageChange={setPage} loading={isFetching} />
  );

  return (
    <div className="p-5 sm:p-8 flex flex-col gap-5">
      <ConfirmDelete open={!!deleteTarget} detail={deleteTarget ? deleteTarget.customerName + ' · ' + new Date(deleteTarget.appointmentDate).toLocaleString() + ' · R$ ' + deleteTarget.total.toFixed(2) : undefined} busy={deleteMutation.isPending} onClose={() => setDeleteTarget(null)} onConfirm={() => {
        if (deleteTarget && !deleteMutation.isPending) deleteMutation.mutate(deleteTarget.id, { onSuccess: () => { setDeleteTarget(null); setPage(Math.max(1, page - (appointments.length === 1 ? 1 : 0))); } })
      }}/>
      {isError && <QueryError onRetry={() => refetch()}/>}

      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <ActivitiesFilterBar
        search={search}
        month={month}
        year={year}
        paymentStatus={paymentStatus}
        onSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        onMonth={(v) => {
          setMonth(v);
          setPage(1);
        }}
        onYear={(v) => {
          setYear(v);
          setPage(1);
        }}
        onPaymentStatus={(v) => {
          setPaymentStatus(v);
          setPage(1);
        }}
        onReset={resetFilters}
        hasFilters={hasFilters}
      />
      {params.get("openOnly") && <p className="text-sm text-amber-800">Exibindo atendimentos pendentes e parcialmente pagos. <button className="underline" onClick={() => setFilters({openOnly: undefined, page: 1})}>Mostrar todos</button></p>}
      <AppointmentFinanceFilters/>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{[['Valor total', data?.summary?.totalValue], ['Pago / crédito aplicado', data?.summary?.paidValue], ['Em aberto', data?.summary?.pendingValue]].map(([label,value]) => <Card key={label} className="p-4"><p className="text-xs text-text-muted">{label}</p><strong className="text-xl">{formatCurrency(Number(value ?? 0))}</strong></Card>)}</div>
      {(params.get('serviceId') || params.get('professionalId')) && <p className="rounded-xl bg-amber-50 p-4 text-sm">Somente os itens filtrados, após descontos: <strong>{formatCurrency(data?.summary?.serviceValue ?? 0)}</strong>. Os cartões incluem o valor completo dos atendimentos encontrados.</p>}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="text-xs text-text-light mb-2">
            {t("totalAppointments")}
          </div>
          <div className="text-2xl sm:text-3xl font-bold">{total}</div>
        </Card>

        <Card className="p-5">
          <div className="text-xs text-text-light mb-2">
            {t("pendingCount")}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-warning">
            {pendingCount}
          </div>
        </Card>
      </div>
      <Card className={`relative hidden sm:block transition-opacity ${isFetching && !isLoading ? 'opacity-45 pointer-events-none' : ''}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-sm">{t("appointmentList")}</h3>
          <span className="bg-gold-btn text-text text-[11px] font-bold px-3 py-1 rounded">
            {t("pendingCount")}: {pendingCount}
          </span>
        </div>

        {isError ? null : isLoading ? (
          <div className="min-h-40" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg">
                  {HEADERS_KEYS.map((key) => (
                    <th
                      key={key}
                      className="text-left px-5 py-3 text-[11px] font-semibold text-text-light uppercase tracking-wide whitespace-nowrap"
                    >
                      {t(key)}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-sm text-text-light"
                    >
                      {t("noResults")}
                    </td>
                  </tr>
                ) : (
                  appointments.map((a, i) => (
                    <ActivityTableRow
                      key={a.id}
                      appointment={a}
                      index={i}
                      onDelete={() => setDeleteTarget(a)}
                      onEdit={() => setEditTarget(a)}
                      onMarkPaid={() => setMarkPaidTarget(a)}
                      onViewDetail={() => setDetailTarget(a)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <div className={`relative sm:hidden flex flex-col gap-3 transition-opacity ${isFetching && !isLoading ? 'opacity-45 pointer-events-none' : ''}`} aria-busy={isFetching}>
        {isError ? null : isLoading ? (
          <div className="min-h-40" />
        ) : appointments.length === 0 ? (
          <div className="text-center py-10 text-sm text-text-light">
            {t("noResults")}
          </div>
        ) : (
          appointments.map((a) => (
            <ActivityMobileCard
              key={a.id}
              appointment={a}
              onDelete={() => setDeleteTarget(a)}
              onEdit={() => setEditTarget(a)}
              onMarkPaid={() => setMarkPaidTarget(a)}
              onViewDetail={() => setDetailTarget(a)}
            />
          ))
        )}
      </div>

      <div className="px-5 py-3 flex items-center sm:justify-between border border-border bg-bg2 rounded-xl flex-col sm:flex-row items gap-2">
        <span className="text-xs text-text-light">
          {t("showing")} {appointments.length} {t("of")} {total}
        </span>
        {pagination}
      </div>

      <ActivityDetailModal
        open={!!detailTarget}
        appointment={detailTarget}
        onClose={() => setDetailTarget(null)}
        onEdit={() => {
          setEditTarget(detailTarget);
          setDetailTarget(null);
        }}
        onMarkPaid={() => {
          setMarkPaidTarget(detailTarget);
          setDetailTarget(null);
        }}
      />

      {markPaidTarget && <PaymentModal key={markPaidTarget.id} appointment={markPaidTarget} onClose={() => setMarkPaidTarget(null)}/>}
      <AppointmentEditModal
        open={!!editTarget}
        appointment={editTarget}
        isLoading={updateMutation.isPending}
        onClose={() => setEditTarget(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default ActivitiesPage;
