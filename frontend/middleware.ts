import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/my-bookings',
  '/profile',
  '/maintenance',
  '/venues',
  '/admin',
]

// Routes that are only for admins
const adminRoutes = [
  '/admin',
]

// Routes that are only for organizers
const organizerRoutes = [
  '/dashboard',
  '/my-bookings',
  '/maintenance',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes to pass through
  if (pathname === '/' || pathname === '/login') {
    return NextResponse.next()
  }

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // For protected routes, we need to verify auth
  // Since middleware can't access client context, we'll add a header
  // The frontend will handle the actual auth check
  
  // Add a security header to indicate this is a protected route
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-protected-route', 'true')
  
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isOrganizerRoute = organizerRoutes.some(route => pathname.startsWith(route))
  
  if (isAdminRoute) {
    requestHeaders.set('x-required-role', 'ADMIN')
  } else if (isOrganizerRoute) {
    requestHeaders.set('x-required-role', 'ORGANIZER')
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
