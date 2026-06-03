import { api } from '@/lib/api'

export type ContactType = 'WHATSAPP' | 'INSTAGRAM'

export interface CustomerContact {
  type:  ContactType
  value: string
}

export interface Customer {
  id:                 string
  name:               string
  phone:              string
  address?:           string | null
  status:             'ACTIVE' | 'INACTIVE'
  createdAt:          string
  whatsapp?:          string | null
  instagram?:         string | null
  totalAppointments?: number
  totalSpent?:        number
}

export interface CustomersDashboard {
  total: number; active: number; inactive: number; newThisMonth: number
}

export interface CustomersListResponse {
  data: Customer[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export interface CreateCustomerPayload {
  name:      string
  phone:     string
  address?:  string
  contacts?: CustomerContact[]
}

export interface UpdateCustomerPayload {
  name?:     string
  phone?:    string
  address?:  string
  status?:   'ACTIVE' | 'INACTIVE'
  contacts?: CustomerContact[]
}

export interface CustomersParams { search?: string; limit?: number; page?: number }

export const customersApi = {
  list:      (p?: CustomersParams)                     => api.get<CustomersListResponse>('/customers/', { params: p }),
  dashboard: ()                                        => api.get<CustomersDashboard>('/customers/dashboard'),
  create:    (data: CreateCustomerPayload)             => api.post<Customer>('/customers/', data),
  update:    (id: string, data: UpdateCustomerPayload) => api.patch<Customer>(`/customers/${id}`, data),
  remove:    (id: string)                              => api.delete(`/customers/${id}`),
}
