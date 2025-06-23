import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getAuth } from './lib/firebase/server';

const PROTECTED_ROUTES = ['/', '/create-document', '/approvals', '/activity-log', '/analytics', '/reports', '/management'];
const AUTH_ROUTE = '/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    ['/favicon.ico', '/jachris-logo.png', '/headerlogo.png'].includes(pathname)
  ) {
    return NextResponse.next();
  }

  const sessionCookie = cookies().get(process.env.SESSION_COOKIE_NAME!)?.value;

  // Redirect to auth page if trying to access a protected route without a session
  if (!sessionCookie && PROTECTED_ROUTES.some(p => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = AUTH_ROUTE;
    return NextResponse.redirect(url);
  }

  try {
    if (sessionCookie) {
      // Verify the session cookie. If invalid, it will throw an error.
      await getAuth().verifySessionCookie(sessionCookie, true);

      // If user is authenticated and tries to access the auth page, redirect to home
      if (pathname === AUTH_ROUTE) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  } catch (error) {
    // Session cookie is invalid. Clear it and redirect to auth page.
    const response = NextResponse.redirect(new URL(AUTH_ROUTE, request.url));
    response.cookies.set(process.env.SESSION_COOKIE_NAME!, '', { maxAge: -1 });
    return response;
  }

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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
