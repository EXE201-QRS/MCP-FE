import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const status = searchParams.get("status");
    const planName = searchParams.get("planName");
    const restaurantName = searchParams.get("restaurantName");

    // Check payment status
    if (status === "PAID" || status === "success") {
      // Payment successful - redirect to success page
      const successUrl = new URL("/payment/success", request.url);
      if (orderId) successUrl.searchParams.set("orderId", orderId);
      if (amount) successUrl.searchParams.set("amount", amount);
      if (planName) successUrl.searchParams.set("planName", planName);
      if (restaurantName) successUrl.searchParams.set("restaurantName", restaurantName);

      return NextResponse.redirect(successUrl);
    } else {
      // Payment failed - redirect to failed page
      const failedUrl = new URL("/payment/failed", request.url);
      if (orderId) failedUrl.searchParams.set("orderId", orderId);
      if (amount) failedUrl.searchParams.set("amount", amount);
      failedUrl.searchParams.set("error", status || "PAYMENT_FAILED");

      return NextResponse.redirect(failedUrl);
    }
  } catch (error) {
    // Redirect to failed page with system error
    const failedUrl = new URL("/payment/failed", request.url);
    failedUrl.searchParams.set("error", "SYSTEM_ERROR");
    
    return NextResponse.redirect(failedUrl);
  }
}
