'use client'
import { BookOpen, MessageSquare, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'

export const SupportQuickCards = () => {
  const t = useTranslations('support')
  const CARDS = [
    { icon: <BookOpen size={22} className="text-gold" />,     title: t('docsTitle'),   desc: t('docsDesc')   },
    { icon: <MessageSquare size={22} className="text-gold" />, title: t('chatTitle'),   desc: t('chatDesc')   },
    { icon: <AlertCircle size={22} className="text-gold" />,   title: t('statusTitle'), desc: t('statusDesc') },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {CARDS.map(c => (
        <Card key={c.title} className="p-5 flex flex-col gap-3 hover:border-gold-btn transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center">{c.icon}</div>
          <div>
            <div className="font-semibold text-sm text-text mb-1">{c.title}</div>
            <div className="text-xs text-text-muted leading-relaxed">{c.desc}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}
