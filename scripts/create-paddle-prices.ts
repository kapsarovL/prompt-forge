/**
 * Creates 3-tier Paddle products and prices (monthly + yearly each).
 * Run once: pnpm tsx scripts/create-paddle-prices.ts
 *
 * Uses the PADDLE_API_KEY (live server-side key) — never exposed to client.
 */
import { Paddle } from '@paddle/paddle-node-sdk';

const API_KEY = process.env.PADDLE_API_KEY;
if (!API_KEY) {
  console.error('Missing PADDLE_API_KEY env var');
  process.exit(1);
}

const paddle = new Paddle(API_KEY);

interface TierDef {
  name: string;
  description: string;
  monthPrice: string; // amount in cents as string, e.g. '900' = $9.00
  yearPrice: string;
  currency: string;
}

const TIERS: TierDef[] = [
  {
    name: 'Starter',
    description: 'For freelancers getting started with AI prompt crafting.',
    monthPrice: '900',
    yearPrice: '9000',
    currency: 'USD',
  },
  {
    name: 'Pro',
    description: 'For professionals who craft prompts daily for multiple clients.',
    monthPrice: '1900',
    yearPrice: '19000',
    currency: 'USD',
  },
  {
    name: 'Advanced',
    description: 'For teams and agencies with heavy prompt workflows.',
    monthPrice: '3900',
    yearPrice: '39000',
    currency: 'USD',
  },
];

async function main() {
  const results: Record<string, { productId: string; monthPriceId: string; yearPriceId: string }> = {};

  for (const tier of TIERS) {
    console.log(`\nCreating product: ${tier.name}…`);

    const product = await paddle.products.create({
      name: `PromptForge ${tier.name}`,
      description: tier.description,
      taxCategory: 'standard',
    });
    console.log(`  Product: ${product.id}`);

    const monthPrice = await paddle.prices.create({
      productId: product.id,
      description: `PromptForge ${tier.name} — Monthly`,
      unitPrice: { amount: tier.monthPrice, currencyCode: tier.currency as never },
      billingCycle: { interval: 'month', frequency: 1 },
      taxMode: 'account_setting',
    });
    console.log(`  Monthly price: ${monthPrice.id}`);

    const yearPrice = await paddle.prices.create({
      productId: product.id,
      description: `PromptForge ${tier.name} — Yearly`,
      unitPrice: { amount: tier.yearPrice, currencyCode: tier.currency as never },
      billingCycle: { interval: 'year', frequency: 1 },
      taxMode: 'account_setting',
    });
    console.log(`  Yearly price: ${yearPrice.id}`);

    results[tier.name] = {
      productId: product.id,
      monthPriceId: monthPrice.id,
      yearPriceId: yearPrice.id,
    };
  }

  console.log('\n\n=== RESULTS ===');
  console.log(JSON.stringify(results, null, 2));

  console.log('\n\n=== .env.local entries ===');
  for (const [name, ids] of Object.entries(results)) {
    const key = name.toUpperCase().replace(' ', '_');
    console.log(`NEXT_PUBLIC_PRICE_ID_${key}_MONTH=${ids.monthPriceId}`);
    console.log(`NEXT_PUBLIC_PRICE_ID_${key}_YEAR=${ids.yearPriceId}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
