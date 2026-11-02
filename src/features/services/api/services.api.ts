import { recordIdSchema, searchQuerySchema } from '@/lib/query-validation';
import { validatePayload } from '@/lib/validate-payload';
import { createServiceSchema, updateServiceSchema } from '../schemas/service-payload.schemas';
import { api } from '@/lib/api';

export interface Service {
  id: string;
  name: string;
  price: number;
  description?: string;
}
export interface CreateServicePayload {
  name: string;
  price: number;
  description?: string;
}
export type UpdateServicePayload = Partial<CreateServicePayload>;

export const servicesApi = {
  list: (search?: string) =>
    api.get<Service[]>('/services/', { params: validatePayload(searchQuerySchema, { search }) }),
  create: (data: CreateServicePayload) =>
    api.post<Service>('/services/', validatePayload(createServiceSchema, data)),
  update: (id: string, data: UpdateServicePayload) =>
    api.patch<Service>(
      `/services/${validatePayload(recordIdSchema, id)}`,
      validatePayload(updateServiceSchema, data),
    ),
  remove: (id: string) => api.delete(`/services/${validatePayload(recordIdSchema, id)}`),
};
