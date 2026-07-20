import type { Metadata } from "next";
import LegalLayout from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Refund Policy — PromptForge",
  description: "Refund policy for PromptForge.",
};

export default function RefundPage() {
  return (
    <LegalLayout>
      <h1>Refund Policy</h1>
      <p className="text-sm text-zinc-500">Last updated: July 20, 2026</p>

      <h2>Free Trial</h2>
      <p>
        PromptForge offers a 7-day free trial. No payment is required to start the trial.
        If you decide PromptForge is not for you, simply stop using it before the trial ends
        and you will not be charged.
      </p>

      <h2>One-Time Purchase</h2>
      <p>
        After the trial, PromptForge is a one-time purchase of $5 USD (or local equivalent).
        If you are not satisfied, you may request a full refund within <strong>30 days</strong> of
        your purchase.
      </p>

      <h2>How to Request a Refund</h2>
      <p>
        To request a refund, open an issue on our{" "}
        <a href="https://github.com/prismaflux/prompt-forge" target="_blank" rel="noopener noreferrer">
          GitHub repository
        </a>{" "}
        or contact us directly. Include your purchase email and we will process your refund
        promptly.
      </p>

      <h2>Processing</h2>
      <p>
        Refunds are processed through Paddle within 5-10 business days. The refund will be
        credited to the original payment method.
      </p>

      <h2>After Refund</h2>
      <p>
        After a refund is processed, your access to PromptForge will be revoked. Any prompts
        you generated remain in your browser&apos;s localStorage — we have no ability to remove
        client-side data.
      </p>
    </LegalLayout>
  );
}
