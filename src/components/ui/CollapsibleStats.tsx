'use client'

import { useId, useState, type ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useLocale } from 'next-intl'

interface Props {
  items: { label: string; value: ReactNode; className?: string }[]
  children: ReactNode
}

export function CollapsibleStats({ items, children }: Props) {
  const [expanded, setExpanded] = useState(true)
  const id = useId()
  const en = useLocale() === 'en'
  const action = expanded ? (en ? 'Collapse' : 'Recolher') : (en ? 'Expand' : 'Expandir')
  const Icon = expanded ? ChevronUp : ChevronDown

  return <section aria-label={en ? 'Statistics' : 'Estatísticas'} className="space-y-3">
    <div className="flex justify-end">
      <button type="button" className="flex size-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-border/40 hover:text-text" aria-expanded={expanded} aria-controls={id} aria-label={`${action} ${en ? 'statistics' : 'estatísticas'}`} title={action} onClick={() => setExpanded(value => !value)}>
        <Icon size={18} aria-hidden="true" />
      </button>
    </div>
      {!expanded &&
        <dl className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1">
          {items.map(item => <div key={item.label} className="flex flex-wrap items-baseline gap-x-1 text-[13px] leading-snug">
            <dt className="text-text-muted">{item.label}:</dt>
            <dd className={`font-semibold tabular-nums ${item.className ?? 'text-text'}`}>{item.value}</dd>
          </div>)}
        </dl>}
    <div id={id} hidden={!expanded}>
      <div className="space-y-6">{children}</div>
    </div>
  </section>
}
