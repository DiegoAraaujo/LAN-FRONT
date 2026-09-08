'use client'
import { create } from 'zustand'
export interface AuthUser { name: string; email: string; createdAt: string }
interface AuthState {
  user: AuthUser | null; accessToken: string | null; ready: boolean; error: boolean;
  setSession: (user: AuthUser, accessToken: string, refreshToken: string, remember?: boolean) => void;
  clearSession: () => void; initFromStorage: () => Promise<void>;
}
export const getRefreshToken = () => localStorage.getItem('refreshToken') ?? sessionStorage.getItem('refreshToken')
let initialization: Promise<void> | null = null
export const useAuthStore = create<AuthState>((set) => ({
  user: null, accessToken: null, ready: false, error: false,
  setSession: (user, accessToken, refreshToken, remember = true) => {
    sessionStorage.setItem('accessToken', accessToken)
    localStorage.removeItem('refreshToken')
    sessionStorage.removeItem('refreshToken')
    ;(remember ? localStorage : sessionStorage).setItem('refreshToken', refreshToken)
    set({ user, accessToken, ready: true, error: false })
  },
  clearSession: () => {
    sessionStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    sessionStorage.removeItem('refreshToken')
    set({ user: null, accessToken: null, ready: true, error: false })
  },
  initFromStorage: async () => {
    if (initialization) return initialization
    initialization = (async () => {
      set({ error: false })
      try {
        const { api, refreshSession } = await import('@/lib/api')
        let token = sessionStorage.getItem('accessToken')
        if (!token && getRefreshToken()) token = await refreshSession()
        if (!token) { set({ ready: true, user: null, accessToken: null }); return }
        const { data } = await api.get<AuthUser>('/users/me')
        set({ user: data, accessToken: sessionStorage.getItem('accessToken'), ready: true })
      } catch {
        set({ error: true, ready: true })
      }
    })().finally(() => { initialization = null })
    return initialization
  },
}))
