import { useQuery } from '@tanstack/react-query'
import { servicesApi } from '../api/services.api'

export const servicesKeys = {
  all:  ['services'] as const,
  list: (s?: string) => [...servicesKeys.all, 'list', s] as const,
}

export const useServices = (search?: string) =>
  useQuery({ queryKey: servicesKeys.list(search), queryFn: () => servicesApi.list(search).then(r => r.data) })
