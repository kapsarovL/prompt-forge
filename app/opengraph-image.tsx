import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "PromptForge — AI Prompt Crafting for Freelancers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <svg viewBox="0 0 800 400" width="800" height="400" style={{ marginBottom: 32 }}>
          <defs>
            <linearGradient id="og-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <rect width="800" height="400" fill="#050505" />
          <rect width="800" height="400" fill="url(#og-glow)" />
          <circle cx="400" cy="200" r="140" fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.15" />
          <circle cx="400" cy="200" r="100" fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.25" />
          <text x="400" y="160" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="72" fontWeight="800" fill="#fafafa" letterSpacing="-1">PromptForge</text>
          <text x="400" y="210" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="22" fontWeight="400" fill="#a1a1aa" letterSpacing="1">AI Prompt Crafting for Freelancers</text>
          <line x1="300" y1="240" x2="500" y2="240" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
          <text x="400" y="280" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="14" fill="#71717a">Client-side · No backend · No signup</text>
        </svg>
        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ color: "#a1a1aa", fontSize: 16, fontWeight: 600 }}>Next.js 16</span>
          <span style={{ color: "#52525b", fontSize: 16 }}>·</span>
          <span style={{ color: "#a1a1aa", fontSize: 16, fontWeight: 600 }}>React 19</span>
          <span style={{ color: "#52525b", fontSize: 16 }}>·</span>
          <span style={{ color: "#a1a1aa", fontSize: 16, fontWeight: 600 }}>TypeScript</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
