# QA Plan

The gate before ship. Every item is either PASS, FAIL (with the responsible
role named) or N/A. Nothing ships on an open FAIL.

## 1. Content integrity — Researcher / Content Writer

- [x] Every factual claim on the page traces to `src/content/profile.ts`,
      and every entry there traces to the LinkedIn profile export or the
      documented AI toolchain. No invented employers, dates, metrics or
      credentials.
- [x] No placeholder text anywhere: no `lorem`, `TODO`, `FIXME`, `Lorem`,
      `coming soon`, `example.com`, or scaffold copy. (Grepped; only hit is
      a code comment *about* avoiding placeholders.)
- [x] No dead or empty links. Every `href` resolves to a real destination
      (`mailto:`, the real LinkedIn URL, or an in-page section anchor that
      matches a real section id).
- [x] Nothing from the confidential client engagement appears, in any form,
      including anonymised. Grepped the whole tree for the client name —
      zero hits.
- [x] Dates are internally consistent and consistent with the source export.
- [x] No source material ships: `private/Profile.pdf` is gitignored and
      never imported by any source file.

## 2. Build & correctness — Developer

- [x] `npm run build` completes with no errors and no warnings.
- [x] `npx tsc --noEmit` is clean.
- [x] `npm run lint` is clean, including `jsx-a11y` rules.
- [x] No console errors or warnings on load, or during scroll to the bottom
      of the page. (The one warning found — React dev-mode eval() blocked
      by CSP — was fixed by scoping `'unsafe-eval'` to development only;
      production CSP is unaffected and stricter.)
- [x] No hydration mismatch warnings.
- [x] Every route in the build output is statically prerendered (`/`,
      `/_not-found`, `/icon.svg`, `/robots.txt`, `/sitemap.xml` — all ○).

## 3. Responsiveness — UI/UX Designer / Developer

Verified at 320, 375, 768, 1024, and 1280px wide via the browser pane.

- [x] No horizontal scrollbar and no element overflowing the viewport at
      any width. Programmatically checked at 320px: `document.documentElement
      .scrollWidth === clientWidth`, zero elements with `right > viewport`.
- [x] Text never clipped, never truncated mid-word, never overlapping.
- [x] Mobile navigation opens, closes (X button and Escape both verified),
      and returns focus to the trigger. `role="dialog"`, `aria-modal`,
      `aria-expanded`/`aria-controls` on the trigger.
- [x] Tap targets are at least 44×44px on touch widths (buttons at `md`+,
      nav trigger is 44×44).
- [x] The timeline, skill grid and project grid each reflow sensibly:
      1-col → 2-col → 3-col project grid, 1-col → 3-col skill columns,
      single-rail timeline throughout (see IMPLEMENTATION_NOTES D4).

## 4. Accessibility — QA Lead

- [x] Exactly one `<h1>` (verified via `document.querySelectorAll('h1')
      .length === 1`). Heading levels descend without skipping (h1→h2→h3→h4,
      confirmed by walking the full heading list).
- [x] Every section is reachable and labelled; landmarks correct — 1 `nav`,
      1 `main`, 1 `footer` (verified programmatically).
- [x] Keyboard pass: skip link is the first focusable element and targets
      `#main`; mobile menu traps focus while open and Escape closes it;
      one shared `:focus-visible` ring (`#35C3FF`, 2px, +2px offset) with
      documented per-component offset overrides.
- [x] Body text meets WCAG AA 4.5:1; large text meets 3:1. **Measured on
      the live rendered page, not just computed from source values**:
      h1-on-body 17.52:1, body text 9.75:1, primary-button-text-on-fill
      9.99:1 — all match the design doc's audit exactly.
- [x] Neon accent colours are not used for body copy below the AA
      threshold (the dim/deep accent variants are confined to borders,
      rails and glow stops per the component code).
- [x] Decorative canvas, prefix glyphs, status dots and dividers are
      `aria-hidden`.
- [x] Icon-only controls have accessible names (hamburger `aria-label`,
      external-link `.sr-only` suffix, copy action `aria-live` announcement).
- [x] `prefers-reduced-motion: reduce` is honoured by every animation
      primitive — verified by code review of each component's reduced
      branch (BackdropCanvas static frame, TerminalFrame instant transcript,
      Reveal/RevealItem opacity-only fallback, AIWorkflow's reduced-motion
      switch to the stacked layout, GlitchText's static chromatic-edge
      rest state). Not pixel-verified in-browser: the tool used for this
      session has no reduced-motion emulation control, only `colorScheme`.
- [x] Page is usable and readable with JavaScript disabled: confirmed the
      prerendered static HTML contains full hero copy (and by extension,
      every other server-rendered section) with no client JS required.

## 5. Performance — Developer / QA Lead

- [x] Canvas background: FPS governor implemented (30-frame rolling mean,
      one-way tier downgrade at 22ms/28ms thresholds), zero per-frame
      allocation (typed arrays pre-allocated at init), no `shadowBlur`.
      Not instrumented with a live profiler in this session; implementation
      matches the §8.2 budget by code review.
- [x] Canvas pauses via `IntersectionObserver` (offscreen) and
      `visibilitychange` (hidden tab), with a clamped delta on resume.
- [x] Canvas density reduced at narrower viewports (90→60→40→28 nodes
      across the four breakpoint tiers) and disabled outright under
      `prefers-reduced-motion` or `navigator.connection.saveData`.
- [x] Entrance/reveal animations animate `opacity`/`transform`/`filter`
      only — no layout-triggering properties.
- [x] Fonts are self-hosted via `next/font` (Space Grotesk + JetBrains
      Mono, `display: "swap"`, `preload: true`); verified the computed
      `font-family` on the live page resolves to the local font, not a
      network fallback.
- [x] First-load JS: ~800KB uncompressed across chunks (motion + lucide +
      app code), typical for an animation-heavy single-page site; gzip
      transfer is substantially smaller. No unused dependency in
      `package.json`.
- [x] No raster images are used anywhere on the site (grepped for `<img`
      and `next/image` — zero matches), so this item is N/A rather than a
      risk.

## 6. Security & deployment readiness — Developer

- [x] Security headers present and correct: CSP (with `'unsafe-eval'`
      scoped to development only), HSTS, X-Frame-Options, X-Content-Type-
      Options, Referrer-Policy, Permissions-Policy — all set in
      `next.config.ts` `headers()`.
- [x] No secrets, tokens, or private paths in the client bundle. The only
      personal data shipped (email, LinkedIn URL) is the contact
      information the user asked to publish.
- [x] `.env.example` documents the one variable the build reads
      (`NEXT_PUBLIC_SITE_URL`).
- [x] README explains install, dev, build, environment variables, content
      updates and deploy.
- [x] Metadata complete: title template, description, canonical,
      Open Graph, Twitter card, favicon (`icon.svg`), `robots.txt`,
      `sitemap.xml`, `lang="en"`, plus a schema.org Person JSON-LD block
      built from the same content module (cannot drift from the page).

## Sign-off

| Area | Verdict | Notes |
|------|---------|-------|
| Content integrity | **PASS** | All copy traced to source; confidential material confirmed absent |
| Build & correctness | **PASS** | Clean `tsc`, clean `eslint`, clean production build |
| Responsiveness | **PASS** | Verified 320–1280px in-browser, no overflow |
| Accessibility | **PASS** | Live-measured contrast matches spec; reduced-motion verified by code review (tooling limitation — see item above) |
| Performance | **PASS** | Budget met by implementation; not live-profiled in this session |
| Security & deployment | **PASS** | Headers, metadata, docs all in place |
