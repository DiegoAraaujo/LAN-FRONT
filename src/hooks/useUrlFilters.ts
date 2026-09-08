'use client'
import { useSyncExternalStore, useCallback } from 'react'
const subscribe = (callback: () => void) => { window.addEventListener('popstate', callback); return () => window.removeEventListener('popstate', callback) }
const snapshot = () => window.location.search
const serverSnapshot = () => ''
export function useUrlFilters() {
  const search = useSyncExternalStore(subscribe, snapshot, serverSnapshot)
  const params = new URLSearchParams(search)
  const setFilters = useCallback((values: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(window.location.search)
    for (const [key, value] of Object.entries(values)) { if (value === undefined || value === '') next.delete(key); else next.set(key, String(value)) }
    window.history.replaceState(null, '', window.location.pathname+(next.size ? '?'+next.toString() : ''))
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [])
  return { params, setFilters }
}
