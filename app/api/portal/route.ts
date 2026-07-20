import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createPortalSession } from '@/lib/paddle/portal';

/**
 * GET /api/portal
 *
 * Creates a Paddle Customer Portal session and redirects the user.
 * Authenticates via server-side session cookie — no query params.
 *
 * Flow:
 * 1. Read session cookie → resolve Paddle customer ID
 * 2. Look up active subscriptions in DB
 * 3. Mint Paddle portal session URL
 * 4. Redirect to Paddle-hosted portal
 */
export async function GET(): Promise<NextResponse> {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 },
    );
  }

  const url = await createPortalSession(session.paddleCustomerId);

  if (!url) {
    return NextResponse.json(
      { error: 'No active subscriptions found' },
      { status: 404 },
    );
  }

  return NextResponse.redirect(url);
}
