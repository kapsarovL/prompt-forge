'use server';

import { getSession } from '@/lib/auth';
import { hasActiveAccess } from '@/lib/paddle/access';

/**
 * Server action: checks whether the current user has active access.
 *
 * Usage from client components:
 * ```ts
 * import { checkAccess } from '@/lib/actions/access';
 * const { hasAccess } = await checkAccess();
 * ```
 *
 * Returns `{ hasAccess: false }` if not authenticated — the client should
 * prompt the user to purchase.
 */
export async function checkAccess(): Promise<{ hasAccess: boolean }> {
  const session = await getSession();
  if (!session) return { hasAccess: false };

  const access = await hasActiveAccess(session.paddleCustomerId);
  return { hasAccess: access };
}
