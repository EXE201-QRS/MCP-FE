import authApiRequest from "@/apiRequests/auth";
import { LoginBodySchema } from "@/schemaValidations/auth.model";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const bodyValidated = LoginBodySchema.safeParse(body);

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
    const result = await authApiRequest.sLogin(bodyValidated.data);
    
    const sessionToken = result.payload.data.sessionToken;

    // Set httpOnly cookie cho middleware
    cookieStore.set("sessionToken", sessionToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Trả về response bao gồm cả token cho client-side
    const response = {
      ...result.payload,
      sessionToken // Include token for client-side
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.payload?.message ?? "Có lỗi xảy ra",
      },
      { status: error?.status ?? 500 }
    );
  }
}
