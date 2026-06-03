import { api } from '@/lib/api'

export interface LoginPayload  { email: string; password: string }
export interface SignupPayload { name: string; email: string; password: string }
export interface AuthResponse  {
  user: { name: string; email: string; createdAt: string }
  token: string; refreshToken: string
}
export interface SignupResponse { name: string; email: string; createdAt: string }

export const authApi = {
  login:  (data: LoginPayload)  => api.post<AuthResponse>('/sessions/', data),
  signup: (data: SignupPayload) => api.post<SignupResponse>('/users', data),
}
