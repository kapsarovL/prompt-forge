import {
  type EventEntity,
  type TransactionCompletedEvent,
  type TransactionPaymentFailedEvent,
  type CustomerCreatedEvent,
  type CustomerUpdatedEvent,
  type SubscriptionCreatedEvent,
  type SubscriptionActivatedEvent,
  type SubscriptionTrialingEvent,
  type SubscriptionUpdatedEvent,
  type SubscriptionCanceledEvent,
  type SubscriptionPausedEvent,
  type SubscriptionResumedEvent,
} from '@paddle/paddle-node-sdk';
import { getDb } from '../db';
import { customers, purchases, subscriptions } from '../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Routes a verified Paddle event to the appropriate handler.
 *
 * Call this after `paddle.webhooks.unmarshal()` succeeds — the signature
 * is already verified at that point.
 *
 * All handlers are idempotent: they upsert on Paddle ID, so replaying
 * the same event is safe.
 */
export async function handlePaddleEvent(event: EventEntity): Promise<void> {
  switch (event.eventType) {
    // ── Transaction events ────────────────────────────────────────────
    case 'transaction.completed':
      await handleTransactionCompleted(event as TransactionCompletedEvent);
      break;
    case 'transaction.payment_failed':
      await handlePaymentFailed(event as TransactionPaymentFailedEvent);
      break;

    // ── Customer events ──────────────────────────────────────────────
    case 'customer.created':
      await handleCustomerCreated(event as CustomerCreatedEvent);
      break;
    case 'customer.updated':
      await handleCustomerUpdated(event as CustomerUpdatedEvent);
      break;

    // ── Subscription events ──────────────────────────────────────────
    case 'subscription.created':
      // User signed up — create record, grant trial access
      await handleSubscriptionUpsert(event as SubscriptionCreatedEvent);
      break;
    case 'subscription.trialing':
      await handleSubscriptionUpsert(event as SubscriptionTrialingEvent);
      break;
    case 'subscription.activated':
      // Trial ended, charge successful — grant full access
      await handleSubscriptionUpsert(event as SubscriptionActivatedEvent);
      break;
    case 'subscription.updated':
      await handleSubscriptionUpsert(event as SubscriptionUpdatedEvent);
      break;
    case 'subscription.resumed':
      // Re-enable access after pause
      await handleSubscriptionUpsert(event as SubscriptionResumedEvent);
      break;
    case 'subscription.canceled':
    case 'subscription.paused':
      // Disable access
      await handleSubscriptionDowngrade(
        event as SubscriptionCanceledEvent | SubscriptionPausedEvent,
      );
      break;

    default:
      // Silently ignore events we don't handle — Paddle sends many.
      break;
  }
}

// ─── Transaction handlers ─────────────────────────────────────────────────────

async function handleTransactionCompleted(event: TransactionCompletedEvent): Promise<void> {
  const { data } = event;

  if (data.customerId) {
    await upsertCustomer(data.customerId);
  }

  const customer = data.customerId
    ? await getDb().query.customers.findFirst({
        where: eq(customers.paddleCustomerId, data.customerId),
      })
    : null;
  if (!customer) return;

  const firstItem = data.items[0];
  const priceId = firstItem?.price?.id ?? '';
  const amount = data.details?.totals?.grandTotal
    ? parseInt(data.details.totals.grandTotal, 10)
    : 0;

  await getDb()
    .insert(purchases)
    .values({
      id: `pur_${data.id}`,
      customerId: customer.id,
      paddleTransactionId: data.id,
      productId: firstItem?.price?.productId ?? '',
      priceId,
      amount,
      currency: data.currencyCode,
      status: data.status,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    })
    .onConflictDoUpdate({
      target: purchases.paddleTransactionId,
      set: {
        status: data.status,
        amount,
        updatedAt: new Date(),
      },
    });
}

async function handlePaymentFailed(event: TransactionPaymentFailedEvent): Promise<void> {
  const { data } = event;

  // Log the failure — email notification is TODO
  console.error(
    `[paddle-webhook] Payment failed for transaction ${data.id}, customer ${data.customerId}`,
  );

  // TODO: Send payment-failed email
  // await sendPaymentFailedEmail(data.customerId);
}

// ─── Customer handlers ────────────────────────────────────────────────────────

async function handleCustomerCreated(event: CustomerCreatedEvent): Promise<void> {
  const { data } = event;
  await upsertCustomer(data.id, data.email, data.name, data.createdAt, data.updatedAt);
}

async function handleCustomerUpdated(event: CustomerUpdatedEvent): Promise<void> {
  const { data } = event;
  await upsertCustomer(data.id, data.email, data.name, data.createdAt, data.updatedAt);
}

// ─── Subscription handlers ────────────────────────────────────────────────────

async function handleSubscriptionUpsert(
  event:
    | SubscriptionCreatedEvent
    | SubscriptionActivatedEvent
    | SubscriptionTrialingEvent
    | SubscriptionUpdatedEvent
    | SubscriptionResumedEvent,
): Promise<void> {
  const { data } = event;

  if (data.customerId) {
    await upsertCustomer(data.customerId);
  }

  const customer = data.customerId
    ? await getDb().query.customers.findFirst({
        where: eq(customers.paddleCustomerId, data.customerId),
      })
    : null;
  if (!customer) return;

  const firstItem = data.items[0];
  const productId = firstItem?.price?.productId ?? '';
  const priceId = firstItem?.price?.id ?? '';

  await getDb()
    .insert(subscriptions)
    .values({
      id: `sub_${data.id}`,
      customerId: customer.id,
      paddleSubscriptionId: data.id,
      productId,
      priceId,
      status: data.status,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    })
    .onConflictDoUpdate({
      target: subscriptions.paddleSubscriptionId,
      set: {
        status: data.status,
        productId,
        priceId,
        updatedAt: new Date(),
      },
    });
}

async function handleSubscriptionDowngrade(
  event: SubscriptionCanceledEvent | SubscriptionPausedEvent,
): Promise<void> {
  const { data } = event;

  await getDb()
    .update(subscriptions)
    .set({
      status: data.status,
      updatedAt: new Date(data.updatedAt),
    })
    .where(eq(subscriptions.paddleSubscriptionId, data.id));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function upsertCustomer(
  paddleCustomerId: string,
  email?: string,
  name?: string | null,
  createdAt?: string,
  updatedAt?: string,
): Promise<void> {
  const existing = await getDb().query.customers.findFirst({
    where: eq(customers.paddleCustomerId, paddleCustomerId),
  });

  if (existing) {
    if (email || name) {
      await getDb()
        .update(customers)
        .set({
          ...(email && { email }),
          ...(name !== undefined && { name }),
          updatedAt: new Date(),
        })
        .where(eq(customers.paddleCustomerId, paddleCustomerId));
    }
    return;
  }

  await getDb().insert(customers).values({
    id: `ctm_${paddleCustomerId}`,
    paddleCustomerId,
    email: email ?? null,
    name: name ?? null,
    createdAt: createdAt ? new Date(createdAt) : new Date(),
    updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
  });
}
