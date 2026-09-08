import { clientMessage } from '@/lib/messages'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { professionalsApi, type CreateProfessionalPayload } from '../api/professionals.api'
import { professionalsKeys } from './useProfessionals'

export const useCreateProfessional = (onSuccess?: () => void) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProfessionalPayload) => professionalsApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: professionalsKeys.all }); qc.invalidateQueries({ queryKey: ['dashboard'] }); qc.invalidateQueries({ queryKey: ['customers', 'dashboard'] }); toast.success(clientMessage('Profissional cadastrado!')); onSuccess?.() },
  })
}
