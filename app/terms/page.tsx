import type { Metadata } from "next";
import LegalLayout from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service — PromptForge",
  description: "Terms of service for PromptForge.",
};

export default function TermsPage() {
  return (
    <LegalLayout>
      <h1>Terms of Service</h1>
      <p className="text-sm text-zinc-500">Last updated: July 20, 2026</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using PromptForge (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
        If you do not agree, do not use the Service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        PromptForge is a client-side AI prompt crafting tool. It allows users to generate, refine, evaluate, and
        manage prompts for large language models including Gemini, Anthropic Claude, OpenAI GPT, and OpenCode.
        The Service runs entirely in your browser. No user accounts or server-side data storage are involved.
      </p>

      <h2>3. Your API Keys</h2>
      <p>
        You provide your own API keys for AI providers. Your keys are stored locally in your browser via
        localStorage and are sent directly to the respective AI provider. PromptForge never transmits your
        API keys to any third-party server.
      </p>

      <h2>4. Payment</h2>
      <p>
        PromptForge offers a one-time purchase of $5 USD (or local equivalent). Payment is processed by
        Paddle. After purchase, you receive lifetime access to the Service, including all future updates.
        You may also start with a 7-day free trial before purchasing.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        The Service, including its design, code, and content, is owned by PromptForge. You retain full
        ownership of any prompts you create using the Service. PromptForge claims no rights over your
        generated content.
      </p>

      <h2>6. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any unlawful purpose</li>
        <li>Attempt to reverse-engineer or extract the Service&apos;s source code beyond what is publicly available</li>
        <li>Resell, sublicense, or redistribute the Service</li>
        <li>Use the Service to harm, harass, or generate content intended to harm others</li>
      </ul>

      <h2>7. Disclaimer of Warranties</h2>
      <p>
        The Service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee
        uninterrupted or error-free operation. You are responsible for your use of AI provider APIs
        and compliance with their respective terms.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, PromptForge shall not be liable for any indirect,
        incidental, special, or consequential damages arising from your use of the Service.
      </p>

      <h2>9. Changes to Terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the Service after changes
        constitutes acceptance of the updated terms.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these terms? Open an issue on{" "}
        <a href="https://github.com/prismaflux/prompt-forge" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>.
      </p>
    </LegalLayout>
  );
}
