import { ForgotPasswordForm } from "@/components/auth/forgot-password-form-simple"
import { AuthPageLayout } from "@/components/auth/auth-page-layout"

export default function ForgotPasswordPage() {
  return (
    <AuthPageLayout
      title="Khôi phục mật khẩu"
      subtitle="Nhập email và mã OTP để đặt lại mật khẩu của bạn"
    >
      <ForgotPasswordForm />
    </AuthPageLayout>
  )
}
