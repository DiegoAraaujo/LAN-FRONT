import { z } from 'zod';
import { moneySchema } from '../../lib/validation';
export const methodSchema = z.enum(['PIX', 'CASH', 'DEBIT_CARD', 'CREDIT_CARD', 'OTHER']);
const amount = moneySchema;
const pastDate = z
  .string()
  .datetime()
  .refine(
    (value) => new Date(value).getTime() <= Date.now() + 60000,
    'Data de recebimento não pode estar no futuro.',
  );
export const paymentSchema = z
  .object({
    requestId: z.string().uuid(),
    received: amount.optional(),
    useCredit: amount.default(0),
    payments: z
      .array(z.object({ amount: amount.refine((value) => value > 0), method: methodSchema }))
      .max(5)
      .optional(),
    excess: z.enum(['CHANGE', 'CREDIT']),
    method: methodSchema.optional(),
    occurredAt: pastDate,
    description: z.string().trim().max(300).default('Pagamento de atendimento'),
  })
  .superRefine((data, context) => {
    const payments =
      data.payments ??
      (data.received !== undefined && data.method
        ? [{ amount: data.received, method: data.method }]
        : []);
    if (payments.reduce((sum, payment) => sum + payment.amount, 0) + data.useCredit <= 0)
      context.addIssue({ code: 'custom', message: 'Informe um pagamento ou crédito.' });
    if (new Set(payments.map((payment) => payment.method)).size !== payments.length)
      context.addIssue({ code: 'custom', message: 'Não repita a mesma forma de pagamento.' });
  });
export const entrySchema = z
  .object({
    requestId: z.string().uuid(),
    kind: z.enum(['INCOME', 'EXPENSE', 'OPENING', 'CREDIT']),
    amount: amount.refine((value) => value > 0),
    status: z.enum(['POSTED', 'PENDING']).default('POSTED'),
    customerId: z.string().uuid().optional(),
    description: z.string().trim().max(300).optional(),
    category: z
      .string()
      .trim()
      .max(80)
      .refine((value) => !value || value.length >= 2)
      .optional(),
    method: methodSchema,
    occurredAt: z.string().datetime(),
  })
  .refine((data) => data.kind !== 'CREDIT' || !!data.customerId, {
    path: ['customerId'],
    message: 'Selecione o cliente.',
  })
  .refine(
    (data) =>
      data.status === 'PENDING' || new Date(data.occurredAt).getTime() <= Date.now() + 60000,
    'Movimentação paga não pode estar no futuro.',
  )
  .refine(
    (data) => !['CREDIT', 'OPENING'].includes(data.kind) || data.status === 'POSTED',
    'Crédito e saldo inicial devem estar confirmados.',
  );

export const reversalSchema = z.object({ reason: z.string().trim().min(3).max(200) });
export const settlementSchema = z.object({ occurredAt: pastDate });
