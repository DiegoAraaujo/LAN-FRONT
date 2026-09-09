'use client'

import { useIsFetching } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { LumaSpin } from '@/components/ui/luma-spin'

export const ContentLoadingOverlay = () => {
  const fetching = useIsFetching()
  const t = useTranslations('common')

  if (!fetching) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={t('loading')}
      className="absolute inset-0 z-20 grid place-items-center bg-bg/85 backdrop-blur-[1px]"
    >
      <LumaSpin />
    </div>
  )
}
