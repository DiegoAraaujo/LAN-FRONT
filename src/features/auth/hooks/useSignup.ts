import { clientMessage } from '@/lib/messages'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authApi } from '../api/auth.api'
import { ROUTES } from '@/constants'

export const useSignup = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      toast.success(clientMessage('Conta criada! Faça login para continuar.'))
      router.push(ROUTES.login)
    },
  })
}
