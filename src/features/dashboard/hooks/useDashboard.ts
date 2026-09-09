import { useQuery } from '@tanstack/react-query'
import { dashboardApi, type DashboardFilters } from '../api/dashboard.api'

export const useDashboard = (params?: DashboardFilters, enabled = true) =>
  useQuery({
    queryKey: ['dashboard', params],
    enabled,
    queryFn:  () => dashboardApi.get(params).then(r => r.data),
  })
