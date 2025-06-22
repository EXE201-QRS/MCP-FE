import authApiRequest from "@/apiRequests/auth";
import { RegisterBodySchema } from "@/schemaValidations/auth.model";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const bodyValidated = RegisterBodySchema.safeParse(body);

    if (!bodyValidated.success) {
      return NextResponse.json(
        {
          message: "Dữ liệu không hợp lệ",
          errors: bodyValidated.error.issues,
        },
        { status: 422 }
      );
    }

    const cookieStore = await cookies();
    const result = await authApiRequest.sRegister(bodyValidated.data);

    // Set httpOnly cookie
    cookieStore.set("sessionToken", result.payload.data.sessionToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60, // 1 hour
    });

    return NextResponse.json(result.payload);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.payload?.message ?? "Có lỗi xảy ra",
      },
      { status: error?.status ?? 500 }
    );
  }
}
