import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { userApi, type UpdateUserPayload } from '../api/user.api'
import { useAuthStore } from '@/stores/auth.store'

export const useUpdateUser = (onSuccess?: () => void) => {
  const { accessToken, setSession } = useAuthStore()
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') ?? '' : ''

  return useMutation({
    mutationFn: (data: UpdateUserPayload) => userApi.update(data),
    onSuccess: ({ data }) => {
      if (accessToken) setSession(data, accessToken, refreshToken)
      toast.success('Perfil atualizado!')
      onSuccess?.()
    },
  })
}
