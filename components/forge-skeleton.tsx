"use client";

import { cn } from "@/lib/utils";

interface SkeletonBarProps {
  className?: string;
  width?: string;
}

const SkeletonBar = ({ className, width }: SkeletonBarProps) => (
  <div
    className={cn(
      "h-3 bg-zinc-800/50 rounded-md animate-pulse shimmer",
      width || "w-full",
      className
    )}
  />
);

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={cn("bg-zinc-800/40 rounded-xl animate-pulse shimmer", className)} />
);

export const OutputPanelSkeleton = () => (
  <div className="absolute inset-0 flex flex-col p-8 space-y-6">
    <div className="space-y-4">
      <SkeletonBar width="w-full" />
      <SkeletonBar width="w-3/4" />
      <SkeletonBar width="w-5/6" />
      <SkeletonBar width="w-2/3" />
      <SkeletonBar width="w-11/12" />
    </div>
    <div className="pt-4 space-y-4">
      <SkeletonBar width="w-4/5" />
      <SkeletonBar width="w-9/12" />
      <SkeletonBar width="w-3/5" />
      <SkeletonBar width="w-5/6" />
      <SkeletonBar width="w-1/2" />
    </div>
    <div className="flex items-center justify-center pt-4">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border-2 border-amber-500/10 forge-ring-1" />
        <div className="absolute inset-1.5 rounded-full border-2 border-amber-500/15 forge-ring-2" />
        <div className="absolute inset-3 rounded-full border-2 border-amber-500/20 forge-ring-3" />
      </div>
    </div>
  </div>
);

export const EvaluationSkeleton = () => (
  <div className="space-y-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <SkeletonBlock className="md:col-span-1 h-32" />
      <div className="md:col-span-3 grid grid-cols-3 gap-4">
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-24" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <SkeletonBar width="w-24" className="h-4" />
        <div className="space-y-3">
          <SkeletonBar width="w-full" />
          <SkeletonBar width="w-4/5" />
          <SkeletonBar width="w-3/4" />
        </div>
      </div>
      <div className="space-y-4">
        <SkeletonBar width="w-28" className="h-4" />
        <div className="space-y-3">
          <SkeletonBar width="w-full" />
          <SkeletonBar width="w-5/6" />
          <SkeletonBar width="w-4/5" />
        </div>
      </div>
    </div>
    <div className="space-y-6">
      <SkeletonBar width="w-32" className="h-4" />
      <div className="space-y-3">
        <SkeletonBlock className="h-16" />
        <SkeletonBlock className="h-16" />
        <SkeletonBlock className="h-16" />
      </div>
    </div>
  </div>
);
