"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "motion/react";
import { dur, ease, inViewOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * P1 `scrollReveal` — §5.2.
 *
 * Full motion:    opacity 0→1, y 28→0, blur 4→0, 720ms ease-out-expo.
 * Reduced motion: opacity 0→1 only, 200ms linear. No translate, no blur.
 *
 * Content is never permanently hidden without JS: a `<noscript>` rule in
 * the root layout forces `[data-reveal]` back to full opacity and no
 * transform. See IMPLEMENTATION_NOTES.md (D2).
 */

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds. */
  delay?: number;
  y?: number;
  /** Blur is expensive; disabled for large grids. */
  blur?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  blur = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, inViewOnce);
  const reduced = useReducedMotion();

  const variants: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        shown: {
          opacity: 1,
          transition: { duration: 0.2, ease: "linear", delay: delay * 0.4 },
        },
      }
    : {
        hidden: { opacity: 0, y, ...(blur ? { filter: "blur(4px)" } : {}) },
        shown: {
          opacity: 1,
          y: 0,
          ...(blur ? { filter: "blur(0px)" } : {}),
          transition: { duration: dur.reveal, ease: ease.outExpo, delay },
        },
      };

  return (
    <motion.div
      ref={ref}
      data-reveal
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? "shown" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggering container. Direct children must be `<RevealItem>`.
 * Spec caps the stagger at 8 children — beyond that it reads as lag, so
 * group them instead.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  delayChildren = 0.06,
  amount,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { ...inViewOnce, ...(amount ? { amount } : {}) });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "shown" : "hidden"}
      variants={{
        hidden: {},
        shown: {
          transition: {
            staggerChildren: reduced ? 0.03 : stagger,
            delayChildren: reduced ? 0 : delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  y = 28,
  blur = true,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  blur?: boolean;
}) {
  const reduced = useReducedMotion();

  const variants: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        shown: { opacity: 1, transition: { duration: 0.2, ease: "linear" } },
      }
    : {
        hidden: { opacity: 0, y, ...(blur ? { filter: "blur(4px)" } : {}) },
        shown: {
          opacity: 1,
          y: 0,
          ...(blur ? { filter: "blur(0px)" } : {}),
          transition: { duration: dur.reveal, ease: ease.outExpo },
        },
      };

  return (
    <motion.div data-reveal className={cn(className)} variants={variants}>
      {children}
    </motion.div>
  );
}
