import { api } from "@/lib/api";

export type PaymentStatus = "PAID" | "PENDING";
export type PaymentMethod = "PIX" | "CARD" | "CASH" | "OTHER";

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
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  items: AppointmentItem[];
}
export interface AppointmentsListResponse {
  data: Appointment[];
  total: number;
  totalPending: number;
}
export interface AppointmentsParams {
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
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  items: { serviceId: string; professionalId: string }[];
}
export type UpdateAppointmentPayload = Omit<
  Partial<CreateAppointmentPayload>,
  "customerId"
>;

export const appointmentsApi = {
  list: (params?: AppointmentsParams) =>
    api.get<AppointmentsListResponse>("/appointments", { params }),
  create: (data: CreateAppointmentPayload) =>
    api.post<Appointment>("/appointments", data),
  update: (id: string, data: UpdateAppointmentPayload) =>
    api.patch<Appointment>(`/appointments/${id}`, data),
  remove: (id: string) => api.delete(`/appointments/${id}`),
};
