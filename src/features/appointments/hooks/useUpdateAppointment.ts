import { clientMessage } from '@/lib/messages'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { appointmentsApi, type UpdateAppointmentPayload } from '../api/appointments.api'
import { appointmentsKeys } from './useAppointments'

export const useUpdateAppointment = (onSuccess?: () => void) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentPayload }) =>
      appointmentsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentsKeys.all }); qc.invalidateQueries({ queryKey: ['dashboard'] }); qc.invalidateQueries({ queryKey: ['customers'] })
      toast.success(clientMessage('Atendimento atualizado!'))
      onSuccess?.()
    },
  })
}
