import { AuthLayout } from "@/components/user/auth/auth-layout"
import { LoginForm } from "@/components/user/auth/login-form"

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Sometime account"
    >
      <LoginForm />
    </AuthLayout>
  )
}




