import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * POST /revalidate-hero — purge the homepage so hero slideshow changes appear
 * instantly. Gated by the admin HttpOnly cookie.
 */
export async function POST(): Promise<NextResponse> {
  const jar = await cookies();
  if (!jar.get('access_token')?.value) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  revalidatePath('/');

  return NextResponse.json({ ok: true, revalidated: true, at: Date.now() });
}
