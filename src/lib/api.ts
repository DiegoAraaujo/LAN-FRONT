import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useAuthStore, getRefreshToken } from '@/stores/auth.store'
import { clientMessage } from './messages'
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'
export const api = axios.create({ baseURL: BASE_URL, timeout: 10000 })
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('accessToken')
  if (token) config.headers.Authorization = 'Bearer '+token
  else delete config.headers.Authorization
  return config
})
let refreshing: Promise<string> | null = null
export const clearSession = () => {
  useAuthStore.getState().clearSession()
  delete api.defaults.headers.common.Authorization
  window.location.replace('/login')
}
export function refreshSession(): Promise<string> {
  if (refreshing) return refreshing
  const token = getRefreshToken()
  if (!token) { clearSession(); return Promise.reject(new Error('No session')) }
  const perform = async () => {
    // Another tab may have rotated the shared refresh token while this tab waited.
    const storage = localStorage.getItem('refreshToken') ? localStorage : sessionStorage
    const current = storage.getItem('refreshToken')
    if (!current) throw new Error('No session')
    const { data } = await axios.post<{ token: string; refreshToken: string }>(BASE_URL+'/sessions/refresh-token', { token: current }, { timeout: 10000 })
    if (storage.getItem('refreshToken') !== current) throw new Error('Session changed')
    sessionStorage.setItem('accessToken', data.token)
    storage.setItem('refreshToken', data.refreshToken)
    useAuthStore.setState({ accessToken: data.token })
    return data.token
  }
  refreshing = (async () => typeof navigator !== 'undefined' && navigator.locks
    ? await navigator.locks.request('lan-refresh-session', perform) : await perform())()
    .catch(error => { if (axios.isAxiosError(error) && error.response?.status === 401) clearSession(); throw error })
    .finally(() => { refreshing = null })
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
    toast.error(clientMessage(key), { id: key })
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
