import { NextResponse } from 'next/server';
import { assertOrigin, signIn, COOKIE_NAME, cookieOptions } from '@/lib/cms/auth';
import { readJson, failure } from '@/lib/cms/http';
import { CmsError } from '@/lib/cms/store';
export async function POST(request: Request) {
  try {
    assertOrigin(request);
    const body = await readJson(request);
    if (
      typeof body.email !== 'string' ||
      typeof body.password !== 'string' ||
      body.email.length > 254 ||
      body.password.length > 128
    )
      throw new CmsError('Enter your email and password.', 422);
    const result = await signIn(body.email, body.password);
    const response = NextResponse.json(
      { redirect: result.mustChangePassword ? '/admin/account' : '/admin' },
      { headers: { 'Cache-Control': 'no-store' } },
    );
    response.cookies.set(COOKIE_NAME, result.token, cookieOptions);
    return response;
  } catch (error) {
    return failure(error);
  }
}
