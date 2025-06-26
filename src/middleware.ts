import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'procuretrack-session-cookie';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const isAuthenticated = !!sessionCookie;

  const isAuthPage = pathname === '/auth';

  // If the user is on the login page
  if (isAuthPage) {
    // If they are already authenticated, redirect them to the dashboard
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Otherwise, let them see the login page
    return NextResponse.next();
  }

  // For any other page, if the user is not authenticated, redirect them to the login page
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // If the user is authenticated and not on the login page, let them proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - and any public files like images (e.g., login-background.jpg)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
