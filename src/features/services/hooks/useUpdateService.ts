import { clientMessage } from '@/lib/messages'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { servicesApi, type UpdateServicePayload } from '../api/services.api'
import { servicesKeys } from './useServices'

export const useUpdateService = (onSuccess?: () => void) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServicePayload }) => servicesApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: servicesKeys.all }); qc.invalidateQueries({ queryKey: ['dashboard'] }); qc.invalidateQueries({ queryKey: ['customers', 'dashboard'] }); toast.success(clientMessage('Serviço atualizado!')); onSuccess?.() },
  })
}
