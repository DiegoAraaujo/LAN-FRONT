"use client";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2, CheckCircle } from "lucide-react";
import { formatCurrency, getAvatarColor } from "@/lib/utils";
import type { Appointment } from "@/features/appointments/api/appointments.api";

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

interface Props {
  appointment: Appointment;
  onDelete: () => void;
  onEdit: () => void;
  onMarkPaid: () => void;
  onViewDetail: () => void;
}

export const ActivityMobileCard = ({
  appointment: a,
  onDelete,
  onEdit,
  onMarkPaid,
  onViewDetail,
}: Props) => {
  const t = useTranslations("activities");
  const isPending = a.paymentStatus === "PENDING";

  return (
    <Card className="p-4">
      <button
        onClick={onViewDetail}
        className="flex items-center justify-between mb-2 w-full text-left group"
      >
        <div className="flex items-center gap-2.5">
          <Avatar
            initials={a.customerName.charAt(0)}
            color={getAvatarColor(a.customerName)}
            size="md"
          />
          <div>
            <div className="font-semibold text-sm group-hover:text-gold transition-colors">
              {a.customerName}
            </div>
            <div className="text-xs text-text-light">
              {fmt(a.appointmentDate)}
            </div>
          </div>
        </div>
        <Badge variant={isPending ? "yellow" : "green"}>
          {isPending ? t("pendingBadge") : t("paidBadge")}
        </Badge>
      </button>

      <div className="flex justify-between mt-2 pt-2 border-t border-border mb-3">
        <span className="text-xs text-text-light">{t("tableValueCol")}</span>
        <div className="text-right">
          {a.discount > 0 && (
            <div className="text-[10px] text-text-muted line-through">
              {formatCurrency(a.subtotal)}
            </div>
          )}
          <span className="text-sm font-bold">{formatCurrency(a.total)}</span>
        </div>
      </div>

      <div
        className={`grid gap-2 ${isPending ? "grid-cols-3" : "grid-cols-2"}`}
      >
        {isPending && (
          <Button
            variant="primary"
            size="sm"
            className="justify-center bg-green-600 border-green-600 text-white"
            onClick={onMarkPaid}
          >
            <CheckCircle size={13} /> {t("markAsPaid")}
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="justify-center"
          onClick={onEdit}
        >
          <Pencil size={13} /> {t("editAppointment")}
        </Button>
        <Button
          variant="danger"
          size="sm"
          className="justify-center"
          onClick={onDelete}
        >
          <Trash2 size={13} />
        </Button>
      </div>
    </Card>
  );
};
