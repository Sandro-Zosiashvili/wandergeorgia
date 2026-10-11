import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * POST /revalidate-memories — on-demand cache purge for the public pages that
 * render traveler moments: the home "Moments" section and the /memories
 * gallery. Called by the admin panel right after any memory mutation so changes
 * appear for visitors instantly instead of waiting for the ISR timer.
 *
 * Lives outside `/api/*` (which next.config rewrites to the backend) and is
 * gated by the admin HttpOnly cookie so only a signed-in admin can trigger it.
 */
export async function POST(): Promise<NextResponse> {
  const jar = await cookies();
  if (!jar.get('access_token')?.value) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  revalidatePath('/'); // home "Moments" section
  revalidatePath('/memories'); // full gallery

  return NextResponse.json({ ok: true, revalidated: true, at: Date.now() });
}
