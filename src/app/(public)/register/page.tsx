import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { RegisterForm } from "@/components/auth/register-form-simple";

export default function RegisterPage() {
  return (
    <AuthPageLayout
      title="Đăng ký tài khoản Scanorderly"
      subtitle="Bắt đầu quản lý hệ thống QR Ordering của bạn ngay hôm nay"
    >
      <RegisterForm />
    </AuthPageLayout>
  );
}
