import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { LoginForm } from "@/components/auth/login-form-simple";

export default function LoginPage() {
  return (
    <AuthPageLayout
      title="Đăng nhập vào Scanorderly"
      subtitle="Quản lý hệ thống QR Ordering một cách chuyên nghiệp"
    >
      <LoginForm />
    </AuthPageLayout>
  );
}
