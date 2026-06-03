import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { customersApi, type UpdateCustomerPayload, type CustomerContact } from '../api/customers.api'
import { customersKeys } from './useCustomers'
import { digitsOnly, normalizeInstagram } from '@/lib/utils'
import type { CustomerInput } from '../schemas/customer.schemas'

export const useUpdateCustomer = (onSuccess?: () => void) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerPayload | CustomerInput }) => {
      if ('whatsappDdi' in data || 'instagram' in data) {
        const input = data as CustomerInput

        const rawDigits = digitsOnly(input.whatsapp ?? '')
        const fullWhatsapp = rawDigits
          ? `${input.whatsappDdi ?? '+55'}${rawDigits}`
          : undefined

        const contacts: CustomerContact[] = []
        if (fullWhatsapp)
          contacts.push({ type: 'WHATSAPP', value: fullWhatsapp })
        if (input.instagram?.trim())
          contacts.push({ type: 'INSTAGRAM', value: normalizeInstagram(input.instagram) })

        return customersApi.update(id, {
          name:     input.name,
          phone:    fullWhatsapp ?? undefined,
          address:  input.address?.trim() || undefined,
          contacts,
        })
      }
      return customersApi.update(id, data as UpdateCustomerPayload)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customersKeys.all })
      toast.success('Cliente atualizado!')
      onSuccess?.()
    },
  })
}
