'use client';

import { initializePaddle, type Paddle } from '@paddle/paddle-js';
import { useEffect, useState, useCallback } from 'react';

/**
 * Client-side Paddle.js hook.
 *
 * Initializes Paddle.js from CDN and exposes the instance for
 * price preview and checkout overlays.
 *
 * Requires NEXT_PUBLIC_PADDLE_SELLER_ID in your env.
 */

let paddlePromise: Promise<Paddle | null> | undefined;

function getPaddleInstance(): Promise<Paddle | null> {
  if (!paddlePromise) {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) {
      paddlePromise = Promise.resolve(null);
      return paddlePromise;
    }
    paddlePromise = initializePaddle({
      token,
      environment: 'production',
    }).then((p) => p ?? null).catch(() => null);
  }
  return paddlePromise;
}

export function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getPaddleInstance().then((instance) => {
      if (!cancelled) {
        setPaddle(instance);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const openCheckout = useCallback(
    (priceId: string, customerEmail?: string) => {
      if (!paddle) return;

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        ...(customerEmail ? { customer: { email: customerEmail } } : {}),
        settings: {
          displayMode: 'overlay',
          variant: 'one-page',
          theme: 'dark',
          successUrl: `${window.location.origin}/welcome`,
        },
      });
    },
    [paddle],
  );

  return { paddle, loading, openCheckout };
}
