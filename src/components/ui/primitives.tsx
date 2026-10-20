"use client";

import { forwardRef, type ElementType, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { dur, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/* ========================================================================
 * MonoLabel — §6.12
 * ==================================================================== */

export function MonoLabel({
  children,
  tone = "blue",
  tick = false,
  className,
}: {
  children: ReactNode;
  tone?: "blue" | "green" | "muted";
  tick?: boolean;
  className?: string;
}) {
  const toneClass =
    tone === "blue"
      ? "text-[var(--color-accent-blue)]"
      : tone === "green"
        ? "text-[var(--color-accent-green)]"
        : "text-[var(--color-text-muted)]";

  return (
    <span className={cn("mono-label inline-flex items-center gap-2", toneClass, className)}>
      {tick && (
        <span
          aria-hidden="true"
          className={cn(
            "inline-block h-3 w-px shrink-0",
            tone === "blue"
              ? "bg-[var(--color-accent-blue)]"
              : tone === "green"
                ? "bg-[var(--color-accent-green)]"
                : "bg-[var(--color-text-muted)]",
          )}
        />
      )}
      {children}
    </span>
  );
}

/* ========================================================================
 * SectionHeading — §6.2
 * ==================================================================== */

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  accent = "blue",
  id,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  accent?: "blue" | "green";
  id?: string;
}) {
  return (
    <Reveal className={cn(align === "center" && "text-center")}>
      <MonoLabel tone={accent} tick>
        {eyebrow}
      </MonoLabel>
      <h2
        id={id}
        className="mt-3 [font-size:var(--text-h2)] font-bold leading-[1.1] tracking-[-0.025em] text-[var(--color-text-primary)]"
        style={{ textWrap: "balance" }}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-4 [font-size:var(--text-body-lg)] leading-[1.55] text-[var(--color-text-secondary)]",
            "max-w-[var(--container-prose)]",
            align === "center" && "mx-auto",
          )}
        >
          {lede}
        </p>
      )}
    </Reveal>
  );
}

/* ========================================================================
 * Section wrapper — §6.1
 * ==================================================================== */

export function Section({
  id,
  children,
  wash = "none",
  divider = true,
  as: Tag = "section",
  className,
  ariaLabelledBy,
}: {
  id: string;
  children: ReactNode;
  wash?: "none" | "blue" | "green";
  divider?: boolean;
  as?: "section" | "footer";
  className?: string;
  ariaLabelledBy?: string;
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn("relative isolate", className)}
      style={{ paddingBlock: "var(--space-section)" }}
    >
      {divider && (
        <div aria-hidden="true" className="section-divider absolute inset-x-0 top-0" />
      )}
      {wash !== "none" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              wash === "blue" ? "var(--wash-blue)" : "var(--wash-green)",
          }}
        />
      )}
      <div className="page-shell relative">{children}</div>
    </Tag>
  );
}

/* ========================================================================
 * Button — §6.3
 * ==================================================================== */

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 [font-size:var(--text-mono-label)] font-mono uppercase tracking-[0.18em]",
  md: "h-11 px-5 [font-size:var(--text-body-sm)] font-medium",
  lg: "h-13 px-7 [font-size:var(--text-body)] font-medium",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-accent-blue)] text-[var(--color-text-inverse)] shadow-none",
  secondary:
    "bg-transparent border border-[var(--color-border-strong)] text-[var(--color-text-primary)]",
  ghost: "bg-transparent text-[var(--color-text-secondary)]",
};

type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  isHeroCta?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  external?: boolean;
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonOwnProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      href,
      iconLeft,
      iconRight,
      fullWidth = false,
      isHeroCta = false,
      children,
      className,
      disabled = false,
      external = false,
      ...rest
    },
    ref,
  ) {
    const reduced = useReducedMotion();

    const base = cn(
      "relative inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)]",
      "transition-[background-color,border-color,color,box-shadow] duration-[var(--dur-base)]",
      sizeClasses[size],
      variantClasses[variant],
      fullWidth && "w-full",
      disabled && "cursor-not-allowed opacity-100",
      !disabled &&
        variant === "primary" &&
        cn(
          "hover:bg-[#49CBFF]",
          isHeroCta ? "hover:shadow-[var(--glow-blue-lg)]" : "hover:shadow-[var(--glow-blue-md)]",
          "active:bg-[var(--color-accent-blue-dim)]",
        ),
      !disabled &&
        variant === "secondary" &&
        "hover:border-[var(--color-accent-blue)] hover:text-[var(--color-accent-blue)] hover:shadow-[var(--glow-blue-sm)] active:bg-[var(--color-bg-hover)]",
      !disabled &&
        variant === "ghost" &&
        "hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] active:bg-[var(--color-bg-hover)]",
      disabled &&
        variant === "primary" &&
        "bg-[var(--color-bg-hover)] text-[var(--color-text-muted)]",
      disabled &&
        variant === "secondary" &&
        "border-[var(--color-border-subtle)] text-[var(--color-text-muted)]",
      disabled && variant === "ghost" && "text-[var(--color-text-muted)]",
      className,
    );

    const motionProps = disabled
      ? {}
      : reduced
        ? {
            whileTap: {
              backgroundColor:
                variant === "primary"
                  ? "var(--color-accent-blue-dim)"
                  : "var(--color-bg-hover)",
            },
          }
        : {
            whileHover: { scale: 1.015 },
            whileTap: { scale: 0.965 },
            transition: { duration: dur.fast, ease: ease.outQuart },
          };

    const content = (
      <>
        {iconLeft}
        <span>{children}</span>
        {iconRight}
      </>
    );

    if (href && !disabled) {
      const isExternal = external || href.startsWith("http") || href.startsWith("mailto:");
      return (
        <motion.span className="inline-block" {...motionProps}>
          <Link
            ref={ref as never}
            href={href}
            className={base}
            {...(isExternal && href.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            {...rest}
          >
            {content}
            {isExternal && href.startsWith("http") && (
              <span className="sr-only"> (opens in a new tab)</span>
            )}
          </Link>
        </motion.span>
      );
    }

    return (
      <motion.button
        ref={ref as never}
        type="button"
        className={base}
        disabled={disabled}
        aria-disabled={disabled}
        {...motionProps}
        {...rest}
      >
        {content}
      </motion.button>
    );
  },
);

/* ========================================================================
 * StatusDot — §6.12
 * ==================================================================== */

export function StatusDot({
  tone = "green",
  pulse = false,
}: {
  tone?: "green" | "amber";
  pulse?: boolean;
}) {
  const color =
    tone === "green" ? "var(--color-accent-green)" : "var(--color-accent-amber)";
  const glow = tone === "green" ? "var(--glow-green-sm)" : "var(--glow-amber-sm)";

  return (
    <span
      aria-hidden="true"
      className="relative inline-flex h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: color, boxShadow: glow }}
    >
      {pulse && (
        <span
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: color,
            animation: "node-halo 1.8s ease-out infinite",
          }}
        />
      )}
    </span>
  );
}

