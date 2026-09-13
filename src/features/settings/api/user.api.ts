import { api } from '@/lib/api'
export interface UpdateUserPayload { name?: string; email?: string; profileImage?: string | null }
export interface UserResponse { name: string; email: string; profileImage?: string | null; createdAt: string }
export const userApi = {
  update: (data: UpdateUserPayload) => api.patch<UserResponse>('/users/', data),
}
