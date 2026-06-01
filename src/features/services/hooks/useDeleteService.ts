import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { servicesApi } from '../api/services.api'
import { servicesKeys } from './useServices'

export const useDeleteService = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => servicesApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: servicesKeys.all }); toast.success('Serviço removido.') },
  })
}
