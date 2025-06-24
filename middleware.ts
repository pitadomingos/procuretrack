
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/', '/create-document', '/approvals', '/activity-log', '/analytics', '/reports', '/management'];
const AUTH_ROUTE = '/auth';
const SESSION_COOKIE_NAME = 'procuretrack-session-cookie';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isApiRoute = pathname.startsWith('/api/');
  const isStaticFile = pathname.startsWith('/_next/') || pathname.startsWith('/static/') || /^\/.*\.(ico|png|jpg|jpeg|svg|css|js)$/.test(pathname);
  
  // Skip middleware for API routes and static files
  if (isApiRoute || isStaticFile) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  const isAccessingProtectedRoute = PROTECTED_ROUTES.some(p => pathname.startsWith(p));
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
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * This simplified matcher is generally sufficient. The logic inside handles /api routes.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
