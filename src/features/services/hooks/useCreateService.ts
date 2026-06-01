import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { servicesApi, type CreateServicePayload } from '../api/services.api'
import { servicesKeys } from './useServices'

export const useCreateService = (onSuccess?: () => void) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateServicePayload) => servicesApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: servicesKeys.all }); toast.success('Serviço cadastrado!'); onSuccess?.() },
  })
}
