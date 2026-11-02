import { recordIdSchema, searchQuerySchema } from '@/lib/query-validation';
import { validatePayload } from '@/lib/validate-payload';
import {
  createProfessionalSchema,
  updateProfessionalSchema,
} from '../schemas/professional-payload.schemas';
import { api } from '@/lib/api';

export interface Professional {
  id: string;
  name: string;
  phone: string;
  address: string;
  profileImage?: string | null;
  createdAt: string;
  services: { id: string; name: string }[];
}
export interface CreateProfessionalPayload {
  name: string;
  address: string;
  phone: string;
  profileImage?: string | null;
  servicesIds?: string[];
}
export type UpdateProfessionalPayload = Partial<CreateProfessionalPayload>;

export const professionalsApi = {
  list: (search?: string) =>
    api.get<Professional[]>('/professionals/', {
      params: validatePayload(searchQuerySchema, { search }),
    }),
  create: (data: CreateProfessionalPayload) =>
    api.post<Professional>('/professionals/', validatePayload(createProfessionalSchema, data)),
  update: (id: string, data: UpdateProfessionalPayload) =>
    api.patch<Professional>(
      `/professionals/${validatePayload(recordIdSchema, id)}`,
      validatePayload(updateProfessionalSchema, data),
    ),
  remove: (id: string) => api.delete(`/professionals/${validatePayload(recordIdSchema, id)}`),
};

export const professionalsByServiceApi = {
  list: (serviceId: string) =>
    api.get<Omit<Professional, 'services'>[]>(
      `/professionals/service/${validatePayload(recordIdSchema, serviceId)}`,
    ),
};
