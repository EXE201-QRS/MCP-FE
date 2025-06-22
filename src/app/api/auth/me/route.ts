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

    // Decode JWT token manually (simple base64 decode)
    try {
      const parts = sessionToken.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }

      const payload = JSON.parse(atob(parts[1]));

      // Check if token is expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return NextResponse.json(
          { message: "Token đã hết hạn" },
          { status: 401 }
        );
      }

      // TODO: Fetch user data from backend API
      // For now, return mock data
      const user = {
        id: payload.userId,
        email: payload.email,
        name:
          payload.email === "admin@mcpqos.com"
            ? "System Administrator"
            : "Customer User",
        roleName: payload.roleName,
        avatar: null,
        phoneNumber: null,
        createdById: null,
        updatedById: null,
        deletedById: null,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return NextResponse.json({ data: user });
    } catch (decodeError) {
      return NextResponse.json(
        { message: "Token không hợp lệ" },
        { status: 401 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Có lỗi xảy ra" },
      { status: 500 }
    );
  }
}
