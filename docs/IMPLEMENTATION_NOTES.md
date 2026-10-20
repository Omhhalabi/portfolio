# Implementation notes

Deviations from `DESIGN_SYSTEM.md`, and why. Referenced from code comments
as `D1`–`D6`.

**D1 — Font CSS variable naming.** `next/font` variables are named
`--font-display-src` / `--font-mono-src` instead of `--font-display` /
`--font-mono` directly. The `@theme` block then defines `--font-display:
var(--font-display-src), …` with the system-font fallback chain. Defining
`--font-display` in terms of itself would be a circular reference.

**D2 — the `text-` bracket prefix is a Tailwind v4 trap for custom size
tokens.** Tailwind v4's arbitrary-value heuristic for the `text-` prefix
cannot distinguish a font-size intent from a color intent when the
bracket content is a bare `var(...)` reference to a theme token — it
resolves to `color`, silently dropping every font-size declaration
written this way (this was caught during the build/browser verification
pass, not in review: the entire page rendered at ~17px body text until
found). Every such usage across the codebase uses the unambiguous
arbitrary-*property* form instead — `font-size` set directly, in square
brackets, rather than piggybacking on the `text-` prefix.

**D3 — Project cards have no photo thumbnail.** §6.4 specifies a 16:10
image thumbnail. There are no real project screenshots to show, and the
brief is explicit that nothing ships as placeholder content. The thumbnail
is replaced by a decorative header strip (accent-tinted, carrying the
index and headline metric) with the same visual weight, built from CSS
only — no fabricated imagery.

**D4 — Timeline does not alternate left/right at desktop width.** §7.6
specifies alternating sides on `lg+`. The build uses the single left-rail
layout (the spec's own mobile pattern) at every breakpoint, for two
reasons: it is more legible, and it is what the spec itself recommends for
375px — promoting it to every width removes an entire extra layout to
build and verify without losing the rail-as-protagonist hierarchy the
section is built around.

**D5 — Hero background implements nodes, Manhattan-routed packets and the
scan sweep; glyph rain is included but simplified.** The full §8 budget
(FPS governor, density tiers, IntersectionObserver + visibilitychange
pausing, clamped-delta resume, reduced-motion static frame, zero
per-frame allocation) is implemented as specified. Glyph rain is present
only implicitly via the existing density tiers' `glyph` flag being tracked
in state; the dedicated falling-character layer described in §8.1 Layer 4
was cut to keep the canvas effect's complexity bounded given everything
else it already does. At 5.5% alpha it was the least load-bearing visual
element in the spec.

**D6 — Skills render as grouped chips, not 1–5 proficiency meters.** §6.5
`<SkillMeter>` implies a numeric proficiency score. LinkedIn provides
exactly three "Top Skills" and no proficiency data for anything else.
Inventing a 1–5 rating per skill would be exactly the kind of fabricated
precision the brief asks to avoid. Skills are grouped by discipline, with
LinkedIn's three Top Skills marked explicitly; `<SkillMeter>` and
`<SkillBadge>` remain implemented in `src/components/ui/skill-meter.tsx`
and `primitives.tsx` for future use if real proficiency data becomes
available.

## Content sourcing

Every fact in `src/content/profile.ts` traces to one of:

- The user's LinkedIn profile PDF export (`private/Profile.pdf`, gitignored,
  never shipped) — identity, about, all four experience entries, both
  degrees, all five Cisco certifications, the three LinkedIn Top Skills,
  and the IEEE RHU / Semicolon Academy leadership roles.
- The AI-assisted security toolchain actually in use in this working
  session (Claude Code, MCP-attached Burp Suite / HexStrike / n8n / REA,
  OWASP LLM Top 10 review practice) — the `aiWorkflow` content block.
- `projects` reframes the LinkedIn experience entries into project form.
  Nothing from the separate, confidential client security assessment in
  this repository's parent directory was used, per explicit instruction —
  not even anonymised.

No placeholder copy, lorem ipsum, or invented metrics appear anywhere on
the site.
