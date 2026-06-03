import { useQuery } from '@tanstack/react-query'
import { professionalsByServiceApi } from '../api/professionals.api'

export const useProfessionalsByService = (serviceId?: string) =>
  useQuery({
    queryKey: ['professionals', 'by-service', serviceId],
    queryFn:  () => professionalsByServiceApi.list(serviceId!).then(r => r.data),
    enabled:  !!serviceId,
  })
