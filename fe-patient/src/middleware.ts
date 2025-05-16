import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Authentication Middleware
 * 
 * Handles route protection and role-based access control:
 * - Checks for valid authentication token in cookies
 * - Redirects unauthenticated users to login page
 * - Prevents authenticated users from accessing login/signup pages
 * - Enforces role-based restrictions (admin vs patient access)
 * - Allows public access to specified routes
 * 
 * This middleware runs on all routes matching the configured matcher pattern.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const user = request.cookies.get('user')?.value ? JSON.parse(request.cookies.get('user')?.value || '{}') : null;
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = [
    '/login',
    '/signup',
    '/',
    '/api'
  ];

  // Check if the path is a public path
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(publicPath + '/')
  );

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If token exists and user is trying to access auth pages, redirect based on role
  if (token && (path === '/login' || path === '/signup')) {
    if (user?.isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/submitted', request.url));
    }
  }

  // Role-based access control
  if (token && user) {
    // Only admins can access dashboard
    if (path.startsWith('/dashboard') && !user.isAdmin) {
      return NextResponse.redirect(new URL('/submitted', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.ico|.*\\.svg|.*\\.jpg|.*\\.png|.*\\.webp).*)',
  ],
}; 
