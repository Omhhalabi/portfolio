# Omar AL-Halabi — Portfolio

A dark-mode, cybersecurity-themed personal portfolio landing page. Built
with Next.js 16 (App Router), React 19, Tailwind CSS v4, and Motion.

## Stack

- **Next.js 16** — App Router, static export (every route prerenders)
- **React 19**
- **Tailwind CSS v4** — CSS-first config via `@theme` in `src/app/globals.css`, no `tailwind.config.js`
- **Motion** (`motion/react`) — scroll reveals, the AI Workflow pinned console, terminal typing
- **lucide-react** — icons
- Zero-dependency Canvas 2D hero background (no three.js/WebGL)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build — also runs `tsc` |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint, including `jsx-a11y` rules |

## Project structure

```
src/
  app/            Routes: page.tsx, layout.tsx, globals.css, robots.ts, sitemap.ts, icon.svg
  components/
    sections/     One component per landing-page section (hero, about, ai-workflow, …)
    ui/           Design-system primitives (Button, Section, TerminalFrame, BackdropCanvas, …)
  content/
    profile.ts    Single source of truth for all on-page copy — edit this file to update the site
  lib/
    motion.ts     Shared easing/duration tokens (JS twin of the CSS motion tokens)
    hooks.ts      useActiveSection, usePageVisible
    utils.ts      cn() class-merge helper
    site.ts       Canonical site URL (NEXT_PUBLIC_SITE_URL)
docs/
  DESIGN_SYSTEM.md        Full design spec: tokens, motion primitives, component inventory, wireframes
  IMPLEMENTATION_NOTES.md Deliberate deviations from the spec, and content provenance
  QA_PLAN.md              QA checklist and sign-off
private/
  Profile.pdf     Source LinkedIn export — gitignored, never shipped
```

## Updating content

All copy lives in [`src/content/profile.ts`](src/content/profile.ts). No
component holds its own text. Edit that file and every section updates.

## Environment variables

Copy `.env.example` to `.env.local` and set:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Used for canonical tags, Open Graph URLs, `robots.txt` and `sitemap.xml`.

## Deployment

The app builds to fully static output — every route prerenders at build
time. Deploy the `npm run build` output to any static-capable host
(Vercel, Netlify, Cloudflare Pages, or a plain Node server via
`npm run start`).

Security headers (CSP, HSTS, X-Frame-Options, etc.) are set in
`next.config.ts` and apply automatically wherever it's deployed with
`next start` or a platform that respects Next.js's `headers()` config.

## Design system

See [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) for the full spec —
color tokens with a worked WCAG contrast audit, the fluid type scale,
motion primitives (each with a named reduced-motion fallback), and the
complete component inventory. [`docs/IMPLEMENTATION_NOTES.md`](docs/IMPLEMENTATION_NOTES.md)
documents where the build deliberately diverges from it and why.
