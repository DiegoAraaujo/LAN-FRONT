import Link from 'next/link'
import { Shield } from 'lucide-react'
import { LoginForm } from '@/features/auth/components/LoginForm'

const LoginPage = () => (
  <div className="flex flex-col items-center w-full max-w-sm">
    <div className="w-16 h-16 bg-gold-btn rounded-2xl flex items-center justify-center mb-5 shadow-md">
      <Shield size={30} className="text-text" strokeWidth={1.8} />
    </div>
    <h1 className="text-3xl font-bold text-text mb-2 text-center">Bem-vindo de volta</h1>
    <p className="text-sm text-text-muted mb-8 text-center">Acesse sua conta para gerenciar os serviços</p>
    <div className="bg-surface rounded-2xl p-7 w-full shadow-sm border border-border">
      <LoginForm />
    </div>
  </div>
)

export default LoginPage
