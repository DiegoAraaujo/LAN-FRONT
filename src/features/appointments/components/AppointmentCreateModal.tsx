'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Banknote, CheckCircle2, Clock3, Plus, ReceiptText, Scissors, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MoneyInput } from '@/components/ui/MoneyInput';
import { Textarea } from '@/components/ui/Textarea';
import { QueryError } from '@/components/ui/QueryError';
import { extractValidationErrors } from '@/lib/api';
import { moneySchema, notesSchema } from '@/lib/validation';
import { formatCurrency } from '@/lib/utils';
import { financeApi, localDateTime, methodLabels } from '@/features/finance/finance.api';
import { useServices } from '@/features/services/hooks/useServices';
import type { Customer } from '@/features/customers/api/customers.api';
import { appointmentsApi, type PaymentMethod } from '../api/appointments.api';
import { ClientSearchInput } from './ClientSearchInput';
import { AppointmentItemRow, type ItemRowData } from './AppointmentItemRow';
import { PaymentMethodSelector } from './PaymentMethodSelector';

type PaymentMode = 'SIMPLE' | 'CUSTOM' | 'PENDING';
type PaymentPart = { id: string; method: PaymentMethod; amount: number };
const methods = Object.keys(methodLabels) as PaymentMethod[];
const newItem = (): ItemRowData => ({ id: crypto.randomUUID(), serviceId: '', professionalId: '' });

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AppointmentCreateModal = ({ open, onClose }: Props) => {
  const t = useTranslations('appointments');
  const tf = useTranslations('finance');
  const tc = useTranslations('common');
  const e = useTranslations('experience');
  const qc = useQueryClient();
  const [client, setClient] = useState<Customer | null>(null);
  const [date, setDate] = useState(localDateTime);
  const [items, setItems] = useState<ItemRowData[]>(() => [newItem()]);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('SIMPLE');
  const [payment, setPayment] = useState<PaymentMethod>('PIX');
  const [parts, setParts] = useState<PaymentPart[]>([
    { id: crypto.randomUUID(), method: 'PIX', amount: 0 },
  ]);
  const [credit, setCredit] = useState(0);
  const [excess, setExcess] = useState<'CHANGE' | 'CREDIT'>('CHANGE');
  const [paymentDate, setPaymentDate] = useState(localDateTime);
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  const [attempted, setAttempted] = useState(false);
  const [formError, setFormError] = useState('');
  const { data: services = [], isError, refetch } = useServices();
  const account = useQuery({
    queryKey: ['finance', 'customer', client?.id],
    queryFn: () => financeApi.customer(client!.id),
    enabled: open && !!client,
  });

  const subtotal =
    Math.round(
      items.reduce(
        (sum, item) =>
          sum + (services.find((service) => service.id === item.serviceId)?.price ?? 0),
        0,
      ) * 100,
    ) / 100;
  const total = Math.max(0, Math.round((subtotal - discount) * 100) / 100);
  const received =
    Math.round(
      parts.reduce((sum, part) => sum + (Number.isFinite(part.amount) ? part.amount : 0), 0) * 100,
    ) / 100;
  const availableCredit = account.data?.credit ?? 0;
  const appliedCredit = paymentMode === 'PENDING' ? 0 : Math.min(credit, availableCredit, total);
  const simpleCash = Math.max(0, Math.round((total - appliedCredit) * 100) / 100);
  const surplus = Math.max(0, Math.round((received + appliedCredit - total) * 100) / 100);
  const remaining = Math.max(0, Math.round((total - received - appliedCredit) * 100) / 100);
  const usedMethods = new Set(parts.map((part) => part.method));
  const selectedServiceIds = items.map((item) => item.serviceId).filter(Boolean);
  const dateValid = !!date && Number.isFinite(new Date(date).getTime());
  const complete =
    !!client &&
    dateValid &&
    items.length > 0 &&
    items.every((item) => item.serviceId && item.professionalId);
  const discountValid =
    moneySchema.safeParse(discount).success && discount >= 0 && discount <= subtotal;
  const customPaymentValid =
    paymentMode !== 'CUSTOM' ||
    (!!account.data &&
      parts.every((part) => moneySchema.safeParse(part.amount).success) &&
      usedMethods.size === parts.length &&
      credit >= 0 &&
      appliedCredit <= availableCredit &&
      appliedCredit <= total &&
      received + appliedCredit > 0 &&
      !!paymentDate &&
      Number.isFinite(new Date(paymentDate).getTime()));

  const resetAndClose = () => {
    setClient(null);
    setDate(localDateTime());
    setItems([newItem()]);
    setDiscount(0);
    setNotes('');
    setPaymentMode('SIMPLE');
    setPayment('PIX');
    setParts([{ id: crypto.randomUUID(), method: 'PIX', amount: 0 }]);
    setRequestId(crypto.randomUUID());
    setCredit(0);
    setExcess('CHANGE');
    setPaymentDate(localDateTime());
    setAttempted(false);
    setFormError('');
    toast.dismiss('appointment-validation');
    onClose();
  };

  const save = useMutation({
    mutationFn: async () => {
      const hasInitialPayment =
        paymentMode === 'CUSTOM' || (paymentMode === 'SIMPLE' && appliedCredit > 0);
      const appointment = (
        await appointmentsApi.create({
          customerId: client!.id,
          appointmentDate: new Date(date).toISOString(),
          discount,
          paymentStatus: paymentMode === 'SIMPLE' && !hasInitialPayment ? 'PAID' : 'PENDING',
          paymentMethod: paymentMode === 'SIMPLE' && !hasInitialPayment ? payment : null,
          ...(hasInitialPayment
            ? {
                initialPayment: {
                  requestId,
                  payments:
                    paymentMode === 'CUSTOM'
                      ? parts
                          .filter((part) => part.amount > 0)
                          .map(({ amount, method }) => ({ amount, method }))
                      : simpleCash > 0
                        ? [{ amount: simpleCash, method: payment }]
                        : [],
                  useCredit: appliedCredit,
                  excess: paymentMode === 'CUSTOM' ? excess : ('CHANGE' as const),
                  occurredAt:
                    paymentMode === 'CUSTOM'
                      ? new Date(paymentDate).toISOString()
                      : new Date().toISOString(),
                },
              }
            : {}),
          notes: notes || undefined,
          items: items.map(({ serviceId, professionalId }) => ({ serviceId, professionalId })),
        })
      ).data;
      return appointment;
    },
    onSuccess: () => {
      void qc.invalidateQueries();
      toast.success(t('appointmentSaved'));
      resetAndClose();
    },
    onError: (error) => {
      const fields = extractValidationErrors(error);
      setFormError(Object.keys(fields).length ? e('formErrors') : e('loadError'));
    },
  });

  const submit = () => {
    setAttempted(true);
    setFormError('');
    if (!complete || !client) {
      toast.error(e('invalidAppointment'), { id: 'appointment-validation' });
      return;
    }
    if (!notesSchema.safeParse(notes).success || subtotal > 999999.99) {
      toast.error(e('formErrors'));
      return;
    }
    if (!discountValid) {
      toast.error(e('invalidDiscount'), { id: 'appointment-validation' });
      return;
    }
    if (
      !customPaymentValid ||
      (paymentMode === 'CUSTOM' && new Date(paymentDate).getTime() > Date.now() + 60000)
    ) {
      toast.error(tf('checkPayment'), { id: 'appointment-validation' });
      return;
    }
    toast.dismiss('appointment-validation');
    save.mutate();
  };

  const paymentOptions: {
    value: PaymentMode;
    icon: React.ReactNode;
    title: string;
    detail: string;
  }[] = [
    {
      value: 'SIMPLE',
      icon: <Banknote size={17} />,
      title: t('simplePayment'),
      detail: t('simplePaymentHint'),
    },
    {
      value: 'CUSTOM',
      icon: <ReceiptText size={17} />,
      title: t('customPayment'),
      detail: t('customPaymentHint'),
    },
    {
      value: 'PENDING',
      icon: <Clock3 size={17} />,
      title: t('leavePending'),
      detail: t('leavePendingHint'),
    },
  ];

  return (
    <Modal open={open} onClose={resetAndClose} busy={save.isPending} size="2xl" title={t('title')}>
      <div className="space-y-5">
        <div className="space-y-4">
          {isError && <QueryError onRetry={() => refetch()} />}
          {formError && (
            <p
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-danger"
            >
              {formError}
            </p>
          )}
          <section className="rounded-2xl border border-border p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 font-bold text-emerald-700">
                1
              </span>
              <div>
                <h3 className="font-semibold">{t('clientSelection')}</h3>
                <p className="text-xs text-text-muted">{t('clientAndDateHint')}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ClientSearchInput
                selected={client}
                onSelect={(customer) => {
                  if (customer?.id !== client?.id) setCredit(0);
                  setClient(customer);
                }}
                error={attempted && !client ? e('selectCustomer') : undefined}
              />
              <Input
                required
                label={t('appointmentDate')}
                type="datetime-local"
                value={date}
                error={attempted && !dateValid ? e('requiredDate') : undefined}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
          </section>
          <section className="rounded-2xl border border-border p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-700">
                  <Scissors size={16} />
                </span>
                <div>
                  <h3 className="font-semibold">{t('servicesProvided')}</h3>
                  <p className="text-xs text-text-muted">{t('servicesHint')}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setItems((rows) => [...rows, newItem()])}
                disabled={
                  items.length >= 50 ||
                  items.length >= services.length ||
                  items.some((item) => !item.serviceId || !item.professionalId)
                }
              >
                <Plus size={13} />
                {t('addItem')}
              </Button>
            </div>
            <div className="space-y-3">
              {items.map((item) => (
                <AppointmentItemRow
                  key={item.id}
                  item={item}
                  services={services}
                  usedServiceIds={selectedServiceIds.filter((id) => id !== item.serviceId)}
                  showRemove={items.length > 1}
                  showErrors={attempted}
                  onChange={(id, field, value) =>
                    setItems((rows) =>
                      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
                    )
                  }
                  onRemove={(id) => setItems((rows) => rows.filter((row) => row.id !== id))}
                />
              ))}
            </div>
            <Textarea
              maxLength={2000}
              label={`${t('notes')} (${tc('optional')})`}
              placeholder={t('notesPlaceholder')}
              className="mt-4 min-h-20"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </section>
          <section className="rounded-2xl border border-border p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-blue-50 font-bold text-blue-700">
                3
              </span>
              <div>
                <h3 className="font-semibold">{t('payment')}</h3>
                <p className="text-xs text-text-muted">{t('paymentChoiceHint')}</p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {paymentOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setPaymentMode(option.value)}
                  className={`rounded-xl border p-3 text-left transition-colors ${paymentMode === option.value ? 'border-gold bg-amber-50 ring-1 ring-gold' : 'border-border hover:bg-bg'}`}
                >
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    {option.icon}
                    {option.title}
                  </span>
                  <span className="block text-xs text-text-muted">{option.detail}</span>
                </button>
              ))}
            </div>
            {client && paymentMode !== 'PENDING' && (
              <div className="mt-4 space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                {account.isError ? (
                  <QueryError onRetry={() => account.refetch()} />
                ) : account.isLoading ? (
                  <p role="status" className="text-sm text-text-muted">
                    {tc('loading')}
                  </p>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm">
                        {tf('availableCredit')}: <strong>{formatCurrency(availableCredit)}</strong>
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        disabled={availableCredit <= 0 || total <= 0}
                        onClick={() => setCredit(Math.min(total, availableCredit))}
                      >
                        {t('applyCredit')}
                      </Button>
                    </div>
                    {availableCredit > 0 && (
                      <MoneyInput
                        label={`${tf('useCredit')} (${tc('optional')})`}
                        min="0"
                        max={Math.min(total, availableCredit)}
                        value={appliedCredit}
                        onValueChange={(value) =>
                          setCredit(Math.min(Number(value), total, availableCredit))
                        }
                      />
                    )}
                    {appliedCredit > 0 && (
                      <p className="text-sm font-medium text-emerald-800">
                        {t(
                          paymentMode === 'SIMPLE' && simpleCash === 0
                            ? 'coveredByCredit'
                            : 'creditAppliedAtCheckout',
                        )}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
            {paymentMode === 'SIMPLE' && simpleCash > 0 && (
              <div className="mt-4 rounded-xl bg-bg p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  {t('paymentMethod')}
                </p>
                <PaymentMethodSelector value={payment} onChange={setPayment} />
              </div>
            )}
            {paymentMode === 'CUSTOM' && (
              <div className="mt-4 space-y-3 rounded-xl bg-bg p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{tf('paymentMethods')}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={parts.length >= methods.length}
                    onClick={() => {
                      const method = methods.find((value) => !usedMethods.has(value));
                      if (method)
                        setParts((rows) => [
                          ...rows,
                          { id: crypto.randomUUID(), method, amount: 0 },
                        ]);
                    }}
                  >
                    <Plus size={13} />
                    {tf('addMethod')}
                  </Button>
                </div>
                {parts.map((part) => (
                  <div
                    key={part.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2 sm:grid-cols-[minmax(0,1fr)_120px_auto]"
                  >
                    <label className="col-span-2 min-w-0 text-xs text-text-muted sm:col-span-1">
                      {tf('methodLabel')}
                      <select
                        value={part.method}
                        onChange={(event) =>
                          setParts((rows) =>
                            rows.map((row) =>
                              row.id === part.id
                                ? { ...row, method: event.target.value as PaymentMethod }
                                : row,
                            ),
                          )
                        }
                        className="mt-1 min-h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm"
                      >
                        {methods.map((value) => (
                          <option
                            key={value}
                            value={value}
                            disabled={value !== part.method && usedMethods.has(value)}
                          >
                            {tf(`methods.${value}`)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <MoneyInput
                      label={tf('amount')}
                      min="0"
                      value={part.amount}
                      onValueChange={(value) =>
                        setParts((rows) =>
                          rows.map((row) =>
                            row.id === part.id ? { ...row, amount: Number(value) } : row,
                          ),
                        )
                      }
                    />
                    <button
                      type="button"
                      aria-label={tf('removeMethod')}
                      disabled={parts.length === 1}
                      onClick={() => setParts((rows) => rows.filter((row) => row.id !== part.id))}
                      className="mb-1 grid size-10 place-items-center rounded-lg text-danger hover:bg-rose-50 disabled:opacity-30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <Input
                  required
                  label={tf('paymentDate')}
                  type="datetime-local"
                  value={paymentDate}
                  onChange={(event) => setPaymentDate(event.target.value)}
                />
                {surplus > 0 && (
                  <label className="block text-sm">
                    {tf('surplus', { value: formatCurrency(surplus) })}
                    <select
                      value={excess}
                      onChange={(event) => setExcess(event.target.value as 'CHANGE' | 'CREDIT')}
                      className="mt-1 w-full rounded-lg border border-border bg-surface p-3"
                    >
                      <option value="CHANGE">{tf('returnChange')}</option>
                      <option value="CREDIT">{tf('saveCredit')}</option>
                    </select>
                  </label>
                )}
              </div>
            )}
          </section>
        </div>
        <section className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-bg/60 p-4">
          <h3 className="mb-3 text-sm font-semibold text-text">{t('orderSummary')}</h3>
          <div className="grid items-end gap-3 sm:grid-cols-[1fr_160px_1fr]">
            <div>
              <p className="text-xs text-text-muted">{t('subtotal')}</p>
              <p className="mt-1 text-base font-semibold tabular-nums text-text">
                {formatCurrency(subtotal)}
              </p>
            </div>
            <MoneyInput
              label={`${t('discount')} (${tc('optional')})`}
              min="0"
              max={subtotal}
              value={discount}
              error={attempted && !discountValid ? e('invalidDiscount') : undefined}
              onValueChange={(value) => setDiscount(Number(value))}
            />
            <div className="sm:text-right">
              <p className="text-xs text-text-muted">{t('total')}</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-emerald-700">
                {formatCurrency(total)}
              </p>
            </div>
          </div>
          {paymentMode === 'SIMPLE' && appliedCredit > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-3 text-xs text-text-muted">
              <span>
                {tf('creditUsed')}: <strong>{formatCurrency(appliedCredit)}</strong>
              </span>
              <span>
                {t('remainingToPay')}: <strong>{formatCurrency(simpleCash)}</strong>
              </span>
            </div>
          )}
          {paymentMode === 'CUSTOM' && (
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-3 text-xs text-text-muted">
              <span>
                {tf('informedTotal')}:{' '}
                <strong className="text-text">{formatCurrency(received + appliedCredit)}</strong>
              </span>
              <span>
                {tf('remainingOpen')}:{' '}
                <strong className="text-text">{formatCurrency(remaining)}</strong>
              </span>
            </div>
          )}
        </section>
        <div className="flex justify-end border-t border-border pt-4">
          <Button
            variant="primary"
            className="w-full justify-center sm:w-auto"
            disabled={save.isPending || isError}
            onClick={submit}
          >
            <CheckCircle2 size={16} />
            {save.isPending ? t('finalizing') : t('finalize')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
