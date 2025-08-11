
// ./src/app/api/proxy/page.ts
import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { ApiResponse, ProxyRequestBody } from '@/types';

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzf9lxmxRXyf0hapV0GXaGAdA7flFj5-vw7iAGzFu2I1E3M57ZzMJnp5qoypvNADrnL/exec';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ProxyRequestBody;

    const response = await axios.post<ApiResponse<unknown>>(APPS_SCRIPT_URL, body, {
      headers: { 'Content-Type': 'application/json' },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return NextResponse.json(
        {
          success: false,
          error: error.response.data.error || 'Proxy error',
        },
        { status: error.response.status }
      );
    }
    return NextResponse.json({ success: false, error: 'Network error' }, { status: 500 });
  }
}

// // ./src/app/api/proxy/page.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import axios, { AxiosError } from 'axios';
// import { ApiResponse, ProxyRequestBody } from '@/types';

// const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzf9lxmxRXyf0hapV0GXaGAdA7flFj5-vw7iAGzFu2I1E3M57ZzMJnp5qoypvNADrnL/exec'; // Replace with your Apps Script URL

// export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<unknown>>) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ success: false, error: 'Method not allowed' });
//   }

//   try {
//     const response = await axios.post<ApiResponse<unknown>>(APPS_SCRIPT_URL, req.body as ProxyRequestBody, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     return res.status(response.status).json(response.data);
//   } catch (error) {
//     if (error instanceof AxiosError && error.response) {
//       return res.status(error.response.status).json({
//         success: false,
//         error: error.response.data.error || 'Proxy error',
//       });
//     }
//     return res.status(500).json({ success: false, error: 'Network error' });
//   }
// }