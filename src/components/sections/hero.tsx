"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { identity } from "@/content/profile";
import { ease } from "@/lib/motion";
import { Button, GlitchText, MonoLabel, ScrollCue, StatusDot } from "@/components/ui/primitives";
import { BackdropCanvas } from "@/components/ui/backdrop-canvas";

/**
 * Hero — §7.1 / P2 `heroEnter`.
 * The single `<h1>` on the page lives here (§9.3).
 */
export function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [glitchRun, setGlitchRun] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setGlitchRun(true), 300);
    return () => clearTimeout(t);
  }, [reduced]);

  const stagger = (delay: number) =>
    reduced
      ? { duration: 0.24, ease: "linear" as const }
      : { duration: 0.64, delay, ease: ease.outExpo };

  const variants = reduced
    ? { hidden: { opacity: 0 }, shown: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 24, scale: 0.985 }, shown: { opacity: 1, y: 0, scale: 1 } };

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <BackdropCanvas protectRef={textRef} />

      <div className="page-shell relative z-[1] w-full pb-24 pt-20">
        <motion.div
          ref={textRef}
          initial="hidden"
          animate="shown"
          className="max-w-[46rem]"
        >
          <motion.div variants={variants} transition={stagger(0)}>
            <MonoLabel tone="blue" tick>
              Cyber Security Officer · Threat Intel
            </MonoLabel>
          </motion.div>

          <motion.h1
            variants={variants}
            transition={stagger(0.12)}
            className="mt-5 [font-size:var(--text-display-xl)] font-bold leading-[0.94] tracking-[-0.035em] text-[var(--color-text-primary)]"
            style={{ textWrap: "balance" }}
          >
            <GlitchText as="span" trigger={glitchRun ? "mount" : "none"}>
              {identity.tagline}
            </GlitchText>
          </motion.h1>

          <motion.p
            variants={variants}
            transition={stagger(0.32)}
            className="mt-6 max-w-[38ch] [font-size:var(--text-body-lg)] leading-[1.55] text-[var(--color-text-secondary)] md:max-w-[48ch]"
          >
            {identity.intro}
          </motion.p>

          <motion.div
            variants={variants}
            transition={stagger(0.44)}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button href="#projects" size="lg" fullWidth isHeroCta className="sm:w-auto">
              View the work
            </Button>
            <Button href="#contact" variant="secondary" size="lg" fullWidth className="sm:w-auto">
              Get in touch
            </Button>
          </motion.div>

          <motion.div
            variants={variants}
            transition={stagger(0.56)}
            className="mt-8 flex items-center gap-2"
          >
            <StatusDot tone="amber" pulse />
            <span className="mono-label text-[var(--color-text-secondary)]">
              Open to security work
            </span>
          </motion.div>
        </motion.div>
      </div>

      <ScrollCue />
    </section>
  );
}
