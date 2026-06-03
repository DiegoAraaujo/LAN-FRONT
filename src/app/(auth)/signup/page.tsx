import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { SignupForm } from '@/features/auth/components/SignupForm'

const SignupPage = () => (
  <div className="flex flex-col items-center w-full max-w-sm">
    <div className="w-16 h-16 bg-gold-btn rounded-2xl flex items-center justify-center mb-5 shadow-md">
      <UserPlus size={30} className="text-text" strokeWidth={1.8} />
    </div>
    <h1 className="text-3xl font-bold text-text mb-2 text-center">Criar sua conta</h1>
    <p className="text-sm text-text-muted mb-8 text-center">Preencha os dados abaixo para começar</p>
    <div className="bg-surface rounded-2xl p-7 w-full shadow-sm border border-border">
      <SignupForm />
    </div>
  </div>
)

export default SignupPage
