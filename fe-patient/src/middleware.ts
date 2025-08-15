/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwtPayload(jwt?: string | null) {
  if (!jwt || !jwt.includes('.')) return null;
  try {
    const [, payload] = jwt.split('.');
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // Edge runtime has atob
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || null;
  const userCookie = request.cookies.get('user')?.value || null;

  // Try JSON first; if it fails, try JWT decode
  let user: any = null;
  try {
    user = userCookie ? JSON.parse(userCookie) : null;
  } catch {
    user = decodeJwtPayload(userCookie);
  }

  // Also allow role to come from the access token
  const tokenPayload = decodeJwtPayload(token);
  const role: string | undefined = user?.role ?? tokenPayload?.role;

  const path = request.nextUrl.pathname;
  const publicPaths = ['/', '/login', '/signup', '/api'];
  const isPublicPath = publicPaths.some(p => path === p || path.startsWith(p + '/'));

  // If no token and accessing protected path → login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Authenticated user trying to visit auth pages → dashboard
  if (token && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Role-based restrictions (only if we have a role)
  if (token && role) {
    // /dashboard/doctors → admin only
    if (path.startsWith('/dashboard/doctors') && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    // /dashboard/patients → admin & doctor
    if (path.startsWith('/dashboard/patients') && !['admin', 'doctor'].includes(role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    // /dashboard/biography → patient only
    if (path.startsWith('/dashboard/biography') && role !== 'patient') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.ico|.*\\.svg|.*\\.jpg|.*\\.png|.*\\.webp).*)',
  ],
};