/* ========================================================================
 * Chip / SkillBadge — §6.5
 * ==================================================================== */

export function Chip({
  children,
  tone = "neutral",
  size = "sm",
}: {
  children: ReactNode;
  tone?: "neutral" | "blue" | "green" | "amber";
  size?: "sm" | "md";
}) {
  const toneClasses: Record<string, string> = {
    neutral: "border-[var(--color-border-default)] text-[var(--color-text-secondary)]",
    blue: "border-[var(--color-accent-blue-dim)] bg-[var(--color-bg-tint-blue)] text-[var(--color-accent-blue)]",
    green:
      "border-[var(--color-accent-green-dim)] bg-[var(--color-bg-tint-green)] text-[var(--color-accent-green)]",
    amber:
      "border-[var(--color-accent-amber)]/40 bg-[var(--color-bg-tint-amber)] text-[var(--color-accent-amber)]",
  };

  return (
    <span
      className={cn(
        "mono-label inline-flex items-center rounded-[var(--radius-xs)] border px-2.5 py-1.5 transition-colors duration-[var(--dur-fast)]",
        "hover:border-[var(--color-border-strong)]",
        toneClasses[tone],
        size === "md" && "px-3 py-2",
      )}
    >
      {children}
    </span>
  );
}

/* ========================================================================
 * StatWell — §6.12
 * ==================================================================== */

export function StatWell({
  value,
  label,
  tone = "blue",
}: {
  value: string;
  label: string;
  tone?: "blue" | "green";
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] px-4 py-4",
        "transition-colors duration-[var(--dur-fast)] hover:border-[var(--color-border-strong)]",
        tone === "blue" ? "bg-[var(--color-bg-tint-blue)]" : "bg-[var(--color-bg-tint-green)]",
      )}
    >
      <div
        className={cn(
          "font-mono [font-size:var(--text-h3)] font-bold tabular-nums",
          tone === "blue" ? "text-[var(--color-accent-blue)]" : "text-[var(--color-accent-green)]",
        )}
      >
        {value}
      </div>
      <div className="mono-label mt-1 text-[var(--color-text-muted)]">{label}</div>
    </div>
  );
}

/* ========================================================================
 * SrOnly
 * ==================================================================== */

export function SrOnly({ children, as: Tag = "span" }: { children: ReactNode; as?: ElementType }) {
  return <Tag className="sr-only">{children}</Tag>;
}

/* ========================================================================
 * ScrollCue — §6.12 (hero only)
 * ==================================================================== */

export function ScrollCue() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
    >
      <span className="mono-label text-[var(--color-text-muted)]">scroll</span>
      <span
        className="h-10 w-px bg-[var(--color-border-strong)]"
        style={{ animation: "scroll-cue 2.4s ease-in-out infinite" }}
      />
    </div>
  );
}

/* ========================================================================
 * GlitchText — §6.10 / P8
 * ==================================================================== */

export function GlitchText({
  children,
  as: Tag = "span",
  trigger = "inView",
  className,
}: {
  children: string;
  as?: ElementType;
  trigger?: "mount" | "inView" | "hover" | "none";
  className?: string;
}) {
  // Simplified, robust implementation: CSS handles both the animated run
  // and the static reduced-motion edge via the [data-run] attribute toggle
  // defined in globals.css. No per-character DOM duplication.
  return (
    <Tag
      className={cn("glitch", className)}
      data-text={children}
      data-run={trigger === "mount" ? "true" : undefined}
    >
      {children}
    </Tag>
  );
}
