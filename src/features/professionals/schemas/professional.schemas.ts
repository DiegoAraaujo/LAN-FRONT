import { z } from 'zod';
import { nameSchema, addressSchema, phoneSchema, photoSchema } from '../../../lib/validation';
export const professionalSchema = z.object({
  name: nameSchema,
  address: addressSchema,
  phone: phoneSchema,
  profileImage: photoSchema,
  servicesIds: z.array(z.string().uuid()).optional(),
});
export type ProfessionalInput = z.infer<typeof professionalSchema>;
