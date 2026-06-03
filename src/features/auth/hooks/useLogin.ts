import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '@/stores/auth.store'
import { ROUTES } from '@/constants'

export const useLogin = () => {
  const { setSession } = useAuthStore()
  const router = useRouter()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      setSession(data.user, data.token, data.refreshToken)
      toast.success(`Bem-vindo, ${data.user.name}!`)
      router.push(ROUTES.dashboard)
    },
  })
}
