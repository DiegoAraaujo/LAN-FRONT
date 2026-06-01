"use client";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Display";
import { CustomerTableRow } from "./CustomerTableRow";
import type { Customer } from "../api/customers.api";

interface Props {
  customers: Customer[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  onToggle: (c: Customer) => void;
  onEdit: (c: Customer) => void;
  onDelete: (id: string) => void;
  onPageChange: (p: number) => void;
  onViewDetail: (c: Customer) => void;
}

export const CustomerTable = ({
  customers,
  total,
  page,
  totalPages,
  isLoading,
  onToggle,
  onEdit,
  onDelete,
  onPageChange,
  onViewDetail,
}: Props) => {
  const t = useTranslations("clients");
  const tc = useTranslations("common");

  const HEADERS = [
    t("tableNameCol"),
    t("tableAddressCol"),
    t("tableContactsCol"),
    t("tableAppointmentsCol"),
    t("tableTotalSpentCol"),
    t("tableStatusCol"),
    t("tableActionsCol"),
  ];

  return (
    <Card className="hidden sm:block">
      {isLoading ? (
        <div className="px-5 py-10 text-center text-sm text-text-light">
          {tc("loading")}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg">
                {HEADERS.map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-[11px] font-semibold text-text-light uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-sm text-text-light"
                  >
                    {t("noClientsFound")}
                  </td>
                </tr>
              ) : (
                customers.map((c, i) => (
                  <CustomerTableRow
                    key={c.id}
                    customer={c}
                    index={i}
                    onToggle={() => onToggle(c)}
                    onEdit={() => onEdit(c)}
                    onDelete={() => onDelete(c.id)}
                    onViewDetail={() => onViewDetail(c)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="px-5 py-3 flex items-center justify-between border-t border-border bg-bg2">
        <span className="text-xs text-text-light">
          {t("showing")} {customers.length} {t("of")} {total}
        </span>
        <Pagination
          current={page}
          total={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </Card>
  );
};
