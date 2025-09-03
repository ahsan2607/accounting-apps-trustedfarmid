// ./src/app/api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { ApiResponse, ProxyRequestBody } from '@/types';

const APPS_SCRIPT_URL = process.env.API_URL || "";
const API_KEY = process.env.API_KEY || "";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ProxyRequestBody;

  if (body.action !== 'checkLogin') {
    const sessionCookie = req.cookies.get('trusted-farm-session')?.value;
    if (!sessionCookie) {
      console.log('No session cookie in proxy, action:', body.action);
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
      const session = JSON.parse(sessionCookie);
      const loginTime = new Date(session.loginTime);
      const currentTime = new Date();
      const hoursSinceLogin = (currentTime.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      if (!session.authenticated || hoursSinceLogin > 0.25) { // 0.25 hours = 15 minutes
        console.log('Invalid session in proxy:', { authenticated: session.authenticated, hoursSinceLogin });
        return NextResponse.json({ success: false, error: 'Session expired' }, { status: 401 });
      }
      console.log('Session valid in proxy, refreshing:', session.username);
    } catch (error) {
      console.error('Error parsing session in proxy:', error);
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
    }
  }

  const proxiedBody = { ...body, apiKey: API_KEY };

  try {
    const response = await axios.post<ApiResponse<unknown>>(APPS_SCRIPT_URL, proxiedBody, {
      headers: { 'Content-Type': 'application/json' },
    });
    // Refresh session cookie on successful API call
    const sessionCookie = req.cookies.get('trusted-farm-session')?.value;
    if (sessionCookie && body.action !== 'checkLogin') {
      const session = JSON.parse(sessionCookie);
      const updatedSession = {
        ...session,
        loginTime: new Date().toISOString(),
      };
      const nextResponse = NextResponse.json(response.data, { status: response.status });
      nextResponse.cookies.set('trusted-farm-session', JSON.stringify(updatedSession), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60, // 15 minutes
        path: '/',
      });
      return nextResponse;
    }
    if (response.data.error) {
      return NextResponse.json({ success: false, error: response.data.error });
    } else {
      return NextResponse.json(response.data, { status: response.status });
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return NextResponse.json(
        { success: false, error: error.response.data.error || 'Proxy error' },
        { status: error.response.status }
      );
    }
    console.error('Proxy network error:', error);
    return NextResponse.json({ success: false, error: 'Network error' }, { status: 500 });
  }
}