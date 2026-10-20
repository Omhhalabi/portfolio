"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type TerminalLine = {
  kind: "cmd" | "out" | "ok" | "warn" | "err";
  text: string;
};

const KIND_META: Record<
  TerminalLine["kind"],
  { prefix: string; srWord: string; className: string }
> = {
  cmd: { prefix: "$", srWord: "command:", className: "text-[var(--color-text-primary)]" },
  out: { prefix: "", srWord: "", className: "text-[var(--color-text-secondary)]" },
  ok: { prefix: "✓", srWord: "ok:", className: "text-[var(--color-accent-green)]" },
  warn: { prefix: "!", srWord: "warning:", className: "text-[var(--color-accent-amber)]" },
  err: { prefix: "✕", srWord: "error:", className: "text-[var(--color-accent-red)]" },
};

/**
 * TerminalFrame — §6.7 / P9 `terminalType`.
 *
 * Types the full script at ~18ms/char with punctuation and newline pauses,
 * driven by rAF with a single batched state update per frame (not one
 * state update per character) so long scripts don't thrash React.
 *
 * Reduced motion: renders the full transcript instantly, cursor static.
 * The animated node is aria-hidden; a sibling .sr-only <pre> always holds
 * the complete transcript so content is never gated behind the animation.
 */
export function TerminalFrame({
  path = "~",
  lines,
  chrome = "full",
  className,
  startOnView = true,
}: {
  path?: string;
  lines: TerminalLine[];
  chrome?: "full" | "minimal";
  className?: string;
  startOnView?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();

  const fullText = lines.map((l) => l.text).join("\n");
  const totalChars = fullText.length;

  // Lazy initial state so the reduced-motion case never needs a setState
  // call inside the effect below — it renders complete on first paint.
  const [charIndex, setCharIndex] = useState(() => (reduced ? totalChars : 0));
  const [done, setDone] = useState(() => Boolean(reduced));

  useEffect(() => {
    if (reduced) return;
    if (startOnView && !inView) return;

    let raf: number;
    let cancelled = false;
    let acc = 0;
    let lastTime: number | null = null;
    let idx = 0;
    const CHAR_MS = 18;
    const MAX_MS = 4500;
    const startedAt = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      if (lastTime === null) lastTime = now;
      const dt = now - lastTime;
      lastTime = now;
      acc += dt;

      while (acc >= CHAR_MS && idx < totalChars) {
        const ch = fullText[idx];
        acc -= ch === "\n" ? CHAR_MS + 220 : /[.:/ ]/.test(ch) ? CHAR_MS + 40 : CHAR_MS;
        idx += 1;
      }

      setCharIndex(idx);

      if (idx >= totalChars || now - startedAt > MAX_MS) {
        setCharIndex(totalChars);
        setDone(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [inView, startOnView, reduced, fullText, totalChars]);

  // Rebuild the visible lines array from the typed character count, using
  // each line's starting offset in `fullText` (joined by "\n"). Built via
  // reduce rather than a mutable accumulator shared across map callbacks.
  const lineStarts = lines.reduce<number[]>((acc, line, i) => {
    const prevStart = i === 0 ? 0 : acc[i - 1];
    const prevLen = i === 0 ? 0 : lines[i - 1].text.length + 1;
    acc.push(prevStart + prevLen);
    return acc;
  }, []);
  const visibleLines = lines.map((line, i) => {
    const take = Math.max(0, Math.min(line.text.length, charIndex - lineStarts[i]));
    return { ...line, visibleText: line.text.slice(0, take), complete: take === line.text.length };
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-default)]",
        "bg-[var(--color-bg-inset)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] px-3.5 py-2.5">
        {chrome === "full" && (
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FF5F57] opacity-55" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent-amber)] opacity-55" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent-green)] opacity-55" />
          </span>
        )}
        <span className="mono-label text-[var(--color-text-muted)]">{path}</span>
      </div>

      <div className="relative px-4 py-4 font-mono [font-size:var(--text-body-sm)] leading-[1.6] md:px-5 md:py-5">
        {/* Animated stream — decorative duplicate of the sr-only transcript below. */}
        <div aria-hidden="true">
          {visibleLines.map((line, i) => {
            const meta = KIND_META[line.kind];
            const showCursor = !done ? i === visibleLines.findIndex((l) => !l.complete) : i === visibleLines.length - 1;
            return (
              <div key={i} className={cn("tnum", meta.className)}>
                {meta.prefix && (
                  <span
                    className={cn(
                      "mr-2 inline-block",
                      line.kind === "cmd" && "text-[var(--color-accent-green)]",
                    )}
                  >
                    {meta.prefix}
                  </span>
                )}
                {line.visibleText}
                {showCursor && (
                  <span
                    className="ml-0.5 inline-block h-[1.1em] w-2 translate-y-[0.15em] bg-[var(--color-accent-green)] align-middle"
                    style={{
                      boxShadow: "var(--glow-green-sm)",
                      animation: reduced || done ? "none" : "cursor-blink 1.06s steps(2, jump-none) infinite",
                      opacity: reduced ? 1 : undefined,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Always-present, always-complete transcript for assistive tech. */}
        <pre className="sr-only">
          {lines
            .map((l) => `${KIND_META[l.kind].srWord ? KIND_META[l.kind].srWord + " " : ""}${l.text}`)
            .join("\n")}
        </pre>
      </div>
    </div>
  );
}
