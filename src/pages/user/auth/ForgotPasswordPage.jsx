import { AuthLayout } from "@/components/user/auth/auth-layout"
import { ForgotPasswordForm } from "@/components/user/auth/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}




