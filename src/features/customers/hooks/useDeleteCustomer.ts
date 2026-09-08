import { clientMessage } from '@/lib/messages'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { customersApi } from '../api/customers.api'
import { customersKeys } from './useCustomers'

export const useDeleteCustomer = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => customersApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: customersKeys.all }); qc.invalidateQueries({ queryKey: ['dashboard'] }); qc.invalidateQueries({ queryKey: ['customers', 'dashboard'] }); toast.success(clientMessage('Cliente removido.')) },
  })
}
