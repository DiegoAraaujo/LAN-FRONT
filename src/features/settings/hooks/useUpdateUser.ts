import { clientMessage } from '@/lib/messages'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { userApi, type UpdateUserPayload } from '../api/user.api'
import { useAuthStore } from '@/stores/auth.store'

export const useUpdateUser = (onSuccess?: () => void) => {



  return useMutation({
    mutationFn: (data: UpdateUserPayload) => userApi.update(data),
    onSuccess: ({ data }) => {
      useAuthStore.setState({ user: data })
      toast.success(clientMessage('Perfil atualizado!'))
      onSuccess?.()
    },
  })
}
