import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { customersApi, type CustomerContact } from '../api/customers.api'
import { customersKeys } from './useCustomers'
import { digitsOnly, normalizeInstagram } from '@/lib/utils'
import type { CustomerInput } from '../schemas/customer.schemas'

const buildPayload = (input: CustomerInput) => {
  const rawDigits = digitsOnly(input.whatsapp ?? '')
  const fullWhatsapp = rawDigits
    ? `${input.whatsappDdi ?? '+55'}${rawDigits}`
    : undefined

  const contacts: CustomerContact[] = []
  if (fullWhatsapp)
    contacts.push({ type: 'WHATSAPP', value: fullWhatsapp })
  if (input.instagram?.trim())
    contacts.push({ type: 'INSTAGRAM', value: normalizeInstagram(input.instagram) })

  return {
    name:     input.name,
    phone:    fullWhatsapp ?? '',
    address:  input.address?.trim() || undefined,
    contacts: contacts.length > 0 ? contacts : undefined,
  }
}

export const useCreateCustomer = (onSuccess?: () => void) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CustomerInput) => customersApi.create(buildPayload(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customersKeys.all })
      toast.success('Cliente cadastrado!')
      onSuccess?.()
    },
  })
}
