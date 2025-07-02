import envConfig from "@/config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { message: "Không tìm thấy token" },
        { status: 401 }
      );
    }

    // Call backend API to get user info
    try {
      const response = await fetch(
        `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          return NextResponse.json(
            { message: "Token không hợp lệ hoặc đã hết hạn" },
            { status: 401 }
          );
        }
        throw new Error(`Backend API error: ${response.status}`);
      }

      const userData = await response.json();
      return NextResponse.json(userData);
    } catch (fetchError: any) {
      console.error("Error calling backend /auth/me:", fetchError);
      return NextResponse.json(
        { message: "Không thể lấy thông tin người dùng từ server" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Unexpected error in /api/auth/me:", error);
    return NextResponse.json(
      { message: error?.message ?? "Có lỗi xảy ra" },
      { status: 500 }
    );
  }
}
