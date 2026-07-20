'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePaddle } from '@/hooks/use-paddle';
import { TIERS, getPriceId, type Tier } from '@/lib/paddle/tiers';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface PriceItem {
  priceId: string;
  formattedTotals: { total: string };
  formattedUnitTotals: { total: string };
}

interface PricingTiersProps {
  countryCode?: string | null;
  customerEmail?: string | null;
}

export function PricingTiers({ countryCode, customerEmail }: PricingTiersProps) {
  const { paddle, loading: paddleLoading } = usePaddle();
  const [billing, setBilling] = useState<'month' | 'year'>('month');
  const [prices, setPrices] = useState<Map<string, PriceItem>>(new Map());
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  // Fetch localized prices via Paddle.PricePreview
  useEffect(() => {
    if (!paddle) return;

    let cancelled = false;

    async function fetchPrices() {
      setLoadingPrices(true);
      try {
        const priceIds = TIERS.map((t) => ({
          priceId: t.priceId[billing],
          quantity: 1,
        }));

        const preview = await paddle!.PricePreview({
          items: priceIds,
          ...(countryCode ? { address: { countryCode } } : {}),
        });

        if (cancelled) return;

        const map = new Map<string, PriceItem>();
        for (const item of preview.data.details.lineItems ?? []) {
          map.set(item.price.id, {
            priceId: item.price.id,
            formattedTotals: item.formattedTotals,
            formattedUnitTotals: item.formattedUnitTotals,
          });
        }
        setPrices(map);
      } catch (err) {
        console.error('[PricingTiers] PricePreview failed:', err);
      } finally {
        if (!cancelled) setLoadingPrices(false);
      }
    }

    fetchPrices();
    return () => { cancelled = true; };
  }, [paddle, billing, countryCode]);

  const openCheckout = useCallback(
    (tier: Tier) => {
      if (!paddle) return;
      const priceId = getPriceId(tier, billing);
      if (!priceId) return;

      setCheckoutLoading(tier.name);
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
          customData: {
            tier: tier.name,
            billing,
          },
        });
      } catch (err) {
        console.error('[PricingTiers] Checkout open failed:', err);
      } finally {
        setCheckoutLoading(null);
      }
    },
    [paddle, billing, customerEmail],
  );

  return (
    <div className="w-full">
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <button
          onClick={() => setBilling('month')}
          className={`text-sm font-medium transition-colors ${
            billing === 'month' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBilling('year')}
          className={`relative text-sm font-medium transition-colors ${
            billing === 'year' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Yearly
          <span className="absolute -top-3 -right-12 text-[10px] font-mono tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full whitespace-nowrap">
            Save 2 months
          </span>
        </button>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {TIERS.map((tier, i) => {
          const price = prices.get(tier.priceId[billing]);
          const isPopular = tier.name === 'Pro';

          return (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                isPopular
                  ? 'border-amber-500/30 bg-zinc-900/80'
                  : 'border-white/5 bg-zinc-900/50'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-500/20">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-1">{tier.name}</h3>
                <p className="text-sm text-zinc-500">{tier.description}</p>
              </div>

              <div className="mb-6">
                {loadingPrices || !price ? (
                  <div className="h-12 flex items-center">
                    <Loader2 className="w-5 h-5 text-zinc-600 animate-spin" />
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-white">
                      {price.formattedTotals.total}
                    </span>
                    <span className="text-sm text-zinc-500">
                      /{billing === 'month' ? 'mo' : 'yr'}
                    </span>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => openCheckout(tier)}
                disabled={paddleLoading || loadingPrices || !price || checkoutLoading !== null}
                className={`group w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                  isPopular
                    ? 'bg-white text-black hover:bg-zinc-200'
                    : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-white/5'
                }`}
              >
                {checkoutLoading === tier.name ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
