"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { navigation, identity } from "@/content/profile";
import { useActiveSection } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Button } from "./primitives";

/**
 * NavBar + MobileMenu — §6.8.
 */
export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useActiveSection(navigation.map((n) => n.id));
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-14 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-[var(--dur-base)] md:h-16",
          scrolled
            ? "border-b border-[var(--color-border-subtle)] shadow-[var(--shadow-float)] backdrop-blur-md backdrop-saturate-150"
            : "border-b border-transparent",
        )}
        style={{
          backgroundColor: scrolled
            ? "color-mix(in oklab, var(--color-bg-elevated) 82%, transparent)"
            : "transparent",
        }}
      >
        <nav
          aria-label="Primary"
          className="page-shell flex h-full items-center justify-between"
        >
          <Link
            href="#hero"
            className="font-mono [font-size:var(--text-mono-label)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            omar@sec:~$
          </Link>

          <ul className="hidden items-center gap-6 whitespace-nowrap lg:flex">
            {navigation.map((item) => {
              const active = activeId === item.id;
              return (
                <li key={item.id} className="relative">
                  <Link
                    href={`#${item.id}`}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "mono-label relative pb-1.5 transition-colors duration-[var(--dur-fast)]",
                      active
                        ? "text-[var(--color-text-primary)]"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
                    )}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId={reduced ? undefined : "nav-ink"}
                        className="absolute inset-x-0 -bottom-0 h-0.5"
                        style={{
                          backgroundColor: "var(--color-accent-blue)",
                          boxShadow: "var(--glow-blue-sm)",
                        }}
                        transition={
                          reduced
                            ? { duration: 0.12 }
                            : { type: "spring", stiffness: 420, damping: 34, mass: 0.8 }
                        }
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:block">
            <Button href="#contact" size="sm">
              Contact
            </Button>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center text-[var(--color-text-primary)] lg:hidden"
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} activeId={activeId} />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  activeId,
}: {
  open: boolean;
  onClose: () => void;
  activeId: string | null;
}) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-40 flex flex-col pt-20"
          style={{
            backgroundColor: "color-mix(in oklab, var(--color-bg-elevated) 98%, transparent)",
            backdropFilter: "blur(16px)",
          }}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={
            reduced
              ? { duration: 0.14 }
              : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
          }
        >
          <ul className="page-shell flex flex-col">
            {navigation.map((item, i) => (
              <motion.li
                key={item.id}
                className="border-b border-[var(--color-border-subtle)]"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduced ? 0 : i * 0.04 }}
              >
                <Link
                  href={`#${item.id}`}
                  onClick={onClose}
                  aria-current={activeId === item.id ? "true" : undefined}
                  className="flex h-14 items-center [font-size:var(--text-h3)] text-[var(--color-text-primary)]"
                >
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </ul>
          <div className="page-shell mt-6">
            <p className="mono-label text-[var(--color-text-muted)]">{identity.email}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
