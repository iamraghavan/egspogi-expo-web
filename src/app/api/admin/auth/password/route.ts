import { NextResponse } from 'next/server';
import { authorize, changePassword, COOKIE_NAME, cookieOptions } from '@/lib/cms/auth';
import { readJson, failure } from '@/lib/cms/http';
import { CmsError } from '@/lib/cms/store';
export async function POST(request: Request) {
  try {
    const admin = await authorize(request, true);
    const body = await readJson(request);
    if (
      typeof body.current !== 'string' ||
      typeof body.password !== 'string' ||
      body.current.length > 128
    )
      throw new CmsError('Enter both passwords.', 422);
    await changePassword(admin, body.current, body.password);
    const response = NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
    response.cookies.set(COOKIE_NAME, '', { ...cookieOptions, maxAge: 0 });
    return response;
  } catch (error) {
    return failure(error);
  }
}
