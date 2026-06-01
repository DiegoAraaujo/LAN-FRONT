import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboard.api'

export const useDashboard = (params?: { year?: number; month?: number }) =>
  useQuery({
    queryKey: ['dashboard', params],
    queryFn:  () => dashboardApi.get(params).then(r => r.data),
  })
