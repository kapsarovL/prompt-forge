import type { Metadata } from "next";
import LegalLayout from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service — PromptForge",
  description: "Terms of service governing use of PromptForge.",
};

export default function TermsPage() {
  return (
    <LegalLayout>
      <h1>Terms of Service</h1>
      <p className="text-sm text-zinc-500">Effective date: July 20, 2026</p>

      <h2>1. Agreement to Terms</h2>
      <p>
        By accessing or using PromptForge (&quot;the Service&quot;), you agree to be bound by these Terms of Service
        (&quot;Terms&quot;). If you are using the Service on behalf of an organization, you represent that you have
        authority to bind that organization to these Terms. If you do not agree, do not use the Service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        PromptForge is a browser-based AI prompt crafting tool. It enables users to generate, refine, evaluate,
        version, and manage prompts for large language models including Google Gemini, Anthropic Claude, OpenAI GPT,
        and OpenCode. The application runs entirely client-side in your web browser.
      </p>
      <p>
        PromptForge is not affiliated with, endorsed by, or sponsored by any AI model provider. Each provider
        maintains its own terms of service governing use of their APIs.
      </p>

      <h2>3. Eligibility</h2>
      <p>
        You must be at least 16 years old to use the Service. By using the Service, you represent and warrant
        that you meet this age requirement and have the legal capacity to enter into these Terms.
      </p>

      <h2>4. Account and Access</h2>
      <p>
        PromptForge does not require user accounts. Access to the Service after purchase is managed via a session
        cookie stored in your browser. You are responsible for maintaining the security of your device and browser.
        PromptForge is not liable for unauthorized access resulting from your device or browser security failures.
      </p>

      <h2>5. Your API Keys</h2>
      <p>
        You provide your own API keys for AI providers. These keys are stored locally in your browser via
        localStorage and transmitted directly to the respective AI provider. PromptForge never transmits,
        collects, or stores your API keys on any server.
      </p>
      <p>
        You are solely responsible for the use, cost, and compliance of your API keys with each provider&apos;s
        terms. PromptForge is not liable for any charges incurred through your API usage.
      </p>

      <h2>6. License Grant</h2>
      <p>
        Upon purchase, PromptForge grants you a non-exclusive, non-transferable, revocable license to use the
        Service for your personal or internal business purposes. This license includes all updates released during
        your access period.
      </p>
      <p>
        This license does not include the right to: sublicense, redistribute, resell, or make the Service
        available to third parties; reverse-engineer, decompile, or disassemble the Service; remove or modify
        any proprietary notices; or use the Service to build a competing product.
      </p>

      <h2>7. User Content</h2>
      <p>
        You retain full ownership of all prompts, text, and content you create using the Service (&quot;User
        Content&quot;). PromptForge claims no intellectual property rights over your User Content.
      </p>
      <p>
        Because the Service runs entirely in your browser, your User Content is stored only in your browser&apos;s
        localStorage. PromptForge has no access to, and assumes no liability for, your User Content.
      </p>

      <h2>8. Payment</h2>
      <p>
        PromptForge is a one-time purchase of $5 USD (or local equivalent). Payment is processed by Paddle, our
        authorized payment reseller. Paddle&apos;s terms of service and privacy policy apply to your payment
        transaction.
      </p>
      <p>
        All prices are inclusive of applicable taxes unless otherwise stated. PromptForge reserves the right to
        change pricing for future purchases, but existing purchases are not affected.
      </p>

      <h2>9. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any unlawful purpose or in violation of any applicable laws or regulations</li>
        <li>Attempt to gain unauthorized access to the Service or its related systems</li>
        <li>Interfere with or disrupt the Service or its infrastructure</li>
        <li>Reverse-engineer, decompile, or attempt to extract the source code of the Service</li>
        <li>Resell, sublicense, redistribute, or make the Service available to third parties</li>
        <li>Use the Service to generate content that is harmful, harassing, fraudulent, defamatory, or otherwise objectionable</li>
        <li>Use automated means (bots, scrapers) to access the Service except as intended for its normal use</li>
        <li>Circumvent or attempt to circumvent any access controls or usage limitations</li>
      </ul>
      <p>
        PromptForge reserves the right to suspend or terminate access for users who violate these provisions.
      </p>

      <h2>10. Third-Party Services</h2>
      <p>
        The Service integrates with third-party AI providers (Gemini, Claude, GPT, OpenCode) and Paddle (payment
        processing). Your use of these third-party services is governed by their respective terms and privacy
        policies. PromptForge is not responsible for the availability, accuracy, or practices of third-party
        services.
      </p>

      <h2>11. Service Availability</h2>
      <p>
        PromptForge is a client-side application that runs in your browser. We do not guarantee uninterrupted
        availability of the Service. The Service may be temporarily unavailable for maintenance, updates, or
        factors beyond our control. We are not liable for any downtime or inability to access the Service.
      </p>

      <h2>12. Disclaimer of Warranties</h2>
      <p>
        THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
        WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
        FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
      </p>
      <p>
        We do not warrant that the Service will be error-free, uninterrupted, or that defects will be corrected.
        You are solely responsible for evaluating the accuracy and suitability of any output generated by the
        Service for your intended use.
      </p>

      <h2>13. Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, PROMPTFORGE AND ITS OPERATORS SHALL NOT BE LIABLE
        FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED
        TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING FROM OR RELATED TO YOUR USE OF THE SERVICE, WHETHER
        BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY.
      </p>
      <p>
        Our total liability for any claims arising from or related to the Service shall not exceed the amount
        you paid for the Service ($5 USD).
      </p>

      <h2>14. Indemnification</h2>
      <p>
        You agree to indemnify and hold PromptForge and its operators harmless from any claims, losses, damages,
        liabilities, costs, and expenses (including reasonable attorneys&apos; fees) arising from your use of the
        Service, your violation of these Terms, or your violation of any rights of a third party.
      </p>

      <h2>15. Termination</h2>
      <p>
        You may stop using the Service at any time. We may suspend or terminate your access if you violate these
        Terms, with or without notice. Upon termination, your license to use the Service is revoked. Sections 7,
        12, 13, 14, and 17 survive termination.
      </p>

      <h2>16. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will be reflected on this page with an
        updated effective date. Your continued use of the Service after changes are posted constitutes acceptance
        of the updated Terms.
      </p>

      <h2>17. Governing Law and Disputes</h2>
      <p>
        These Terms are governed by the laws of the State of Delaware, United States, without regard to its
        conflict of law provisions. Any disputes arising under these Terms shall be resolved in the state or
        federal courts located in Delaware.
      </p>
      <p>
        If you are a consumer in the European Union, you may also be entitled to mandatory consumer protection
        rules of your country of residence, which shall prevail over any conflicting provisions in these Terms.
      </p>

      <h2>18. Severability</h2>
      <p>
        If any provision of these Terms is found to be unenforceable, the remaining provisions remain in full
        force and effect.
      </p>

      <h2>19. Entire Agreement</h2>
      <p>
        These Terms, together with our Privacy Policy and Refund Policy, constitute the entire agreement between
        you and PromptForge regarding the Service, and supersede all prior agreements and understandings.
      </p>

      <h2>20. Contact</h2>
      <p>
        Questions about these Terms? Open an issue on{" "}
        <a href="https://github.com/prismaflux/prompt-forge" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>.
      </p>
    </LegalLayout>
  );
}
