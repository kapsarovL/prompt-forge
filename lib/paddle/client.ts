import { Paddle } from '@paddle/paddle-node-sdk';

/**
 * Server-only Paddle SDK client.
 * Uses the live API key. The same client is used for webhooks (signature
 * verification via `paddle.webhooks.unmarshal`) and portal session minting.
 *
 * Lazy-initialized singleton.
 */

let _client: Paddle | null = null;

export function getPaddleClient(): Paddle {
  if (!_client) {
    const apiKey = process.env.PADDLE_API_KEY;
    if (!apiKey) throw new Error('Missing PADDLE_API_KEY');
    _client = new Paddle(apiKey);
  }
  return _client;
}
