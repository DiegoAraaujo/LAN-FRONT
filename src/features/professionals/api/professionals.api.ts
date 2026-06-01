import { api } from '@/lib/api'

export interface Professional {
  id: string; name: string; phone: string; address: string; createdAt: string
  services: { id: string; name: string }[]
}
export interface CreateProfessionalPayload { name: string; address: string; phone: string; servicesIds?: string[] }
export type UpdateProfessionalPayload = Partial<CreateProfessionalPayload>

export const professionalsApi = {
  list:   (search?: string) => api.get<Professional[]>('/professionals/', { params: search ? { search } : undefined }),
  create: (data: CreateProfessionalPayload) => api.post<Professional>('/professionals/', data),
  update: (id: string, data: UpdateProfessionalPayload) => api.patch<Professional>(`/professionals/${id}`, data),
  remove: (id: string) => api.delete(`/professionals/${id}`),
}

export const professionalsByServiceApi = {
  list: (serviceId: string) =>
    api.get<Omit<Professional, 'services'>[]>(`/professionals/service/${serviceId}`),
}
