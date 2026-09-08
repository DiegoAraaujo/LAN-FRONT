import { Suspense } from 'react'
import { DashboardClient } from '@/features/dashboard/components/DashboardClient'
export default function DashboardPage() {
  return <Suspense fallback={<div className="m-8 h-80 rounded-2xl bg-border/50 animate-pulse" />}><DashboardClient/></Suspense>
}
