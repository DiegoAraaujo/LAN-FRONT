import type { z } from 'zod';
import toast from 'react-hot-toast';
import { clientMessage } from './messages';

export function validatePayload<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    toast.error(clientMessage('VALIDATION_ERROR'), { id: 'VALIDATION_ERROR' });
    throw result.error;
  }
  return result.data;
}
