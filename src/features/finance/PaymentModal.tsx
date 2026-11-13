'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MoneyInput } from '@/components/ui/MoneyInput';
import { formatCurrency as money } from '@/lib/utils';
import { moneySchema } from '@/lib/validation';
import { QueryError } from '@/components/ui/QueryError';
import type { Appointment, PaymentMethod } from '@/features/appointments/api/appointments.api';
import { financeApi, localDateTime, methodLabels } from './finance.api';

type PaymentPart = { id: string; method: PaymentMethod; amount: number };
const methods = Object.keys(methodLabels) as PaymentMethod[];
// Match the label/field look of the shared Input component.
const fieldLabel = 'text-xs font-medium uppercase tracking-wide text-text-light';
const fieldSelect =
  'mt-1.5 min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-text';

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3">
      <dt className="text-text-muted">{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

export function PaymentModal({
  appointment,
  onClose,
}: {
  appointment: Appointment;
  onClose: () => void;
}) {
  const t = useTranslations('finance');
  const tc = useTranslations('common');
  const qc = useQueryClient();
  const account = useQuery({
    queryKey: ['finance', 'customer', appointment.customerId],
    queryFn: () => financeApi.customer(appointment.customerId),
    // Money decisions must use the current open amount, never a cached one.
    refetchOnMount: 'always',
  });
  const current = account.data?.appointments.find((a) => a.id === appointment.id);
  const remaining = current?.remaining ?? appointment.remaining ?? appointment.total;
  const [parts, setParts] = useState<PaymentPart[]>([
    { id: crypto.randomUUID(), method: 'PIX', amount: remaining },
  ]);
  const [credit, setCredit] = useState(0);
  // If the open amount changes after a refetch, re-prefill a single payment row with it.
  const [prefilledFor, setPrefilledFor] = useState(remaining);
  if (prefilledFor !== remaining) {
    setPrefilledFor(remaining);
    setCredit(0);
    if (parts.length === 1) setParts((rows) => [{ ...rows[0]!, amount: remaining }]);
  }
  const [excess, setExcess] = useState<'CHANGE' | 'CREDIT'>('CHANGE');
  const [date, setDate] = useState(localDateTime);
  const [requestId] = useState(() => crypto.randomUUID());
  const available = account.data?.credit ?? 0;
  const received =
    Math.round(
      parts.reduce((sum, part) => sum + (Number.isFinite(part.amount) ? part.amount : 0), 0) * 100,
    ) / 100;
  const surplus = Math.max(0, Math.round((received + credit - remaining) * 100) / 100);
  const pending = Math.max(0, Math.round((remaining - received - credit) * 100) / 100);
  // Credit may only cover what the payments leave open; otherwise the surplus is the credit itself.
  const creditRoom = Math.max(0, Math.round((remaining - received) * 100) / 100);
  const creditTooHigh = credit > 0 && Math.round(credit * 100) > Math.round(creditRoom * 100);
  const changeCredit = (value: number) => {
    const next = Math.max(0, Math.min(value, available, remaining));
    setCredit(next);
    // Using credit only settles part of the debt; it does not assume the rest is paid now.
    // Clear the single payment row (fill it only if the customer pays more), and restore
    // the full prefill when credit goes back to zero.
    if (parts.length === 1) setParts((rows) => [{ ...rows[0]!, amount: next > 0 ? 0 : remaining }]);
  };
  const usedMethods = new Set(parts.map((part) => part.method));
  const updatePart = (id: string, patch: Partial<PaymentPart>) =>
    setParts((rows) => rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  const save = useMutation({
    mutationFn: () =>
      financeApi.pay(appointment.id, {
        requestId,
        payments: parts
          .filter((part) => part.amount > 0)
          .map(({ amount, method }) => ({ amount, method })),
        useCredit: credit,
        excess,
        occurredAt: new Date(date).toISOString(),
      }),
    onSuccess: () => {
      void qc.invalidateQueries();
      toast.success(t('paymentSaved'));
      onClose();
    },
  });
  const valid =
    !!account.data &&
    !!current &&
    parts.every((part) => moneySchema.safeParse(part.amount).success) &&
    new Set(parts.map((part) => part.method)).size === parts.length &&
    moneySchema.safeParse(credit).success &&
    credit >= 0 &&
    credit <= available &&
    credit <= remaining &&
    !creditTooHigh &&
    received + credit > 0 &&
    !!date &&
    Number.isFinite(new Date(date).getTime());

  return (
    <Modal
      open
      title={t('recordPayment')}
      onClose={onClose}
      busy={save.isPending}
      size="lg"
      footer={
        <Button
          variant="primary"
          onClick={() =>
            valid && new Date(date).getTime() <= Date.now() + 60000
              ? save.mutate()
              : toast.error(t('checkPayment'))
          }
          disabled={save.isPending || account.isFetching}
        >
          {t('confirmPayment')}
        </Button>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-text-muted">
          {appointment.customerName} · {t('appointmentValue')} {money(appointment.total)}
        </p>
        {account.isError && <QueryError onRetry={() => account.refetch()} />}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-900">
            {t('outstanding')}
            <strong className="block text-xl">{money(remaining)}</strong>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-900">
            {t('availableCredit')}
            <strong className="block text-xl">{money(available)}</strong>
          </div>
        </div>

        <fieldset className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <legend className="text-sm font-medium">{t('paymentMethods')}</legend>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={parts.length >= methods.length}
              onClick={() => {
                const method = methods.find((value) => !usedMethods.has(value));
                if (method)
                  setParts((rows) => [...rows, { id: crypto.randomUUID(), method, amount: 0 }]);
              }}
            >
              <Plus size={14} />
              {t('addMethod')}
            </Button>
          </div>
          {parts.map((part, index) => (
            <div
              key={part.id}
              className={
                parts.length > 1
                  ? 'grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 rounded-xl border border-border p-3 sm:grid-cols-[minmax(0,1fr)_minmax(110px,1fr)_auto]'
                  : 'grid grid-cols-1 items-end gap-3 rounded-xl border border-border p-3 sm:grid-cols-2'
              }
            >
              <label className="col-span-2 min-w-0 sm:col-span-1">
                <span className={fieldLabel}>{t('methodLabel')}</span>
                <select
                  value={part.method}
                  onChange={(event) =>
                    updatePart(part.id, {
                      method: event.target.value as PaymentMethod,
                    })
                  }
                  className={fieldSelect}
                >
                  {methods.map((value) => (
                    <option
                      key={value}
                      value={value}
                      disabled={value !== part.method && usedMethods.has(value)}
                    >
                      {t(`methods.${value}`)}
                    </option>
                  ))}
                </select>
              </label>
              <MoneyInput
                label={t('amount')}
                min="0"
                value={part.amount}
                onValueChange={(value) => updatePart(part.id, { amount: Number(value) })}
              />
              {/* Only removable when there is more than one method. */}
              {parts.length > 1 && (
                <button
                  type="button"
                  aria-label={t('removeMethod')}
                  onClick={() => setParts((rows) => rows.filter((row) => row.id !== part.id))}
                  className="mb-0.5 grid size-10 place-items-center rounded-lg text-text-light transition-colors hover:bg-rose-50 hover:text-danger"
                >
                  <Trash2 size={16} />
                </button>
              )}
              {index === 0 && parts.length > 1 && (
                <p className="col-span-full text-[11px] text-text-muted">{t('splitHint')}</p>
              )}
            </div>
          ))}
        </fieldset>

        <MoneyInput
          label={`${t('useCredit')} (${tc('optional')})`}
          min="0"
          max={Math.min(remaining, available)}
          value={credit}
          error={creditTooHigh ? t('creditTooHigh', { value: money(creditRoom) }) : undefined}
          onValueChange={(value) => changeCredit(Number(value) || 0)}
        />
        <Input
          required
          label={t('paymentDate')}
          type="datetime-local"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        {surplus > 0 && (
          <label className="block">
            <span className={fieldLabel}>{t('surplus', { value: money(surplus) })}</span>
            <select
              value={excess}
              onChange={(event) => setExcess(event.target.value as 'CHANGE' | 'CREDIT')}
              className={fieldSelect}
            >
              <option value="CHANGE">{t('returnChange')}</option>
              <option value="CREDIT">{t('saveCredit')}</option>
            </select>
          </label>
        )}
        <dl className="space-y-2 rounded-xl bg-bg p-4 text-sm">
          <SummaryRow label={t('receivedNow')} value={money(received)} />
          {credit > 0 && <SummaryRow label={t('creditUsed')} value={money(credit)} />}
          <SummaryRow
            label={t('cashEntry')}
            value={money(received - (excess === 'CHANGE' ? surplus : 0))}
          />
          <SummaryRow
            label={t('creditAfter')}
            value={money(available - credit + (excess === 'CREDIT' ? surplus : 0))}
          />
          {/* The number that matters most: what is still owed after this payment. */}
          <div
            className={`mt-1 flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 ${
              pending > 0 ? 'bg-amber-50 text-amber-900' : 'bg-emerald-50 text-emerald-900'
            }`}
          >
            <dt className="font-medium">{t('remainingOpen')}</dt>
            <dd className="text-base font-bold tabular-nums">{money(pending)}</dd>
          </div>
        </dl>
        <p className="text-xs text-text-muted">{t('creditHint')}</p>
      </div>
    </Modal>
  );
}
