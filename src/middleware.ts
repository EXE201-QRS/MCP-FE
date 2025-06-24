import { NextRequest, NextResponse } from "next/server"

// Route definitions
const adminPaths = ["/manage"]
const customerPaths = ["/customer"]
const authPaths = ["/login", "/register", "/forgot-password"]
const publicPaths = ["/", "/blog", "/contact", "/product"]

// Helper function to decode JWT token
function decodeToken(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]))
      
      // Check if token is expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return null // Token expired
      }
      
      return payload
    }
  } catch (error) {
    console.error('Token decode error:', error)
  }
  return null
}

// Helper function to check if path requires specific role
function getRequiredRole(pathname: string): 'ADMIN_SYSTEM' | 'CUSTOMER' | null {
  if (adminPaths.some(path => pathname.startsWith(path))) {
    return 'ADMIN_SYSTEM'
  }
  if (customerPaths.some(path => pathname.startsWith(path))) {
    return 'CUSTOMER'
  }
  return null
}

// Helper function to get default route for role
function getDefaultRouteForRole(role: string): string {
  switch (role) {
    case 'ADMIN_SYSTEM':
      return '/manage/dashboard'
    case 'CUSTOMER':
      return '/customer/dashboard'
    default:
      return '/login'
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get("sessionToken")?.value

  // Check path types
  const isAuthPath = authPaths.some(path => pathname.startsWith(path))
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'))
  const requiredRole = getRequiredRole(pathname)
  const isProtectedPath = requiredRole !== null

  // Case 1: Accessing protected paths without token
  if (isProtectedPath && !sessionToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Case 2: Has token - validate and check permissions
  if (sessionToken) {
    const payload = decodeToken(sessionToken)
    
    // Invalid token - clear and redirect to login
    if (!payload || !payload.roleName) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.set('sessionToken', '', { maxAge: 0, path: '/' })
      return response
    }

    const userRole = payload.roleName

    // Case 2a: Accessing auth pages while logged in - redirect to dashboard
    if (isAuthPath) {
      return NextResponse.redirect(new URL(getDefaultRouteForRole(userRole), request.url))
    }

    // Case 2b: Accessing protected path - check role permissions
    if (isProtectedPath && requiredRole) {
      // Admin trying to access customer routes
      if (userRole === 'ADMIN_SYSTEM' && requiredRole === 'CUSTOMER') {
        return NextResponse.redirect(new URL('/manage/dashboard', request.url))
      }
      
      // Customer trying to access admin routes
      if (userRole === 'CUSTOMER' && requiredRole === 'ADMIN_SYSTEM') {
        return NextResponse.redirect(new URL('/customer/dashboard', request.url))
      }
      
      // User doesn't have required role
      if (userRole !== requiredRole) {
        return NextResponse.redirect(new URL(getDefaultRouteForRole(userRole), request.url))
      }
    }

    // Case 2c: Accessing root path - redirect to appropriate dashboard
    if (pathname === '/') {
      return NextResponse.redirect(new URL(getDefaultRouteForRole(userRole), request.url))
    }
  }

  // Case 3: No token and accessing public paths or auth paths - allow
  if (!sessionToken && (isPublicPath || isAuthPath)) {
    return NextResponse.next()
  }

  // Default: allow the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|assets|public).*)",
  ],
}
