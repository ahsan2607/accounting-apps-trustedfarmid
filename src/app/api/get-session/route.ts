// ./src/app/api/get-session/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get('trusted-farm-session')?.value;
  if (!sessionCookie) {
    return NextResponse.json({ success: false, error: 'No session' }, { status: 401 });
  }
  try {
    const session = JSON.parse(sessionCookie);
    const loginTime = new Date(session.loginTime);
    const currentTime = new Date();
    const hoursSinceLogin = (currentTime.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
    if (!session.authenticated || hoursSinceLogin > 0.25) {
      return NextResponse.json({ success: false, error: 'Session expired' }, { status: 401 });
    }
    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error('Error parsing session:', error);
    return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
  }
}