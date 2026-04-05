import { AuthLayout } from "@/components/user/auth/auth-layout"
import { SignupForm } from "@/components/user/auth/signup-form"

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




