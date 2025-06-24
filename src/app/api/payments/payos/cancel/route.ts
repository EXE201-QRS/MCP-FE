import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const planId = searchParams.get("planId");

    // Redirect to failed page with cancellation info
    const failedUrl = new URL("/payment/failed", request.url);
    if (orderId) failedUrl.searchParams.set("orderId", orderId);
    if (amount) failedUrl.searchParams.set("amount", amount);
    if (planId) failedUrl.searchParams.set("planId", planId);
    failedUrl.searchParams.set("error", "CANCELLED");

    return NextResponse.redirect(failedUrl);
  } catch (error) {
    // Redirect to failed page with system error
    const failedUrl = new URL("/payment/failed", request.url);
    failedUrl.searchParams.set("error", "SYSTEM_ERROR");
    
    return NextResponse.redirect(failedUrl);
  }
}
