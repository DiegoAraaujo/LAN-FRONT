'use client'
import { useCallback, useSyncExternalStore } from 'react'

export const PAGE_SIZES = [10, 25, 50, 100]
const changedEvent = 'lan-page-size-changed'
const fallback = new Map<string, number>()
const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback)
  window.addEventListener(changedEvent, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(changedEvent, callback)
  }
}

export function usePageSize(page: 'activities' | 'clients' | 'cash-flow', defaultSize = 10) {
  const key = `lan:page-size:${page}`
  const snapshot = useCallback(() => {
    if (fallback.has(key)) return fallback.get(key)!
    try {
      const value = Number(window.localStorage.getItem(key))
      return PAGE_SIZES.includes(value) ? value : fallback.get(key) ?? defaultSize
    } catch {
      return fallback.get(key) ?? defaultSize
    }
  }, [key, defaultSize])
  const size = useSyncExternalStore(subscribe, snapshot, () => defaultSize)
  const setSize = useCallback((value: number) => {
    if (!PAGE_SIZES.includes(value)) return
    try {
      window.localStorage.setItem(key, String(value))
      fallback.delete(key)
    } catch {
      // Keep the selection usable if storage is unavailable.
      fallback.set(key, value)
    }
    window.dispatchEvent(new Event(changedEvent))
  }, [key])
  return [size, setSize] as const
}
