'use client'
import { create } from 'zustand'
import axios from 'axios'
export interface AuthUser { name: string; email: string; createdAt: string }
interface AuthState {
  user: AuthUser | null; authenticated: boolean; ready: boolean; error: boolean;
  setSession: (user: AuthUser) => void;
  clearSession: () => void; initFromStorage: () => Promise<void>;
}
const removeLegacyTokens = () => {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem('accessToken')
    storage.removeItem('refreshToken')
  }
}
let initialization: Promise<void> | null = null
let generation = 0
export const useAuthStore = create<AuthState>((set) => ({
  user: null, authenticated: false, ready: false, error: false,
  setSession: user => {
    generation++
    removeLegacyTokens()
    set({ user, authenticated: true, ready: true, error: false })
  },
  clearSession: () => {
    generation++
    removeLegacyTokens()
    set({ user: null, authenticated: false, ready: true, error: false })
  },
  initFromStorage: async () => {
    if (initialization) return initialization
    const current = generation
    initialization = (async () => {
      removeLegacyTokens()
      set({ error: false })
      try {
        const { api } = await import('@/lib/api')
        const { data } = await api.get<AuthUser>('/users/me')
        if (current === generation) set({ user: data, authenticated: true, ready: true, error: false })
      } catch (error) {
        if (current !== generation) return
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          set({ user: null, authenticated: false, ready: true, error: false })
        } else set({ error: true, ready: true })
      }
    })().finally(() => { initialization = null })
    return initialization
  },
}))
