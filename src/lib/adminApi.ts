/**
 * Admin auth API client. Calls are SAME-ORIGIN relative paths (`/api/auth/*`)
 * that next.config.ts rewrites to the backend — so the backend's HttpOnly
 * `access_token` cookie is set on this site's own domain (works with the
 * middleware + SameSite=Lax in production). `credentials: 'include'` is kept so
 * the cookie is always sent.
 */

export interface AdminUser {
  id?: string;
  email: string;
  role: string;
}

/** Sign in. Throws with a user-facing message on failure. */
export async function adminLogin(email: string, password: string): Promise<AdminUser> {
  let res: Response;
  try {
    res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error('Can’t reach the server. Check your connection and try again.');
  }

  if (!res.ok) {
    throw new Error(
      res.status === 401
        ? 'Invalid email or password.'
        : 'Something went wrong. Please try again.',
    );
  }

  const data = (await res.json()) as { user: AdminUser };
  return data.user;
}

/** Sign out (clears the cookie on the backend). Never throws. */
export async function adminLogout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    /* ignore — we redirect to login regardless */
  }
}

/** Current admin from the cookie, or null if not authenticated. */
export async function adminMe(): Promise<AdminUser | null> {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (!res.ok) return null;
    const data = (await res.json()) as { user: AdminUser };
    return data.user ?? null;
  } catch {
    return null;
  }
}
