// ./src/middleware.ts (Next.js)
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get('trusted-farm-session')?.value;
  const protectedPaths = ['/dashboard'];

  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    const session = JSON.parse(sessionCookie);
    const loginTime = new Date(session.loginTime).getTime();
    const currentTime = new Date().getTime();
    const hoursSinceLogin = (currentTime - loginTime) / (1000 * 60 * 60);
    if (!session.authenticated || hoursSinceLogin > 24) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};