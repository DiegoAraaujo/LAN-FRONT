import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/stores/auth.store'
import { clientMessage } from './messages'
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV === 'production'
  ? 'https://api.jdbarbeariatapuio.com.br' : 'http://localhost:3333')
const config = { baseURL: BASE_URL, timeout: 10000, withCredentials: true,
  headers: { 'X-CSRF-Protection': '1' } }
export const api = axios.create(config)
const sessionApi = axios.create(config)
let refreshing: Promise<void> | null = null
let signingOut = false
export const withSessionLock = async <T>(perform: () => Promise<T>): Promise<T> =>
  typeof navigator !== 'undefined' && navigator.locks
    ? navigator.locks.request('lan-refresh-session', perform) : perform()

export async function logoutSession(): Promise<void> {
  if (signingOut) return
  signingOut = true
  try {
    if (refreshing) await refreshing.catch(() => undefined)
    await withSessionLock(async () => {
      await api.post('/sessions/logout')
      useAuthStore.getState().clearSession()
      localStorage.setItem('lan-session-event', JSON.stringify({ type: 'logout', id: crypto.randomUUID() }))
    })
  } finally { signingOut = false }
}
export const clearSession = () => {
  useAuthStore.getState().clearSession()
}
export function refreshSession(): Promise<void> {
  if (signingOut) return Promise.reject(new Error('Signing out'))
  if (refreshing) return refreshing
  refreshing = withSessionLock(async () => {
    await sessionApi.post('/sessions/refresh-token')
  }).catch(error => {
    if (axios.isAxiosError(error) && error.response?.status === 401) clearSession()
    throw error
  }).finally(() => { refreshing = null })
  return refreshing
}
api.interceptors.response.use(res => res, async (error: AxiosError<ApiError>) => {
  const original = error.config as typeof error.config & { _retry?: boolean }
  const status = error.response?.status
  const code = error.response?.data?.code
  const isLogin = original?.url?.startsWith('/sessions')
  if (status === 401 && !isLogin && original) {
    if (original._retry) { clearSession(); return Promise.reject(error) }
    original._retry = true
    try { await refreshSession(); return api(original) } catch (refreshError) { return Promise.reject(refreshError) }
  }
  {
    const key = code ?? (!error.response ? 'NETWORK_ERROR' : status === 403 ? 'FORBIDDEN' : status === 404 ? 'NOT_FOUND' : 'UNKNOWN_ERROR')
    toast.error(code === "PAYMENT_CONFLICT" && error.response?.data?.message ? error.response.data.message : clientMessage(key), { id: key })
  }
  return Promise.reject(error)
})
export interface ApiError { status?: number; code: string; message?: string; errors?: { field: string; message: string }[] }
export const extractValidationErrors = (error: unknown): Record<string, string> => {
  if (!axios.isAxiosError(error)) return {}
  const data = (error as AxiosError<ApiError>).response?.data
  if (data?.code !== 'VALIDATION_ERROR' || !data.errors) return {}
  return Object.fromEntries(data.errors.map(e => [e.field, e.message]))
}
