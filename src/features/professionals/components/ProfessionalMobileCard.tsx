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
    <div className="grid min-h-72 grid-cols-[minmax(120px,0.9fr)_minmax(0,1.25fr)] sm:grid-cols-[minmax(160px,0.9fr)_minmax(0,1.25fr)]">
      <div className="relative min-h-full overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950">
        {professional.profileImage?<img src={professional.profileImage} alt={professional.name} className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"/>:<div className="grid size-full min-h-72 place-items-center text-white/35"><UserRound size={64} strokeWidth={1.2}/></div>}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
      </div>
      <div className="flex min-w-0 flex-col p-4 sm:p-5">
        <div>
          <h2 className="break-words text-lg font-semibold text-text">{professional.name}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-text-muted"><Scissors size={12} className="text-gold"/>{professional.services.length} {t('servicesCount')}</p>
        </div>
        <div className="my-4 space-y-2 text-sm text-text-muted">
          <p className="flex items-center gap-2"><Phone size={14} className="shrink-0 text-gold"/><span className="break-all">{formatBRPhone(professional.phone)}</span></p>
          <p className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-gold"/><span className="line-clamp-3">{professional.address}</span></p>
        </div>
        <div className="mb-4 min-h-12"><ProfessionalServiceBadges services={professional.services}/></div>
        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border pt-4">
          <Button aria-label={`${tc('edit')} ${professional.name}`} variant="outline" size="sm" className="justify-center px-2" onClick={onEdit}><Pencil size={12}/><span className="hidden sm:inline">{tc('edit')}</span></Button>
          <Button aria-label={`${tc('delete')} ${professional.name}`} variant="danger" size="sm" className="justify-center px-2" onClick={onDelete}><Trash2 size={12}/><span className="hidden sm:inline">{tc('delete')}</span></Button>
        </div>
      </div>
    </div>
  </Card>
}
