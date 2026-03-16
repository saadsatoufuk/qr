import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow public routes
  if (
    pathname.startsWith('/menu') ||
    pathname.startsWith('/api') ||
    pathname === '/admin/login' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // /admin/setup — conditionally allow based on tenant setup status
  if (pathname === '/admin/setup') {
    try {
      const checkUrl = new URL('/api/check-setup', request.url);
      const res = await fetch(checkUrl.toString(), {
        headers: { host: request.headers.get('host') || '' },
      });
      const data = await res.json();

      if (data.setupComplete) {
        // Setup already done for this tenant — redirect away
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      // Setup not done — allow access
      return NextResponse.next();
    } catch {
      // If check fails, allow access (fail-open for first-time setup)
      return NextResponse.next();
    }
  }

  // For all other /admin/* routes, require authentication
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
