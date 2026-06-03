import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { professionalsApi, type UpdateProfessionalPayload } from '../api/professionals.api'
import { professionalsKeys } from './useProfessionals'

export const useUpdateProfessional = (onSuccess?: () => void) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProfessionalPayload }) => professionalsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: professionalsKeys.all }); toast.success('Profissional atualizado!'); onSuccess?.() },
  })
}
