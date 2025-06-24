
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/', '/create-document', '/approvals', '/activity-log', '/analytics', '/reports', '/management'];
const AUTH_ROUTE = '/auth';
const SESSION_COOKIE_NAME = 'procuretrack-session-cookie';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow all requests for static files, images, and API routes to pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const isAccessingProtectedRoute = PROTECTED_ROUTES.some(p => pathname.startsWith(p) && (p !== '/' || pathname === '/'));
  const isAccessingAuthRoute = pathname.startsWith(AUTH_ROUTE);
  
  // If user has a session cookie and tries to access the auth page, redirect to home
  if (sessionCookie && isAccessingAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user does not have a session cookie and is trying to access a protected route, redirect to auth page
  if (!sessionCookie && isAccessingProtectedRoute) {
    return NextResponse.redirect(new URL(AUTH_ROUTE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - This pattern is now handled inside the middleware logic itself.
     * The matcher can be simplified to run on almost everything, and we filter inside.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
