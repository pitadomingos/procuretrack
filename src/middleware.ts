
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/', '/create-document', '/approvals', '/activity-log', '/analytics', '/reports', '/management'];
const AUTH_ROUTE = '/auth';
const SESSION_COOKIE_NAME = 'procuretrack-session-cookie';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  const isAuthPage = pathname.startsWith(AUTH_ROUTE);
  
  // If user is on an auth page
  if (isAuthPage) {
    // If they have a session, redirect them to the home page
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Otherwise, let them see the auth page
    return NextResponse.next();
  }

  // Check if the current path is one of the protected routes.
  const isProtectedRoute = PROTECTED_ROUTES.some(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });
  
  // If it's a protected route and the user has no session, redirect to auth page
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL(AUTH_ROUTE, request.url));
  }
  
  // Otherwise, allow the request to proceed
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
     * This ensures the middleware runs only on pages and not on assets.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
