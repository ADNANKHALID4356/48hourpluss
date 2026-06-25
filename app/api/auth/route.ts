// app/api/auth/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_key_minimum_32_characters_long'
);

// POST: Handle admin login and set session cookie
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json(
        { error: 'Admin password is not configured in .env variables' },
        { status: 500 }
      );
    }

    // Verify credentials
    if (username !== expectedUsername || password !== expectedPassword) {
      return NextResponse.json(
        { error: 'Invalid username or password credentials' },
        { status: 401 }
      );
    }

    // Sign a cryptographically secure token valid for 1 day
    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true, message: 'Login successful' });

    // Set the token inside a secure, httpOnly cookie (unreadable by browser scripts)
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 Day in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Failed to process login request' }, { status: 500 });
  }
}

// DELETE: Handle admin logout by clearing the session cookie
export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logout successful' });
  
  // Set the cookie to expire immediately
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return response;
}