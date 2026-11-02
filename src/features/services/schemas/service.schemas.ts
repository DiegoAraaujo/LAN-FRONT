import { z } from 'zod';
import { nameSchema, moneySchema } from '../../../lib/validation';
export const serviceFormSchema = z.object({
  name: nameSchema,
  price: z
    .string()
    .trim()
    .min(1, 'Informe o preco.')
    .refine(
      (value) => moneySchema.safeParse(Number(value)).success,
      'Informe um valor de 0 a 999.999,99 com ate duas casas decimais.',
    ),
  description: z.string().max(300).optional(),
});
export type ServiceFormInput = z.infer<typeof serviceFormSchema>;
