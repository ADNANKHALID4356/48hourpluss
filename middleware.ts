// middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_key_minimum_32_characters_long'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Intercept all administrative paths (/admin/*)
  if (pathname.startsWith('/admin')) {
    // Skip protection for the login view itself to prevent infinite redirect loops
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get('admin_session')?.value;

    if (!sessionCookie) {
      // Redirect to the login panel if no session cookie exists
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Verify JWT signature using jose
      await jwtVerify(sessionCookie, JWT_SECRET);
      return NextResponse.next(); // Signature is valid, allow page render
    } catch (err) {
      console.warn('Unauthorized admin access attempt: invalid session token.');
      
      // Token is expired, tampered with, or invalid; clear session and redirect to login
      const redirectResponse = NextResponse.redirect(new URL('/admin/login', request.url));
      redirectResponse.cookies.delete('admin_session');
      return redirectResponse;
    }
  }

  return NextResponse.next();
}

// Configure middleware matcher to only run on admin pages for performance
export const config = {
  matcher: ['/admin/:path*'],
};