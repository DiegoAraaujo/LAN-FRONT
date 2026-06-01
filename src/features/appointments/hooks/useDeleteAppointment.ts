import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { appointmentsApi } from '../api/appointments.api'
import { appointmentsKeys } from './useAppointments'

export const useDeleteAppointment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => appointmentsApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: appointmentsKeys.all }); toast.success('Atendimento removido.') },
  })
}
