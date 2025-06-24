import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'procuretrack-session-cookie';

export async function GET(request: Request) {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // In a real app with JWTs, you would verify the token here.
    // For this prototype, we parse the user data stored directly in the cookie.
    const userData = JSON.parse(sessionCookie.value);
    
    // You might want to re-validate against the DB here in a real app,
    // but for session restoration, this is often sufficient.
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error parsing session cookie:', error);
    // If cookie is malformed, treat as unauthenticated
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}
