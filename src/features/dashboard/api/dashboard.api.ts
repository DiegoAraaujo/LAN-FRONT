import { api } from '@/lib/api'

export interface DashboardData {
  cards:           { totalAppointments: number; totalRevenue: number }
  evolutionGraph:  { month: string; revenue: number }[]
  servicesPieGraph:{ serviceName: string; revenue: number }[]
}

export const dashboardApi = {
  get: (params?: { year?: number; month?: number }) =>
    api.get<DashboardData>('/dashboard/', { params }),
}
