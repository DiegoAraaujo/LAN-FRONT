'use client'
import { Pencil, Trash2 } from 'lucide-react'
import { ProfessionalServiceBadges } from './ProfessionalServiceBadges'
import type { Professional } from '../api/professionals.api'

interface Props { professional: Professional; index: number; onEdit: () => void; onDelete: () => void }

export const ProfessionalTableRow = ({ professional, index, onEdit, onDelete }: Props) => (
  <tr className={index > 0 ? 'border-t border-border' : ''}>
    <td className="px-5 py-4 font-semibold text-sm text-text">{professional.name}</td>
    <td className="px-5 py-4 text-sm text-text-muted">{professional.phone}</td>
    <td className="px-5 py-4 text-sm text-text-muted">{professional.address}</td>
    <td className="px-5 py-4"><ProfessionalServiceBadges services={professional.services} /></td>
    <td className="px-5 py-4">
      <div className="flex gap-2">
        <button onClick={onEdit} className="w-7 h-7 flex items-center justify-center rounded text-gold hover:bg-amber-50 transition-colors">
          <Pencil size={14} />
        </button>
        <button onClick={onDelete} className="w-7 h-7 flex items-center justify-center rounded text-red-400 hover:bg-red-50 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </td>
  </tr>
)
