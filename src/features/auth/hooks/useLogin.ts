import { clientMessage } from '@/lib/messages'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '@/stores/auth.store'
import { ROUTES } from '@/constants'

export const useLogin = () => {
  const { setSession } = useAuthStore()
  const router = useRouter()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      qc.clear()
      setSession(data.user)
      localStorage.setItem('lan-session-event', JSON.stringify({ type: 'login', id: crypto.randomUUID() }))
      toast.success(clientMessage('WELCOME')+', '+data.user.name+'!')
      router.push(ROUTES.dashboard)
    },
  })
}
