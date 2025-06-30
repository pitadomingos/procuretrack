
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDbPool } from '../../../../../backend/db.js';
import { SignJWT } from 'jose';

const SESSION_COOKIE_NAME = 'procuretrack-session-cookie';
const JWT_SECRET = process.env.JWT_SECRET;

// Helper to get the secret key as a Uint8Array
function getJwtSecretKey(): Uint8Array {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set!');
  }
  return new TextEncoder().encode(JWT_SECRET);
}

export async function POST(request: Request) {
  try {
    if (!JWT_SECRET) {
      console.error('[API_ERROR] /api/auth/login: JWT_SECRET is not configured on the server.');
      return NextResponse.json({ error: 'Server configuration error: JWT secret is missing.' }, { status: 500 });
    }

    const pool = await getDbPool();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const [rows]: any[] = await pool.execute(
      'SELECT id, name, email, role, isActive, password FROM User WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const user = rows[0];

    if (!user.isActive) {
      return NextResponse.json({ error: 'Your account is inactive. Please contact an administrator.' }, { status: 403 });
    }
    
    // In a real production app, use bcrypt.compare(password, user.password)
    const isValid = password === user.password;

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Create JWT
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const expiresIn = '7d';

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(getJwtSecretKey());

    // Set the JWT in an HTTP-Only cookie
    cookies().set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: '/',
      sameSite: 'lax',
    });
    
    // Do not send the password back to the client
    const { password: _, ...userResponse } = user;
    return NextResponse.json(userResponse);

  } catch (error: any) {
    console.error('[API_ERROR] /api/auth/login POST:', error);
    
    // Use the specific error message from getDbPool or a default
    const errorMessage = error.message.includes('DB_') ? error.message : 'An internal server error occurred during login.';
    
    return NextResponse.json({ 
        error: errorMessage, 
        details: `[${error.code || 'NO_CODE'}] ${error.message}`
    }, { status: 500 });
  }
}
