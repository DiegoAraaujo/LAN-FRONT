"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader, Pagination } from "@/components/ui/Display";
import { Card } from "@/components/ui/Card";
import { ActivitiesFilterBar } from "@/features/activities/components/ActivitiesFilterBar";
import { ActivityTableRow } from "@/features/activities/components/ActivityTableRow";
import { ActivityMobileCard } from "@/features/activities/components/ActivityMobileCard";
import { AppointmentEditModal } from "@/features/appointments/components/AppointmentEditModal";
import { MarkAsPaidModal } from "@/features/appointments/components/MarkAsPaidModal";
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

  const [search, setSearch] = useState("");
  const [month, setMonth] = useState<number | undefined>();
  const [year, setYear] = useState<number | undefined>();
  const [paymentStatus, setPaymentStatus] = useState<
    PaymentStatus | undefined
  >();
  const [page, setPage] = useState(1);
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

  const { data, isLoading } = useAppointments({
    search: debounced || undefined,
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
  const hasFilters = !!(search || month || year || paymentStatus);

  const resetFilters = () => {
    setSearch("");
    setMonth(undefined);
    setYear(undefined);
    setPaymentStatus(undefined);
    setPage(1);
  };

  const handleConfirmMarkPaid = (method: PaymentMethod) => {
    if (!markPaidTarget) return;
    updateMutation.mutate({
      id: markPaidTarget.id,
      data: { paymentStatus: "PAID", paymentMethod: method },
    });
  };

  const handleSaveEdit = (
    id: string,
    data: {
      paymentStatus: PaymentStatus;
      paymentMethod?: PaymentMethod;
      discount: number;
      notes?: string;
      appointmentDate: string;
    },
  ) => {
    updateMutation.mutate({
      id,
      data: {
        paymentStatus: data.paymentStatus,
        paymentMethod: data.paymentMethod ?? "OTHER",
        discount: data.discount,
        notes: data.notes,
        appointmentDate: data.appointmentDate,
      },
    });
  };

  const pagination = (
    <Pagination current={page} total={totalPages} onPageChange={setPage} />
  );

  return (
    <div className="p-5 sm:p-8 flex flex-col gap-5">
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
      <Card className="hidden sm:block">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-sm">{t("appointmentList")}</h3>
          <span className="bg-gold-btn text-text text-[11px] font-bold px-3 py-1 rounded">
            {t("pendingCount")}: {pendingCount}
          </span>
        </div>

        {isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-text-light">
            Carregando…
          </div>
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
                      onDelete={() => deleteMutation.mutate(a.id)}
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
      <div className="sm:hidden flex flex-col gap-3">
        {isLoading ? (
          <div className="text-center py-10 text-sm text-text-light">
            Carregando…
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-10 text-sm text-text-light">
            {t("noResults")}
          </div>
        ) : (
          appointments.map((a) => (
            <ActivityMobileCard
              key={a.id}
              appointment={a}
              onDelete={() => deleteMutation.mutate(a.id)}
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

      <MarkAsPaidModal
        open={!!markPaidTarget}
        onClose={() => setMarkPaidTarget(null)}
        onConfirm={handleConfirmMarkPaid}
        isLoading={updateMutation.isPending}
      />
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
