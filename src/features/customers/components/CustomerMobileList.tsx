'use client'
import { useTranslations } from 'next-intl'
import { CustomerCard } from './CustomerCard'
import type { Customer } from '../api/customers.api'

interface Props {
  customers:    Customer[]
  isLoading:    boolean
  onEdit:       (c: Customer) => void
  onDelete:     (id: string)  => void
  onViewDetail: (c: Customer) => void
}

export const CustomerMobileList = ({ customers, isLoading, onEdit, onDelete, onViewDetail }: Props) => {
  const tc = useTranslations('common')
  if (isLoading) return (
    <div className="sm:hidden text-center py-10 text-sm text-text-light">{tc('loading')}</div>
  )
  return (
    <div className="sm:hidden flex flex-col gap-3">
      {customers.map(c => (
        <CustomerCard
          key={c.id} customer={c}
          onEdit={() => onEdit(c)}
          onDelete={() => onDelete(c.id)}
          onViewDetail={() => onViewDetail(c)}
        />
      ))}
    </div>
  )
}
