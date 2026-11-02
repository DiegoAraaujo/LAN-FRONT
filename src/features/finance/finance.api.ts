import { recordIdSchema, financeQuerySchema } from '@/lib/query-validation';
import { validatePayload } from '@/lib/validate-payload';
import { entrySchema, paymentSchema, reversalSchema, settlementSchema } from './finance.schemas';
import { api } from '@/lib/api';
import type { Appointment, PaymentMethod } from '@/features/appointments/api/appointments.api';
export interface FinanceEntry {
  id: string;
  kind: string;
  status: string;
  description: string;
  category: string;
  cashCents: number;
  creditCents: number;
  appliedCents: number;
  occurredAt: string;
  dueAt: string | null;
  method: PaymentMethod | null;
  appointmentId: string | null;
  customerId: string | null;
  customer?: { name: string } | null;
  appointment?: { appointmentDate: string } | null;
  reversal?: { id: string } | null;
}
export interface CustomerAccount {
  credit: number;
  outstanding: number;
  appointments: Appointment[];
  history: FinanceEntry[];
}
export interface CashSummary {
  opening: number;
  incoming: number;
  outgoing: number;
  balance: number;
  receivable: number;
  payable: number;
}
export interface CashResponse {
  data: FinanceEntry[];
  total: number;
  summary: CashSummary;
}
export interface PaymentInput {
  requestId: string;
  payments: { amount: number; method: PaymentMethod }[];
  useCredit: number;
  excess: 'CHANGE' | 'CREDIT';
  occurredAt: string;
}
export interface EntryInput {
  requestId: string;
  kind: string;
  amount: number;
  status: string;
  customerId?: string;
  description: string;
  category: string;
  method: PaymentMethod;
  occurredAt: string;
}
export const financeApi = {
  customer: (id: string) =>
    api
      .get<CustomerAccount>(`/finance/customers/${validatePayload(recordIdSchema, id)}`)
      .then((r) => r.data),
  list: (params: Record<string, string | number | undefined>) =>
    api
      .get<CashResponse>('/finance', { params: validatePayload(financeQuerySchema, params) })
      .then((r) => r.data),
  pay: (id: string, data: PaymentInput) =>
    api.post(
      `/finance/appointments/${validatePayload(recordIdSchema, id)}/payments`,
      validatePayload(paymentSchema, data),
    ),
  create: (data: EntryInput) => api.post('/finance', validatePayload(entrySchema, data)),
  reverse: (id: string, reason: string) =>
    api.post(
      `/finance/${validatePayload(recordIdSchema, id)}/reverse`,
      validatePayload(reversalSchema, { reason }),
    ),
  settle: (id: string) =>
    api.post(
      `/finance/${validatePayload(recordIdSchema, id)}/settle`,
      validatePayload(settlementSchema, { occurredAt: new Date().toISOString() }),
    ),
};
export const localDateTime = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
export const methodLabels: Record<PaymentMethod, string> = {
  PIX: 'Pix',
  CASH: 'Dinheiro',
  DEBIT_CARD: 'Débito',
  CREDIT_CARD: 'Crédito',
  OTHER: 'Outro',
};
