import { NextRequest, NextResponse } from 'next/server';
import { getPaddleClient } from '@/lib/paddle/client';
import { handlePaddleEvent } from '@/lib/paddle/webhook-handler';

/**
 * POST /api/webhook/paddle
 *
 * Receives Paddle webhook events, verifies the signature using the webhook
 * signing secret, and routes verified events to typed handlers.
 *
 * Paddle sends at-least-once, potentially out-of-order. All handlers are
 * idempotent (upsert on Paddle ID).
 *
 * Raw body must be read as text BEFORE any JSON parsing — the SDK verifies
 * the signature against the raw bytes.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Read raw body as text (critical — signature is over raw bytes)
  const rawBody = await request.text();

  // 2. Get signature from header
  const signature = request.headers.get('paddle-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing paddle-signature header' }, { status: 400 });
  }

  // 3. Verify signature and parse event
  const paddle = getPaddleClient();
  let event;
  try {
    event = await paddle.webhooks.unmarshal(rawBody, process.env.PADDLE_WEBHOOK_SECRET!, signature);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    if (message.includes('signature verification failed')) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }

  // 4. Route to typed handler
  try {
    await handlePaddleEvent(event);
  } catch (e) {
    // Log but don't fail — Paddle will retry, and our handlers are idempotent
    console.error(`[paddle-webhook] Handler error for ${event.eventType}:`, e);
  }

  // 5. Always return 200 — Paddle retries on non-2xx
  return NextResponse.json({ received: true });
}
