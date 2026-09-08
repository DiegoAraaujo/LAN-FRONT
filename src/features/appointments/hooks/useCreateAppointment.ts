import { clientMessage } from '@/lib/messages'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { appointmentsApi, type Appointment, type CreateAppointmentPayload } from '../api/appointments.api'
import { appointmentsKeys } from './useAppointments'

export const useCreateAppointment = (onSuccess?: (appointment: Appointment) => void) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAppointmentPayload) => appointmentsApi.create(data),
    onSuccess: ({ data }) => { qc.invalidateQueries({ queryKey: ["finance"] }); qc.invalidateQueries({ queryKey: appointmentsKeys.all }); qc.invalidateQueries({ queryKey: ['dashboard'] }); qc.invalidateQueries({ queryKey: ['customers'] }); toast.success(clientMessage('Atendimento registrado!')); onSuccess?.(data) },
  })
}
