import { AuthExperience } from '@/components/ui/travel-connect-signin-1'
import { SignupForm } from '@/features/auth/components/SignupForm'

const SignupPage = () => (
  <AuthExperience mode="signup" eyebrow="Comece agora" title="Crie sua conta" description="Preencha seus dados para começar a organizar sua barbearia.">
    <SignupForm />
  </AuthExperience>
)

export default SignupPage
