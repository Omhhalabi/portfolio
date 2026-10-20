"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Chip } from "./primitives";

/**
 * ProjectCard — §6.4, adapted.
 *
 * The spec calls for a 16:10 photo thumbnail. There are no real project
 * screenshots to show (the brief forbids placeholder content), so the
 * thumbnail is replaced by a decorative header strip carrying the stage
 * index and accent colour — same visual weight, no fabricated imagery.
 * See docs/IMPLEMENTATION_NOTES.md (D3).
 */
export function ProjectCard({
  index,
  title,
  context,
  blurb,
  bullets,
  stack,
  accent,
  metric,
  featured = false,
}: {
  index: number;
  title: string;
  context: string;
  blurb: string;
  bullets: string[];
  stack: string[];
  accent: "cyan" | "green";
  metric?: { value: string; label: string };
  featured?: boolean;
}) {
  const reduced = useReducedMotion();
  const accentVar = accent === "cyan" ? "var(--color-accent-blue)" : "var(--color-accent-green)";
  const glow = accent === "cyan" ? "var(--glow-blue-md)" : "var(--glow-green-md)";

  return (
    <motion.article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)]",
        "border border-[var(--color-border-subtle)] bg-[var(--color-bg-overlay)]",
        featured && "edge-lit md:col-span-2",
      )}
      whileHover={
        reduced
          ? {}
          : {
              y: -4,
              transition: { duration: 0.24, ease: ease.outQuart },
            }
      }
      style={{ minWidth: 0 }}
    >
      <HoverGlow glow={glow} reduced={Boolean(reduced)} />

      <div
        aria-hidden="true"
        className="relative flex h-16 items-center justify-between overflow-hidden px-5"
        style={{
          background:
            accent === "cyan" ? "var(--color-bg-tint-blue)" : "var(--color-bg-tint-green)",
          borderBottom: "1px solid var(--color-border-subtle)",
        }}
      >
        <span className="mono-label" style={{ color: accentVar }}>
          {String(index).padStart(2, "0")}
        </span>
        {metric && (
          <span className="font-mono [font-size:var(--text-h3)] font-bold tabular-nums" style={{ color: accentVar }}>
            {metric.value}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        {metric && (
          <span className="mono-label -mt-1 text-[var(--color-text-muted)]">{metric.label}</span>
        )}
        <div>
          <span className="mono-label text-[var(--color-text-muted)]">{context}</span>
          <h3 className="mt-1.5 [font-size:var(--text-h3)] font-medium leading-[1.25] tracking-[-0.015em] text-[var(--color-text-primary)]">
            {title}
          </h3>
        </div>
        <p className="[font-size:var(--text-body-sm)] leading-[1.55] text-[var(--color-text-secondary)]">
          {blurb}
        </p>
        <ul className="flex flex-col gap-1.5">
          {bullets.slice(0, 3).map((b, i) => (
            <li
              key={i}
              className="flex gap-2 [font-size:var(--text-body-sm)] leading-[1.55] text-[var(--color-text-secondary)]"
            >
              <span aria-hidden="true" className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-[var(--color-text-muted)]" />
              {b}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {stack.map((tag) => (
            <Chip key={tag} tone="neutral">
              {tag}
            </Chip>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function HoverGlow({ glow, reduced }: { glow: string; reduced: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
      initial={{ opacity: 0, borderColor: "var(--color-border-subtle)" }}
      whileHover={{
        opacity: 1,
        borderColor: "var(--color-border-strong)",
      }}
      transition={{ duration: 0.24 }}
      style={{
        border: "1px solid transparent",
        boxShadow: reduced ? "none" : glow,
      }}
    />
  );
}

export function CardContext({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
