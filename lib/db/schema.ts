import { pgTable, text, timestamp, integer, unique } from 'drizzle-orm/pg-core';

/**
 * Mirrors Paddle customer identity.
 * One row per Paddle customer — upserted on `customer.created` / `customer.updated`.
 */
export const customers = pgTable(
  'customers',
  {
    id: text('id').primaryKey(),
    paddleCustomerId: text('paddle_customer_id').notNull().unique(),
    email: text('email'),
    name: text('name'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [unique('customers_email_idx').on(t.email)],
);

/**
 * Tracks one-time purchases (transactions).
 * One row per Paddle transaction — upserted on `transaction.completed`.
 */
export const purchases = pgTable(
  'purchases',
  {
    id: text('id').primaryKey(),
    customerId: text('customer_id')
      .notNull()
      .references(() => customers.id),
    paddleTransactionId: text('paddle_transaction_id').notNull().unique(),
    productId: text('product_id').notNull(),
    priceId: text('price_id').notNull(),
    amount: integer('amount').notNull(),
    currency: text('currency').notNull(),
    status: text('status').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [unique('purchases_customer_idx').on(t.customerId)],
);

/**
 * Mirrors Paddle subscription state.
 * One row per Paddle subscription — upserted on subscription lifecycle events.
 */
export const subscriptions = pgTable(
  'subscriptions',
  {
    id: text('id').primaryKey(),
    customerId: text('customer_id')
      .notNull()
      .references(() => customers.id),
    paddleSubscriptionId: text('paddle_subscription_id').notNull().unique(),
    productId: text('product_id').notNull(),
    priceId: text('price_id'),
    status: text('status').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [unique('subscriptions_customer_idx').on(t.customerId)],
);
