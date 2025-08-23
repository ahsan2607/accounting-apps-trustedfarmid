// ./src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get('trusted-farm-session')?.value;
  const protectedPaths = ['/dashboard'];

  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    if (!sessionCookie) {
      console.log('No session cookie found, redirecting to /login');
      return NextResponse.redirect(new URL('/login', req.url));
    }
    try {
      const session = JSON.parse(sessionCookie);
      const loginTime = new Date(session.loginTime);
      const currentTime = new Date();
      const hoursSinceLogin = (currentTime.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      if (!session.authenticated || hoursSinceLogin > 0.25) { // 0.25 hours = 15 minutes
        console.log('Session invalid or expired:', { authenticated: session.authenticated, hoursSinceLogin });
        return NextResponse.redirect(new URL('/login', req.url));
      }
      // Session is valid, refresh it
      console.log('Session valid, refreshing:', session.username);
      const response = NextResponse.next();
      const updatedSession = {
        ...session,
        loginTime: new Date().toISOString(),
      };
      response.cookies.set('trusted-farm-session', JSON.stringify(updatedSession), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60, // 15 minutes
        path: '/',
      });
      return response;
    } catch (error) {
      console.error('Error parsing session cookie:', error);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};