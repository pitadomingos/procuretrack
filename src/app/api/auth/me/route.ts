
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });


const SESSION_COOKIE_NAME = 'procuretrack-session-cookie';
const JWT_SECRET = process.env.JWT_SECRET;

// Helper to get the secret key as a Uint8Array
function getJwtSecretKey(): Uint8Array {
  if (!JWT_SECRET) {
    // This should not happen if the login check is in place, but good for safety.
    throw new Error('JWT_SECRET environment variable is not set!');
  }
  return new TextEncoder().encode(JWT_SECRET);
}

export async function GET(request: Request) {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json({ error: 'Not authenticated. No session cookie found.' }, { status: 401 });
  }

  const token = sessionCookie.value;

  try {
    // Verify the JWT
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    
    // Return the user data from the token's payload
    return NextResponse.json(payload);
  } catch (error) {
    // Token is invalid (expired, malformed, wrong signature)
    console.warn('JWT verification failed:', error instanceof Error ? error.message : 'Unknown error');
    
    // Create a response to clear the invalid cookie
    const response = NextResponse.json(
      { error: 'Invalid session. Please log in again.' },
      { status: 401 }
    );
    response.cookies.set(SESSION_COOKIE_NAME, '', { maxAge: -1, path: '/' });
    return response;
  }
}
