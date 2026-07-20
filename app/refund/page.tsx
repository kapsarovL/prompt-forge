import type { Metadata } from "next";
import LegalLayout from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Refund Policy — PromptForge",
  description: "Refund policy for PromptForge purchases.",
};

export default function RefundPage() {
  return (
    <LegalLayout>
      <h1>Refund Policy</h1>
      <p className="text-sm text-zinc-500">Effective date: July 20, 2026</p>

      <h2>1. Overview</h2>
      <p>
        We want you to be satisfied with PromptForge. If the Service does not meet your expectations, you may
        request a refund under the conditions described below.
      </p>

      <h2>2. Eligibility</h2>
      <p>You are eligible for a full refund if:</p>
      <ul>
        <li>You purchased PromptForge within the last <strong>30 days</strong></li>
        <li>You have not previously received a refund for the same purchase</li>
        <li>Your request is made in good faith (the Service did not work as described or did not meet your needs)</li>
      </ul>

      <h2>3. How to Request a Refund</h2>
      <p>To request a refund:</p>
      <ol>
        <li>
          Open an issue on our{" "}
          <a href="https://github.com/prismaflux/prompt-forge" target="_blank" rel="noopener noreferrer">
            GitHub repository
          </a>
          , or contact us directly via the email associated with your purchase.
        </li>
        <li>
          Include your <strong>purchase email</strong> and a brief description of the reason for your refund
          request.
        </li>
        <li>
          We will review your request and respond within <strong>2 business days</strong>.
        </li>
      </ol>

      <h2>4. Processing</h2>
      <p>
        Approved refunds are processed through Paddle within <strong>5&ndash;10 business days</strong>. The
        refund will be credited to the original payment method. Paddle may deduct applicable transaction fees
        as permitted by their terms.
      </p>
      <p>
        You will receive a confirmation email from Paddle once the refund has been processed.
      </p>

      <h2>5. After a Refund</h2>
      <p>
        Once your refund is processed, your access to PromptForge is revoked. Your purchase session will be
        deactivated and you will no longer be able to access premium features.
      </p>
      <p>
        Any prompts, templates, or content you created using the Service remain in your browser&apos;s
        localStorage. PromptForge has no ability to access or remove client-side data.
      </p>

      <h2>6. Free Trial</h2>
      <p>
        PromptForge may offer a free trial period before purchase. No payment is required to start a trial.
        If you decide not to purchase, simply stop using the Service before the trial ends and you will not
        be charged.
      </p>

      <h2>7. Exceptions</h2>
      <p>Refunds may be declined in the following cases:</p>
      <ul>
        <li>The request is made more than 30 days after purchase</li>
        <li>The user has previously received a refund for PromptForge</li>
        <li>Evidence of abuse, misuse, or violation of the Terms of Service</li>
        <li>The issue is caused by the user&apos;s API provider, browser, or device configuration rather than PromptForge itself</li>
      </ul>
      <p>
        If your refund request is declined, we will explain the reason and suggest alternative solutions where
        possible.
      </p>

      <h2>8. Chargebacks</h2>
      <p>
        If you initiate a chargeback or payment dispute with your bank or card issuer instead of contacting
        us directly, we will cooperate with the chargeback process. However, we encourage you to contact us
        first, as most issues can be resolved quickly and directly.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Refund Policy from time to time. Changes will be reflected on this page with an
        updated effective date. Refund requests submitted before a policy change will be evaluated under the
        policy in effect at the time of purchase.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about this Refund Policy? Open an issue on{" "}
        <a href="https://github.com/prismaflux/prompt-forge" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>.
      </p>
    </LegalLayout>
  );
}
