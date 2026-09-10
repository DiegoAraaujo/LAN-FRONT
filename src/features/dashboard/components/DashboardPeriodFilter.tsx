"use client";
import { useLocale } from "next-intl";
interface Props {
  dateFrom: string;
  dateTo: string;
  onDateChange: (key: "dateFrom" | "dateTo", value: string) => void;
}
export const DashboardPeriodFilter = ({
  dateFrom,
  dateTo,
  onDateChange,
}: Props) => {
  const locale = useLocale();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-2 text-sm">
        {locale === "en" ? "From" : "De"}
        <input
          type="date"
          value={dateFrom}
          max={dateTo || "2100-12-31"}
          min="2000-01-01"
          onChange={(e) => onDateChange("dateFrom", e.target.value)}
          className="min-w-0 rounded-xl border border-border bg-surface px-3 py-2.5"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        {locale === "en" ? "To" : "Até"}
        <input
          type="date"
          value={dateTo}
          min={dateFrom || "2000-01-01"}
          max="2100-12-31"
          onChange={(e) => onDateChange("dateTo", e.target.value)}
          className="min-w-0 rounded-xl border border-border bg-surface px-3 py-2.5"
        />
      </label>
    </div>
  );
};
