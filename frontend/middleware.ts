import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/login', '/singup', '/auth/login', '/auth/singup']
const protectedRoutes = ['/home', '/challenges', '/profile', '/progress_tracker', '/learing_partner', '/Community']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const pathname = new URL(request.url).pathname

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to home if accessing auth pages with token
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/home/striver-a2z-dsa-course', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
