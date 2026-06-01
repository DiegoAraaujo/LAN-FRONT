'use client'

import { create } from 'zustand'

interface User {
  name: string
  email: string
  createdAt: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  setSession: (user: User, accessToken: string, refreshToken: string) => void
  clearSession: () => void
  initFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  setSession: (user, accessToken, refreshToken) => {
    sessionStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    set({ user, accessToken })
  },

  clearSession: () => {
    sessionStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    set({ user: null, accessToken: null })
  },

  initFromStorage: () => {
    const token = sessionStorage.getItem('accessToken')
    if (token) set({ accessToken: token })
  },
}))
