// ./src/app/api/proxy/route.ts (Next.js - renamed to route.ts for App Router)
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { ApiResponse, ProxyRequestBody } from '@/types';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzf9lxmxRXyf0hapV0GXaGAdA7flFj5-vw7iAGzFu2I1E3M57ZzMJnp5qoypvNADrnL/exec';
const API_KEY = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'; // Same as in Apps Script

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ProxyRequestBody;
  
  // Check session cookie (except for checkLogin)
  if (body.action !== 'checkLogin') {
    const sessionCookie = req.cookies.get('trusted-farm-session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const session = JSON.parse(sessionCookie);
    const loginTime = new Date(session.loginTime).getTime();
    const currentTime = new Date().getTime();
    const hoursSinceLogin = (currentTime - loginTime) / (1000 * 60 * 60);
    if (!session.authenticated || hoursSinceLogin > 24) {
      return NextResponse.json({ success: false, error: 'Session expired' }, { status: 401 });
    }
  }

  // Add API key to body
  const proxiedBody = { ...body, apiKey: API_KEY };

  try {
    const response = await axios.post<ApiResponse<unknown>>(APPS_SCRIPT_URL, proxiedBody, {
      headers: { 'Content-Type': 'application/json' },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return NextResponse.json(
        { success: false, error: error.response.data.error || 'Proxy error' },
        { status: error.response.status }
      );
    }
    return NextResponse.json({ success: false, error: 'Network error' }, { status: 500 });
  }
}