import { getDb } from '../db';
import { customers, purchases, subscriptions } from '../db/schema';
import { eq, and, or } from 'drizzle-orm';

/**
 * Access-granting subscription statuses.
 * Subscriptions in these states grant the customer access to PromptForge.
 */
const ACCESS_STATUSES = ['active', 'trialing'] as const;

/**
 * Checks whether a customer has active access to PromptForge.
 *
 * Access is granted when:
 * - A completed purchase exists (one-time $5), OR
 * - A subscription in an access-granting status exists (active/trialing)
 *
 * This is the single source of truth for access decisions.
 * Call it server-side only (API routes, server actions, middleware).
 *
 * @param paddleCustomerId — Paddle customer ID (e.g. "ctm_...")
 * @returns true if the customer has access
 */
export async function hasActiveAccess(paddleCustomerId: string): Promise<boolean> {
  const customer = await getDb().query.customers.findFirst({
    where: eq(customers.paddleCustomerId, paddleCustomerId),
  });
  if (!customer) return false;

  // 1. Check for completed purchase (one-time $5)
  const purchase = await getDb().query.purchases.findFirst({
    where: and(
      eq(purchases.customerId, customer.id),
      eq(purchases.status, 'completed'),
    ),
  });
  if (purchase) return true;

  // 2. Check for active/trialing subscription (scoped to THIS customer)
  const subscription = await getDb().query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.customerId, customer.id),
      or(
        ...ACCESS_STATUSES.map((status) => eq(subscriptions.status, status)),
      ),
    ),
  });

  return !!subscription;
}

/**
 * Resolves a Paddle customer ID to internal customer data.
 * Returns null if no customer record exists.
 */
export async function getCustomerByPaddleId(paddleCustomerId: string) {
  return getDb().query.customers.findFirst({
    where: eq(customers.paddleCustomerId, paddleCustomerId),
  });
}
