"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowUpRight,
  RefreshCw,
  Users,
  CheckCircle2,
  CalendarDays,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useRef, useState } from "react";
import { useDashboard } from "../hooks/useDashboard";
import { DashboardStatCards } from "./DashboardStatCards";
import { DashboardPeriodFilter } from "./DashboardPeriodFilter";
import { Card } from "@/components/ui/Card";
import { QueryError } from "@/components/ui/QueryError";
import { LoadingState } from "@/components/ui/luma-spin";
import { PaymentModal } from "@/features/finance/PaymentModal";
import type { DashboardAppointment } from "../api/dashboard.api";
const RevenueChart = dynamic(
  () => import("@/components/charts/RevenueChart").then((m) => m.RevenueChart),
  {
    ssr: false,
    loading: () => (
      <LoadingState label="Carregando gráfico…" className="h-72" />
    ),
  },
);

export function DashboardClient() {
  const t = useTranslations("overview");
  const locale = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  const now = new Date();
  const rawYear = Number(params.get("year"));
  const year =
    Number.isInteger(rawYear) && rawYear >= 2000 && rawYear <= 2100
      ? rawYear
      : now.getFullYear();
  const mode = params.get("dateMode") === "custom" ? "custom" : params.get("month") === "all" ? "year" : "month";
  const rawMonth = Number(params.get("month"));
  const selectedMonth = Number.isInteger(rawMonth) && rawMonth >= 1 && rawMonth <= 12 ? rawMonth : now.getMonth() + 1;
  const month = mode === "year" ? undefined : selectedMonth;
  const dateFrom =
    params.get("dateFrom") ??
    `${year}-${String(month ?? 1).padStart(2, "0")}-01`;
  const dateTo =
    params.get("dateTo") ??
    `${year}-${String(month ?? 12).padStart(2, "0")}-${new Date(Date.UTC(year, month ?? 12, 0)).getUTCDate()}`;
  const validDate = (value: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value &&
    value >= "2000-01-01" &&
    value <= "2100-12-31";
  const validPeriod =
    validDate(dateFrom) && validDate(dateTo) && dateFrom <= dateTo;
  const setCustomDates = (from: string, to: string) =>
    router.replace(
      "/dashboard?" +
        new URLSearchParams({ dateMode: "custom", dateFrom: from, dateTo: to }),
      { scroll: false },
    );
  const setCalendarPeriod = (nextMode: "month" | "year", nextYear = year, nextMonth = selectedMonth) => router.replace("/dashboard?" + new URLSearchParams({ year:String(nextYear), month:nextMode === "year" ? "all" : String(nextMonth) }), { scroll:false });
  const setMode = (nextMode: "month" | "year" | "custom") => nextMode === "custom" ? setCustomDates(dateFrom,dateTo) : setCalendarPeriod(nextMode);
  const query = useDashboard(mode === "custom" ? { dateFrom, dateTo } : { year, ...(month ? { month } : {}) }, validPeriod);
  const [target, setTarget] = useState<DashboardAppointment | null>(null);
  const monthComparisonRef = useRef<HTMLDivElement>(null);
  const monthDrag = useRef({ startX: 0, scrollLeft: 0 });
  const [draggingMonths, setDraggingMonths] = useState(false);
  const startMonthDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const element = monthComparisonRef.current;
    if (!element) return;
    monthDrag.current = { startX: event.clientX, scrollLeft: element.scrollLeft };
    setDraggingMonths(true);
    element.setPointerCapture(event.pointerId);
  };
  const moveMonthDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingMonths || !monthComparisonRef.current) return;
    event.preventDefault();
    monthComparisonRef.current.scrollLeft = monthDrag.current.scrollLeft - (event.clientX - monthDrag.current.startX);
  };
  const stopMonthDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = monthComparisonRef.current;
    if (element?.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    setDraggingMonths(false);
  };
  const currency = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "BRL",
    }).format(n);
  const date = (s: string) =>
    new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo",
    }).format(new Date(s));
  const periodLink =
    "/activities?" +
    new URLSearchParams({ dateMode: "custom", dateFrom, dateTo });
  const data = validPeriod ? query.data : undefined;
  const customDays = mode === "custom" ? Math.round((Date.parse(dateTo) - Date.parse(dateFrom)) / 86400000) + 1 : 0;
  const chartLabelMode = mode === "month" || (mode === "custom" && customDays <= 31)
    ? "day"
    : mode === "custom" && customDays > 366
      ? "monthYear"
      : "month";
  const evolutionLabel = (value: string) => {
    if (chartLabelMode === "day") return String(Number(value.includes("-") ? value.slice(-2) : value));
    const parts = value.split("-").map(Number);
    return new Intl.DateTimeFormat(locale, { month: "short", ...(chartLabelMode === "monthYear" ? { year: "2-digit" as const } : {}), timeZone: "UTC" }).format(new Date(Date.UTC(parts.length > 1 ? parts[0] : year, (parts.length > 1 ? parts[1] : parts[0]) - 1, 1)));
  };
  const visibleMonthToDate = data?.monthToDate.filter(item => item.appointments > 0 || item.received > 0 || item.pending > 0) ?? [];
  const currentMonthToDate = data?.monthToDate[0];
  const ranking = (
    title: string,
    rows: { name: string; count: number; revenue: number }[],
    customer = false,
  ) => (
    <Card className="p-5 sm:p-6">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-xs text-text-muted mt-1 mb-5">
        {t(customer ? "customerRankHint" : "rankHint")}
      </p>
      {!rows.length ? (
        <p className="text-sm text-text-muted py-6">{t("empty")}</p>
      ) : (
        <ol className="space-y-5">
          {rows.map((r, i) => (
            <li key={r.name + "-" + i} className="flex items-center gap-3">
              <span className="w-8 h-8 shrink-0 rounded-full bg-bg flex items-center justify-center text-xs text-text-muted font-semibold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{r.name}</p>
                <p className="text-xs text-text-muted mt-1">
                  {t("count", { count: r.count })}
                </p>
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {currency(r.revenue)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
  return (
    <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-8 space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold mb-2">
            LAN / {t("business")}
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-sm text-text-muted mt-2">{t("subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DashboardPeriodFilter
            mode={mode}
            year={year}
            month={selectedMonth}
            dateFrom={dateFrom}
            dateTo={dateTo}
            active={mode !== "month" || year !== now.getFullYear() || selectedMonth !== now.getMonth()+1}
            onModeChange={setMode}
            onYearChange={value=>setCalendarPeriod(mode === "year" ? "year" : "month",value)}
            onMonthChange={value=>setCalendarPeriod("month",year,value)}
            onDateChange={(key, value) =>
              setCustomDates(
                key === "dateFrom" ? value : dateFrom,
                key === "dateTo" ? value : dateTo,
              )
            }
            onReset={()=>setCalendarPeriod("month",now.getFullYear(),now.getMonth()+1)}
          />
          <button
            aria-label={t("refresh")}
            disabled={query.isFetching || !validPeriod}
            onClick={() => query.refetch()}
            className="p-3 rounded-xl border border-border bg-white disabled:opacity-50"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
      <p className="flex items-center gap-2 text-xs text-text-muted">
        <CalendarDays size={14} className="shrink-0" />
        {t("periodHint")}
      </p>
      {!validPeriod && (
        <p role="alert" className="text-sm text-danger">
          {locale === "en"
            ? "Enter a valid start and end date."
            : "Informe uma data inicial e final válidas."}
        </p>
      )}
      {validPeriod && query.isError && (
        <QueryError onRetry={() => query.refetch()} />
      )}
      {data && (
        <>
          <DashboardStatCards data={data} />
          <Card className="p-5 sm:p-6">
            <div className="mb-5">
              <h2 className="font-semibold text-lg">Comparativo mensal até hoje</h2>
              <p className="text-xs text-text-muted mt-1">Uma visão fixa dos últimos 12 meses, independente do período selecionado.</p>
            </div>
            <div
              ref={monthComparisonRef}
              onPointerDown={startMonthDrag}
              onPointerMove={moveMonthDrag}
              onPointerUp={stopMonthDrag}
              onPointerCancel={stopMonthDrag}
              className={`flex select-none gap-3 overflow-x-auto overscroll-x-contain pb-2 touch-pan-x ${draggingMonths ? "cursor-grabbing" : "cursor-grab"}`}
            >
              {visibleMonthToDate.map((item) => {
                const monthName = new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(item.year, item.month - 1, 1)));
                const isCurrentMonth = item.year === currentMonthToDate?.year && item.month === currentMonthToDate.month;
                const comparisonRows = [
                  { label: t('appointmentsLabel'), value: item.appointments, reference: currentMonthToDate?.appointments ?? 0, money: false, pending: false },
                  { label: t('received'), value: item.received, reference: currentMonthToDate?.received ?? 0, money: true, pending: false },
                  { label: t('pending'), value: item.pending, reference: currentMonthToDate?.pending ?? 0, money: true, pending: true },
                  { label: t('totalValueLabel'), value: item.received + item.pending, reference: (currentMonthToDate?.received ?? 0) + (currentMonthToDate?.pending ?? 0), money: true, pending: false },
                ];
                return <div key={`${item.year}-${item.month}`} className="w-[318px] shrink-0 rounded-2xl border border-border bg-surface p-4 shadow-sm">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div><p className="text-sm font-semibold capitalize">Neste mesmo dia em {monthName}</p><p className="mt-1 text-[11px] text-text-muted">Dados do dia 1 ao dia {item.throughDay}</p></div>
                    {isCurrentMonth&&<span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">{t('currentMonthReference')}</span>}
                  </div>
                  <dl className="grid grid-cols-2 gap-2">
                    {comparisonRows.map(row => {
                      const change = row.reference > 0 ? Math.round((row.value - row.reference) / row.reference * 1000) / 10 : null;
                      return <div key={row.label} className="min-w-0 rounded-xl bg-bg px-3 py-3">
                        <dt className="truncate text-[11px] text-text-muted" title={row.label}>{row.label}</dt>
                        <dd className="mt-1 min-w-0">
                          <span className="block truncate text-sm font-semibold tabular-nums text-text" title={row.money ? currency(row.value) : String(row.value)}>{row.money ? currency(row.value) : row.value}</span>
                          {!isCurrentMonth && <span className={`mt-1 inline-flex items-center gap-0.5 text-[11px] font-semibold tabular-nums ${change === null || change === 0 ? 'text-text-muted' : row.pending ? change > 0 ? 'text-amber-700' : 'text-emerald-700' : change > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                            {change === null ? t('noComparisonBase') : <>{change > 0 ? <TrendingUp size={11}/> : change < 0 ? <TrendingDown size={11}/> : null}{change > 0 ? '+' : ''}{change.toLocaleString(locale, { maximumFractionDigits: 1 })}%</>}
                          </span>}
                        </dd>
                      </div>;
                    })}
                  </dl>
                  {!isCurrentMonth&&<p className="mt-3 text-[11px] text-text-muted">{t('versusCurrentMonth')}</p>}
                </div>;
              })}
              {visibleMonthToDate.length === 0 && <p className="py-6 text-sm text-text-muted">Ainda não há dados mensais para comparar.</p>}
            </div>
          </Card>
          <p className="text-xs text-text-muted mb-4">
            Valores por data do atendimento, incluindo pagamentos parciais e
            crédito aplicado. Consulte o Fluxo de caixa para entradas por data
            de recebimento.
          </p>
          <div className="grid xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)] gap-5">
            <Card className="p-5 sm:p-6 min-w-0">
              <div className="mb-6">
                <h2 className="font-semibold text-lg">{t("evolution")}</h2>
                <p className="text-xs text-text-muted mt-1">{t("period")}</p>
              </div>
              <RevenueChart data={data.evolutionGraph} labelMode={chartLabelMode} />
              {data.cards.totalAppointments === 0 && (
                <p className="text-sm text-text-muted text-center mt-3">
                  {t("empty")}
                </p>
              )}
              <details className="text-xs text-text-muted mt-4">
                <summary className="cursor-pointer">{t("viewData")}</summary>
                <div className="max-h-48 overflow-auto mt-3">
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th>{t("period")}</th>
                        <th>{t("received")}</th>
                        <th>{t("pending")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.evolutionGraph.map((r) => (
                        <tr key={r.month}>
                          <td className="py-1 capitalize">{evolutionLabel(r.month)}</td>
                          <td>{currency(r.revenue)}</td>
                          <td>{currency(r.pending)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </Card>
            <Card className="p-5 sm:p-6">
              <div className="flex justify-between gap-2 items-start">
                <div>
                  <h2 className="font-semibold text-lg">{t("toReceive")}</h2>
                  <p className="text-xs text-text-muted mt-1">
                    {t("oldestPending")}
                  </p>
                </div>
                <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg text-xs font-semibold">
                  {data.cards.pendingCount}
                </span>
              </div>
              <div className="text-3xl font-semibold tracking-tight mt-5 mb-4 tabular-nums">
                {currency(data.cards.pendingRevenue)}
              </div>
              {!data.pendingAppointments.length ? (
                <div className="py-10 text-center text-text-muted">
                  <CheckCircle2
                    className="mx-auto text-emerald-600 mb-3"
                    size={30}
                  />
                  <p className="text-sm">{t("noPending")}</p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {data.pendingAppointments.map((a) => (
                    <li key={a.id} className="flex items-center gap-3 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {a.customerName}
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                          {date(a.appointmentDate)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">
                        {currency(a.remaining)}
                      </span>
                      <button
                        aria-label={t("markPaidFor", { name: a.customerName })}
                        title={t("markPaid")}
                        onClick={() => setTarget(a)}
                        className="p-2.5 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                      >
                        <CheckCircle2 size={17} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href={periodLink + "&openOnly=true"}
                className="text-sm font-medium flex items-center justify-between mt-5 pt-4 border-t border-border"
              >
                {t("viewPending")}
                <ArrowUpRight size={16} />
              </Link>
            </Card>
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            {ranking(
              t("services"),
              data.servicesPieGraph
                .slice(0, 5)
                .map((s) => ({ ...s, name: s.serviceName })),
            )}
            {ranking(t("professionals"), data.professionals)}
            <Card className="p-5 sm:p-6">
              <h2 className="font-semibold">{t("payments")}</h2>
              <p className="text-xs text-text-muted mt-1 mb-5">
                {t("paidOnly")}
              </p>
              {!data.paymentMethods.length ? (
                <p className="text-sm text-text-muted py-6">{t("empty")}</p>
              ) : (
                <div className="space-y-5">
                  {data.paymentMethods.map((p) => (
                    <div key={p.method}>
                      <div className="flex justify-between gap-2 text-sm mb-2">
                        <span>{t("methods." + p.method)}</span>
                        <span className="font-semibold">
                          {currency(p.revenue)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-bg overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gold-btn"
                          style={{
                            width:
                              (data.cards.totalRevenue
                                ? (p.revenue / data.cards.totalRevenue) * 100
                                : 0) + "%",
                          }}
                        />
                      </div>
                      <p className="text-xs text-text-muted mt-1">
                        {t("paidCount", { count: p.count })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
          <div className="grid lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)] gap-5">
            <Card className="p-5 sm:p-6">
              <div className="flex justify-between gap-3 mb-5">
                <h2 className="font-semibold">{t("recent")}</h2>
                <Link
                  href={periodLink}
                  className="text-xs font-medium text-gold flex items-center gap-1"
                >
                  {t("viewAll")}
                  <ArrowUpRight size={14} />
                </Link>
              </div>
              {!data.recentAppointments.length ? (
                <p className="text-sm text-text-muted py-6">{t("empty")}</p>
              ) : (
                <ul className="divide-y divide-border">
                  {data.recentAppointments.map((a) => (
                    <li key={a.id} className="py-4 flex items-center gap-3">
                      <span className="w-10 h-10 shrink-0 rounded-xl bg-bg flex items-center justify-center font-semibold text-text-muted">
                        {a.customerName.charAt(0)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {a.customerName}
                        </p>
                        <p className="text-xs text-text-muted truncate mt-1">
                          {a.services.join(", ")} · {date(a.appointmentDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {currency(a.total)}
                        </p>
                        <span
                          className={
                            "inline-block text-[11px] px-2 py-0.5 rounded-md mt-1 " +
                            (a.paymentStatus === "PAID"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700")
                          }
                        >
                          {a.paymentStatus === "PARTIAL"
                            ? "Parcialmente pago"
                            : t(
                                a.paymentStatus === "PAID" ? "paid" : "pending",
                              )}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <div className="space-y-5">
              <div className="rounded-2xl bg-sidebar text-white px-4 py-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/10">
                  <Users size={18} className="text-gold-btn" />
                </div>
                <div>
                  <p className="text-xl font-semibold">
                    {data.cards.newCustomers}
                  </p>
                  <p className="text-xs text-white/70">{t("newCustomers")}</p>
                </div>
              </div>
              {ranking(t("customers"), data.customers, true)}
            </div>
          </div>
        </>
      )}
      {target && (
        <PaymentModal
          key={target.id}
          appointment={{
            ...target,
            subtotal: target.total,
            discount: 0,
            paymentMethod: null,
            items: [],
          }}
          onClose={() => setTarget(null)}
        />
      )}
    </div>
  );
}
