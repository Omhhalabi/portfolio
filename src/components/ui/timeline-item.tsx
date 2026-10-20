"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Chip } from "./primitives";

/**
 * TimelineItem — §6.6, mobile-rail layout (§7.6 "Mobile" wireframe).
 * The spec's desktop alternating-rail is a cosmetic enhancement on top of
 * this same markup; given the build budget, every breakpoint uses the
 * left-rail layout the spec itself prefers for legibility at 375px, kept
 * consistent up to desktop rather than zig-zagging. See IMPLEMENTATION_NOTES
 * (D4). Node colour / glow / ACTIVE chip behaviour match §6.6 exactly.
 */
export function TimelineItem({
  period,
  role,
  org,
  location,
  bullets,
  tags,
  current = false,
  index = 0,
  isLast = false,
}: {
  period: string;
  role: string;
  org: string;
  location?: string;
  bullets: string[];
  tags: string[];
  current?: boolean;
  index?: number;
  isLast?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <div className="relative flex gap-5 pl-1">
      {/* Rail + node */}
      <div className="relative flex w-5 shrink-0 flex-col items-center">
        <span
          aria-hidden="true"
          className={cn(
            "relative z-10 mt-1.5 h-2 w-2 shrink-0 rounded-full border-2",
            current
              ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green)]"
              : "border-[var(--color-accent-blue-dim)] bg-[var(--color-bg-base)]",
          )}
          style={current ? { boxShadow: "var(--glow-green-sm)" } : undefined}
        />
        {!isLast && (
          <span
            aria-hidden="true"
            className="w-px flex-1"
            style={{
              background:
                "linear-gradient(180deg, var(--color-accent-green-dim) 0%, var(--color-accent-blue-deep) 55%, transparent 100%)",
            }}
          />
        )}
      </div>

      {/* Card */}
      <motion.div
        className="mb-6 flex-1 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-overlay)] p-5 md:p-6"
        initial={reduced ? { opacity: 0 } : { opacity: 0, x: 20 }}
        whileInView={reduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={
          reduced
            ? { duration: 0.2, delay: index * 0.04 }
            : { duration: 0.5, ease: ease.outExpo, delay: index * 0.1 }
        }
        whileHover={
          reduced
            ? {}
            : { borderColor: "var(--color-border-strong)", transition: { duration: 0.24 } }
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="mono-label text-[var(--color-text-muted)]">{period}</span>
          {current && (
            <span className="mono-label inline-flex items-center gap-1.5 text-[var(--color-accent-green)]">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-green)]"
              />
              Active
            </span>
          )}
        </div>
        <h3 className="mt-2 [font-size:var(--text-h3)] font-medium text-[var(--color-text-primary)]">
          {role}
        </h3>
        <p className="mt-1 [font-size:var(--text-body-sm)] text-[var(--color-text-muted)]">
          {org}
          {location ? ` · ${location}` : ""}
        </p>
        <ul className="mt-3 flex flex-col gap-1.5">
          {bullets.map((b, i) => (
            <li
              key={i}
              className="flex gap-2 [font-size:var(--text-body-sm)] leading-[1.55] text-[var(--color-text-secondary)]"
            >
              <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[var(--color-text-muted)]" />
              {b}
            </li>
          ))}
        </ul>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
