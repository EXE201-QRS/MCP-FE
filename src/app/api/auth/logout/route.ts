import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Remove httpOnly cookie
    cookieStore.set("sessionToken", "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 0, // Delete immediately
    });

    return NextResponse.json({ message: "Đăng xuất thành công" });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message ?? "Có lỗi xảy ra",
      },
      { status: 500 }
    );
  }
}
