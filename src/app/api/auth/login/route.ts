import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { pool } from '../../../../../backend/db.js';

const SESSION_COOKIE_NAME = 'procuretrack-session-cookie';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const [rows]: any[] = await pool.execute(
      'SELECT id, name, email, role, isActive FROM User WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const user = rows[0];

    if (!user.isActive) {
      return NextResponse.json({ error: 'Your account is inactive. Please contact an administrator.' }, { status: 403 });
    }

    // THIS IS A PROTOTYPE PASSWORD CHECK. DO NOT USE IN PRODUCTION.
    // In a real app, you would use a library like bcrypt to compare a hashed password.
    // e.g., const isValid = await bcrypt.compare(password, user.passwordHash);
    const isValid = password.length > 0; // For demo, any password works.

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // In a real app, you would generate a secure, signed JWT here.
    // For this prototype, we store user data directly in the cookie.
    const sessionData = JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
    });
    
    const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 days

    cookies().set(SESSION_COOKIE_NAME, sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn / 1000,
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json(user);

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
