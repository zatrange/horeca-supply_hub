import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Simple check for token presence. Real app would verify JWT.
  // Next.js middleware runs on edge, verifying JWT requires 'jose' or just checking existence.
  const authCookie = request.cookies.get('token')?.value; 
  // Wait, token might be in localStorage, not cookie, since it's a simple client-side app.
  // Next.js middleware can't read localStorage. So we will just let it pass, and handle protection in components or we can skip Next.js middleware and use Higher Order Components or useEffects.
  // Actually, let's implement a simple client-side wrapper instead of Next.js middleware since we didn't set up cookies in the backend yet.
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/orders/:path*'],
};
