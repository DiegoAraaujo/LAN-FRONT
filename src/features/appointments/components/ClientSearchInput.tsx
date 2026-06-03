'use client'
import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCustomers } from '@/features/customers/hooks/useCustomers'
import { useDebounce } from '@/hooks/useDebounce'
import type { Customer } from '@/features/customers/api/customers.api'

interface Props { selected: Customer | null; onSelect: (c: Customer | null) => void }

export const ClientSearchInput = ({ selected, onSelect }: Props) => {
  const t = useTranslations('appointments')
  const [search, setSearch] = useState('')
  const [open, setOpen]     = useState(false)
  const debounced           = useDebounce(search, 300)
  const { data }            = useCustomers({ search: debounced, limit: 8 })
  const suggestions         = data?.data ?? []

  if (selected) {
    return (
      <div className="border border-gold-btn rounded-lg p-3 flex items-center justify-between bg-amber-50/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold-btn flex items-center justify-center text-sm font-bold text-text">
            {selected.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-sm text-text">{selected.name}</div>
            <div className="text-xs text-text-light">{selected.phone}</div>
          </div>
        </div>
        <button onClick={() => onSelect(null)} className="text-text-light hover:text-danger">
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <label className="text-xs font-medium text-text-light uppercase tracking-wide block mb-1.5">
        {t('searchClient')}
      </label>
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
        <input type="text" placeholder={t('searchPlaceholder')} value={search}
          onChange={e => { setSearch(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          className="w-full border border-border rounded-lg pl-8 pr-3 py-2.5 text-sm bg-surface" />
      </div>
      {open && suggestions.length > 0 && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-surface border border-border rounded-lg shadow-lg overflow-hidden">
            {suggestions.map(c => (
              <button key={c.id} onClick={() => { onSelect(c); setSearch(''); setOpen(false) }}
                className="w-full text-left px-3 py-2.5 text-sm hover:bg-bg border-b border-divider last:border-0">
                <div className="font-medium text-text">{c.name}</div>
                <div className="text-xs text-text-light">{c.phone}</div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
