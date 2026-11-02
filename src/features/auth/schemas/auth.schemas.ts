import { z } from 'zod';
import {
  nameSchema,
  emailSchema,
  passwordSchema,
  currentPasswordSchema,
} from '../../../lib/validation';
export const loginSchema = z.object({
  email: emailSchema,
  password: currentPasswordSchema,
  remember: z.boolean().optional(),
});
export const signupSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
    terms: z.literal(true, { error: 'Aceite os termos.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas nao coincidem.',
  });
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
