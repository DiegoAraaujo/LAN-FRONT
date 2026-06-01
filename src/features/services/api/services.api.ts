import { api } from '@/lib/api'

export interface Service {
  id: string; name: string; price: number; description?: string
}
export interface CreateServicePayload { name: string; price: number; description?: string }
export type UpdateServicePayload = Partial<CreateServicePayload>

export const servicesApi = {
  list:   (search?: string) => api.get<Service[]>('/services/', { params: search ? { search } : undefined }),
  create: (data: CreateServicePayload) => api.post<Service>('/services/', data),
  update: (id: string, data: UpdateServicePayload) => api.patch<Service>(`/services/${id}`, data),
  remove: (id: string) => api.delete(`/services/${id}`),
}
