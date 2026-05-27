"use client";

import { Wand2, Layout, History, Terminal, Pen, BarChart } from "lucide-react";
import { FeatureCard } from "@/components/feature-card";

const FEATURES = [
  { number: "01", title: "Instant Optimization", description: "Convert vague ideas into structured, high-performing prompts instantly using Gemini 3.1 Pro.", icon: Wand2 },
  { number: "02", title: "Template Gallery", description: "Access a rich library of pre-defined templates or save your own custom templates for quick reuse.", icon: Layout },
  { number: "03", title: "Version History", description: "Never lose a good prompt. Automatically track your recent generations and recall them anytime.", icon: History },
  { number: "04", title: "Coding Prompts", description: "Specialized optimizations for software development, debugging, and architecture tasks.", icon: Terminal },
  { number: "05", title: "Creative Writing", description: "Tailored structures for storytelling, marketing copy, and creative content generation.", icon: Pen },
  { number: "06", title: "Data Analysis", description: "Precise instructions for data interpretation, research summaries, and analytical tasks.", icon: BarChart },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 py-28 md:py-36 px-6 md:px-8 border-t border-zinc-900/50 bg-[#050505]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-medium tracking-wide text-white mb-6 leading-[0.9]">
              Precision engineering.
            </h2>
            <p className="text-xl text-zinc-500 font-light tracking-tight">
              Everything you need to craft, test, and manage your prompt library.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-zinc-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-900/50 rounded-2xl overflow-hidden">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.number}
              number={feature.number}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
