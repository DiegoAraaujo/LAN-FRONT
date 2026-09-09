import { Suspense } from 'react'
import { DashboardClient } from '@/features/dashboard/components/DashboardClient'
import { LoadingState } from '@/components/ui/luma-spin'
export default function DashboardPage() {
  return <Suspense fallback={<LoadingState label="Carregando…" className="min-h-[420px]" />}><DashboardClient/></Suspense>
}
