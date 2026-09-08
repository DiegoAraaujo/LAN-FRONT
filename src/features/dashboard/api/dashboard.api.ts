import { api } from '@/lib/api'
export interface DashboardCards {
  totalAppointments: number; paidCount: number; pendingCount: number; totalRevenue: number;
  pendingRevenue: number; totalValue: number; averageTicket: number; newCustomers: number;
}
export interface DashboardAppointment {
  id: string; customerId: string; paidAmount: number; remaining: number; customerName: string; appointmentDate: string; total: number;
  paymentStatus: 'PAID' | 'PENDING' | 'PARTIAL'; services: string[];
}
export interface DashboardData {
  cards: DashboardCards;
  previous: Omit<DashboardCards, 'newCustomers'>;
  comparison: { totalValue: number | null; revenue: number | null; appointments: number | null; averageTicket: number | null };
  evolutionGraph: { month: string; revenue: number; pending: number }[];
  servicesPieGraph: { serviceName: string; count: number; revenue: number }[];
  professionals: { name: string; count: number; revenue: number }[];
  customers: { name: string; count: number; revenue: number }[];
  paymentMethods: { method: string; count: number; revenue: number }[];
  recentAppointments: DashboardAppointment[]; pendingAppointments: DashboardAppointment[];
}
export const dashboardApi = {
  get: (params?: { year?: number; month?: number }) => api.get<DashboardData>('/dashboard/', { params }),
}
