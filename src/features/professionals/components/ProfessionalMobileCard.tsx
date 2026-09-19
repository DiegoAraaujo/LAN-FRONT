'use client'
import { MapPin, Pencil, Phone, Scissors, Trash2, UserRound } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProfessionalServiceBadges } from './ProfessionalServiceBadges'
import type { Professional } from '../api/professionals.api'
import { formatBRPhone } from '@/lib/utils'

interface Props { professional: Professional; onEdit: () => void; onDelete: () => void }

export const ProfessionalMobileCard = ({ professional, onEdit, onDelete }: Props) => {
  const tc = useTranslations('common')
  const t = useTranslations('professionals')
  return <Card className="group overflow-hidden p-0 transition-all hover:-translate-y-0.5 hover:shadow-lg">
    <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950">
      {professional.profileImage?<img src={professional.profileImage} alt={professional.name} className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"/>:<div className="grid size-full place-items-center text-white/35"><UserRound size={64} strokeWidth={1.2}/></div>}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-5 pb-4 pt-12">
        <h2 className="text-lg font-semibold text-white">{professional.name}</h2>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-white/70"><Scissors size={12}/>{professional.services.length} {t('servicesCount')}</p>
      </div>
    </div>
    <div className="p-5">
      <div className="mb-4 space-y-2 text-sm text-text-muted">
        <p className="flex items-center gap-2"><Phone size={14} className="text-gold"/>{formatBRPhone(professional.phone)}</p>
        <p className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-gold"/><span className="line-clamp-2">{professional.address}</span></p>
      </div>
      <div className="mb-5 min-h-12"><ProfessionalServiceBadges services={professional.services}/></div>
      <div className="grid grid-cols-2 gap-2 border-t border-border pt-4">
        <Button variant="outline" size="sm" className="justify-center" onClick={onEdit}><Pencil size={12}/>{tc('edit')}</Button>
        <Button variant="danger" size="sm" className="justify-center" onClick={onDelete}><Trash2 size={12}/>{tc('delete')}</Button>
      </div>
    </div>
  </Card>
}
