import { api } from '@/lib/api'

export type ContactType = 'WHATSAPP' | 'INSTAGRAM'
export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'OCCASIONAL'

export interface CustomerContact {
  type:  ContactType
  value: string
}

export interface Customer {
  id:                 string
  name:               string
  phone:              string
  address?:           string | null
  status:             CustomerStatus
  createdAt:          string
  whatsapp?:          string | null
  instagram?:         string | null
  totalAppointments?: number
  totalSpent?:        number
}

export interface CustomersDashboard {
  total: number; active: number; inactive: number; occasional: number; newThisMonth: number
}

export interface LoyaltyCustomer extends Customer {
  totalAppointments: number
  totalSpent: number
  lastVisit: string
  tier: 'VIP_GOLD' | 'FREQUENT' | 'ACTIVE'
}

export interface CustomersListResponse {
  data: Customer[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export interface CreateCustomerPayload {
  status?: CustomerStatus
  name:      string
  phone:     string
  address?:  string
  contacts?: CustomerContact[]
}

export interface UpdateCustomerPayload {
  name?:     string
  phone?:    string
  address?:  string
  status?:   CustomerStatus
  contacts?: CustomerContact[]
}

export interface CustomersParams { search?: string; status?: CustomerStatus; limit?: number; page?: number }

export const customersApi = {
  list:      (p?: CustomersParams)                     => api.get<CustomersListResponse>('/customers/', { params: p }),
  dashboard: ()                                        => api.get<CustomersDashboard>('/customers/dashboard'),
  loyalty:   ()                                        => api.get<{ data: LoyaltyCustomer[] }>('/customers/loyalty'),
  create:    (data: CreateCustomerPayload)             => api.post<Customer>('/customers/', data),
  update:    (id: string, data: UpdateCustomerPayload) => api.patch<Customer>(`/customers/${id}`, data),
  remove:    (id: string)                              => api.delete(`/customers/${id}`),
}
