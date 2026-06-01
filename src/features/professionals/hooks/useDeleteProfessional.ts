import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { professionalsApi } from '../api/professionals.api'
import { professionalsKeys } from './useProfessionals'

export const useDeleteProfessional = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => professionalsApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: professionalsKeys.all }); toast.success('Profissional removido.') },
  })
}
