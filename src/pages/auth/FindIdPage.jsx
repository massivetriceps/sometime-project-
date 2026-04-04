import { AuthLayout } from "@/components/auth/auth-layout"
import { FindIdForm } from "@/components/auth/find-id-form"

export default function FindIdPage() {
  return (
    <AuthLayout
      title="Find your email"
      subtitle="Enter your information to recover your registered email"
    >
      <FindIdForm />
    </AuthLayout>
  )
}
