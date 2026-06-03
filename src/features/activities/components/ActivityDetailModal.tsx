"use client";
import { useTranslations } from "next-intl";
import { Calendar, CheckCircle, CreditCard } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Display";
import { formatCurrency, getAvatarColor, cn } from "@/lib/utils";
import type { Appointment } from "@/features/appointments/api/appointments.api";

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

const PAYMENT_LABELS: Record<string, string> = {
  PIX: "Pix",
  CARD: "Cartão",
  CASH: "Dinheiro",
  OTHER: "Outro",
};

interface Props {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onEdit: () => void;
  onMarkPaid: () => void;
}

export const ActivityDetailModal = ({
  open,
  appointment: a,
  onClose,
  onEdit,
  onMarkPaid,
}: Props) => {
  const t = useTranslations("activities");
  const tc = useTranslations("common");

  if (!a) return null;

  const isPending = a.paymentStatus === "PENDING";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("appointmentDetails")}
      size="md"
      footer={
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 justify-center"
          >
            {tc("close")}
          </Button>
          {isPending && (
            <Button
              variant="primary"
              onClick={onMarkPaid}
              className="flex-1 justify-center bg-green-600 border-green-600"
            >
              <CheckCircle size={14} /> {t("markAsPaid")}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onEdit}
            className="flex-1 justify-center"
          >
            {t("editAppointment")}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Avatar
            initials={a.customerName.charAt(0)}
            color={getAvatarColor(a.customerName)}
            size="lg"
          />
          <div>
            <div className="font-bold text-base text-text">
              {a.customerName}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-light mt-0.5">
              <Calendar size={11} /> {fmt(a.appointmentDate)}
            </div>
          </div>
          <div className="ml-auto">
            <Badge variant={isPending ? "yellow" : "green"}>
              {isPending ? t("pendingBadge") : t("paidBadge")}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-text-light uppercase tracking-wide mb-1">
            {t("tableServicesCol")}
          </div>
          {a.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-2 border-b border-divider last:border-0"
            >
              <div>
                <div className="text-sm font-medium text-text">
                  {item.serviceName}
                </div>
                <div className="text-xs text-text-light">
                  {item.professionalName}
                </div>
              </div>
              <div className="text-sm font-semibold text-text">
                {formatCurrency(item.value)}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-bg rounded-xl p-4 flex flex-col gap-2">
          {a.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Subtotal</span>
              <span className="text-text-muted line-through">
                {formatCurrency(a.subtotal)}
              </span>
            </div>
          )}
          {a.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Desconto</span>
              <span className="text-danger">
                - {formatCurrency(a.discount)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold pt-1 border-t border-border">
            <span className="text-text">Total</span>
            <span className="text-gold text-base">
              {formatCurrency(a.total)}
            </span>
          </div>
          {!isPending && a.paymentMethod && (
            <div className="flex justify-between text-xs text-text-light pt-1">
              <span className="flex items-center gap-1">
                <CreditCard size={11} /> Forma de pagamento
              </span>
              <span className="font-medium text-text">
                {PAYMENT_LABELS[a.paymentMethod] ?? a.paymentMethod}
              </span>
            </div>
          )}
        </div>

        {a.notes && (
          <div className="bg-bg rounded-xl p-4">
            <div className="text-xs font-medium text-text-light uppercase tracking-wide mb-1">
              {t("notes") ?? "Observações"}
            </div>
            <p className="text-sm text-text-muted">{a.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
