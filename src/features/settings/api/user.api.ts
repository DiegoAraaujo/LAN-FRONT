import { validatePayload } from '@/lib/validate-payload';
import { changePasswordSchema } from '@/lib/validation';
import { updateUserSchema } from '../schemas/user.schemas';
import type { ChangePasswordInput } from '@/lib/validation';
import { api } from '@/lib/api';
export interface UpdateUserPayload {
  name?: string;
  email?: string;
  profileImage?: string | null;
}
export interface UserResponse {
  name: string;
  email: string;
  profileImage?: string | null;
  createdAt: string;
}
export const userApi = {
  changePassword: (data: ChangePasswordInput) =>
    api.patch<void>('/users/password', validatePayload(changePasswordSchema, data)),
  update: (data: UpdateUserPayload) =>
    api.patch<UserResponse>('/users/', validatePayload(updateUserSchema, data)),
};
