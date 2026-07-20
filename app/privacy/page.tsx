import type { Metadata } from "next";
import LegalLayout from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy — PromptForge",
  description: "Privacy policy for PromptForge.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout>
      <h1>Privacy Policy</h1>
      <p className="text-sm text-zinc-500">Last updated: July 20, 2026</p>

      <h2>1. Overview</h2>
      <p>
        PromptForge is a client-side application. It runs entirely in your browser and does not
        send data to any backend server we control. This policy explains what data is involved
        and how it is handled.
      </p>

      <h2>2. Data We Do Not Collect</h2>
      <ul>
        <li>Personal information (name, email, address)</li>
        <li>Account credentials</li>
        <li>Payment details (processed by Paddle, not stored by us)</li>
        <li>Usage analytics or telemetry</li>
        <li>Cookies for tracking purposes</li>
      </ul>

      <h2>3. Data Stored in Your Browser</h2>
      <p>PromptForge uses browser localStorage to persist:</p>
      <ul>
        <li><strong>API keys</strong> — for Gemini, Anthropic Claude, OpenAI GPT, and OpenCode. Stored locally, sent only to the respective AI provider.</li>
        <li><strong>Generated prompts</strong> — your prompt history, versions, and saved templates.</li>
        <li><strong>Preferences</strong> — selected models, categories, and settings.</li>
      </ul>
      <p>
        All data remains on your device. We have no access to your localStorage. Clearing your
        browser data will remove all PromptForge data.
      </p>

      <h2>4. AI Provider Data Flow</h2>
      <p>
        When you generate or refine a prompt, your input is sent directly from your browser to
        the AI provider you selected (Gemini, Claude, GPT, or OpenCode). This communication
        is governed by each provider&apos;s own privacy policy. PromptForge does not intercept,
        log, or store these requests.
      </p>

      <h2>5. Payment Processing</h2>
      <p>
        Payments are handled by Paddle. Paddle collects payment information according to their
        own privacy policy. We do not receive or store your credit card details.
      </p>

      <h2>6. Open Source</h2>
      <p>
        PromptForge is open source. You can audit the code to verify these privacy claims.
        The source code is available on{" "}
        <a href="https://github.com/prismaflux/prompt-forge" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>.
      </p>

      <h2>7. Children&apos;s Privacy</h2>
      <p>
        The Service is not intended for children under 13. We do not knowingly collect data
        from children.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Changes will be reflected on this page
        with an updated date.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about this policy? Open an issue on{" "}
        <a href="https://github.com/prismaflux/prompt-forge" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>.
      </p>
    </LegalLayout>
  );
}
