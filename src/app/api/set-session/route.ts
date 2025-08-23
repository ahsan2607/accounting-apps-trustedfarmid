// ./src/app/api/set-session/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Setting session cookie with:', body);
    const response = NextResponse.json({ success: true });
    response.cookies.set('trusted-farm-session', JSON.stringify(body), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes (900 seconds)
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('Error setting session:', error);
    return NextResponse.json({ success: false, error: 'Failed to set session' }, { status: 500 });
  }
}