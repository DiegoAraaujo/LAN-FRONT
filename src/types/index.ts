export type Status = 'active' | 'inactive'
export type ClientTier = 'premium' | 'corporate' | 'standard'
export type PaymentMethod = 'card' | 'cash_pix'
export type AppointmentStatus = 'completed' | 'open' | 'cancelled'
export type LoyaltyStatus = 'VIP GOLD' | 'FREQUENT' | 'ACTIVE'

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  status: Status
  tier?: ClientTier
}

export interface Professional {
  id: string
  name: string
  address: string
  phone: string
  services: string[]
}

export interface Service {
  id: string
  name: string
  price: number
  category: string
}

export interface AppointmentService {
  name: string
  professional: string
  value: number
}

export interface Appointment {
  id: string
  clientName: string
  clientInitials: string
  date: string
  time: string
  services: AppointmentService[]
  total: number
  status: AppointmentStatus
}

export interface LoyalClient {
  name: string
  visits: number
  totalSpent: number
  status: LoyaltyStatus
}

export interface RevenueByMonth {
  month: string
  value: number
}

export interface RevenueByService {
  service: string
  quantity: number
  total: number
}
