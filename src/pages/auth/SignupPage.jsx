import { AuthLayout } from "@/components/auth/auth-layout"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join the Gachon University community"
    >
      <SignupForm />
    </AuthLayout>
  )
}
