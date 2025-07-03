import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import { Shield, Eye, Lock, UserCheck, Database, Mail, Phone } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật | Scanorderly",
  description: "Chính sách bảo mật và quyền riêng tư của Scanorderly - Hệ thống QR Order cho nhà hàng",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "01 Tháng 1, 2025";

  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background via-muted/20 to-background py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="outline" className="mb-6 bg-background/50 backdrop-blur">
                <Shield className="mr-2 h-3 w-3" />
                Chính sách bảo mật
              </Badge>
              
              <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Chính sách bảo mật và{" "}
                <span className="text-primary">quyền riêng tư</span>
              </h1>
              
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                Chúng tôi cam kết bảo vệ thông tin cá nhân và quyền riêng tư của bạn. 
                Tài liệu này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.
              </p>

              <div className="inline-flex items-center gap-2 rounded-lg bg-background/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur">
                <Eye className="h-4 w-4" />
                Cập nhật lần cuối: {lastUpdated}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="space-y-12">
                
                {/* 1. Giới thiệu */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-primary" />
                      1. Giới thiệu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Scanorderly ("chúng tôi", "của chúng tôi") là nền tảng cung cấp hệ thống QR Order 
                      cho các nhà hàng và quán ăn. Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết 
                      bảo vệ thông tin cá nhân mà bạn chia sẻ với chúng tôi.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Chính sách này áp dụng cho tất cả người dùng của dịch vụ Scanorderly, bao gồm 
                      chủ nhà hàng, nhân viên và khách hàng cuối cùng sử dụng hệ thống QR Order.
                    </p>
                  </CardContent>
                </Card>

                {/* 2. Thông tin chúng tôi thu thập */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      2. Thông tin chúng tôi thu thập
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">2.1. Thông tin bạn cung cấp trực tiếp:</h4>
                      <ul className="space-y-2 pl-6">
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          Thông tin đăng ký: Họ tên, email, số điện thoại, mật khẩu
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          Thông tin nhà hàng: Tên, địa chỉ, loại hình kinh doanh, thông tin liên hệ
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          Thông tin thanh toán: Chi tiết giao dịch, phương thức thanh toán
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          Đánh giá và phản hồi: Nội dung review, rating, ý kiến khách hàng
                        </li>
                      </ul>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">2.2. Thông tin thu thập tự động:</h4>
                      <ul className="space-y-2 pl-6">
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          Thông tin thiết bị: IP address, loại thiết bị, hệ điều hành, trình duyệt
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          Dữ liệu sử dụng: Thời gian truy cập, trang được xem, tương tác với hệ thống
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          Cookies và tracking: Để cải thiện trải nghiệm người dùng
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* 3. Cách chúng tôi sử dụng thông tin */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      3. Cách chúng tôi sử dụng thông tin
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Chúng tôi sử dụng thông tin của bạn cho các mục đích sau:
                    </p>
                    <ul className="space-y-2 pl-6">
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Cung cấp và vận hành dịch vụ QR Order
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Xử lý thanh toán và quản lý đăng ký dịch vụ
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Gửi thông báo quan trọng về dịch vụ và tài khoản
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Cải thiện và phát triển sản phẩm
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Cung cấp hỗ trợ khách hàng
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Tuân thủ các yêu cầu pháp lý
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* 4. Chia sẻ thông tin */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-primary" />
                      4. Chia sẻ thông tin
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, 
                      trừ các trường hợp sau:
                    </p>
                    <ul className="space-y-2 pl-6">
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Với sự đồng ý rõ ràng của bạn
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Với các đối tác dịch vụ cần thiết (thanh toán, hosting, phân tích)
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Khi được yêu cầu bởi pháp luật hoặc cơ quan có thẩm quyền
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Để bảo vệ quyền lợi và an toàn của chúng tôi và người dùng khác
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* 5. Bảo mật dữ liệu */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      5. Bảo mật dữ liệu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ 
                      thông tin cá nhân của bạn:
                    </p>
                    <ul className="space-y-2 pl-6">
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Mã hóa dữ liệu SSL/TLS cho tất cả truyền tải
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Mã hóa mật khẩu và thông tin nhạy cảm
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Kiểm soát truy cập nghiêm ngặt
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Sao lưu dữ liệu định kỳ
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Giám sát bảo mật 24/7
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* 6. Quyền của bạn */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-primary" />
                      6. Quyền của bạn
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Bạn có các quyền sau đối với thông tin cá nhân của mình:
                    </p>
                    <ul className="space-y-2 pl-6">
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <strong>Quyền truy cập:</strong> Yêu cầu bản sao thông tin cá nhân chúng tôi lưu trữ
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <strong>Quyền chỉnh sửa:</strong> Cập nhật hoặc sửa đổi thông tin không chính xác
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <strong>Quyền xóa:</strong> Yêu cầu xóa thông tin cá nhân trong một số trường hợp
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <strong>Quyền hạn chế:</strong> Yêu cầu hạn chế xử lý thông tin
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <strong>Quyền di chuyển:</strong> Nhận thông tin ở định dạng có thể đọc được
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* 7. Cookies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      7. Cookies và Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Chúng tôi sử dụng cookies và các công nghệ tracking tương tự để:
                    </p>
                    <ul className="space-y-2 pl-6">
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Duy trì phiên đăng nhập của bạn
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Cá nhân hóa trải nghiệm người dùng
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Phân tích cách sử dụng website
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Cải thiện hiệu suất và bảo mật
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed">
                      Bạn có thể quản lý cookies thông qua cài đặt trình duyệt của mình.
                    </p>
                  </CardContent>
                </Card>

                {/* 8. Lưu trữ và xóa dữ liệu */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      8. Lưu trữ và xóa dữ liệu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Chúng tôi chỉ lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết để:
                    </p>
                    <ul className="space-y-2 pl-6">
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Cung cấp dịch vụ theo hợp đồng
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Tuân thủ các nghĩa vụ pháp lý
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Giải quyết tranh chấp và thực thi thỏa thuận
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed">
                      Khi bạn xóa tài khoản, chúng tôi sẽ xóa hoặc ẩn danh hóa thông tin cá nhân của bạn, 
                      trừ khi pháp luật yêu cầu lưu trữ.
                    </p>
                  </CardContent>
                </Card>

                {/* 9. Liên hệ */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      9. Liên hệ với chúng tôi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật này hoặc muốn thực hiện 
                      các quyền của mình, vui lòng liên hệ với chúng tôi:
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium text-foreground">Email</div>
                          <div className="text-sm text-muted-foreground">privacy@scanorderly.com</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium text-foreground">Hotline</div>
                          <div className="text-sm text-muted-foreground">1900 xxx xxx</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 10. Thay đổi chính sách */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      10. Thay đổi chính sách
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian. Khi có thay đổi 
                      quan trọng, chúng tôi sẽ thông báo cho bạn qua:
                    </p>
                    <ul className="space-y-2 pl-6">
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Email thông báo tới địa chỉ đã đăng ký
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Thông báo nổi bật trên website
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        Cập nhật ngày "Cập nhật lần cuối" ở đầu trang này
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed">
                      Việc tiếp tục sử dụng dịch vụ sau khi thay đổi có hiệu lực đồng nghĩa với 
                      việc bạn chấp nhận chính sách mới.
                    </p>
                  </CardContent>
                </Card>

              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}