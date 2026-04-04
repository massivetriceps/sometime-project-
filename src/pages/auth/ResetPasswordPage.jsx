import { AuthLayout } from "@/components/auth/auth-layout"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your new password below"
    >
      <ResetPasswordForm />
    </AuthLayout>
  )
}
