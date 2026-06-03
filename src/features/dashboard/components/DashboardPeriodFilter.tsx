'use client'

const MONTHS = [
  { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' }, { value: 3, label: 'Março' },
  { value: 4, label: 'Abril'   }, { value: 5, label: 'Maio'      }, { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho'   }, { value: 8, label: 'Agosto'    }, { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro'}, { value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' },
]
const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

interface Props {
  year: number; month?: number
  onYearChange: (y: number) => void
  onMonthChange: (m: number | undefined) => void
}

export const DashboardPeriodFilter = ({ year, month, onYearChange, onMonthChange }: Props) => (
  <div className="flex items-center gap-2">
    <select value={month ?? ''} onChange={e => onMonthChange(e.target.value ? Number(e.target.value) : undefined)}
      className="border border-border bg-surface rounded-lg px-3 py-2 text-sm cursor-pointer">
      <option value="">Todos os meses</option>
      {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
    </select>
    <select value={year} onChange={e => onYearChange(Number(e.target.value))}
      className="border border-border bg-surface rounded-lg px-3 py-2 text-sm cursor-pointer">
      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
    </select>
  </div>
)
