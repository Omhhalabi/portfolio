"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowUpRight, Copy, Check } from "lucide-react";
import { contact, identity } from "@/content/profile";
import { cn } from "@/lib/utils";
import { Button, MonoLabel, StatusDot } from "@/components/ui/primitives";
import { TerminalFrame, type TerminalLine } from "@/components/ui/terminal-frame";
import { Reveal } from "@/components/ui/reveal";
import { LinkedInIcon } from "@/components/ui/icons";

const terminalLines: TerminalLine[] = [
  { kind: "cmd", text: "cat contact.txt" },
  { kind: "out", text: `email   ${identity.email}` },
  { kind: "out", text: `role    ${identity.role} @ ${identity.company}` },
  { kind: "ok", text: "status: open to security work" },
];

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
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
            {contact.eyebrow}
          </MonoLabel>
          <h2
            id="contact-heading"
            className="mt-3 [font-size:var(--text-h2)] font-bold leading-[1.1] tracking-[-0.025em] text-[var(--color-text-primary)]"
          >
            {contact.heading}
          </h2>
          <p className="mt-4 max-w-[var(--container-prose)] [font-size:var(--text-body-lg)] text-[var(--color-text-secondary)]">
            {contact.lede}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal delay={0.05}>
            <TerminalFrame path="~/contact" lines={terminalLines} />
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex h-full flex-col">
              <div className="flex-1">
                {contact.links.map((link) => (
                  <ContactLink key={link.id} link={link} />
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-4">
                <Button href={contact.links[0].href} size="lg" fullWidth isHeroCta>
                  Send an email
                </Button>
                <div className="flex items-center gap-2">
                  <StatusDot tone="amber" pulse />
                  <span className="mono-label text-[var(--color-text-secondary)]">
                    Open to security work
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactLink({ link }: { link: (typeof contact.links)[number] }) {
  const [copied, setCopied] = useState(false);
  const isExternal = link.href.startsWith("http");
  const Icon = link.icon === "mail" ? Mail : LinkedInIcon;

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(link.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard API unavailable — fall back to normal navigation.
      window.location.href = link.href;
    }
  }

  return (
    <div className="border-b border-[var(--color-border-subtle)]">
      <Link
        href={link.href}
        onClick={link.id === "email" ? handleCopy : undefined}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={cn(
          "group grid h-16 grid-cols-[24px_1fr_auto] items-center gap-4 outline-none",
          "hover:bg-[var(--color-bg-hover)]",
        )}
        style={{ outlineOffset: "-2px" }}
      >
        <Icon size={20} aria-hidden="true" className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-green)]" />
        <div>
          <div className="[font-size:var(--text-body-sm)] text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">
            {link.label}
          </div>
          <div className="font-mono [font-size:var(--text-body-sm)] text-[var(--color-text-muted)]">
            {link.value}
          </div>
        </div>
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
          {link.id === "email" ? (
            copied ? (
              <Check size={16} aria-hidden="true" className="text-[var(--color-accent-green)]" />
            ) : (
              <Copy size={16} aria-hidden="true" className="text-[var(--color-text-muted)]" />
            )
          ) : (
            <>
              <ArrowUpRight size={16} aria-hidden="true" className="text-[var(--color-text-muted)]" />
              <span className="sr-only"> (opens in a new tab)</span>
            </>
          )}
        </span>
      </Link>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </div>
  );
}
