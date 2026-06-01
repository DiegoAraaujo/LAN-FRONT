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
      qc.invalidateQueries({ queryKey: appointmentsKeys.all })
      toast.success('Atendimento atualizado!')
      onSuccess?.()
    },
  })
}
