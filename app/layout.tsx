import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { StorageInit } from "@/components/storage-init";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptForge",
  description: "Precision prompts at the speed of thought. Transform ideas into optimized, high-performance instructions.",
  icons: {
    icon: [
      { url: "/favicon.svg", rel: "icon", type: "image/svg+xml" },
    ],
  },
  metadataBase: new URL("https://prompt-forge.vercel.app"),
  openGraph: {
    title: "PromptForge",
    description: "Precision prompts at the speed of thought. Transform ideas into optimized, high-performance instructions.",
    url: "https://prompt-forge.vercel.app",
    siteName: "PromptForge",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge",
    description: "Precision prompts at the speed of thought. Transform ideas into optimized, high-performance instructions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <StorageInit />
        {children}
        <Analytics />
      </body>
    </html>);
}
