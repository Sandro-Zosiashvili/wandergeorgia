import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Canonical-host redirect. (Next.js 16 renamed the former "middleware" file
 * convention to "proxy" — same capabilities, runs at the edge in front of the
 * app.)
 *
 * We serve the site on ONE hostname — the bare apex `wanderkartli.com` (the
 * domain configured in Vercel) — so Google doesn't index the apex and WWW
 * versions as separate, duplicate pages. Any request that arrives on the WWW
 * host (`www.wanderkartli.com`) is sent to the apex with a 301 (permanent)
 * redirect, keeping the exact path and query string. Localhost, LAN and
 * preview hosts are left untouched so local dev and Vercel previews keep
 * working.
 */

const WWW_HOST = 'www.wanderkartli.com';
const CANONICAL_HOST = 'wanderkartli.com';

export function proxy(request: NextRequest): NextResponse {
  // `host` is the hostname the visitor actually typed (minus any port).
  const host = request.headers.get('host')?.split(':')[0] ?? '';

  if (host === WWW_HOST) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.host = CANONICAL_HOST;
    url.port = '';
    return NextResponse.redirect(url, 301);
  }

  // Admin gate: the private dashboard under /admin requires the backend's
  // `access_token` cookie. (Works when the cookie is on this host — i.e. local
  // dev, or a backend served same-site in production; see the note below.)
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin')) {
    const hasToken = Boolean(request.cookies.get('access_token')?.value);
    const isLoginPage = pathname === '/admin/login';

    // Not signed in → send any admin route (except the login page) to login.
    if (!hasToken && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    // Already signed in → keep them out of the login page.
    if (hasToken && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  /**
   * Run on every request EXCEPT Next's build output and image optimizer, so a
   * visitor hitting `wanderkartli.com/anything` — pages, sitemap.xml,
   * robots.txt, favicons — is redirected to the WWW equivalent.
   */
  matcher: ['/((?!_next/static|_next/image).*)'],
};
