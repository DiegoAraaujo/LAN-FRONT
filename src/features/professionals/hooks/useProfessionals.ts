import { useQuery } from '@tanstack/react-query'
import { professionalsApi } from '../api/professionals.api'

export const professionalsKeys = {
  all:  ['professionals'] as const,
  list: (s?: string) => [...professionalsKeys.all, 'list', s] as const,
}

export const useProfessionals = (search?: string) =>
  useQuery({ queryKey: professionalsKeys.list(search), queryFn: () => professionalsApi.list(search).then(r => r.data) })
