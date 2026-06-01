import { AppShell } from '@/components/layout/AppShell'
import { AuthGuard } from '@/components/layout/AuthGuard'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard>
    <AppShell>{children}</AppShell>
  </AuthGuard>
)

export default DashboardLayout
