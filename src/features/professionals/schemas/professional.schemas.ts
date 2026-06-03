import { z } from 'zod'
export const professionalSchema = z.object({
  name:        z.string().min(2, 'Mínimo 2 caracteres'),
  address:     z.string().min(5, 'Endereço obrigatório'),
  phone:       z.string().min(10, 'Telefone inválido'),
  servicesIds: z.array(z.string()).optional(),
})
export type ProfessionalInput = z.infer<typeof professionalSchema>
