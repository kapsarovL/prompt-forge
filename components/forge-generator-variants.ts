import type { Variants } from "motion/react";

export const springEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

export const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: springEase },
  }),
} satisfies Variants;
