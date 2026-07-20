import type { Metadata } from "next";
import LegalLayout from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy — PromptForge",
  description: "How PromptForge handles your data and privacy.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout>
      <h1>Privacy Policy</h1>
      <p className="text-sm text-zinc-500">Effective date: July 20, 2026</p>

      <h2>1. Introduction</h2>
      <p>
        PromptForge (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a client-side AI prompt crafting tool
        that runs entirely in your web browser. This Privacy Policy explains what data is involved when you use
        the Service and how it is handled.
      </p>
      <p>
        We are committed to protecting your privacy. Because PromptForge is a client-side application, your
        personal data exposure is minimal by design.
      </p>

      <h2>2. Data We Do Not Collect</h2>
      <p>PromptForge does not collect, transmit, or store the following on any server we control:</p>
      <ul>
        <li>Personal identifying information (name, email, address, phone number)</li>
        <li>Account credentials (there are no user accounts)</li>
        <li>Payment card details (processed entirely by Paddle)</li>
        <li>Usage analytics, telemetry, or tracking data</li>
        <li>Content you generate or prompts you craft</li>
        <li>Browser fingerprinting or device identifiers</li>
      </ul>

      <h2>3. Data Stored in Your Browser</h2>
      <p>
        PromptForge uses browser localStorage to persist your data locally on your device. This data never
        leaves your browser unless you explicitly send it to an AI provider or export it yourself.
      </p>
      <p>localStorage stores:</p>
      <ul>
        <li>
          <strong>API keys</strong> — your personal keys for Gemini, Anthropic Claude, OpenAI GPT, and OpenCode.
          These are encrypted with AES-256-GCM using a key derived from your browser. They are sent directly to
          the respective AI provider and are never transmitted to any PromptForge server.
        </li>
        <li>
          <strong>Prompts and history</strong> — generated prompts, versions, saved templates, categories, and
          evaluation results.
        </li>
        <li>
          <strong>Preferences</strong> — selected models, UI settings, and category configurations.
        </li>
      </ul>
      <p>
        You can delete all PromptForge data at any time by clearing your browser&apos;s localStorage for this
        site or by using the application&apos;s data management features.
      </p>

      <h2>4. AI Provider Data Flow</h2>
      <p>
        When you generate, refine, or evaluate a prompt, your input is sent directly from your browser to the
        AI provider you selected. This communication is governed by each provider&apos;s own privacy policy:
      </p>
      <ul>
        <li>
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google Privacy Policy
          </a>{" "}
          (Gemini)
        </li>
        <li>
          <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer">
            Anthropic Privacy Policy
          </a>{" "}
          (Claude)
        </li>
        <li>
          <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">
            OpenAI Privacy Policy
          </a>{" "}
          (GPT)
        </li>
      </ul>
      <p>
        PromptForge does not intercept, log, store, or have access to these requests or responses.
      </p>

      <h2>5. Payment Processing</h2>
      <p>
        Payments are processed by Paddle, our authorized payment reseller. Paddle collects and processes payment
        information in accordance with their{" "}
        <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>
        . We receive a transaction confirmation (including your email for receipt delivery) but do not receive
        or store your credit card details, bank account information, or other payment credentials.
      </p>

      <h2>6. Cookies</h2>
      <p>
        PromptForge uses a single session cookie (<code>pf_session</code>) to maintain your purchase access
        status. This cookie contains only a session identifier and is not used for tracking or analytics. It
        is essential for the Service to function and is not used by any third party.
      </p>
      <p>
        We do not use advertising cookies, analytics cookies, or any tracking cookies.
      </p>

      <h2>7. Data Security</h2>
      <p>
        We implement industry-standard security measures to protect the limited data we handle:
      </p>
      <ul>
        <li>API keys are encrypted at rest in your browser using AES-256-GCM</li>
        <li>All communication with AI providers occurs over TLS/HTTPS</li>
        <li>Payment data is handled exclusively by PCI-compliant payment processors</li>
        <li>We do not maintain servers that store personal data</li>
      </ul>
      <p>
        However, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute
        security of your browser data.
      </p>

      <h2>8. Data Retention</h2>
      <p>
        PromptForge retains no data on servers. All data is stored in your browser and persists until you
        delete it. You have full control over your data at all times.
      </p>
      <p>
        Paddle retains transaction records as required by law. This data is governed by Paddle&apos;s privacy
        policy, not ours.
      </p>

      <h2>9. International Data Transfers</h2>
      <p>
        When you use an AI provider, your data may be transferred to and processed in countries other than your
        own. These transfers are governed by the respective AI provider&apos;s terms and privacy policies.
        PromptForge does not facilitate or control these transfers.
      </p>

      <h2>10. Your Rights</h2>
      <p>
        Depending on your jurisdiction, you may have the following rights regarding your personal data:
      </p>
      <ul>
        <li>
          <strong>European Economic Area (GDPR):</strong> Right to access, rectify, erase, restrict processing,
          and port your data. Right to object to processing and withdraw consent at any time.
        </li>
        <li>
          <strong>California (CCPA/CPRA):</strong> Right to know what personal information is collected, right
          to delete, right to opt out of sale, and right to non-discrimination.
        </li>
        <li>
          <strong>Other jurisdictions:</strong> You may have similar rights under local data protection laws.
        </li>
      </ul>
      <p>
        Because PromptForge does not collect or store personal data on servers, most data rights are exercised
        directly by you through your browser (e.g., clearing localStorage). For payment-related data requests,
        contact Paddle directly.
      </p>

      <h2>11. Children&apos;s Privacy</h2>
      <p>
        The Service is not directed to individuals under 16 years of age. We do not knowingly collect personal
        information from children. If we become aware that a child has provided us with personal information, we
        will take steps to delete such information.
      </p>

      <h2>12. Third-Party Links</h2>
      <p>
        The Service may contain links to third-party AI providers. We are not responsible for the privacy
        practices or content of these external sites. We encourage you to review the privacy policies of any
        third-party service you interact with.
      </p>

      <h2>13. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will be reflected on this page
        with an updated effective date. We encourage you to review this policy periodically.
      </p>

      <h2>14. Open Source</h2>
      <p>
        PromptForge is open source. You can audit the code to verify these privacy claims. The source code is
        available on{" "}
        <a href="https://github.com/prismaflux/prompt-forge" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        .
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions about this Privacy Policy? Open an issue on{" "}
        <a href="https://github.com/prismaflux/prompt-forge" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>.
      </p>
    </LegalLayout>
  );
}
