// ./src/app/api/logout/route.ts (Next.js)
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('trusted-farm-session');
  return response;
}