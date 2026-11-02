import { recordIdSchema, searchSchema } from '@/lib/query-validation';
import { validatePayload } from '@/lib/validate-payload';
import {
  createAppointmentBodySchema,
  updateAppointmentBodySchema,
} from '../schemas/appointment.schemas';
import type { PaymentInput } from '@/features/finance/finance.api';
import { api } from '@/lib/api';

export type PaymentStatus = 'PAID' | 'PENDING' | 'PARTIAL';
export type PaymentMethod = 'PIX' | 'DEBIT_CARD' | 'CREDIT_CARD' | 'CASH' | 'OTHER';

export interface AppointmentItem {
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  value: number;
}
export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  appointmentDate: string;
  subtotal: number;
  discount: number;
  total: number;
  paidAmount: number;
  remaining: number;
  paidAt?: string | null;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  paymentMethods?: PaymentMethod[];
  usesCredit?: boolean;
  notes?: string;
  items: AppointmentItem[];
}
export interface AppointmentsListResponse {
  data: Appointment[];
  total: number;
  totalPending: number;
  summary: { totalValue: number; paidValue: number; pendingValue: number; serviceValue: number };
}
export interface AppointmentsParams {
  openOnly?: 'true';
  serviceId?: string;
  serviceIds?: string;
  professionalId?: string;
  customerId?: string;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  dateType?: 'appointment' | 'payment';
  search?: string;
  paymentStatus?: PaymentStatus;
  year?: number;
  month?: number;
  page?: number;
  limit?: number;
}
export interface CreateAppointmentPayload {
  customerId: string;
  appointmentDate: string;
  discount?: number;
  initialPayment?: PaymentInput;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  notes?: string;
  items: { serviceId: string; professionalId: string }[];
}
export type UpdateAppointmentPayload = Omit<
  Partial<CreateAppointmentPayload>,
  'customerId' | 'paymentStatus' | 'paymentMethod' | 'initialPayment'
>;

export const appointmentsApi = {
  list: (params?: AppointmentsParams) =>
    api.get<AppointmentsListResponse>('/appointments', {
      params: validatePayload(searchSchema, params ?? {}),
    }),
  create: (data: CreateAppointmentPayload) =>
    api.post<Appointment>('/appointments', validatePayload(createAppointmentBodySchema, data)),
  update: (id: string, data: UpdateAppointmentPayload) =>
    api.patch<Appointment>(
      `/appointments/${validatePayload(recordIdSchema, id)}`,
      validatePayload(updateAppointmentBodySchema, data),
    ),
  remove: (id: string) => api.delete(`/appointments/${validatePayload(recordIdSchema, id)}`),
};
