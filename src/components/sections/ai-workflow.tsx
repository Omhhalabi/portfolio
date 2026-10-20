"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { aiWorkflow } from "@/content/profile";
import { Chip, MonoLabel } from "@/components/ui/primitives";
import { TerminalFrame, type TerminalLine } from "@/components/ui/terminal-frame";
import { Reveal } from "@/components/ui/reveal";

const STAGE_COUNT = aiWorkflow.stages.length;

function stageLines(stage: (typeof aiWorkflow.stages)[number]): TerminalLine[] {
  return [
    { kind: "cmd", text: `claude: ${stage.command}` },
    { kind: "out", text: stage.detail },
    { kind: "ok", text: `tools: ${stage.tools.join(", ")}` },
  ];
}

/**
 * AI Workflow Showcase — the centrepiece. §7.3 "OPS://PIPELINE", adapted to
 * the real 4-stage pipeline in src/content/profile.ts (recon → test →
 * correlate → report) rather than the spec's illustrative 5-stage example.
 *
 * Desktop (lg+): a sticky console pinned inside a tall scroll track; the
 * active stage is driven by scroll position with a quantised index and a
 * hysteresis band so it doesn't flicker at a boundary.
 * Mobile / reduced motion: the pin is removed entirely — a normal-flow
 * vertical list of all stages, each complete and self-contained. This is
 * also the P10 reduced-motion fallback (§5.2), so there is only one
 * fallback layout to build, exactly as the spec recommends.
 */
