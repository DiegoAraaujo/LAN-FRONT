'use client'
import { useTranslations } from 'next-intl'
import { HelpCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { FaqItem } from './FaqItem'

export const FaqList = () => {
  const t = useTranslations('support')
  const faqs = [
    { q: t('faq1q'), a: t('faq1a') },
    { q: t('faq2q'), a: t('faq2a') },
    { q: t('faq3q'), a: t('faq3a') },
    { q: t('faq4q'), a: t('faq4a') },
    { q: t('faq5q'), a: t('faq5a') },
    { q: t('faq6q'), a: t('faq6a') },
  ]
  return (
    <Card>
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <HelpCircle size={16} className="text-gold" />
        <h3 className="font-semibold text-sm text-text">{t('faqTitle')}</h3>
      </div>
      {faqs.map(item => <FaqItem key={item.q} question={item.q} answer={item.a} />)}
    </Card>
  )
}
