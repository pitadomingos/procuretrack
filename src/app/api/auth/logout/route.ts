import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear the session cookie by setting its maxAge to 0
    cookies().set(process.env.SESSION_COOKIE_NAME!, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: -1, // Set to a past date
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error logging out:', error);
    return NextResponse.json({ error: 'Failed to log out', details: error.message }, { status: 500 });
  }
}
