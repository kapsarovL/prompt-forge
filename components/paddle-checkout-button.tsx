'use client';

import { usePaddle } from '@/hooks/use-paddle';
import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface PaddleCheckoutButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  priceId: string;
  customerEmail?: string;
  children: ReactNode;
  onCheckoutStarted?: () => void;
  onCheckoutError?: (error: unknown) => void;
}

/**
 * Wraps a button to open Paddle Checkout overlay on click.
 *
 * Falls back to a plain disabled button while Paddle.js loads.
 * Shows a spinner during initialization.
 */
export function PaddleCheckoutButton({
  priceId,
  customerEmail,
  children,
  onCheckoutStarted,
  onCheckoutError,
  disabled,
  className,
  ...rest
}: PaddleCheckoutButtonProps) {
  const { paddle, loading } = usePaddle();

  const handleClick = () => {
    if (!paddle) return;
    try {
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
      onCheckoutStarted?.();
    } catch (err) {
      onCheckoutError?.(err);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading || !paddle}
      className={className}
      {...rest}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading…
        </span>
      ) : (
        children
      )}
    </button>
  );
}
