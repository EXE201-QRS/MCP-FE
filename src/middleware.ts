import { NextRequest, NextResponse } from "next/server"

const privatePaths = ["/manage", "/customer"]
const authPaths = ["/login", "/register", "/forgot-password"]

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get("sessionToken")?.value

  // Check if the current path requires authentication
  const isPrivatePath = privatePaths.some((path) => pathname.startsWith(path))
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path))

  // If trying to access private path without session token
  if (isPrivatePath && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If trying to access auth pages with valid session token, redirect based on role
  if (isAuthPath && sessionToken) {
    try {
      // Decode JWT token to get user role
      const parts = sessionToken.split('.')
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]))
        
        // Redirect based on role
        if (payload.roleName === 'ADMIN_SYSTEM') {
          return NextResponse.redirect(new URL("/manage/dashboard", request.url))
        } else {
          return NextResponse.redirect(new URL("/customer/dashboard", request.url))
        }
      }
    } catch (error) {
      // If token decode fails, clear it and continue
      const response = NextResponse.next()
      response.cookies.set("sessionToken", "", { maxAge: 0 })
      return response
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
