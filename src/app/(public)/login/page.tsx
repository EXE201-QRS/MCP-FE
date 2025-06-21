import { LoginForm } from "@/components/auth/login-form-simple"
import { AuthPageLayout } from "@/components/auth/auth-page-layout"

export default function LoginPage() {
  return (
    <AuthPageLayout
      title="Đăng nhập vào MCP-QOS"
      subtitle="Quản lý hệ thống QR Ordering một cách chuyên nghiệp"
    >
      <LoginForm />
    </AuthPageLayout>
  )
}
