'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Props { question: string; answer: string }

export const FaqItem = ({ question, answer }: Props) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-bg transition-colors">
        <span className="text-sm font-medium text-text pr-4">{question}</span>
        {open ? <ChevronUp size={16} className="shrink-0 text-gold" /> : <ChevronDown size={16} className="shrink-0 text-text-light" />}
      </button>
      {open && <div className="px-5 pb-4 text-sm text-text-muted leading-relaxed">{answer}</div>}
    </div>
  )
}
