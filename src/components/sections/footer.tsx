import Link from "next/link";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border-subtle)]">
      <div className="page-shell flex flex-col items-center gap-3 py-6 sm:flex-row sm:justify-between">
        <p className="mono-label text-[var(--color-text-muted)]">
          omar@sec:~$ built with Next.js · {year}
        </p>
        <Link
          href="#hero"
          className="mono-label inline-flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          Back to top
          <ArrowUp size={14} aria-hidden="true" />
        </Link>
      </div>
    </footer>
  );
}
