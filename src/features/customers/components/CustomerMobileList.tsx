'use client'
import { CustomerCard } from './CustomerCard'
import type { Customer, CustomerStatus } from '../api/customers.api'

interface Props {
  onStatusChange: (c: Customer, status: CustomerStatus) => void
  statusBusy?: boolean
  customers:    Customer[]
  isLoading:    boolean
  onEdit:       (c: Customer) => void
  onDelete:     (id: string)  => void
  onViewDetail: (c: Customer) => void
}

export const CustomerMobileList = ({ customers, isLoading, onStatusChange, statusBusy, onEdit, onDelete, onViewDetail }: Props) => {
  if (isLoading) return (
    <div className="min-h-40 sm:hidden" />
  )
  return (
    <div className="sm:hidden flex flex-col gap-3">
      {customers.map(c => (
        <CustomerCard
          key={c.id} customer={c}
          onStatusChange={status => onStatusChange(c, status)} statusBusy={statusBusy}
          onEdit={() => onEdit(c)}
          onDelete={() => onDelete(c.id)}
          onViewDetail={() => onViewDetail(c)}
        />
      ))}
    </div>
  )
}
