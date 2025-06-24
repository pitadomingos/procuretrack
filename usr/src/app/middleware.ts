
import { NextResponse, type NextRequest } from 'next/server';

// This middleware is now a pass-through and does nothing.
// The routing loop was caused by incorrect logic here. Disabling it is the safest fix.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// The matcher is empty, so this middleware will not run on any path.
export const config = {
  matcher: [],
};