export function AIWorkflow() {
  const reduced = useReducedMotion();

  return (
    <section
      id="ai-workflow"
      aria-labelledby="ai-workflow-heading"
      className="relative isolate"
      style={{ paddingBlock: "var(--space-section)" }}
    >
      <div aria-hidden="true" className="section-divider absolute inset-x-0 top-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "var(--wash-green)" }}
      />

      <div className="page-shell relative">
        <Reveal>
          <MonoLabel tone="green" tick>
            {aiWorkflow.eyebrow}
          </MonoLabel>
          <h2
            id="ai-workflow-heading"
            className="mt-3 max-w-[20ch] [font-size:var(--text-h2)] font-bold leading-[1.1] tracking-[-0.025em] text-[var(--color-text-primary)]"
          >
            {aiWorkflow.heading}
          </h2>
          <p className="mt-4 max-w-[var(--container-prose)] [font-size:var(--text-body-lg)] leading-[1.55] text-[var(--color-text-secondary)]">
            {aiWorkflow.lede}
          </p>
        </Reveal>

        {reduced ? (
          <StackedStages />
        ) : (
          <>
            <div className="hidden lg:block">
              <PinnedConsole />
            </div>
            <div className="lg:hidden">
              <StackedStages />
            </div>
          </>
        )}

        <Reveal delay={0.1} className="mt-12">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-overlay)] p-5 md:p-6">
            <span className="mono-label text-[var(--color-accent-amber)]">
              {aiWorkflow.principle.label}
            </span>
            <p className="mt-2 [font-size:var(--text-body)] text-[var(--color-text-primary)]">
              {aiWorkflow.principle.text}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {aiWorkflow.capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-overlay)] p-5">
                <h3 className="[font-size:var(--text-h3)] font-medium text-[var(--color-text-primary)]">
                  {c.title}
                </h3>
                <p className="mt-2 [font-size:var(--text-body-sm)] leading-[1.55] text-[var(--color-text-secondary)]">
                  {c.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Mobile / reduced-motion: stacked, complete, nothing moves.
 * ------------------------------------------------------------------ */

function StackedStages() {
  return (
    <div className="relative mt-10 flex flex-col gap-5">
      {aiWorkflow.stages.map((stage, i) => (
        <div key={stage.id} className="flex gap-4">
          <div className="flex w-5 shrink-0 flex-col items-center">
            <span
              aria-hidden="true"
              className="mt-1.5 h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  stage.accent === "green" ? "var(--color-accent-green)" : "var(--color-accent-blue)",
                boxShadow: stage.accent === "green" ? "var(--glow-green-sm)" : "var(--glow-blue-sm)",
              }}
            />
            {i < aiWorkflow.stages.length - 1 && (
              <span aria-hidden="true" className="w-px flex-1 bg-[var(--color-border-subtle)]" />
            )}
          </div>
          <div
            className="mb-2 flex-1 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] p-5"
            style={{
              backgroundColor:
                stage.accent === "green" ? "var(--color-bg-tint-green)" : "var(--color-bg-tint-blue)",
            }}
          >
            <span className="mono-label text-[var(--color-text-muted)]">{stage.step}</span>
            <h3 className="mt-1 [font-size:var(--text-h3)] font-medium text-[var(--color-text-primary)]">
              {stage.title}
            </h3>
            <p className="mt-1 [font-size:var(--text-body-sm)] text-[var(--color-text-secondary)]">
              {stage.detail}
            </p>
            <TerminalFrame
              className="mt-4"
              path={`~/ops/${stage.id}`}
              chrome="minimal"
              lines={stageLines(stage)}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {stage.tools.map((t) => (
                <Chip key={t} tone={stage.accent === "green" ? "green" : "blue"}>
                  {t}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Desktop: pinned console, scroll-scrubbed.
 * ------------------------------------------------------------------ */

function PinnedConsole() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const raw = progress * STAGE_COUNT;
    const idx = Math.min(STAGE_COUNT - 1, Math.floor(raw));
    // 0.04 hysteresis band so a stage doesn't flicker right at the boundary.
    const frac = raw - idx;
    if (frac < 0.04 && idx > 0 && idx === activeIndex + 1) return;
    setActiveIndex(idx);
  });

  const stage = aiWorkflow.stages[activeIndex];
  const accentVar = stage.accent === "green" ? "var(--color-accent-green)" : "var(--color-accent-blue)";

  return (
    <div ref={wrapperRef} className="relative mt-10" style={{ height: `${STAGE_COUNT * 90}vh` }}>
      <div className="sticky top-16 h-[calc(100vh-4rem)] py-6">
        <div className="grid h-full grid-cols-12 gap-8">
          {/* Stage list rail — cols 1-4 */}
          <div className="relative col-span-4 flex flex-col justify-center gap-1 border-l border-[var(--color-border-subtle)] pl-6">
            {aiWorkflow.stages.map((s, i) => {
              const active = i === activeIndex;
              return (
                <div key={s.id} className="relative py-3">
                  {active && (
                    <motion.span
                      layoutId="stage-playhead"
                      className="absolute -left-6 top-1/2 h-14 w-0.5 -translate-y-1/2"
                      style={{ backgroundColor: accentVar, boxShadow: `var(--glow-${s.accent}-sm)` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span
                    className="mono-label"
                    style={{ color: active ? accentVar : "var(--color-text-muted)" }}
                  >
                    {s.step}
                  </span>
                  <h3
                    className="mt-1 [font-size:var(--text-h3)] font-medium transition-colors duration-200"
                    style={{ color: active ? "var(--color-text-primary)" : "var(--color-text-muted)" }}
                  >
                    {s.title}
                  </h3>
                  {active && (
                    <p className="mt-1 max-w-[26ch] [font-size:var(--text-body-sm)] text-[var(--color-text-secondary)]">
                      {s.detail}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Console — cols 5-12 */}
          <div className="edge-lit scanlines relative col-span-8 flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)]"
            style={{ boxShadow: "var(--shadow-float)" }}
          >
            <PipelineGraph activeIndex={activeIndex} accentVar={accentVar} />
            <div className="flex-1 p-5">
              <TerminalFrame
                key={stage.id}
                path={`~/ops/pipeline/${stage.id}`}
                chrome="full"
                lines={stageLines(stage)}
              />
            </div>
            <div className="grid grid-cols-3 gap-px border-t border-[var(--color-border-subtle)] bg-[var(--color-border-subtle)]">
              <StatCell label="Stage" value={`${activeIndex + 1} / ${STAGE_COUNT}`} />
              <StatCell label="Tools" value={String(stage.tools.length)} />
              <StatCell label="Accent" value={stage.accent === "green" ? "Detect" : "Offense"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--color-bg-elevated)] px-4 py-3">
      <div className="font-mono [font-size:var(--text-h3)] font-bold tabular-nums text-[var(--color-text-primary)]">
        {value}
      </div>
      <div className="mono-label mt-0.5 text-[var(--color-text-muted)]">{label}</div>
    </div>
  );
}

/** Simple horizontal pipeline DAG: one node per stage, flowing edge on the active segment. */
function PipelineGraph({ activeIndex, accentVar }: { activeIndex: number; accentVar: string }) {
  const nodeX = (i: number) => 60 + i * (520 / (STAGE_COUNT - 1));
  const y = 50;

  return (
    <svg
      viewBox="0 0 640 100"
      aria-hidden="true"
      className="h-[88px] w-full border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-inset)]"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(53,195,255,0.05)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="640" height="100" fill="url(#grid)" />

      {aiWorkflow.stages.slice(0, -1).map((_, i) => {
        const x1 = nodeX(i);
        const x2 = nodeX(i + 1);
        const isActive = i < activeIndex;
        const isCurrent = i === activeIndex;
        return (
          <line
            key={i}
            x1={x1}
            y1={y}
            x2={x2}
            y2={y}
            stroke={isActive || isCurrent ? "var(--color-accent-green)" : "var(--color-accent-blue-deep)"}
            strokeWidth={isActive || isCurrent ? 2 : 1.5}
            strokeDasharray={isCurrent ? "6 10" : undefined}
          >
            {isCurrent && (
              <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.2s" repeatCount="indefinite" />
            )}
          </line>
        );
      })}

      {aiWorkflow.stages.map((s, i) => {
        const active = i === activeIndex;
        const visited = i <= activeIndex;
        return (
          <g key={s.id}>
            <circle
              cx={nodeX(i)}
              cy={y}
              r={active ? 7 : 5.5}
              fill={visited ? "var(--color-accent-green)" : "var(--color-bg-inset)"}
              stroke={visited ? "var(--color-accent-green)" : "var(--color-accent-blue-dim)"}
              strokeWidth="1.5"
            />
            <text
              x={nodeX(i)}
              y={y + 22}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-mono)"
              letterSpacing="0.1em"
              fill={active ? accentVar : "var(--color-text-muted)"}
            >
              {s.id.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
