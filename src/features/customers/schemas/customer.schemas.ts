import { z } from 'zod';
import { nameSchema, addressSchema, instagramSchema } from '../../../lib/validation';

export const WHATSAPP_DDI_OPTIONS = [
  { value: '+55', label: '🇧🇷 +55 (Brasil)' },
  { value: '+1', label: '🇺🇸 +1 (EUA/Canadá)' },
  { value: '+44', label: '🇬🇧 +44 (Reino Unido)' },
  { value: '+351', label: '🇵🇹 +351 (Portugal)' },
  { value: '+54', label: '🇦🇷 +54 (Argentina)' },
];

export const customerSchema = z
  .object({
    status: z.enum(['ACTIVE', 'INACTIVE', 'OCCASIONAL']).optional(),
    name: nameSchema,
    address: addressSchema.optional(),
    whatsappDdi: z
      .string()
      .regex(/^\+\d{1,3}$/)
      .optional(),
    whatsapp: z.string().max(40).optional(),
    instagram: instagramSchema.optional(),
  })
  .superRefine((data, context) => {
    const local = (data.whatsapp ?? '').replace(/\D/g, '');
    const full = (data.whatsappDdi ?? '+55').replace(/\D/g, '') + local;
    if (
      data.whatsapp?.trim() &&
      (!/^[+\d\s().-]+$/.test(data.whatsapp.trim()) || !local || !/^\d{8,15}$/.test(full))
    )
      context.addIssue({ code: 'custom', path: ['whatsapp'], message: 'WhatsApp invalido.' });
  });

export type CustomerInput = z.infer<typeof customerSchema>;
