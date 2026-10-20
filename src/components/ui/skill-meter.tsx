"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

const LEVEL_TEXT: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Familiar",
  2: "Working",
  3: "Proficient",
  4: "Advanced",
  5: "Expert",
};

/**
 * SkillMeter — §6.5 / P7 `meterFill`.
 * Bar is aria-hidden; the level is conveyed by always-visible text plus
 * an .sr-only "n of 5" — no role="meter".
 */
export function SkillMeter({
  label,
  level,
  index = 0,
}: {
  label: string;
  level: 1 | 2 | 3 | 4 | 5;
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(reduced ? level : 0);
  const pct = (level / 5) * 100;

  useEffect(() => {
    if (reduced || !inView) return;
    const start = performance.now();
    const DURATION = 900;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      setCount(Math.round(t * level));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, level]);

  return (
    <div ref={ref} className="group rounded-[var(--radius-sm)] px-2 py-2 -mx-2 transition-colors duration-[var(--dur-fast)] hover:bg-[var(--color-bg-hover)]">
      <div className="flex items-baseline justify-between gap-3">
        <span className="[font-size:var(--text-body-sm)] text-[var(--color-text-primary)]">{label}</span>
        <span className="mono-label shrink-0 text-[var(--color-text-muted)]">
          {LEVEL_TEXT[level]}
        </span>
      </div>
      <div
        aria-hidden="true"
        className="mt-2 h-1.5 w-full overflow-hidden rounded-[var(--radius-xs)] bg-[var(--color-bg-inset)]"
        style={{ boxShadow: "var(--shadow-inset)" }}
      >
        <motion.div
          className="h-full rounded-[var(--radius-xs)]"
          style={{
            background: "linear-gradient(90deg, #0E7FA8, #35C3FF 62%, #2BF59A)",
            transformOrigin: "left",
          }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: pct / 100 } : { scaleX: 0 }}
          transition={
            reduced
              ? { duration: 0.18, delay: index * 0.04, ease: "linear" }
              : { duration: 0.9, delay: index * 0.08, ease: ease.outExpo }
          }
        />
      </div>
      <span className="sr-only">{count} of 5</span>
    </div>
  );
}
