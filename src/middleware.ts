import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'procuretrack-session-cookie';

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ['/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const isAuthenticated = !!sessionCookie;

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // If user is authenticated
  if (isAuthenticated) {
    // If they try to access a public route (like the login page), redirect them to the dashboard
    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } 
  // If user is not authenticated
  else {
    // If they try to access a protected route, redirect them to the login page
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  // Allow the request to proceed if no redirect is needed
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
