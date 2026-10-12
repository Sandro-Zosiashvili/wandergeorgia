import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DEFAULT_LOCALE, LOCALES } from '@/lib/locale';

/**
 * Edge proxy. (Next.js 16 renamed the former "middleware" file convention to
 * "proxy" — same capabilities, runs at the edge in front of the app.) It does
 * three things, in order:
 *
 *   1. Canonical-host redirect — WWW → apex, so Google doesn't index both.
 *   2. Admin gate — the private /admin dashboard requires the backend cookie.
 *   3. Locale routing — public pages live under /en and /ru; a request with no
 *      locale prefix is redirected to the default locale, and the active locale
 *      is exposed to Server Components (e.g. <html lang>) via a request header.
 */

const WWW_HOST = 'www.wanderkartli.com';
const CANONICAL_HOST = 'wanderkartli.com';

/** Matches a filename with an extension (static assets). */
const PUBLIC_FILE = /\.[^/]+$/;

/** Paths that are NOT localized (admin tool, API, SEO files, internals). */
function isExcluded(pathname: string): boolean {
  return (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/revalidate') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/favicon.ico' ||
    PUBLIC_FILE.test(pathname)
  );
}

export function proxy(request: NextRequest): NextResponse {
  // 1. Canonical host: send WWW → apex with a permanent redirect, keeping the
  //    path and query. Localhost, LAN and preview hosts are left untouched.
  const host = request.headers.get('host')?.split(':')[0] ?? '';
  if (host === WWW_HOST) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.host = CANONICAL_HOST;
    url.port = '';
    return NextResponse.redirect(url, 301);
  }

  const { pathname } = request.nextUrl;

  // 2. Admin gate: the private dashboard under /admin requires the backend's
  //    `access_token` cookie. The admin area is English-only, so it is handled
  //    here and then falls through to the non-localized pass below.
  if (pathname.startsWith('/admin')) {
    const hasToken = Boolean(request.cookies.get('access_token')?.value);
    const isLoginPage = pathname === '/admin/login';

    if (!hasToken && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (hasToken && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // 3a. Non-localized paths (admin, api, SEO files, assets) pass through.
  if (isExcluded(pathname)) return NextResponse.next();

  // 3b. Localized public paths.
  const first = pathname.split('/')[1] ?? '';
  const hasLocale = (LOCALES as readonly string[]).includes(first);

  if (hasLocale) {
    const headers = new Headers(request.headers);
    headers.set('x-locale', first);
    return NextResponse.next({ request: { headers } });
  }

  // No locale prefix → redirect to the default locale, preserving the path.
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  /**
   * Run on every request EXCEPT Next's build output and image optimizer, so
   * canonical-host, admin and locale rules all apply to pages, sitemap.xml,
   * robots.txt and favicons.
   */
  matcher: ['/((?!_next/static|_next/image).*)'],
};
