import { cookies } from 'next/headers';

/**
 * Server-side session resolution.
 *
 * CURRENT: Reads a Paddle customer ID from a cookie. This is a placeholder
 * until a real auth system (NextAuth, Clerk, etc.) is wired up.
 *
 * FUTURE: Replace with your auth provider's server-side session getter,
 * then resolve the Paddle customer ID from your users table.
 */

const SESSION_COOKIE = 'pf_session';

export interface Session {
  paddleCustomerId: string;
}

/**
 * Resolves the current user's session from cookies.
 * Returns null if no session exists or the cookie is malformed.
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  // Current format: plain paddleCustomerId (e.g. "ctm_...")
  // In production, this should be a signed JWT or encrypted session token.
  if (raw.startsWith('ctm_')) {
    return { paddleCustomerId: raw };
  }

  return null;
}

/**
 * Sets the session cookie.
 * Call this after successful Paddle checkout or login.
 */
export async function setSession(paddleCustomerId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, paddleCustomerId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}

/**
 * Clears the session cookie.
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
