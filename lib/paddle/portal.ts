import { getPaddleClient } from './client';
import { getDb } from '../db';
import { customers, subscriptions } from '../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Creates a Paddle Customer Portal session for a given customer.
 *
 * The portal lets customers manage their billing, update payment methods,
 * and view invoices — all hosted by Paddle.
 *
 * @param paddleCustomerId — Paddle customer ID (e.g. "ctm_...")
 * @returns The portal session URL, or null if customer not found or has no subscriptions
 */
export async function createPortalSession(paddleCustomerId: string): Promise<string | null> {
  // 1. Resolve internal customer
  const customer = await getDb().query.customers.findFirst({
    where: eq(customers.paddleCustomerId, paddleCustomerId),
  });
  if (!customer) return null;

  // 2. Get active subscriptions for this customer
  const subs = await getDb().query.subscriptions.findMany({
    where: eq(subscriptions.customerId, customer.id),
  });

  const subscriptionIds = subs
    .filter((s: { status: string }) => s.status === 'active' || s.status === 'trialing' || s.status === 'past_due')
    .map((s: { paddleSubscriptionId: string }) => s.paddleSubscriptionId);

  // 3. For one-time purchases with no subscriptions, we still need a valid
  //    subscription ID for the portal. If none exist, we can't open a portal
  //    session — the customer should contact support instead.
  if (subscriptionIds.length === 0) return null;

  // 4. Create portal session via Paddle SDK
  const paddle = getPaddleClient();
  const session = await paddle.customerPortalSessions.create(
    customer.paddleCustomerId,
    subscriptionIds,
  );

  return session.urls.general.overview;
}
