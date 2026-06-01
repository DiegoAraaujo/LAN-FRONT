import { api } from '@/lib/api'
export interface UpdateUserPayload { name?: string; email?: string }
export interface UserResponse { name: string; email: string; createdAt: string }
export const userApi = {
  update: (data: UpdateUserPayload) => api.patch<UserResponse>('/users/', data),
}
