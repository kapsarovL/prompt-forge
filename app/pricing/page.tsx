import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { PricingTiers } from '@/components/pricing/pricing-tiers';

export const metadata: Metadata = {
  title: 'Pricing — PromptForge',
  description:
    'Choose the plan that fits your workflow. Starter, Pro, or Advanced — with country-localized pricing via Paddle.',
};

/**
 * Server component that reads x-vercel-ip-country from request headers
 * and passes it to the client pricing component.
 *
 * If the header is absent, Paddle.PricePreview auto-detects from the
 * visitor's IP.
 */
export default async function PricingPage() {
  const hdrs = await headers();
  const countryCode = hdrs.get('x-vercel-ip-country') ?? null;

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-50 selection:bg-amber-500/30">
      <section className="relative py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-[10px] font-mono tracking-widest uppercase text-amber-400 mb-4">
              Pricing
            </p>
            <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tight">
              Simple, transparent pricing.
            </h2>
            <p className="text-zinc-500 mt-4 text-lg">
              Choose the plan that fits your workflow. Cancel anytime.
            </p>
          </div>

          <PricingTiers countryCode={countryCode} />
        </div>
      </section>
    </main>
  );
}
