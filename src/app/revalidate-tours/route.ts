import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * POST /revalidate-tours — on-demand cache purge for the public tour pages.
 *
 * Called by the admin panel right after any tour mutation (toggle active,
 * create, update, delete) so hidden/edited tours disappear or update for
 * visitors INSTANTLY, instead of waiting for the ISR timer. We purge every
 * route that renders tour data: the home listing, ALL detail pages, the
 * booking page and the sitemap.
 *
 * Lives outside `/api/*` (which next.config rewrites to the backend) and is
 * gated by the admin HttpOnly cookie so only a signed-in admin can trigger it.
 */
export async function POST(): Promise<NextResponse> {
  const jar = await cookies();
  if (!jar.get('access_token')?.value) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  revalidatePath('/'); // home listings (+ footer)
  revalidatePath('/tours/[slug]', 'page'); // every tour detail page
  revalidatePath('/booking'); // booking picker
  revalidatePath('/sitemap.xml'); // SEO

  return NextResponse.json({ ok: true, revalidated: true, at: Date.now() });
}
