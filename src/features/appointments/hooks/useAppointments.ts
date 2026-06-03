import { useQuery } from '@tanstack/react-query'
import { appointmentsApi, type AppointmentsParams } from '../api/appointments.api'

export const appointmentsKeys = {
  all:  ['appointments'] as const,
  list: (p: AppointmentsParams) => [...appointmentsKeys.all, 'list', p] as const,
}

export const useAppointments = (params: AppointmentsParams = {}) =>
  useQuery({ queryKey: appointmentsKeys.list(params), queryFn: () => appointmentsApi.list(params).then(r => r.data) })
