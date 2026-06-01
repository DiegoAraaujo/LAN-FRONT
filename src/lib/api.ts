import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let failedQueue: { resolve: (v: string) => void; reject: (e: unknown) => void }[] = []

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => (token ? p.resolve(token) : p.reject(error)))
  failedQueue = []
}

const KNOWN_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS:          'E-mail ou senha incorretos.',
  EMAIL_ALREADY_EXISTS:         'Este e-mail já está em uso.',
  CUSTOMER_ALREADY_EXISTS:      'Já existe um cliente com este telefone.',
  CONTACT_ALREADY_EXISTS:       'Este contato já está associado a outro cliente.',
  PROFESSIONAL_ALREADY_EXISTS:  'Já existe um profissional com este telefone.',
  SERVICE_ALREADY_EXISTS:       'Já existe um serviço com este nome.',
  CUSTOMER_NOT_FOUND:           'Cliente não encontrado.',
  PROFESSIONAL_NOT_FOUND:       'Profissional não encontrado.',
  SERVICE_NOT_FOUND:            'Serviço não encontrado.',
  APPOINTMENT_NOT_FOUND:        'Atendimento não encontrado.',
  USER_NOT_FOUND:               'Usuário não encontrado.',
  TOKEN_NOT_FOUND:              'Token não encontrado.',
  TOKEN_INVALID:                'Sessão expirada. Faça login novamente.',
  PROFESSIONAL_SERVICE_MISMATCH:'Este profissional não executa o serviço selecionado.',
  MIN_ITEMS_REQUIRED:           'Adicione ao menos um serviço ao atendimento.',
  INVALID_DISCOUNT:             'Desconto inválido ou maior que o subtotal.',
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiError>) => {
    const original = error.config as typeof error.config & { _retry?: boolean }
    const status   = error.response?.status
    const code     = error.response?.data?.code

    if (code && code !== 'VALIDATION_ERROR' && KNOWN_MESSAGES[code]) {
      toast.error(KNOWN_MESSAGES[code])
      return Promise.reject(error)
    }

    if (!error.response) {
      toast.error('Sem conexão com o servidor. Verifique sua internet.')
      return Promise.reject(error)
    }

    if (status === 401 && !original?._retry) {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        clearSession()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          if (original) original.headers!.Authorization = `Bearer ${token}`
          return api(original!)
        })
      }

      original!._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post<{ token: string; refreshToken: string }>(
          `${BASE_URL}/sessions/refresh-token`,
          { token: refreshToken },
        )
        sessionStorage.setItem('accessToken', data.token)
        localStorage.setItem('refreshToken', data.refreshToken)
        api.defaults.headers.common.Authorization = `Bearer ${data.token}`
        processQueue(null, data.token)
        return api(original!)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearSession()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    if (code !== 'VALIDATION_ERROR') {
      if (status === 403)       toast.error('Sem permissão para realizar esta ação.')
      else if (status === 404)  toast.error('Recurso não encontrado.')
      else if (status! >= 500)  toast.error('Erro interno do servidor. Tente novamente.')
      else                      toast.error('Algo deu errado. Tente novamente.')
    }

    return Promise.reject(error)
  },
)

export const clearSession = () => {
  sessionStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  window.location.href = '/login'
}

export interface ApiError {
  status?: number
  code:    string
  message?: string
  errors?: { field: string; message: string }[]
}

export const extractValidationErrors = (error: unknown): Record<string, string> => {
  if (!axios.isAxiosError(error)) return {}
  const data = (error as AxiosError<ApiError>).response?.data
  if (data?.code !== 'VALIDATION_ERROR' || !data.errors) return {}
  return Object.fromEntries(data.errors.map((e) => [e.field, e.message]))
}
