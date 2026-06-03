import { z } from 'zod'

export const WHATSAPP_DDI_OPTIONS = [
  { value: '+55', label: '🇧🇷 +55 (Brasil)' },
  { value: '+1',  label: '🇺🇸 +1 (EUA/Canadá)' },
  { value: '+44', label: '🇬🇧 +44 (Reino Unido)' },
  { value: '+351',label: '🇵🇹 +351 (Portugal)' },
  { value: '+54', label: '🇦🇷 +54 (Argentina)' },
]

export const customerSchema = z.object({
  name:         z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  address:      z.string().optional(),
  whatsappDdi:  z.string().optional(),
  whatsapp:     z.string().optional(),
  instagram:    z.string().optional(),
})

export type CustomerInput = z.infer<typeof customerSchema>
