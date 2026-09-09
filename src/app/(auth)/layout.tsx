import { GuestGuard } from '@/components/layout/GuestGuard'

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <GuestGuard>{children}</GuestGuard>
)

export default AuthLayout
