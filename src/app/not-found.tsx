"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
      <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
        404
      </span>
      <h2 className="font-heading my-2 text-2xl font-bold">
        Không tìm thấy trang
      </h2>
      <p>
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang
        trang khác.
      </p>
      <div className="mt-8 flex justify-center gap-2">
        <Button onClick={() => router.back()} variant="default" size="lg">
          Quay lại
        </Button>
        <Button onClick={() => router.push("/login")} variant="ghost" size="lg">
          Về trang chủ
        </Button>
      </div>
    </div>
  );
}
