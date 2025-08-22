// ./src/app/api/set-session/route.ts (Next.js)
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const response = NextResponse.json({ success: true });
  response.cookies.set('trusted-farm-session', JSON.stringify(body), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  });
  return response;
}