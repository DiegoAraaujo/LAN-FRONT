'use client'
import { useId, useState } from 'react'
import { Search, X, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCustomers } from '@/features/customers/hooks/useCustomers'
import { useCreateCustomer } from '@/features/customers/hooks/useCreateCustomer'
import { CustomerFormModal } from '@/features/customers/components/CustomerFormModal'
import { useDebounce } from '@/hooks/useDebounce'
import type { Customer } from '@/features/customers/api/customers.api'
interface Props { selected: Customer | null; onSelect: (c: Customer | null) => void; error?: string }
export const ClientSearchInput = ({ selected, onSelect, error }: Props) => {
  const t = useTranslations('appointments')
  const e = useTranslations('experience')
  const id = useId()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [createOpen, setCreateOpen] = useState(false)
  const debounced = useDebounce(search, 300)
  const query = useCustomers({ search: debounced, limit: 8 })
  const create = useCreateCustomer(() => setCreateOpen(false))
  const suggestions = query.data?.data ?? []
  const select = (c: Customer) => { onSelect(c); setSearch(''); setOpen(false); setActive(-1) }
  return <div className="relative">
    {selected ? <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-3 flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 grid place-items-center font-semibold">{selected.name.charAt(0)}</div><div className="min-w-0 flex-1"><p className="font-medium text-sm truncate">{selected.name}</p><p className="text-xs text-text-muted">{selected.whatsapp ?? selected.phone}</p></div><button type="button" aria-label={e('removeCustomer')} className="p-2 text-text-muted" onClick={() => onSelect(null)}><X size={16}/></button></div> :
    <div onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
      <label htmlFor={id} className="text-xs font-medium text-text-muted uppercase tracking-wide block mb-1.5">{t('searchClient')}</label>
      <div className="relative"><Search size={15} className="absolute left-3 top-3.5 text-text-muted"/><input id={id} aria-invalid={!!error} aria-describedby={error ? id+'-error' : undefined} role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={id+'-list'} aria-activedescendant={open && active >= 0 ? id+'-option-'+active : undefined} autoComplete="off" placeholder={t('searchPlaceholder')} value={search}
        onChange={ev => { setSearch(ev.target.value); setOpen(true); setActive(-1) }} onFocus={() => setOpen(true)}
        onKeyDown={ev => {
          if (ev.key === 'Escape') { setOpen(false); return }
          if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') { ev.preventDefault(); setOpen(true); setActive(i => Math.max(0, Math.min(suggestions.length - 1, i + (ev.key === 'ArrowDown' ? 1 : -1)))) }
          if (ev.key === 'Enter' && open && active >= 0 && suggestions[active]) { ev.preventDefault(); select(suggestions[active]) }
        }} className={'w-full border rounded-lg pl-9 pr-3 py-2.5 text-sm bg-surface '+(error ? 'border-danger' : 'border-border')}/>
      </div>
      {error && <p id={id+'-error'} className="mt-1.5 text-xs text-danger">{error}</p>}
      {open && <div className="absolute z-20 top-full left-0 right-0 mt-1 rounded-xl border border-border bg-surface shadow-xl p-1">
        {query.isLoading || search !== debounced ? <p role="status" className="p-3 text-sm text-text-muted">{e('searching')}</p> : query.isError ? <button type="button" onClick={() => query.refetch()} className="p-3 text-sm text-danger">{e('loadError')} {e('retry')}</button> : suggestions.length === 0 ? <p role="status" className="p-3 text-sm text-text-muted">{e('noCustomers')}</p> : null}
        <ul id={id+'-list'} role="listbox" aria-label={t('searchClient')}>{suggestions.map((c,i) => <li id={id+'-option-'+i} role="option" aria-selected={active === i} key={c.id} className={'rounded-lg '+(active === i ? 'bg-bg' : '')}><button tabIndex={-1} type="button" onMouseDown={ev => ev.preventDefault()} onClick={() => select(c)} className="w-full text-left p-3 hover:bg-bg rounded-lg"><p className="font-medium text-sm">{c.name}</p><p className="text-xs text-text-muted">{c.whatsapp ?? c.phone}</p></button></li>)}</ul>
        <button type="button" onClick={() => { setCreateOpen(true); setOpen(false) }} className="w-full border-t border-border p-3 text-sm font-medium text-gold flex items-center gap-2"><Plus size={16}/>{e('newCustomer')}</button>
      </div>}
    </div>}
    {!selected && <button type="button" onClick={() => setCreateOpen(true)} className="mt-2 text-xs text-gold font-medium">{e('newCustomer')}</button>}
    <CustomerFormModal open={createOpen} onClose={() => { if (!create.isPending) setCreateOpen(false) }} isLoading={create.isPending} onSubmit={input => create.mutate(input, { onSuccess: result => select(result.data) })}/>
  </div>
}
