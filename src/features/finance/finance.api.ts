import { api } from '@/lib/api'
import type { Appointment, PaymentMethod } from '@/features/appointments/api/appointments.api'
export interface FinanceEntry {
  id: string; kind: string; status: string; description: string; category: string;
  cashCents: number; creditCents: number; appliedCents: number; occurredAt: string; dueAt: string | null;
  method: PaymentMethod | null; appointmentId: string | null; customerId: string | null;
  customer?: { name: string } | null; reversal?: { id: string } | null;
}
export interface CustomerAccount { credit: number; outstanding: number; appointments: Appointment[]; history: FinanceEntry[] }
export interface CashSummary { opening: number; incoming: number; outgoing: number; balance: number; receivable: number; payable: number }
export interface CashResponse { data: FinanceEntry[]; total: number; summary: CashSummary }
export interface PaymentInput { requestId: string; received: number; useCredit: number; excess: 'CHANGE' | 'CREDIT'; method: PaymentMethod; occurredAt: string }
export interface EntryInput { requestId: string; kind: string; amount: number; status: string; customerId?: string; description: string; category: string; method: PaymentMethod; occurredAt: string }
export const financeApi = {
  customer: (id: string) => api.get<CustomerAccount>(`/finance/customers/${id}`).then(r => r.data),
  list: (params: Record<string, string | number | undefined>) => api.get<CashResponse>('/finance', { params }).then(r => r.data),
  pay: (id: string, data: PaymentInput) => api.post(`/finance/appointments/${id}/payments`, data),
  create: (data: EntryInput) => api.post('/finance', data),
  reverse: (id: string, reason: string) => api.post(`/finance/${id}/reverse`, { reason }),
  settle: (id: string) => api.post(`/finance/${id}/settle`, { occurredAt: new Date().toISOString() }),
}
export const localDateTime = () => {
  const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,16)
}
export const methodLabels: Record<PaymentMethod,string> = { PIX:'Pix', CASH:'Dinheiro', DEBIT_CARD:'Débito', CREDIT_CARD:'Crédito', OTHER:'Outro' }
