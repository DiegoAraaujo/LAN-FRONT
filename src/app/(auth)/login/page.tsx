import { AuthExperience } from '@/components/ui/travel-connect-signin-1'
import { LoginForm } from '@/features/auth/components/LoginForm'

const LoginPage = () => (
  <AuthExperience mode="login" eyebrow="Acesso seguro" title="Bem-vindo de volta" description="Entre para acessar sua agenda e acompanhar seu negócio.">
    <LoginForm />
  </AuthExperience>
)

export default LoginPage
