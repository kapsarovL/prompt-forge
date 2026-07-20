/**
 * 3-tier pricing configuration.
 *
 * Edit prices here — they map to Paddle price IDs created via
 * scripts/create-paddle-prices.ts.
 */

export interface Tier {
  name: 'Starter' | 'Pro' | 'Advanced';
  description: string;
  features: string[];
  priceId: { month: string; year: string };
}

export const TIERS: Tier[] = [
  {
    name: 'Starter',
    description: 'For freelancers getting started with AI prompt crafting.',
    features: [
      'Unlimited prompt generation',
      'Multi-provider support (Gemini, Claude, GPT, OpenCode)',
      'AI-powered refinement & evaluation',
      'Client-side encryption for API keys',
    ],
    priceId: {
      month: process.env.NEXT_PUBLIC_PRICE_ID_STARTER_MONTH ?? '',
      year: process.env.NEXT_PUBLIC_PRICE_ID_STARTER_YEAR ?? '',
    },
  },
  {
    name: 'Pro',
    description: 'For professionals who craft prompts daily for multiple clients.',
    features: [
      'Everything in Starter',
      'Auto-fix weak prompts',
      'Version history & comparison',
      'Priority support',
    ],
    priceId: {
      month: process.env.NEXT_PUBLIC_PRICE_ID_PRO_MONTH ?? '',
      year: process.env.NEXT_PUBLIC_PRICE_ID_PRO_YEAR ?? '',
    },
  },
  {
    name: 'Advanced',
    description: 'For teams and agencies with heavy prompt workflows.',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom prompt templates',
      'Dedicated support',
      'All future updates included',
    ],
    priceId: {
      month: process.env.NEXT_PUBLIC_PRICE_ID_ADVANCED_MONTH ?? '',
      year: process.env.NEXT_PUBLIC_PRICE_ID_ADVANCED_YEAR ?? '',
    },
  },
];

/** All price IDs for the current billing cycle — used by PricePreview. */
export function getAllPriceIds(billing: 'month' | 'year'): string[] {
  return TIERS.map((t) => t.priceId[billing]).filter(Boolean);
}

/** Price ID for a specific tier and billing cycle. */
export function getPriceId(
  tier: Tier,
  billing: 'month' | 'year',
): string {
  return tier.priceId[billing];
}
