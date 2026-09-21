import { NextResponse } from 'next/server';
import { authorize, signOut, COOKIE_NAME, cookieOptions } from '@/lib/cms/auth';
import { failure } from '@/lib/cms/http';
export async function POST(request: Request) {
  try {
    await authorize(request, true);
    await signOut();
    const response = NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
    response.cookies.set(COOKIE_NAME, '', { ...cookieOptions, maxAge: 0 });
    return response;
  } catch (error) {
    return failure(error);
  }
}
