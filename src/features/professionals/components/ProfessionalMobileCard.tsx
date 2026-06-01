'use client'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProfessionalServiceBadges } from './ProfessionalServiceBadges'
import type { Professional } from '../api/professionals.api'

interface Props { professional: Professional; onEdit: () => void; onDelete: () => void }

export const ProfessionalMobileCard = ({ professional, onEdit, onDelete }: Props) => {
  const tc = useTranslations('common')
  return (
    <Card className="p-4">
      <div className="font-semibold text-sm text-text mb-1">{professional.name}</div>
      <div className="text-xs text-text-muted mb-2">{professional.phone} · {professional.address}</div>
      <div className="mb-3"><ProfessionalServiceBadges services={professional.services} /></div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="justify-center" onClick={onEdit}>
          <Pencil size={12} /> {tc('edit')}
        </Button>
        <Button variant="danger" size="sm" className="justify-center" onClick={onDelete}>
          <Trash2 size={12} /> {tc('delete')}
        </Button>
      </div>
    </Card>
  )
}
