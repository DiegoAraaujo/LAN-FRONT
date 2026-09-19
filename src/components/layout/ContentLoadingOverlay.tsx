'use client'

import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { LumaSpin } from '@/components/ui/luma-spin'

export const ContentLoadingOverlay = () => {
  const queryClient = useQueryClient()
  const fetching = useIsFetching({ predicate: query => {
    if (query.meta?.suppressGlobalLoading === true) return false
    const group = query.meta?.backgroundWhenCached
    if (typeof group !== 'string') return true
    const groupAlreadyHasData = queryClient.getQueryCache().findAll({
      predicate: candidate => candidate.meta?.backgroundWhenCached === group && candidate.state.data !== undefined,
    }).length > 0
    return !groupAlreadyHasData
  } })
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
