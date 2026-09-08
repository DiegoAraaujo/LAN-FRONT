import { clientMessage } from '@/lib/messages'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { appointmentsApi, type CreateAppointmentPayload } from '../api/appointments.api'
import { appointmentsKeys } from './useAppointments'

export const useCreateAppointment = (onSuccess?: () => void) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAppointmentPayload) => appointmentsApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: appointmentsKeys.all }); qc.invalidateQueries({ queryKey: ['dashboard'] }); qc.invalidateQueries({ queryKey: ['customers'] }); toast.success(clientMessage('Atendimento registrado!')); onSuccess?.() },
  })
}
