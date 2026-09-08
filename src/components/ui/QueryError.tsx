'use client'
import { useTranslations } from 'next-intl'
import { AlertCircle, RotateCw } from 'lucide-react'
export function QueryError({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations('experience')
  return <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 flex flex-wrap items-center gap-3 text-rose-800">
    <AlertCircle size={20}/><p className="flex-1 text-sm">{t('loadError')}</p>
    <button onClick={onRetry} className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg bg-white"><RotateCw size={14}/>{t('retry')}</button>
  </div>
}
