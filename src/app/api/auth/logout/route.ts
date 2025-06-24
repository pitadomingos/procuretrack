import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'procuretrack-session-cookie';

export async function POST() {
  try {
    // Clear the session cookie by setting its maxAge to a past value
    cookies().set(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: -1,
      path: '/',
    });

    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (error: any) {
    console.error('Error logging out:', error);
    return NextResponse.json({ error: 'Failed to log out', details: error.message }, { status: 500 });
  }
}
