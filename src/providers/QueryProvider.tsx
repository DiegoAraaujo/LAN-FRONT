'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/stores/auth.store'
import { useEffect, useState } from 'react'

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime:            60 * 1000,
            retry:                1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state, previous) => {
      if (!state.accessToken && previous.accessToken) { void queryClient.cancelQueries(); queryClient.clear() }
    })
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'refreshToken' && event.newValue === null && useAuthStore.getState().accessToken) {
        useAuthStore.getState().clearSession()
        window.location.replace('/login')
      }
    }
    window.addEventListener('storage', onStorage)
    return () => { unsubscribe(); window.removeEventListener('storage', onStorage) }
  }, [queryClient])
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#FFFFFF',
            color:      '#1C1C1C',
            border:     '1px solid #E2E0DA',
            fontSize:   '14px',
          },
          success: { iconTheme: { primary: '#22C55E', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
    </QueryClientProvider>
  )
}
