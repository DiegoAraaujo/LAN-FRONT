import { validatePayload } from '@/lib/validate-payload';
import { loginSchema, signupSchema } from '../schemas/auth.schemas';
import { api, withSessionLock } from '@/lib/api';

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}
export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: true;
}
export interface AuthResponse {
  user: { name: string; email: string; createdAt: string };
}
export interface SignupResponse {
  name: string;
  email: string;
  createdAt: string;
}

export const authApi = {
  login: (data: LoginPayload) =>
    withSessionLock(() => api.post<AuthResponse>('/sessions/', validatePayload(loginSchema, data))),
  signup: (data: SignupPayload) =>
    api.post<SignupResponse>('/users', validatePayload(signupSchema, data)),
};
