"use client";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { CustomerTableRow } from "./CustomerTableRow";
import type { Customer, CustomerStatus } from "../api/customers.api";

interface Props {
  customers: Customer[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  onStatusChange: (c: Customer, status: CustomerStatus) => void;
  statusBusy?: boolean;
  onEdit: (c: Customer) => void;
  onDelete: (id: string) => void;
  onPageChange: (p: number) => void;
  onViewDetail: (c: Customer) => void;
}

export const CustomerTable = ({
  customers,
  isLoading,
  onStatusChange,
  statusBusy,
  onEdit,
  onDelete,
  onViewDetail,
}: Props) => {
  const t = useTranslations("clients");

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
        <div className="min-h-40" />
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
                    onStatusChange={status => onStatusChange(c, status)}
                    statusBusy={statusBusy}
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
    </Card>
  );
};
