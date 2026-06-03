'use client'
import { useState } from 'react'
import { MessageSquare, CheckCircle, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

export const ContactForm = () => {
  const t = useTranslations('support')
  const [sent, setSent]       = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSent(true)
    setSubject(''); setMessage('')
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 font-semibold text-sm text-text mb-4">
        <MessageSquare size={15} className="text-gold" /> {t('contactTitle')}
      </div>
      {sent ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle size={24} className="text-success" />
          </div>
          <div className="font-semibold text-sm">{t('sentTitle')}</div>
          <div className="text-xs text-text-muted">{t('sentDesc')}</div>
          <Button variant="outline" size="sm" onClick={() => setSent(false)}>{t('newMessage')}</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Input label={t('subjectLabel')} placeholder={t('subjectPlaceholder')}
            value={subject} onChange={e => setSubject(e.target.value)} />
          <Textarea label={t('messageLabel')} placeholder={t('messagePlaceholder')}
            className="min-h-30" value={message} onChange={e => setMessage(e.target.value)} />
          <Button variant="primary" fullWidth className="justify-center"
            disabled={!subject.trim() || !message.trim() || loading} onClick={handleSend}>
            <Send size={14} /> {loading ? t('sending') : t('send')}
          </Button>
        </div>
      )}
    </Card>
  )
}
