import { useState } from 'react'

interface UsePaginationReturn {
  page:       number
  totalPages: number
  setPage:    (page: number) => void
  next:       () => void
  prev:       () => void
}

export const usePagination = (totalItems: number, itemsPerPage = 10): UsePaginationReturn => {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return {
    page,
    totalPages,
    setPage,
    next: () => setPage((p) => Math.min(p + 1, totalPages)),
    prev: () => setPage((p) => Math.max(p - 1, 1)),
  }
}
