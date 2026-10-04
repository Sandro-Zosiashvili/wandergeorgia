/**
 * Admin auth API client. Every call includes `credentials: 'include'` so the
 * backend's HttpOnly `access_token` cookie is sent/stored by the browser.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export interface AdminUser {
  id?: string;
  email: string;
  role: string;
}

/** Sign in. Throws with a user-facing message on failure. */
export async function adminLogin(email: string, password: string): Promise<AdminUser> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/auth/login`, {
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
    await fetch(`${API_URL}/api/auth/logout`, {
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
    const res = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
    if (!res.ok) return null;
    const data = (await res.json()) as { user: AdminUser };
    return data.user ?? null;
  } catch {
    return null;
  }
}
