import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  // Public routes - allow access
  const publicRoutes = [
    '/',
    '/ueber-uns',
    '/kontakt',
    '/termine',
    '/downloads',
    '/login',
    '/api/auth',
  ]

  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Protected routes require authentication
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const isAdmin = token.role === 'ADMIN'
  const isMember = token.role === 'MEMBER' || isAdmin

  // Protect admin routes
  if (pathname.startsWith('/admin') && !isAdmin) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Protect member routes
  if (
    (pathname.startsWith('/athleten') ||
      pathname.startsWith('/stats') ||
      pathname.startsWith('/profile')) &&
    !isMember
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/athleten/:path*',
    '/stats/:path*',
    '/profile/:path*',
  ],
}
