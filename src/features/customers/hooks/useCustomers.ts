import { useQuery } from '@tanstack/react-query'
import { customersApi, type CustomersParams } from '../api/customers.api'

export const customersKeys = {
  all:       ['customers'] as const,
  list:      (p: CustomersParams) => [...customersKeys.all, 'list', p] as const,
  dashboard: ()                   => [...customersKeys.all, 'dashboard'] as const,
}

export const useCustomers = (params: CustomersParams = {}) =>
  useQuery({ queryKey: customersKeys.list(params), queryFn: () => customersApi.list(params).then(r => r.data) })

export const useCustomersDashboard = () =>
  useQuery({ queryKey: customersKeys.dashboard(), queryFn: () => customersApi.dashboard().then(r => r.data) })
