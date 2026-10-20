# DESIGN SYSTEM — Cybersecurity Portfolio Landing Page

**Status:** Approved for implementation. Every value here is final. Do not substitute.
**Stack it targets:** Next.js 16 App Router · React 19 · Tailwind CSS v4 (`@theme` in `src/app/globals.css`, no `tailwind.config.js`) · `motion` v12+.
**Theme:** Dark only. No light theme, no `prefers-color-scheme` branch, no theme toggle.
**Codename for the visual language:** `OPS://` — an operator console. Clean, high-contrast, type-led, with light used as a signal rather than decoration.

---

## 0. First principles (read before building anything)

1. **Dark is the canvas, not the effect.** 90% of every screen is near-black surface and neutral text. Neon appears on roughly 5–8% of pixels.
2. **Neon is a signal.** Glow marks exactly one thing per viewport: the active state, the live value, the primary action. If two things glow, one is wrong.
3. **Mono type is the voice of the machine.** Labels, timestamps, counters, paths, status. Never body prose.
4. **Display type is the voice of the person.** Headings and claims. Never used at small sizes.
5. **Glitch is punctuation, not grammar.** It fires on entry and on deliberate interaction, for under 500ms, and never loops idly.
6. **Mobile-first literally.** Every component is authored at 375px and enhanced upward. No desktop-only features that break small screens.
7. **The reduced-motion build must be beautiful.** Treat it as a second design, not a degradation.

---

## 1. COLOR TOKENS

### 1.1 Token definitions (paste into `@theme`)

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* ── SURFACES ─────────────────────────────────────────── */
  --color-bg-base:      #05070A;  /* oklch(12.71% 0.0088 253.66) page background */
  --color-bg-elevated:  #0B1016;  /* oklch(17.07% 0.0149 253.25) raised panels, nav */
  --color-bg-overlay:   #111922;  /* oklch(20.99% 0.0216 251.79) cards, menus, popovers */
  --color-bg-inset:     #02060A;  /* oklch(11.75% 0.0156 238.36) terminal body, code wells */
  --color-bg-hover:     #1A2531;  /* oklch(25.99% 0.0275 251.07) row/card hover fill */

  /* Accent-tinted surfaces (for stat wells and active stages only) */
  --color-bg-tint-blue:  #06202C; /* oklch(23.02% 0.0390 231.67) */
  --color-bg-tint-green: #07241C; /* oklch(23.57% 0.0381 171.64) */
  --color-bg-tint-amber: #2A1D06; /* oklch(24.13% 0.0414 79.22)  */

  /* ── BORDERS (one hue, three opacities) ───────────────── */
  --color-border-subtle:  oklch(70.70% 0.0382 249.65 / 0.10); /* #8FA3B8 @ 10% — dividers, card rest */
  --color-border-default: oklch(70.70% 0.0382 249.65 / 0.18); /* #8FA3B8 @ 18% — inputs, frames */
  --color-border-strong:  oklch(70.70% 0.0382 249.65 / 0.32); /* #8FA3B8 @ 32% — hover, active, focus-adjacent */

  /* ── TEXT ─────────────────────────────────────────────── */
  --color-text-primary:   #E8F0F7;  /* oklch(95.11% 0.0127 244.26) */
  --color-text-secondary: #A7B6C6;  /* oklch(76.98% 0.0283 249.92) */
  --color-text-muted:     #8696A6;  /* oklch(66.58% 0.0301 248.28) */
  --color-text-inverse:   #05070A;  /* text on filled accent buttons */

  /* ── ACCENTS ──────────────────────────────────────────── */
  --color-accent-blue:       #35C3FF;  /* oklch(76.99% 0.1431 231.85) ELECTRIC BLUE — primary */
  --color-accent-blue-dim:   #0E7FA8;  /* oklch(55.96% 0.1090 230.52) borders / icons / rails */
  --color-accent-blue-deep:  #1C5F7F;  /* oklch(45.95% 0.0832 233.86) DECORATIVE ONLY */

  --color-accent-green:      #2BF59A;  /* oklch(85.71% 0.1964 156.85) CYBER GREEN — secondary */
  --color-accent-green-dim:  #127A58;  /* oklch(51.56% 0.1040 164.57) borders / icons / rails */

  --color-accent-amber:      #FFB224;  /* oklch(81.69% 0.1639 75.84) WARNING — sparing use only */
}
```

> **Note on `@theme` vs `@theme inline`:** use plain `@theme` as above. Do **not** wrap these in `@theme inline` and indirect them through `:root` custom properties — there is no light theme to swap, so the indirection buys nothing and breaks `color-mix()` opacity utilities.

### 1.2 Token-to-usage map

| Token | Where it is used | Never used for |
|---|---|---|
| `bg-base` | `<body>`, hero, every section background | Cards |
| `bg-elevated` | Sticky nav (scrolled), mobile menu sheet, footer | Page background |
| `bg-overlay` | Project cards, timeline cards, skill rows, stage cards | Large flood fills |
| `bg-inset` | Terminal window body, code blocks | Anything above a card |
| `bg-hover` | Card/row hover and `:active` fill | Rest states |
| `bg-tint-*` | Active pipeline stage, stat wells, status chips | Cards, sections |
| `border-subtle` | Section hairlines, card rest border | Focus |
| `border-default` | Terminal frames, input rest, ghost button | Section dividers |
| `border-strong` | Card hover border, active nav item, table headers | Focus (focus uses accent) |
| `accent-blue` | Primary CTA fill, links, focus ring, active nav underline, data-flow edges | Body paragraphs |
| `accent-green` | Live/online status, metric values, terminal prompt + cursor, skill meter fill, active node | Body paragraphs, long labels |
| `accent-amber` | Max 2 instances per page: "Available for work" dot and a single credential/alert chip | Anything else |

### 1.3 Contrast audit — computed, not estimated

Method: WCAG 2.1 relative luminance `L = 0.2126R + 0.7152G + 0.0722B` on linearised sRGB; ratio `= (L_light + 0.05) / (L_dark + 0.05)`.

**Worked example (text-primary on bg-base), full arithmetic:**

```
#E8F0F7 -> R=232/255=0.90980  G=240/255=0.94118  B=247/255=0.96863
linearise: ((c+0.055)/1.055)^2.4
  R_lin = 0.80695   G_lin = 0.87137   B_lin = 0.92689
  L_text = 0.2126(0.80695) + 0.7152(0.87137) + 0.0722(0.92689) = 0.86191

#05070A -> R=5/255=0.01961  G=7/255=0.02745  B=10/255=0.03922
all <= 0.04045, so linearise: c/12.92
  R_lin = 0.00152   G_lin = 0.00213   B_lin = 0.00304
  L_bg  = 0.2126(0.00152) + 0.7152(0.00213) + 0.0722(0.00304) = 0.00206

ratio = (0.86191 + 0.05) / (0.00206 + 0.05) = 0.91191 / 0.05206 = 17.52 : 1
```

**Text ladder — every text token against every surface it is permitted on:**

| Foreground | `bg-base` #05070A | `bg-elevated` #0B1016 | `bg-overlay` #111922 | `bg-inset` #02060A | `bg-hover` #1A2531 | Verdict |
|---|---|---|---|---|---|---|
| `text-primary` #E8F0F7 | **17.52** | **16.58** | **15.38** | **17.84** | **13.48** | AA + AAA everywhere |
| `text-secondary` #A7B6C6 | **9.75** | **9.23** | **8.56** | **9.93** | **7.50** | AA + AAA everywhere |
| `text-muted` #8696A6 | **6.65** | **6.30** | **5.84** | **6.73** | **5.12** | AA (body) everywhere; AAA only on base/inset |

All three pass the 4.5:1 body threshold on all five surfaces. **There is no restricted-surface rule for neutral text** — this ladder was deliberately tuned so that it never needs one. `text-muted` is the floor at 5.12:1 (on `bg-hover`), which is the worst case in the entire system and still clears AA body by 14%.

**Accent colours as text:**

| Accent | on `bg-base` | on `bg-elevated` | on `bg-overlay` | on own tint well | AA body (4.5) | AA large (3.0) |
|---|---|---|---|---|---|---|
| `accent-blue` #35C3FF | **9.99** | **9.46** | **8.77** | 8.32 (on `bg-tint-blue`) | PASS | PASS |
| `accent-green` #2BF59A | **14.05** | **13.30** | **12.34** | 11.45 (on `bg-tint-green`) | PASS | PASS |
| `accent-amber` #FFB224 | **11.18** | **10.59** | **9.82** | 9.12 (on `bg-tint-amber`) | PASS | PASS |
| `accent-blue-dim` #0E7FA8 | 4.44 | 4.20 | **3.90** | — | **FAIL** | PASS |
| `accent-green-dim` #127A58 | 3.79 | 3.58 | **3.33** | — | **FAIL** | PASS |
| `accent-blue-deep` #1C5F7F | 2.87 | 2.71 | 2.52 | — | **FAIL** | **FAIL** |

**Filled accent buttons (ink on accent):**

| Pairing | Ratio | Verdict |
|---|---|---|
| `text-inverse` #05070A on `accent-blue` #35C3FF | **9.99** | PASS |
| `text-inverse` #05070A on `accent-green` #2BF59A | **14.05** | PASS |
| `text-inverse` #05070A on `accent-amber` #FFB224 | **11.18** | PASS |

Filled buttons therefore always use **dark ink on neon**, never white ink on neon.

### 1.4 Hard conclusions — what may and may not carry neon

**All three full-strength neon accents pass WCAG AA for body text on every surface in this system.** That is a consequence of how dark the surfaces are, and it is stated plainly rather than hedged. However, passing the ratio is not permission to use them as body copy, for two measured reasons:

- **Chromatic adjacency failure.** `accent-green` against `accent-blue` is **1.41:1**. Blue and green neon must never be adjacent as text-on-text, and neon must never sit directly on another neon fill.
- **Neon on near-white fails.** `accent-blue` on `text-primary` #E8F0F7 is **1.75:1**. No neon fill may ever carry light text.

**Rules, binding:**

- `accent-blue`, `accent-green`, `accent-amber` **MAY** be used for: links, headings and large text, mono eyebrow labels, metric numerals, icons, 1px–2px borders, rails, SVG strokes, glows, terminal prompts and cursors, status dots, button fills (with `text-inverse`).
- They **MUST NOT** be used for: paragraphs over 2 lines, lists of running prose, form field input text, help text, or any block of 20+ consecutive words. Prose uses `text-primary` / `text-secondary` only. This is a legibility and eye-strain rule, enforced at review, not a contrast rule.
- `accent-blue-dim` (4.44:1) and `accent-green-dim` (3.33–3.79:1) **FAIL AA for body text.** They are permitted **only** for: borders, 1–2px rails and dividers, icon strokes at ≥24px, inactive SVG graph edges, meter tracks, and glow colour stops. Never for any text at any size, including labels — they clear only the 3:1 large-text/UI bar, and we do not spend that margin on text.
- `accent-blue-deep` (2.87:1) **FAILS both AA thresholds and the 3:1 non-text UI threshold.** It is permitted **only** inside gradients, canvas pixels, and glow stops, where it is never the sole means of conveying a boundary. It must never be the only border on an interactive control.
- Border tokens are translucent and therefore under 3:1 on their own. Any border that is the **only** visual indicator of an interactive control's bounds must be `border-strong` **plus** a background shift (`bg-overlay` → `bg-hover`), so the control's presence never depends on the hairline alone.

---

## 2. TYPOGRAPHY

### 2.1 Families — exactly two

| Role | Family | `next/font/google` import | Weights to load | CSS var |
|---|---|---|---|---|
| Display / UI | **Space Grotesk** | `Space_Grotesk` | 400, 500, 700 | `--font-display` |
| Mono / terminal | **JetBrains Mono** | `JetBrains_Mono` | 400, 500, 700 | `--font-mono` |

Space Grotesk's shortened ascenders and squared terminals read as technical without costuming; JetBrains Mono has a tall x-height and an unmistakable slashed zero, which the terminal UI depends on.

```ts
// src/app/layout.tsx
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
});
```

```css
@theme {
  --font-display: var(--font-display), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-mono), ui-monospace, "SFMono-Regular", monospace;
}
body { font-family: var(--font-display); }
```

There is no third family. Numerals use `font-variant-numeric: tabular-nums` on all counters, metrics, timestamps and meter values.

### 2.2 Fluid scale

Fluid range is **375px → 1280px** viewport. Below 375px the min clamps; above 1280px the max clamps. All slopes were solved as `size = min + (max − min) · (100vw − 23.4375rem) / 56.5625rem` and both endpoints verified.

```css
@theme {
  --text-display-xl: clamp(2.75rem, 1.6105rem + 4.8619vw, 5.5rem);    /*  44 ->  88px */
  --text-h1:         clamp(2.25rem, 1.7320rem + 2.2099vw, 3.5rem);    /*  36 ->  56px */
  --text-h2:         clamp(1.75rem, 1.4392rem + 1.3260vw, 2.5rem);    /*  28 ->  40px */
  --text-h3:         clamp(1.25rem, 1.1464rem + 0.4420vw, 1.5rem);    /*  20 ->  24px */
  --text-body-lg:    clamp(1.0625rem, 0.9848rem + 0.3315vw, 1.25rem); /*  17 ->  20px */
  --text-body:       clamp(1rem, 0.9741rem + 0.1105vw, 1.0625rem);    /*  16 ->  17px */
  --text-body-sm:    clamp(0.875rem, 0.8491rem + 0.1105vw, 0.9375rem);/*  14 ->  15px */
  --text-mono-label: clamp(0.75rem, 0.7241rem + 0.1105vw, 0.8125rem); /*  12 ->  13px */
}
```

### 2.3 Full type specification

| Token | Family | Weight | Size | Line-height | Letter-spacing | Transform | Notes |
|---|---|---|---|---|---|---|---|
| `display-xl` | Display | 700 | `--text-display-xl` | **0.94** | **-0.035em** | none | Hero only. One instance per page. Balance with `text-wrap: balance`. |
| `h1` | Display | 700 | `--text-h1` | **1.04** | **-0.03em** | none | Reserved for the hero's semantic `<h1>` when it is not the display-xl line. |
| `h2` | Display | 700 | `--text-h2` | **1.10** | **-0.025em** | none | Section titles. `text-wrap: balance`. |
| `h3` | Display | 500 | `--text-h3` | **1.25** | **-0.015em** | none | Card titles, timeline roles, stage names. |
| `body-lg` | Display | 400 | `--text-body-lg` | **1.55** | **-0.005em** | none | Hero subhead, section lede. Max width `--container-prose`. |
| `body` | Display | 400 | `--text-body` | **1.65** | **0** | none | Default paragraph. Max 72ch. |
| `body-sm` | Display | 400 | `--text-body-sm` | **1.55** | **0** | none | Card descriptions, captions, meta. |
| `mono-label` | Mono | 500 | `--text-mono-label` | **1.2** | **+0.18em** | `uppercase` | Eyebrow labels, chips, nav items, stage indices. Strip the trailing letter-space with `margin-right: -0.18em`. |
| `mono-body` | Mono | 400 | `--text-body-sm` | **1.6** | **+0.01em** | none | Terminal log lines, code, paths. Tabular nums on. |
| `mono-metric` | Mono | 700 | `--text-h3` | **1.1** | **0** | none | Big numbers (years, counts, percentages). Tabular nums on. |

**Type rules:**
- `font-feature-settings: "ss01", "cv01"` is **not** used; keep default features for predictable metrics.
- Headings never exceed 3 lines at 375px. If a title does, shorten the copy — do not shrink the type.
- `mono-label` is the **only** uppercase style in the system. Headings are sentence case.
- Antialiasing: `-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;` on `<html>`.
- Paragraph measure caps at **72ch** (`body`) and **64ch** (`body-lg`).

---

## 3. SPACING, RADIUS, LAYOUT

### 3.1 Breakpoints — Tailwind v4 defaults, unmodified

| Name | Min-width | Primary use |
|---|---|---|
| *(base)* | 0 | Mobile-first default. Author here. |
| `sm` | **40rem** / 640px | 2-col project grid, 2-col stat row |
| `md` | **48rem** / 768px | Nav switches from hamburger to inline links; timeline gets its rail |
| `lg` | **64rem** / 1024px | 3-col project grid; AI Showcase switches to pinned console; About goes 2-col |
| `xl` | **80rem** / 1280px | Container hits max; type scale tops out |
| `2xl` | **96rem** / 1536px | Gutters only; no layout change |

No custom breakpoints. No `max-*` variants except in the AI Showcase (`max-lg:` for the stacked spine layout).

### 3.2 Spacing scale

Keep Tailwind v4's dynamic spacing (`--spacing: 0.25rem`) so `p-3`, `gap-7`, `mt-11` all work. On top of it, these semantic tokens:

```css
@theme {
  --spacing: 0.25rem;  /* 4px base unit — unchanged */

  /* Fluid rhythm tokens */
  --space-section:  clamp(4.5rem, 2.2210rem + 9.7238vw, 10rem);   /*  72 -> 160px  section padding-block */
  --space-gutter:   clamp(1.25rem, 0.5249rem + 3.0939vw, 3rem);   /*  20 ->  48px  page side padding */
  --space-stack:    clamp(1.5rem, 1.0856rem + 1.7680vw, 2.5rem);  /*  24 ->  40px  heading -> content */
  --space-grid-gap: clamp(1rem, 0.6892rem + 1.3260vw, 1.75rem);   /*  16 ->  28px  card grid gap */
}
```

Permitted step values for everything else: **4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128px** (`1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32`). Never use an off-scale value.

Internal paddings, fixed:
- Card: **20px** at base, **24px** from `md`.
- Terminal body: **16px** at base, **20px** from `md`. Title bar: **10px 14px**.
- Button: see §6.3.
- Chip: **6px 10px**.

### 3.3 Containers

```css
@theme {
  --container-page:  75rem;   /* 1200px — default content width */
  --container-prose: 42rem;   /*  672px — paragraph measure */
  --container-wide:  90rem;   /* 1440px — AI Showcase and hero canvas only */
}
```

```
.page-shell  = width:100%; max-width:var(--container-page);
               margin-inline:auto; padding-inline:var(--space-gutter);
```

Section backgrounds and the hero canvas are **full-bleed** (100vw); only their inner content is constrained by `.page-shell`.

### 3.4 Section vertical rhythm

| Context | padding-block | Heading → content gap |
|---|---|---|
| Mobile (375px) | **72px** | 24px |
| Desktop (≥1280px) | **160px** | 40px |
| Both | `--space-section` | `--space-stack` |

Exceptions, deliberate:
- **Hero:** `min-height: 100svh` (not `vh` — avoids mobile URL-bar jump), `padding-block: 0`, content vertically centred with a 96px bottom offset for the scroll cue.
- **AI Workflow Showcase:** `padding-block: var(--space-section)` on mobile; on `lg+` the outer wrapper is `height: 420vh` with `padding-block: 0` and an inner `sticky` viewport (see §7.3).
- **Contact:** `padding-block-end` is `--space-section` × 0.6 because the footer follows.

Between every pair of adjacent sections: a 1px full-bleed hairline,
`background: linear-gradient(90deg, transparent, var(--color-border-subtle) 15%, var(--color-border-subtle) 85%, transparent);`

### 3.5 Radius scale

```css
@theme {
  --radius-xs:   2px;   /* chips, tags, inline code, meter bars */
  --radius-sm:   4px;   /* inputs, small buttons, terminal title-bar dots container */
  --radius-md:   6px;   /* buttons, terminal window frame */
  --radius-lg:  10px;   /* project cards, timeline cards, stage cards */
  --radius-xl:  14px;   /* AI Showcase console shell, mobile menu sheet */
  --radius-full: 9999px;/* avatars, status dots, pill nav indicator */
}
```

The system skews sharp on purpose — terminal frames stay at 6px so they read as windows, not cards.

### 3.6 Grid behaviour per breakpoint

| Section | base (375) | `sm` 640 | `md` 768 | `lg` 1024 | `xl` 1280 |
|---|---|---|---|---|---|
| Hero | 1 col, text left-aligned | 1 col | 1 col | 1 col, max 56ch, canvas behind | same |
| About | 1 col; portrait above text | 1 col | 1 col | **2 col** `minmax(0,1fr) 22rem` (text / stat rail) | same, gap 48px |
| AI Showcase | 1 col vertical spine | 1 col | 1 col | **12 col**, stages span 1–4, console spans 5–12 | same, gap 40px |
| Projects | 1 col | **2 col** | 2 col | **3 col** | 3 col; first card spans 2 cols as featured |
| Skills | 1 col, meters stacked | **2 col** | 2 col | **3 col** category columns | same |
| Timeline | 1 col, rail at x=20px, cards right of rail | same | rail at x=28px | **centre rail**, cards alternate L/R | same |
| Contact | 1 col; links stacked full-width | **2 col** link grid | 2 col | **2 col** `1fr 1fr` (terminal / links) | same |

Grid primitive: `display: grid; gap: var(--space-grid-gap);` with `grid-template-columns` swapped at the breakpoints above. Cards are `min-width: 0` to prevent blowout, and card media uses `aspect-ratio: 16/10`.

---

## 4. ELEVATION & GLOW

### 4.1 Neutral elevation (structure)

Depth is carried by **surface value + 1px border**, not by soft shadows. Only two neutral shadows exist:

```css
@theme {
  /* floating UI only: mobile menu sheet, dropdowns, scrolled nav */
  --shadow-float: 0 8px 24px -8px rgb(0 0 0 / 0.72), 0 2px 6px -2px rgb(0 0 0 / 0.60);
  /* pressed/inset wells: terminal body, meter tracks */
  --shadow-inset: inset 0 1px 0 0 rgb(255 255 255 / 0.03), inset 0 0 0 1px rgb(0 0 0 / 0.40);
}
```

Cards get **no** shadow at rest. Their elevation is `bg-overlay` over `bg-base` plus `border-subtle`.

### 4.2 Glow recipes (exact)

Three intensities per hue. Each is a layered `box-shadow`: a 1px chromatic rim, a tight bloom, and a wide atmospheric falloff.

```css
@theme {
  /* ── ELECTRIC BLUE ─────────────────────────────────────── */
  --glow-blue-sm:
    0 0 0 1px rgb(53 195 255 / 0.22),
    0 0 10px -2px rgb(53 195 255 / 0.30);
  --glow-blue-md:
    0 0 0 1px rgb(53 195 255 / 0.34),
    0 0 20px -4px rgb(53 195 255 / 0.40),
    0 0 56px -20px rgb(53 195 255 / 0.30);
  --glow-blue-lg:
    0 0 0 1px rgb(53 195 255 / 0.46),
    0 0 28px -4px rgb(53 195 255 / 0.50),
    0 0 80px -24px rgb(53 195 255 / 0.38);

  /* ── CYBER GREEN ───────────────────────────────────────── */
  --glow-green-sm:
    0 0 0 1px rgb(43 245 154 / 0.22),
    0 0 10px -2px rgb(43 245 154 / 0.30);
  --glow-green-md:
    0 0 0 1px rgb(43 245 154 / 0.34),
    0 0 20px -4px rgb(43 245 154 / 0.40),
    0 0 56px -20px rgb(43 245 154 / 0.30);
  --glow-green-lg:
    0 0 0 1px rgb(43 245 154 / 0.46),
    0 0 28px -4px rgb(43 245 154 / 0.50),
    0 0 80px -24px rgb(43 245 154 / 0.38);

  /* ── AMBER (one size only) ─────────────────────────────── */
  --glow-amber-sm:
    0 0 0 1px rgb(255 178 36 / 0.24),
    0 0 10px -2px rgb(255 178 36 / 0.32);

  /* ── TEXT GLOW (headings and metrics only) ─────────────── */
  --text-glow-blue:  0 0 14px rgb(53 195 255 / 0.42);
  --text-glow-green: 0 0 14px rgb(43 245 154 / 0.42);

  /* ── SVG / ICON GLOW (filter, not shadow) ──────────────── */
  --filter-glow-blue:  drop-shadow(0 0 5px rgb(53 195 255 / 0.55));
  --filter-glow-green: drop-shadow(0 0 5px rgb(43 245 154 / 0.55));

  /* ── AMBIENT SECTION WASH (background-image, no blur cost) */
  --wash-blue: radial-gradient(60% 48% at 50% 0%, rgb(53 195 255 / 0.09), transparent 70%);
  --wash-green: radial-gradient(52% 44% at 80% 10%, rgb(43 245 154 / 0.07), transparent 70%);
}
```

**Edge-lit hairline** (used on the AI console shell and the featured project card, nowhere else):

```css
.edge-lit {
  position: relative;
}
.edge-lit::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, #35C3FF 0%, transparent 38%, transparent 62%, #2BF59A 100%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  opacity: 0.55;
  pointer-events: none;
}
```

### 4.3 Rules of restraint — binding

1. **Two-glow maximum.** At most **two** glowing elements may be visible in the viewport simultaneously. A hovered card counts as one. The hero CTA counts as one.
2. **One `-lg` per page.** `--glow-*-lg` is used on exactly one element: the hero primary CTA on hover. Nothing else may use it.
3. **Glow is state, not identity.** No element glows at rest except: the live-status dot, the terminal cursor, and the active pipeline node. Everything else earns glow through `:hover`, `:focus-visible`, or scroll-activation.
4. **Never glow text at body sizes.** `--text-glow-*` is permitted only at `h2` and above, on `mono-metric`, and on the terminal prompt glyph. Applying text-shadow to `body`, `body-sm`, or `mono-body` is forbidden — it destroys stem clarity.
5. **Hard caps.** Blur radius ≤ 80px. Peak alpha ≤ 0.50. Spread ≤ 0. No stacking of two glow tokens on one element.
6. **Area budget.** Glowing pixels (including washes) stay under **12%** of viewport area. The ambient washes are the only glow allowed to cover large area, and they cap at 0.09 alpha.
7. **No glow on scroll-driven animation frames.** Animating `box-shadow` on a scroll handler is banned — it repaints. Glow transitions only on discrete state change, and only via `box-shadow` on a composited, `isolation: isolate` element. Preferred: keep a pre-rendered glow layer at `opacity: 0` and animate `opacity` only.
8. **Never glow a disabled control.** Disabled strips all shadow.
9. **Amber glows once.** `--glow-amber-sm` appears on the availability dot only.

---

## 5. MOTION SPEC

### 5.1 Easing and duration tokens

```css
@theme {
  /* EASINGS */
  --ease-out-expo:   cubic-bezier(0.16, 1, 0.30, 1);     /* default entrances */
  --ease-out-quart:  cubic-bezier(0.25, 1, 0.50, 1);     /* hovers, small moves */
  --ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1);   /* layout swaps, pinned transitions */
  --ease-snap:       cubic-bezier(0.34, 1.56, 0.64, 1);  /* overshoot: press release, nav pill */
  --ease-in-quad:    cubic-bezier(0.55, 0.085, 0.68, 0.53); /* exits */
  --ease-linear:     linear;                              /* typing, meters, canvas, marquees */

  /* DURATIONS */
  --dur-instant:  90ms;
  --dur-fast:    160ms;
  --dur-base:    240ms;
  --dur-slow:    420ms;
  --dur-slower:  640ms;
  --dur-reveal:  720ms;
}
```

### 5.2 Primitives

For each: trigger, transform, duration, easing, stagger, and the **exact** reduced-motion fallback.

---

**P1 · `scrollReveal` — section entry**

- Trigger: `useInView(ref, { once: true, amount: 0.22, margin: "0px 0px -12% 0px" })`.
- From: `opacity: 0; y: 28px; filter: blur(4px)`. To: `opacity: 1; y: 0; filter: blur(0)`.
- Duration **720ms** (`--dur-reveal`), easing `--ease-out-expo`.
- Stagger: direct children **70ms** apart, `delayChildren: 60ms`, max 8 staggered children (beyond that, group them — a 12-item stagger reads as lag).
- `will-change: opacity, transform` applied on mount, removed on animation complete.
- **Reduced motion:** no translate, no blur. Opacity-only fade `0 → 1` over **200ms** `--ease-linear`, stagger reduced to **30ms`. Content is never left at `opacity: 0` — if the observer never fires (e.g. print, no-JS), CSS default is `opacity: 1` and the animation sets `0` only after JS confirms support.

---

**P2 · `heroEnter` — hero text entrance**

- Trigger: on mount, after `document.fonts.ready` (prevents a reflow mid-animation).
- Sequence, each child `opacity: 0 → 1`, `y: 24px → 0`, `scale: 0.985 → 1`:
  | Child | Delay | Duration |
  |---|---|---|
  | mono eyebrow (`> whoami`) | 0ms | 420ms |
  | display-xl line 1 | 120ms | 640ms |
  | display-xl line 2 | 200ms | 640ms |
  | body-lg subhead | 320ms | 520ms |
  | CTA row | 440ms | 420ms |
  | scroll cue | 700ms | 400ms |
- Easing `--ease-out-expo`. The display lines additionally run **P9 `glitch`** once at `delay + 180ms`.
- Canvas background fades `opacity: 0 → 1` over **1200ms** `--ease-linear`, starting at 0ms.
- **Reduced motion:** all children fade in together, `opacity: 0 → 1`, **240ms**, `--ease-linear`, **no** `y`, **no** `scale`, **no** glitch pass. Canvas fade shortened to 300ms and the canvas renders its single static frame (§8.6).

---

**P3 · `cardLift` — card hover**

- Trigger: `:hover` and `:focus-visible` on the card root (pointer: fine only — gate with `@media (hover: hover) and (pointer: fine)`).
- `transform: translateY(-4px)`, border `border-subtle → border-strong`, background `bg-overlay → bg-hover`, glow layer `opacity: 0 → 1` (`--glow-blue-md` pre-rendered on a `::after`).
- Duration **240ms** in / **160ms** out, easing `--ease-out-quart`.
- Inner thumbnail scales `1 → 1.04` over 420ms `--ease-out-expo` with `overflow: hidden` on the frame.
- **Reduced motion:** no `translateY`, no thumbnail scale. Border → `border-strong` and background → `bg-hover` only, over **120ms**. The glow layer still fades in (opacity is not vestibular) but at **0.6** final opacity.

---

**P4 · `buttonPress`**

- Hover: `scale: 1.015`, **160ms**, `--ease-out-quart`.
- Press (`onPointerDown` / `:active`): `scale: 0.965`, **90ms** (`--dur-instant`), `--ease-in-quad`.
- Release: back to `1`, **260ms**, `--ease-snap` (the overshoot is the point).
- Primary button also sweeps a 1px top highlight: a `::before` at `background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.35), transparent)` translating `-100% → 100%` over **520ms** `--ease-out-quart` on hover enter only (not on loop).
- **Reduced motion:** **no scale at all.** Press feedback becomes an instant (`0ms`) background shift — primary fill `#35C3FF → #0E7FA8`, ghost fill `transparent → bg-hover` — held while pressed and reverted over **90ms** on release. The highlight sweep is removed entirely.

---

**P5 · `navUnderline`**

- A single shared `motion` element (`layoutId="nav-ink"`): 2px bar, `background: var(--color-accent-blue)`, `box-shadow: var(--glow-blue-sm)`, sitting 6px below the label baseline, width = label width.
- Moves between items with a `motion` layout transition: `type: "spring", stiffness: 420, damping: 34, mass: 0.8` (settles ≈ 320ms).
- Hover on a non-active item: that item's own 1px underline grows `scaleX: 0 → 1` from `transform-origin: left`, **200ms**, `--ease-out-quart`, colour `border-strong`.
- **Reduced motion:** the shared bar does **not** slide. It cross-fades — old position `opacity: 1 → 0` and new position `0 → 1`, both **120ms** `--ease-linear`, with `layout={false}`. Hover underline appears at full width instantly (no `scaleX`), with a 100ms opacity fade.

---

**P6 · `timelineDraw`**

- The rail is an SVG `<path>` (or a `<div>` with `transform: scaleY`). On section entry, `pathLength: 0 → 1` — via `strokeDasharray: 1; strokeDashoffset: 1 → 0` — over **1100ms**, `--ease-in-out-quint`.
- Each timeline node (`8px` dot) pops in as the rail passes it: `scale: 0 → 1`, `opacity: 0 → 1`, **320ms**, `--ease-snap`, at delay `180ms + index × 180ms`.
- Each timeline card runs **P1** at delay `260ms + index × 180ms`, translating in from its rail side (`x: ±24px` on `lg+`, `x: 20px` on mobile).
- Rail gradient: `linear-gradient(180deg, #2BF59A 0%, #0E7FA8 55%, transparent 100%)`; the drawn tip carries `--filter-glow-green`.
- **Reduced motion:** the rail is **drawn already** — rendered at `strokeDashoffset: 0` on first paint, no draw animation. Nodes appear at `scale: 1` immediately. Cards fade in `opacity 0 → 1` over **200ms** with **40ms** stagger, no `x` translation. The glowing tip is replaced by a static 2px green cap at the rail's lower end.

---

**P7 · `meterFill` — skill meter**

- Trigger: `useInView(..., { once: true, amount: 0.5 })`.
- Track: `height: 6px`, `background: var(--color-bg-inset)`, `box-shadow: var(--shadow-inset)`, `border-radius: var(--radius-xs)`.
- Fill: `transform: scaleX(0 → value)` with `transform-origin: left`, `background: linear-gradient(90deg, #0E7FA8, #35C3FF 62%, #2BF59A)`. Duration **900ms**, easing `--ease-out-expo`, stagger **80ms** per row.
- The numeric label counts up in lockstep: integer tween `0 → value` over the same 900ms, `--ease-out-expo`, `tabular-nums`.
- A 2px bright cap rides the fill's leading edge with `--filter-glow-blue`, fading out over the last 150ms.
- **Reduced motion:** fill is rendered at its final `scaleX` on first paint — **no fill animation, no count-up** (the number is printed at its final value immediately). The whole row instead fades `opacity: 0 → 1` over **180ms** with **40ms** stagger. The leading-edge cap is static and unglowed.

---

**P8 · `glitch`**

Three sub-layers, fired as one named primitive. Duration envelope **420ms** total, `steps()` timing so it snaps rather than slides.

```css
@keyframes glitch-slice {
  0%   { clip-path: inset(0 0 0 0);       transform: translate3d(0,0,0); }
  18%  { clip-path: inset(14% 0 62% 0);   transform: translate3d(-3px,0,0); }
  32%  { clip-path: inset(58% 0 18% 0);   transform: translate3d(3px,0,0); }
  46%  { clip-path: inset(28% 0 44% 0);   transform: translate3d(-2px,0,0); }
  60%  { clip-path: inset(72% 0 6% 0);    transform: translate3d(2px,0,0); }
  74%  { clip-path: inset(6% 0 80% 0);    transform: translate3d(-1px,0,0); }
  100% { clip-path: inset(0 0 0 0);       transform: translate3d(0,0,0); }
}
```

- **Layer A (base):** the real text, `color: var(--color-text-primary)`.
- **Layer B (blue ghost):** duplicate via `::before` with `content: attr(data-text)`, `color: #35C3FF`, `mix-blend-mode: screen`, `opacity: 0.85`, animation `glitch-slice 420ms steps(6, end)` with `transform` offsets negated (shifts left).
- **Layer C (green ghost):** `::after`, `color: #2BF59A`, `mix-blend-mode: screen`, `opacity: 0.70`, same keyframes at **animation-delay: 60ms** and shifting right.
- Fires: once on hero entrance (§P2); once per `h2` on section reveal; on `:hover` of `GlitchText` with `cursor: default`; never on a loop, never on an interval, never more than once per 1200ms per element (debounced).
- **Scanline overlay** (AI Showcase console only): a `repeating-linear-gradient(180deg, rgb(255 255 255 / 0.025) 0 1px, transparent 1px 3px)` layer translating `y: 0 → 3px` over **1.6s** `--ease-linear` `infinite`. This is the one permitted idle loop; it is 2.5% alpha and 3px of travel.
- **Reduced motion:** the glitch is **fully replaced**, not merely disabled. `GlitchText` renders a single static chromatic offset: the blue ghost sits at `translate3d(-1px, 0, 0)` at `opacity: 0.30`, the green ghost at `translate3d(1px, 0, 0)` at `opacity: 0.22`, both with `animation: none` and `clip-path: none`. The result is a permanent, still chromatic-aberration edge — the aesthetic survives with zero movement. The scanline overlay renders static (no `y` translation) at 2% alpha.

---

**P9 · `terminalType`**

- Characters appended at **18ms/char** (≈55 chars/s), `--ease-linear`. Punctuation `.`,`:`,`/` add **+40ms**. Newline adds **+220ms** (reads as a command returning).
- Cursor: 8px × 1.1em block, `background: var(--color-accent-green)`, `box-shadow: var(--glow-green-sm)`, blinking `opacity: 1 → 0` on a **1060ms** `steps(2, jump-none)` infinite loop.
- Line entry: each completed line nudges the stack up by its own height over **160ms** `--ease-out-quart`.
- Trigger: `useInView(..., { once: true, amount: 0.4 })`. Never autostarts offscreen. Typing pauses on `document.hidden` and resumes on focus.
- Max run **4.5s** per terminal; if the script is longer, cut the copy.
- Implementation: drive a single state index with `requestAnimationFrame` accumulating `deltaTime` — **not** `setInterval` per character, and never one React state update per character for multi-line scripts (batch per character index, one node re-render).
- **Reduced motion:** **no typing.** The full log renders instantly and completely on first paint, with every line at final position. The cursor renders as a **static, non-blinking** green block at the end of the last line (`animation: none; opacity: 1`). The line-entry nudge is removed. This is the fallback for all terminals, including the AI Showcase stages.

---

**P10 · `stageAdvance` — AI Showcase scroll scrub (see §7.3)**

- Driven by `useScroll({ target, offset: ["start start", "end end"] })` on the 420vh wrapper; `scrollYProgress` is quantised into 5 stage indices with a **0.04** hysteresis band so a stage does not flicker at the boundary.
- Active stage card: `background → bg-tint-blue`, left rail segment moves via `layoutId="stage-playhead"`, spring `stiffness: 300, damping: 30`. Inactive → active text `text-muted → text-primary` over **200ms** `--ease-out-quart`.
- Console content cross-fades: outgoing `opacity 1 → 0, y 0 → -10px` over **180ms** `--ease-in-quad`; incoming `opacity 0 → 1, y 10px → 0` over **320ms** `--ease-out-expo`, delayed 120ms.
- DAG edge flow: active-path edges animate `strokeDashoffset` continuously, `-24px` per **1.2s**, `--ease-linear`, infinite. Idle edges static.
- Node activation: `scale 1 → 1.12 → 1` over **420ms** `--ease-snap`, plus a halo ring `scale 0.8 → 1.6` with `opacity 0.5 → 0` over **900ms** `--ease-out-expo`.
- **Reduced motion:** the pin and the scroll-scrub are **removed entirely**. `height: 420vh` and `position: sticky` are not applied; the section becomes a normal-flow vertical list of all 5 stages, each with its full static DAG snapshot (its own active path pre-highlighted) and its complete log text rendered. The playhead is a static green segment on whichever stage is in view (plain IntersectionObserver, opacity-only 150ms). Edge dash flow is `animation: none`. Node halos are not rendered. Nothing moves; the information is all present at once.

### 5.3 Reduced-motion plumbing

```ts
// Single source of truth. Every primitive reads this.
import { useReducedMotion } from "motion/react";
```

Plus a global CSS backstop so non-`motion` animations obey it too:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  /* then the specific fallbacks above re-enable the short opacity fades
     via .motion-safe-fade utilities that opt back in at 120-240ms */
}
```

**Rule:** the CSS backstop is a safety net, not the design. Every one of P1–P10 has its named fallback implemented in component code as specified above. Reviewing a component means checking its reduced-motion branch renders complete, legible, final-state content — never an empty, zero-opacity, or mid-animation frame.

---

## 6. COMPONENT INVENTORY

All components live in `src/components/`. Props below are the complete public API. States are listed as default / hover / focus-visible / active / disabled; where a state is not applicable it is marked n/a.

### 6.1 `<Section>` — section wrapper

| Prop | Type | Default |
|---|---|---|
| `id` | `string` (required) | — | anchor target for nav |
| `wash` | `"none" \| "blue" \| "green"` | `"none"` | ambient radial wash |
| `bleed` | `boolean` | `false` | skip `.page-shell` constraint |
| `divider` | `boolean` | `true` | top hairline |
| `as` | `"section" \| "footer"` | `"section"` |

Renders `<section id>` with `padding-block: var(--space-section)`, `position: relative`, `isolation: isolate`, and an inner `.page-shell`. Wash is an `::before` at `inset: 0` with `pointer-events: none`, `aria-hidden`. States: **n/a** (non-interactive). Must contain exactly one `<h2>` via `<SectionHeading>`.

### 6.2 `<SectionHeading>`

| Prop | Type | Default |
|---|---|---|
| `eyebrow` | `string` (required) | — | e.g. `"02 / about"` |
| `title` | `string` (required) | — |
| `lede` | `string` | — |
| `align` | `"left" \| "center"` | `"left"` |
| `glitch` | `boolean` | `true` | run P8 once on reveal |
| `accent` | `"blue" \| "green"` | `"blue"` | eyebrow + tick colour |

Layout: eyebrow row = a 1px × 12px vertical tick in `accent`, 8px gap, then `mono-label` text in `accent`. 12px gap, then `<h2>` in `h2` style. 16px gap, then `lede` in `body-lg` / `text-secondary`, capped at `--container-prose`. Whole block runs P1 with children staggered 70ms.
States: **n/a**.

### 6.3 `<Button>`

| Prop | Type | Default |
|---|---|---|
| `variant` | `"primary" \| "secondary" \| "ghost"` | `"primary"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `href` | `string` | — | renders `<Link>` when set, else `<button>` |
| `iconLeft` / `iconRight` | `ReactNode` | — |
| `fullWidth` | `boolean` | `false` | forced `true` under `sm` for hero CTAs |
| `disabled` | `boolean` | `false` |
| `loading` | `boolean` | `false` | swaps label for a 3-dot mono pulse |

Sizes — height / padding-inline / type:
- `sm`: **36px** / 14px / `mono-label`
- `md`: **44px** / 20px / `body-sm` @ weight 500
- `lg`: **52px** / 28px / `body` @ weight 500

All sizes satisfy the 44px touch target at `md`+; `sm` is only permitted inside a ≥44px tappable row, never as a standalone tap target on mobile.
Radius `--radius-md`. Transition per P4.

| State | primary | secondary | ghost |
|---|---|---|---|
| default | bg `#35C3FF`, text `#05070A` (9.99:1), no shadow | bg `transparent`, 1px `border-strong`, text `text-primary` | bg `transparent`, no border, text `text-secondary` |
| hover | bg `#49CBFF`, shadow `--glow-blue-md` (hero CTA: `--glow-blue-lg`), scale 1.015 | border `#35C3FF`, text `#35C3FF`, shadow `--glow-blue-sm`, scale 1.015 | bg `bg-hover`, text `text-primary` |
| focus-visible | ring per §9.1 **plus** hover styling | ring per §9.1 | ring per §9.1 + `bg-hover` |
| active | scale 0.965, bg `#0E7FA8` | bg `bg-hover`, scale 0.965 | bg `bg-hover`, scale 0.965 |
| disabled | bg `bg-hover`, text `text-muted` (5.12:1), `cursor: not-allowed`, no shadow, no transform, `aria-disabled` | border `border-subtle`, text `text-muted` | text `text-muted` |

### 6.4 `<ProjectCard>`

| Prop | Type | Default |
|---|---|---|
| `title` | `string` | — |
| `summary` | `string` | — |
| `tags` | `string[]` | `[]` | max 4 rendered, `+N` chip for overflow |
| `thumb` | `{ src: string; alt: string }` | — | `next/image`, `aspect-ratio: 16/10` |
| `href` | `string` | — | whole card is the link |
| `repoHref` | `string` | — | secondary icon link |
| `featured` | `boolean` | `false` | spans 2 cols at `xl`, gets `.edge-lit` |
| `metric` | `{ label: string; value: string }` | — | e.g. `{ label: "CVEs found", value: "14" }` |
| `index` | `number` | — | stagger seed |

Structure: thumbnail (top, `overflow: hidden`) → 20/24px padded body → `mono-label` index + metric row → `<h3>` title → `body-sm` summary (2-line clamp) → tag chip row. Entire card is a single anchor; `repoHref` is a nested, `z-index`-raised link with its own `aria-label`.
Motion: P1 on reveal (80ms stagger by `index`), P3 on hover.

| State | Spec |
|---|---|
| default | `bg-overlay`, 1px `border-subtle`, radius `--radius-lg`, no shadow |
| hover | `bg-hover`, 1px `border-strong`, `translateY(-4px)`, `--glow-blue-md`, thumb `scale(1.04)`, title → `accent-blue` |
| focus-visible | ring per §9.1 at `outline-offset: 3px` + all hover styling |
| active | `translateY(-1px)`, `scale(0.995)`, 90ms |
| disabled | n/a (cards are never disabled; an unpublished project is simply not rendered) |

### 6.5 `<SkillMeter>` and `<SkillBadge>`

`<SkillMeter>`:

| Prop | Type | Default |
|---|---|---|
| `label` | `string` | — |
| `level` | `1 \| 2 \| 3 \| 4 \| 5` | — |
| `levelText` | `string` | derived | `"Expert" \| "Advanced" \| "Proficient" \| "Working" \| "Familiar"` |
| `index` | `number` | — | stagger seed |

Row layout: label (`body-sm`, `text-primary`) left, `levelText` (`mono-label`, `text-muted`) right, 6px track below spanning full width. The bar is **`aria-hidden="true"`**; the level is conveyed by the always-visible `levelText` plus a visually-hidden `"4 of 5"`. No `role="meter"` — the text carries it, which is more robust across screen readers.
Motion: P7.

| State | Spec |
|---|---|
| default | track `bg-inset` + `--shadow-inset`; fill gradient to `level/5` width |
| hover (on row) | row `bg-hover`, fill brightens: overlay `rgb(255 255 255 / 0.10)`, 160ms |
| focus-visible | n/a (not focusable) |
| active / disabled | n/a |

`<SkillBadge>` (for tool names, no proficiency):

| Prop | Type | Default |
|---|---|---|
| `children` | `string` | — |
| `tone` | `"neutral" \| "blue" \| "green" \| "amber"` | `"neutral"` |
| `size` | `"sm" \| "md"` | `"sm"` |

`mono-label`, padding `6px 10px`, radius `--radius-xs`, 1px border. Neutral = `border-default` + `text-secondary`. Toned = `bg-tint-*` + 1px `accent-*-dim` border + `accent-*` text. States: default / hover (border → `border-strong`, 160ms) only; non-interactive otherwise.

### 6.6 `<TimelineItem>`

| Prop | Type | Default |
|---|---|---|
| `period` | `string` | — | `"2023 — Present"`, `mono-label` |
| `role` | `string` | — | `<h3>` |
| `org` | `string` | — |
| `location` | `string` | — |
| `bullets` | `string[]` | — | max 4 |
| `tags` | `string[]` | `[]` |
| `current` | `boolean` | `false` | green glowing node + "ACTIVE" chip |
| `side` | `"left" \| "right"` | auto | `lg+` alternation |
| `index` | `number` | — |

Node: 8px dot on the rail, `bg-base` core with 2px `accent-blue-dim` ring; when `current`, fill `accent-green` + `--glow-green-sm` + a 900ms halo pulse (one of the two permitted resting glows). Card: `bg-overlay`, `border-subtle`, `--radius-lg`, 20/24px padding, connected to the rail by a 1px, 24px-long horizontal tick.
Motion: P6.

| State | Spec |
|---|---|
| default | as above |
| hover | card `bg-hover` + `border-strong`, tick → `accent-blue`, node `scale(1.25)`, 240ms `--ease-out-quart` |
| focus-visible | if the card contains a link: ring per §9.1 on that link only |
| active | n/a |
| disabled | n/a |

### 6.7 `<TerminalFrame>`

| Prop | Type | Default |
|---|---|---|
| `path` | `string` | `"~"` | title-bar label, `mono-label` |
| `lines` | `TerminalLine[]` | — | `{ kind: "cmd" \| "out" \| "ok" \| "warn" \| "err"; text: string }` |
| `typing` | `boolean` | `true` | run P9 |
| `startOnView` | `boolean` | `true` |
| `showCursor` | `boolean` | `true` |
| `height` | `"auto" \| number` | `"auto"` | fixed height prevents reveal-time layout shift |
| `chrome` | `"full" \| "minimal"` | `"full"` | `full` = 3 dots + path; `minimal` = path only |

Title bar: `bg-elevated`, 1px bottom `border-default`, 10/14px padding, three 8px dots — `#FF5F57`, `#FFB224`, `#2BF59A` at `opacity: 0.55` — then the `path` label in `text-muted`, right-aligned mono clock optional. Body: `bg-inset`, `--shadow-inset`, `mono-body`, 16/20px padding, `overflow: hidden`.
Line kinds: `cmd` → `text-primary` prefixed by a glowing `$` in `accent-green`; `out` → `text-secondary`; `ok` → `accent-green` prefixed `✓`; `warn` → `accent-amber` prefixed `!`; `err` → `#FF5F57` prefixed `✕`. Prefix glyphs are `aria-hidden` and duplicated as text in the SR copy.
A11y: the animated stream is `aria-hidden="true"`; a sibling `.sr-only` `<pre>` holds the complete transcript. See §9.4.
Motion: P9.
States: **n/a** (non-interactive) unless it contains a copy button, which is a `<Button variant="ghost" size="sm">`.

### 6.8 `<NavBar>` + `<MobileMenu>`

`<NavBar>`:

| Prop | Type | Default |
|---|---|---|
| `items` | `{ label: string; href: string }[]` | — | 7 section anchors |
| `cta` | `{ label: string; href: string }` | — | renders `Button variant="primary" size="sm"` |

Behaviour: `position: fixed; top: 0; z-index: 50; height: 64px` (56px under `md`). At `scrollY < 24`: `background: transparent`, no border. At `scrollY ≥ 24`: `background: color-mix(in oklab, var(--color-bg-elevated) 82%, transparent)`, `backdrop-filter: blur(12px) saturate(140%)`, 1px bottom `border-subtle`, `--shadow-float`. Transition **240ms** `--ease-out-quart`. Active section tracked with `IntersectionObserver` at `rootMargin: "-45% 0px -55% 0px"`.
Left: a mono wordmark `omar@sec:~$`. Right: inline items from `md` up; hamburger below `md`.

| State (nav item) | Spec |
|---|---|
| default | `mono-label`, `text-secondary` |
| hover | `text-primary` + 1px `border-strong` underline growing from left (P5) |
| focus-visible | ring per §9.1, `outline-offset: 4px` |
| active (current section) | `text-primary` + shared `nav-ink` bar in `accent-blue` with `--glow-blue-sm` |
| disabled | n/a |

`<MobileMenu>`: full-screen sheet, `bg-elevated` at 98% + `blur(16px)`, enters `opacity 0→1` + `y -8px→0` over **280ms** `--ease-out-expo`; items stagger **40ms**, `h3`-sized, left-aligned, 56px row height, 1px `border-subtle` between rows. Exits over **180ms** `--ease-in-quad`. Trigger is a 44×44px button with a 2-line → X morph (two 18px bars rotating ±45° over 240ms `--ease-out-quart`). Focus is trapped while open; `Escape` closes; `<body>` gets `overflow: hidden`; the trigger has `aria-expanded` and `aria-controls`.
**Reduced motion:** sheet opacity-fades only (**140ms**), no `y`, no stagger; the hamburger swaps to an X with no rotation.

### 6.9 `<ContactLink>` (social / contact)

| Prop | Type | Default |
|---|---|---|
| `kind` | `"email" \| "github" \| "linkedin" \| "x" \| "signal" \| "pgp" \| "resume"` | — |
| `label` | `string` | — | visible text |
| `value` | `string` | — | handle or address shown in `mono-body` |
| `href` | `string` | — |
| `external` | `boolean` | auto | adds `target="_blank" rel="noopener noreferrer"` + an SR-only "(opens in a new tab)" |
| `copyable` | `boolean` | `false` | adds a copy affordance with a 1.4s `"copied"` toast |

Layout: 64px-tall row, 1px `border-subtle` bottom, grid `24px 1fr auto` — icon, label + value stack, trailing `↗` or copy icon. Icons are 20px, `currentColor`, `aria-hidden`.

| State | Spec |
|---|---|
| default | icon + label `text-secondary`, value `text-muted` |
| hover | row `bg-hover`, icon → `accent-green` with `--filter-glow-green`, label → `text-primary`, trailing glyph `translateX(3px)` over 200ms |
| focus-visible | ring per §9.1 inset by 2px (the row is wide; use `outline-offset: -2px` so the ring stays on-screen) |
| active | row `bg-hover`, `scale(0.995)`, 90ms |
| disabled | icon + text `text-muted`, no hover, `aria-disabled="true"` |

### 6.10 `<GlitchText>`

| Prop | Type | Default |
|---|---|---|
| `children` | `string` (required, plain text only) | — | also written to `data-text` for the ghost layers |
| `as` | `ElementType` | `"span"` |
| `trigger` | `"mount" \| "inView" \| "hover" \| "none"` | `"inView"` |
| `intensity` | `"subtle" \| "normal"` | `"normal"` | `subtle` halves the translate offsets |

Must receive a string, not nodes — the pseudo-element duplication needs `attr(data-text)`. The ghost layers are `aria-hidden` by virtue of being pseudo-elements. Motion per P8.
States: default / hover (re-fires once, debounced 1200ms) only.

### 6.11 `<BackdropCanvas>` — animated background

| Prop | Type | Default |
|---|---|---|
| `density` | `"auto" \| number` | `"auto"` | auto = per §8.4 |
| `scanSweep` | `boolean` | `true` |
| `glyphRain` | `boolean` | `"auto"` → desktop only |
| `className` | `string` | — |

Renders `<canvas aria-hidden="true" role="presentation">` at `position: absolute; inset: 0; z-index: 0; pointer-events: none`, with the hero content at `z-index: 1`. Full spec in §8. States: **n/a**.

### 6.12 Supporting primitives

| Component | Purpose / key props | States |
|---|---|---|
| `<MonoLabel>` | `children`, `tone`, `tick?: boolean` — the eyebrow/label atom | n/a |
| `<StatusDot>` | `tone: "green" \| "amber"`, `pulse?: boolean` — 8px dot, the only amber glow | n/a |
| `<Chip>` | `children`, `tone` — alias of `SkillBadge` sizing for tags | default / hover |
| `<Reveal>` | `children`, `delay`, `stagger`, `y` — wraps P1; the only place `useInView` is used | n/a |
| `<StatWell>` | `value`, `label`, `tone` — `bg-tint-*`, `mono-metric` value + `mono-label` caption | default / hover |
| `<ScrollCue>` | 24px mono chevron + 1px 40px rail, 2.4s `translateY(0→6px→0)` loop (pauses when hero leaves view) | n/a |
| `<SrOnly>` | visually-hidden text utility | n/a |
| `<PipelineStage>` | AI Showcase stage card: `index`, `title`, `desc`, `active`, `nodes` | default / active / hover / focus-visible |
| `<DagGraph>` | AI Showcase SVG: `activeStage`, `reducedMotion` | n/a |

---

## 7. SECTION WIREFRAMES

Legend: `█` filled accent · `▓` card surface · `░` inset/terminal · `·` canvas particle field · `━` rail/divider · `◆` node.

### 7.1 Hero

**Mobile (375px)**

```
┌───────────────────────────────────────┐ 0
│ omar@sec:~$                      [≡]  │ 56px fixed nav
├───────────────────────────────────────┤
│  ·      ·    ·        ·     ·    ·    │
│    ·  ·   ·     ·   ·    ·      ·     │  canvas (full bleed, z0)
│                                       │
│  │ SECURITY ENGINEER                  │  mono-label + tick, accent-blue
│                                       │
│  Omar Al Halabi                       │  display-xl 44px, glitch once
│  breaks things                        │
│  before they break you.               │
│                                       │
│  Offensive security, detection        │  body-lg, text-secondary, 64ch
│  engineering, and AI-assisted         │
│  threat workflows.                    │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │ █  View the work              █ │  │ Button primary, fullWidth, 52px
│  └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │    Get in touch                 │  │ Button secondary, fullWidth
│  └─────────────────────────────────┘  │
│                                       │
│  ● AVAILABLE FOR WORK                 │ StatusDot amber + mono-label
│                                       │
│            │                          │ ScrollCue
│            ⌄                          │
└───────────────────────────────────────┘ 100svh
```

**Desktop (1280px)**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ omar@sec:~$     hero  about  workflow  work  skills  path  contact  [Contact]│ 64px
├──────────────────────────────────────────────────────────────────────────────┤
│   ·        ·         ·      ·        ·       ·        ·        ·       ·      │
│       ·        ·  ·      ·      ·        ·        ·       ·        ·          │
│                                                                              │
│    │ SECURITY ENGINEER · DETECTION · AI WORKFLOWS                            │
│                                                                              │
│    Omar Al Halabi breaks things                     ·        ·               │
│    before they break you.                                ·                   │ display-xl 88px
│                                                     ·        ·               │ max 20ch/line
│    Offensive security, detection engineering,                                │
│    and AI-assisted threat workflows. Ten years                               │ body-lg 20px, 64ch
│    of finding the thing nobody looked at.                                    │
│                                                                              │
│    ┌──────────────────────┐  ┌──────────────────────┐                        │
│    │ █ View the work    █ │  │   Get in touch       │                        │ 52px, 16px gap
│    └──────────────────────┘  └──────────────────────┘                        │
│                                                                              │
│    ● AVAILABLE FOR WORK        ━━━━━━━━━━  OSCP · GCIA · 40+ engagements     │ mono-label
│                                                                              │
│  │                                                                           │
│  ⌄  SCROLL                                                                   │
└──────────────────────────────────────────────────────────────────────────────┘ 100svh
```

**Hierarchy and motion.** The name is the single loudest thing on the page — `display-xl` at 88px with `-0.035em` tracking, deliberately set to wrap into two short lines so the mass reads as a block rather than a sentence. Everything else steps down hard: the eyebrow is 13px mono, the subhead is 20px at 60% the visual weight, the CTAs are the only filled shape on screen. Left-aligned at every breakpoint — centred hero text would fight the terminal metaphor. The canvas sits at 0.09–0.22 alpha behind everything and must never reduce the subhead below its 9.75:1 ratio, so no particle is drawn brighter than `#1C5F7F` in the text's bounding box (the renderer masks a 24px-padded rect around the text column). Animation: **P2 `heroEnter`**, with **P8 `glitch`** firing once on each display line, and the canvas running §8. The scroll cue is the only idle loop in the hero.

### 7.2 About

**Mobile**

```
┌───────────────────────────────────────┐
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ hairline
│                                       │ 72px pad
│  │ 01 / ABOUT                         │ mono-label, accent-blue
│  Ten years inside other              │ h2 28px
│  people's networks.                   │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  │ portrait, 4:5, radius-lg
│  │ ▓▓▓▓▓▓▓ portrait ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  │ 1px border-subtle
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  │
│  └─────────────────────────────────┘  │
│                                       │
│  I started by taking apart the        │ body 16px, text-secondary
│  home router. Now I do it for         │ 2-3 paragraphs, 72ch
│  banks. [...]                         │
│                                       │
│  ┌──────────┐ ┌──────────┐            │
│  │  10+     │ │   40+    │            │ StatWell 2-up
│  │  YEARS   │ │ ENGAGE.  │            │ mono-metric + mono-label
│  └──────────┘ └──────────┘            │
│  ┌──────────┐ ┌──────────┐            │
│  │  14      │ │   6      │            │
│  │  CVEs    │ │ CERTS    │            │
│  └──────────┘ └──────────┘            │
└───────────────────────────────────────┘
```

**Desktop**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                   160px pad  │
│  │ 01 / ABOUT                                                                │
│  Ten years inside other people's networks.                                   │ h2 40px
│                                                                              │
│  ┌──────────────────────────────────────────┐   ┌─────────────────────────┐   │
│  │ I started by taking apart the home       │   │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │   │
│  │ router. Now I do it for banks, and I     │   │ ▓▓▓▓ portrait 4:5 ▓▓▓▓▓ │   │ 22rem rail
│  │ write the detections that catch the      │   │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │   │
│  │ next person who tries. [...]             │   └─────────────────────────┘   │
│  │                                          │   ┌───────────┬─────────────┐   │
│  │ Lately most of my leverage comes from    │   │  10+      │   40+       │   │ StatWell
│  │ wiring LLMs into the boring 80% of       │   │  YEARS    │  ENGAGE.    │   │ 2x2 grid
│  │ triage. [...]                            │   ├───────────┼─────────────┤   │
│  │                                          │   │  14       │   6         │   │
│  │  [ Download CV ↗ ]  ghost button         │   │  CVEs     │  CERTS      │   │
│  └──────────────────────────────────────────┘   └───────────┴─────────────┘   │
│         text column, max 72ch                       48px gap                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Hierarchy and motion.** Prose-led. The `h2` is the anchor, the body is the substance, and the stat wells are the proof — they use `mono-metric` in `accent-green` so the numbers read as machine output rather than marketing. The portrait is deliberately secondary: 22rem wide, 1px border, no glow, slightly desaturated (`filter: saturate(0.85) contrast(1.05)`) so the face does not compete with the neon. Animation: **P1 `scrollReveal`** on the heading block, then the text column and the stat rail as two staggered groups (70ms apart). Each stat value runs the same count-up tween as **P7** (900ms, `--ease-out-expo`), staggered 80ms. No glitch here — this is the one section that stays completely calm.

### 7.3 AI Workflow Showcase — **CENTREPIECE**

**Concept: `OPS://PIPELINE` — a pinned operator console.**

The section is a 420vh-tall scroll track containing a single `sticky` 100vh console. As the visitor scrolls, they do not scroll *past* content — they scroll *through* a five-stage AI triage pipeline, and the console rebuilds itself at each stage. Three things move in concert: a playhead down the stage list, a live DAG that lights up its active path, and a terminal that types that stage's real log output. It is the only pinned section on the page, the only place with a scanline overlay, and the only place the two accents are used together at full strength.

**The five stages** (fixed content):

| # | Slug | Title | One-liner | Active DAG nodes |
|---|---|---|---|---|
| 01 | `ingest` | Ingest & Normalise | Raw telemetry from 6 sources into one schema. | N1, N2 → N3 |
| 02 | `enrich` | Enrich & Correlate | Threat intel, asset context, identity graph joined per event. | N3 → N4, N5 |
| 03 | `reason` | LLM Reasoning Pass | An agent reads the cluster and writes the hypothesis. | N4, N5 → N6 |
| 04 | `verify` | Verify & Score | Deterministic checks gate the model's claim. | N6 → N7 |
| 05 | `report` | Report & Hand-off | Analyst-ready narrative, cited, in under 90 seconds. | N7 → out |

**DAG geometry** — SVG `viewBox="0 0 640 280"`, three columns, exact coordinates:

| Node | cx | cy | Label |
|---|---|---|---|
| N1 | 70 | 70 | `edr.stream` |
| N2 | 70 | 210 | `cloud.audit` |
| N3 | 240 | 140 | `normalise` |
| N4 | 400 | 60 | `intel.join` |
| N5 | 400 | 220 | `asset.graph` |
| N6 | 520 | 140 | `agent.reason` |
| N7 | 600 | 140 | `verify.gate` |

Edges (cubic béziers, 1.5px): N1→N3, N2→N3, N3→N4, N3→N5, N4→N6, N5→N6, N6→N7, N7→exit(640,140).
Idle edge stroke `--color-accent-blue-deep`; active-path edge stroke `--color-accent-green` at 2px with `stroke-dasharray: 6 10` flowing `-24px / 1.2s` linear infinite, plus `--filter-glow-green`. Nodes are 9px circles: idle = `bg-inset` fill + 1.5px `accent-blue-dim` ring + `text-muted` label; active = `accent-green` fill + `--filter-glow-green` + `text-primary` label + the 900ms halo (P10). Node labels are `mono-label` at 11px, placed 14px below each node, `aria-hidden` (the stage list carries the same information as real text).

**Mobile (375px) — the spine.** No pin, no scrub. The DAG becomes a 7-dot minimap; each stage is a card with its own 3-line terminal strip.

```
┌───────────────────────────────────────┐
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  │ 02 / AI WORKFLOW                   │ mono-label, accent-green
│  The pipeline that reads              │ h2 28px
│  the alerts for me.                   │
│  Six sources in, one cited            │ body-lg lede
│  narrative out, in 90 seconds.        │
│                                       │
│  ◆──◆──◆──◆──◆──◆──◆    minimap       │ 7 dots, active = green
│                                       │
│  ┃ ┌─────────────────────────────────┐│ spine 2px at x=20
│  ●─│ 01  INGEST & NORMALISE          ││ active stage: bg-tint-blue
│  ┃ │ Raw telemetry from 6 sources    ││ body-sm
│  ┃ │ into one schema.                ││
│  ┃ │ ┌─────────────────────────────┐ ││
│  ┃ │ │░ ~/ops/ingest            ░░│ ││ TerminalFrame chrome=minimal
│  ┃ │ │░ $ ingest --src all       ░░│ ││ 3 lines, types on first view
│  ┃ │ │░ ✓ 1.2M events normalised ░░│ ││
│  ┃ │ └─────────────────────────────┘ ││
│  ┃ └─────────────────────────────────┘│
│  ┃                                    │ 24px gap
│  ○─┌─────────────────────────────────┐│ inactive node = hollow
│  ┃ │ 02  ENRICH & CORRELATE          ││
│  ┃ │ ...                             ││
│    └─────────────────────────────────┘│
│       ... stages 03, 04, 05 ...        │
└───────────────────────────────────────┘
```

Packets travel down the spine: 3px green squares at `x=20`, `translateY(0 → 100%)` over 2.8s linear infinite, 3 packets offset by 0.9s, `opacity: 0 → 0.9 → 0`. Each stage card activates via IntersectionObserver at `amount: 0.55`, which fills its node, brightens its spine segment, and starts its terminal typing once.

**Desktop (≥1024px) — the pinned console.**

```
  outer wrapper: height 420vh         inner: position sticky; top 0; height 100vh
┌──────────────────────────────────────────────────────────────────────────────┐
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  │ 02 / AI WORKFLOW                                   ┌────────────────────┐ │
│  The pipeline that reads the alerts for me.           │ ░ 03 / 05 ░░░░░░░░ │ │ progress
│                                                       └────────────────────┘ │ mono
│ ┌──── cols 1-4 ─────────────┐ ┌──────────── cols 5-12 ──────────────────────┐│
│ │ ┃                         │ │ ┌─────────────────────────────────────────┐ ││
│ │ ┃ 01 INGEST & NORMALISE   │ │ │ ● ● ●   ~/ops/pipeline/reason    00:41 │ ││ title bar
│ │ ┃    6 sources, one schema│ │ ├─────────────────────────────────────────┤ ││
│ │ ┃                         │ │ │░░░░░░░░░░░ DAG CANVAS 640x280 ░░░░░░░░░│ ││
│ │ ┃ 02 ENRICH & CORRELATE   │ │ │░                                      ░│ ││
│ │ ┃    intel + asset + idty │ │ │░  ◆edr.stream                         ░│ ││ 55% height
│ │ ┃                         │ │ │░         ╲        ◆intel.join         ░│ ││
│ │ █ 03 LLM REASONING PASS   │ │ │░          ◆normalise ═══╗             ░│ ││ active path
│ │ █    agent writes hypoth. │ │ │░         ╱              ◆agent.reason ░│ ││ flows green
│ │ ┃                         │ │ │░  ◆cloud.audit    ◆asset.graph  ◆gate ░│ ││
│ │ ┃ 04 VERIFY & SCORE       │ │ │░                                      ░│ ││
│ │ ┃    deterministic gates  │ │ ├─────────────────────────────────────────┤ ││
│ │ ┃                         │ │ │░ $ agent reason --cluster c4f1          │ ││
│ │ ┃ 05 REPORT & HAND-OFF    │ │ │░ ▸ 412 events, 6 entities, 2 hypotheses │ ││ 45% height
│ │ ┃    cited, under 90s     │ │ │░ ✓ hypothesis: valid-account + exfil    │ ││ types per stage
│ │ ┃                         │ │ │░ ▸ confidence 0.86  cites 11 artifacts▊ │ ││ cursor
│ │ playhead █ = active       │ │ └─────────────────────────────────────────┘ ││
│ └───────────────────────────┘ └─────────────────────────────────────────────┘│
│                               ┌────────┬────────┬────────┐                   │
│                               │ 1.8k/s │  41s   │  0.86  │ StatWell row 3-up │
│                               │ TOKENS │ LATENCY│ CONF.  │ values retween    │
│                               └────────┴────────┴────────┘ on stage change   │
└──────────────────────────────────────────────────────────────────────────────┘
```

Console shell: `bg-elevated`, `--radius-xl`, 1px `border-default`, `.edge-lit` treatment, `--shadow-float`, plus the §P8 scanline overlay. DAG canvas region: `bg-inset` with a 32px grid of 1px `rgb(53 195 255 / 0.05)` lines. Stage list rail: 2px `border-subtle` vertical line at the column's left edge; the playhead is a 2px × 56px `accent-green` segment with `--glow-green-sm`, moved by `layoutId`.

**Hierarchy and motion.** This section wins on three counts the others deliberately forgo: it is the only pinned/scrubbed experience, it is the only place with a continuously animating graph, and it is the only element carrying `.edge-lit` plus `--shadow-float` plus a scanline. Reading order is forced left-to-right: the stage list tells you *what* is happening in plain language, the DAG shows *where* in the system, the terminal shows *what it actually printed*, and the stat row shows *what it cost*. Animation: **P10 `stageAdvance`** driving everything, with **P9 `terminalType`** re-running per stage (18ms/char, capped at 4.5s so it always finishes within a stage's scroll band) and the DAG edge flow as the only continuous motion. Scroll budget: 420vh ÷ 5 stages = 84vh of scroll per stage, which at typical wheel speed is ~1.1s dwell — enough to read four log lines. The pin releases cleanly because the sticky child is exactly `100vh` and the wrapper's last 20vh is empty run-out. **Reduced motion:** the pin is removed and all five stages render stacked and complete (see P10 fallback) — critically, the mobile spine layout *is* the reduced-motion desktop layout, so there is only one fallback to build.

### 7.4 Portfolio / Projects

**Mobile**

```
┌───────────────────────────────────────┐
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  │ 03 / SELECTED WORK                 │
│  Things I broke, and                  │ h2
│  things I built after.                │
│                                       │
│  [ ALL ][ OFFENSIVE ][ DETECTION ]    │ filter chips, h-scroll, 44px tall
│                                       │
│  ┌─────────────────────────────────┐  │
│  │ ▓▓▓▓▓▓ thumb 16:10 ▓▓▓▓▓▓▓▓▓▓▓▓ │  │
│  ├─────────────────────────────────┤  │
│  │ 01                    14 CVEs   │  │ mono-label + metric
│  │ Firmware teardown toolkit       │  │ h3 20px
│  │ Static + emulated analysis of   │  │ body-sm, 2-line clamp
│  │ 40 consumer IoT images.         │  │
│  │ [Python] [QEMU] [Ghidra] [+2]   │  │ chips
│  └─────────────────────────────────┘  │
│  ... 1-col stack, 16px gap ...        │
│                                       │
│  [ All projects on GitHub ↗ ]         │ ghost button
└───────────────────────────────────────┘
```

**Desktop**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  │ 03 / SELECTED WORK                          [ALL][OFFENSIVE][DETECTION]  │ filters right
│  Things I broke, and things I built after.                                   │
│                                                                              │
│  ┌─────────────────────────────────────────────┐ ┌──────────────────────────┐│
│  │ ▓▓▓▓▓▓▓▓▓▓▓ FEATURED · spans 2 cols ▓▓▓▓▓▓▓ │ │ ▓▓▓▓▓ thumb ▓▓▓▓▓▓▓▓▓▓▓▓ ││
│  │ ▓▓▓▓▓▓▓▓▓▓▓ .edge-lit treatment ▓▓▓▓▓▓▓▓▓▓▓ │ ├──────────────────────────┤│
│  ├─────────────────────────────────────────────┤ │ 02             6 MONTHS  ││
│  │ 01                              14 CVEs     │ │ Detection-as-code repo   ││
│  │ Firmware teardown toolkit                   │ │ 180 Sigma rules with CI  ││
│  │ Static and emulated analysis of 40 consumer │ │ validation and ATT&CK... ││
│  │ IoT firmware images, with a triage UI.      │ │ [Sigma][Python][GH-A]    ││
│  │ [Python][QEMU][Ghidra][Binwalk]             │ └──────────────────────────┘│
│  └─────────────────────────────────────────────┘ ┌──────────────────────────┐│
│  ┌──────────────────────┐ ┌──────────────────────┐│ ▓▓▓▓▓ thumb ▓▓▓▓▓▓▓▓▓▓▓ ││
│  │ 03  ...              │ │ 04  ...              │├──────────────────────────┤│
│  └──────────────────────┘ └──────────────────────┘│ 05  ...                  ││
│        3-col grid, 28px gap, first card spans 2    └──────────────────────────┘│
│                      [ All projects on GitHub ↗ ]                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Hierarchy and motion.** A deliberate asymmetry: the featured card spans two columns at `xl` and is the only card with `.edge-lit`, which gives the grid a focal point without needing a louder colour. Within each card the reading order is thumb → metric → title → summary → stack, and the metric (`mono-metric` in `accent-green`) is intentionally placed *above* the title because the number is the hook. Filter chips sit at 44px tall on mobile and horizontally scroll with `scroll-snap-type: x mandatory`. Animation: **P1 `scrollReveal`** with 80ms per-card stagger, capped at 8 cards; **P3 `cardLift`** on hover. Filter changes use `motion`'s `layout` on the grid (`type: "spring", stiffness: 260, damping: 28`) with exiting cards fading over 160ms — and under reduced motion, filtering swaps the DOM with no layout animation and a 120ms opacity fade.

### 7.5 Skills & Expertise

**Mobile**

```
┌───────────────────────────────────────┐
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  │ 04 / SKILLS                        │
│  What I'm actually good at.           │ h2
│                                       │
│  ┌─ OFFENSIVE ───────────────────────┐│ mono-label header, accent-green
│  │ Web app testing          EXPERT   ││ body-sm + mono-label
│  │ ████████████████████░░░░░░        ││ 6px meter, gradient fill
│  │ Network / AD           EXPERT     ││
│  │ ████████████████████░░░░░░        ││
│  │ Cloud (AWS, Azure)     ADVANCED   ││
│  │ ████████████████░░░░░░░░░░        ││
│  └───────────────────────────────────┘│
│  ┌─ DETECTION ───────────────────────┐│
│  │ ...                               ││
│  └───────────────────────────────────┘│
│  ┌─ AI / AUTOMATION ─────────────────┐│
│  │ ...                               ││
│  └───────────────────────────────────┘│
│                                       │
│  TOOLING                              │ mono-label
│  [Burp][nmap][Ghidra][Frida][Sigma]   │ SkillBadge wrap, 8px gap
│  [Semgrep][Terraform][n8n][LangGraph] │
└───────────────────────────────────────┘
```

**Desktop**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  │ 04 / SKILLS                                                              │
│  What I'm actually good at.                                                  │
│                                                                              │
│  ┌── OFFENSIVE ──────────┐ ┌── DETECTION ──────────┐ ┌── AI / AUTOMATION ──┐│
│  │ Web app testing EXPERT│ │ Sigma / SIEM   EXPERT │ │ Agent pipelines ADV ││
│  │ ██████████████████░░░ │ │ ██████████████████░░░ │ │ ███████████████░░░░ ││
│  │ Network / AD    EXPERT│ │ Threat hunting   ADV  │ │ LLM eval + guard ADV││
│  │ ██████████████████░░░ │ │ ███████████████░░░░░░ │ │ ███████████████░░░░ ││
│  │ Cloud pentest     ADV │ │ IR / forensics  PROF  │ │ Workflow orch.  PROF││
│  │ ███████████████░░░░░░ │ │ ████████████░░░░░░░░░ │ │ ████████████░░░░░░░ ││
│  │ Firmware / RE    PROF │ │ Purple teaming  PROF  │ │ RAG for intel   PROF││
│  │ ████████████░░░░░░░░░ │ │ ████████████░░░░░░░░░ │ │ ████████████░░░░░░░ ││
│  └───────────────────────┘ └───────────────────────┘ └─────────────────────┘│
│                                                                              │
│  TOOLING  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  [Burp][nmap][Ghidra][Frida][Sigma][Semgrep][Terraform][n8n][LangGraph][...] │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Hierarchy and motion.** Three equal columns — no column is privileged, because the claim is breadth. Within a column the meters descend by level, which makes the gradient fills form a visual staircase and reads instantly. The meter is the only place the blue→green gradient is used, which ties the two accents together once rather than everywhere. The badge wall at the bottom is intentionally plain (`border-default`, `text-secondary`, no glow) so 20 items do not become 20 competing lights. Animation: **P7 `meterFill`**, triggered per column at `amount: 0.5` with 80ms row stagger, and a count-up on the level text. The badge wall uses **P1** with a fast 24ms stagger so it reads as a single sweep rather than 20 separate events.

### 7.6 Experience Timeline

**Mobile** — rail pinned left at x=20px, all cards to its right.

```
┌───────────────────────────────────────┐
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  │ 05 / PATH                          │
│  How I got here.                      │ h2
│                                       │
│  ●━┬─────────────────────────────────┐│ node green (current) + glow
│  ┃ │ 2023 — PRESENT        ● ACTIVE  ││ mono-label + chip
│  ┃ │ Senior Security Engineer        ││ h3
│  ┃ │ Acme Financial · Remote         ││ body-sm text-muted
│  ┃ │ ▸ Led 18 red-team engagements   ││ bullets, body-sm
│  ┃ │ ▸ Cut MTTD from 4h to 22m       ││
│  ┃ │ [AWS][Sigma][Python]            ││
│  ┃ └─────────────────────────────────┘│
│  ┃                                    │ 24px gap
│  ○━┬─────────────────────────────────┐│
│  ┃ │ 2020 — 2023                     ││
│  ┃ │ Penetration Tester              ││
│  ┃ │ ...                             ││
│  ┃ └─────────────────────────────────┘│
│  ┃  ... 4-6 entries ...               │
│  ╹  rail fades to transparent         │
└───────────────────────────────────────┘
```

**Desktop** — centre rail, cards alternate.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  │ 05 / PATH                                                                │
│  How I got here.                                                             │
│                                                                              │
│         ┌──────────────────────────────┐   ┃                                 │
│         │ 2023 — PRESENT    ● ACTIVE   │━━━●   rail: green → blue → fade     │
│         │ Senior Security Engineer     │   ┃                                 │
│         │ Acme Financial · Remote      │   ┃                                 │
│         │ ▸ Led 18 red-team engagements│   ┃                                 │
│         │ [AWS][Sigma][Python]         │   ┃                                 │
│         └──────────────────────────────┘   ┃                                 │
│                                       ┃    ┃   ┌──────────────────────────┐  │
│                                       ○━━━━━━━━│ 2020 — 2023              │  │
│                                            ┃   │ Penetration Tester       │  │
│                                            ┃   │ Redacted Labs · Berlin   │  │
│                                            ┃   │ ▸ 60+ web/API assessments│  │
│                                            ┃   └──────────────────────────┘  │
│         ┌──────────────────────────────┐   ┃                                 │
│         │ 2018 — 2020                  │━━━○                                 │
│         │ SOC Analyst II               │   ┃                                 │
│         └──────────────────────────────┘   ┃                                 │
│                        ... alternating, 40px row gap ...                     │
│                                            ╹                                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Hierarchy and motion.** The rail is the protagonist and the cards are annotations on it, which is why the rail gets the gradient and the glowing tip while the cards stay at `bg-overlay` with a 1px border and no shadow. The current role is the only entry with a filled green node, an `ACTIVE` chip, and a resting glow — one of exactly two resting glows in the whole page. Period labels are `mono-label` so the chronology scans as data. On mobile the alternation is abandoned entirely; a 20px left rail with uniform right-side cards is more legible at 375px than any attempt to zigzag. Animation: **P6 `timelineDraw`** — the rail draws over 1100ms, nodes pop at 180ms intervals as the tip passes, and each card reveals from its own rail side 80ms behind its node.

### 7.7 Contact / Connect

**Mobile**

```
┌───────────────────────────────────────┐
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  │ 06 / CONNECT                       │ wash: green
│  Found something? Tell me.            │ h2, glitch once
│  Disclosure, contract work, or        │ body-lg lede
│  a second opinion — all welcome.      │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │ ░ ~/contact                   ░ │  │ TerminalFrame, chrome=full
│  │ ░ $ cat contact.txt           ░ │  │ types on view, 4 lines
│  │ ░ ▸ email  omar@…             ░ │  │
│  │ ░ ▸ pgp    4A9F 2C11 …        ░ │  │
│  │ ░ ✓ reply within 24h        ▊ ░ │  │ green cursor
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │ █  Send an email              █ │  │ Button primary fullWidth
│  └─────────────────────────────────┘  │
│                                       │
│  ✉  Email           omar@…      ⧉     │ ContactLink, 64px rows
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ⌨  GitHub          @handle     ↗     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  in LinkedIn        /in/handle  ↗     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  🔑 PGP key         4A9F…       ⧉     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                       │
│  ● AVAILABLE FOR WORK                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  omar@sec:~$   ·   built 2026   ·  ↑  │ footer, mono-label
└───────────────────────────────────────┘
```

**Desktop**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  │ 06 / CONNECT                                                             │ wash green
│  Found something? Tell me.                                                   │ h2 40px
│  Disclosure, contract work, or a second opinion — all welcome.                │
│                                                                              │
│  ┌─────────────────────────────────────┐  ┌─────────────────────────────────┐│
│  │ ● ● ●   ~/contact             22:14 │  │ ✉  Email         omar@…     ⧉  ││
│  ├─────────────────────────────────────┤  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ││
│  │░ $ cat contact.txt                 ░│  │ ⌨  GitHub        @handle     ↗  ││
│  │░ ▸ email    omar@example.com       ░│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ││
│  │░ ▸ pgp      4A9F 2C11 8D3E 77B0    ░│  │ in LinkedIn      /in/handle  ↗  ││
│  │░ ▸ signal   available on request   ░│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ││
│  │░ ▸ tz       UTC+01                 ░│  │ 🔑 PGP key       4A9F…       ⧉  ││
│  │░ ✓ reply within 24h              ▊ ░│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ││
│  └─────────────────────────────────────┘  │ ┌─────────────────────────────┐ ││
│                                           │ │ █   Send an email         █ │ ││
│         1fr                               │ └─────────────────────────────┘ ││
│                                           │ ● AVAILABLE FOR WORK            ││
│                                           └─────────────────────────────────┘│
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  omar@sec:~$      Built with Next.js · No trackers · 2026        Back to top ↑│ footer
└──────────────────────────────────────────────────────────────────────────────┘
```

**Hierarchy and motion.** The closing beat should feel like a handshake, not a form — so there is **no contact form**. Two columns: the terminal states the facts in the site's own machine voice, the link rows let you act. The `h2` gets one glitch pass (the last one on the page), and the green wash is used here and nowhere else, so the bottom of the page is visibly warmer than the top. Animation: **P1** on the heading, then the terminal and the link column as two groups 100ms apart; the terminal runs **P9 `terminalType`**; each `ContactLink` reveals with a 60ms stagger. The footer hairline draws `scaleX: 0 → 1` from centre over 600ms `--ease-out-expo` on reveal; under reduced motion it renders at full width with a 150ms opacity fade.

---

## 8. ANIMATED HERO BACKGROUND

### 8.1 Concept: `PACKET LATTICE`

A single `<canvas>` behind the hero, rendering three layers over a transparent background (the `bg-base` body colour shows through — the canvas never paints its own opaque background, so there is no colour mismatch).

**Layer 1 — Lattice nodes.** A jittered grid of points. Cell size **96px**; each node offset by up to ±28px from its cell centre (seeded, deterministic per session so it does not reshuffle on resize). Each node is a **1.5px** square (squares, not circles — it reads as data, and it skips `arc()`). Base colour `#1C5F7F` at alpha **0.38**. Each node has an independent sine breathe: `alpha = 0.26 + 0.14 · sin(t · 0.0006 + phase)`.

**Layer 2 — Packets.** **14** packets on desktop. Each packet walks the lattice via **Manhattan routing**: pick a neighbour node, travel purely horizontally then purely vertically to reach it, at **38px/s**, then pick the next neighbour. The 90° turns are the whole point — the motion reads as routed traffic, not drifting dust. A packet is a **2px** square in `#35C3FF` (10 of them) or `#2BF59A` (4 of them), with a trail: the last **10** positions drawn at descending alpha `0.5 → 0.0`, implemented as a stored ring buffer, **not** as a translucent full-canvas fill (`fillRect` over the whole canvas every frame is banned — it costs a full-surface composite). The 1px line the packet travels along is drawn behind it at `#1C5F7F` alpha **0.10** only for the segment currently being traversed, so the lattice edges reveal themselves as traffic uses them.

**Layer 3 — Scan sweep.** Every **9s**, a 1px vertical line in `#2BF59A` at alpha **0.22** sweeps left → right across the full width over **1.6s** (`--ease-linear`), preceded by a 24px-wide gradient wake at alpha 0.06. Any node within 40px of the line brightens to alpha **0.85** and decays back over 600ms. This is the matrix nod, done once every nine seconds instead of continuously.

**Layer 4 — Glyph rain (desktop only, very sparse).** **7** columns at random x positions, each dropping JetBrains Mono glyphs from the set `01<>/\[]{}#$%&*+=~^` at **13px**, one glyph per **110ms**, column speed **40px/s**, colour `#2BF59A` at alpha **0.055**, with the leading glyph at alpha **0.14**. Columns respawn at the top with a new x after exiting. At 5.5% alpha this is felt rather than seen, which is the only acceptable amount of falling-glyph cliché.

**Vignette.** A static radial `background-image` on the canvas's parent (not painted per frame): `radial-gradient(120% 90% at 50% 40%, transparent 35%, #05070A 82%)`, which pulls the lattice away from the text and the section edges for free.

**Text protection.** The renderer holds a rect = the hero text column's bounding box + 24px padding. Inside that rect, nothing is drawn above alpha **0.12**, and the scan sweep's node-brighten is suppressed. This guarantees the measured 9.75:1 and 17.52:1 text ratios hold with the canvas live.

### 8.2 Performance budget

| Metric | Budget | Enforcement |
|---|---|---|
| Target frame rate | **60 fps** (16.6ms budget) | FPS governor, §8.3 |
| JS per frame (main thread) | **≤ 4.0ms** at desktop density | measured via `performance.now()` deltas in dev |
| Canvas draw calls per frame | **≤ 160** | 90 nodes + 14 packets × ~4 + sweep + 7 glyph cols |
| `devicePixelRatio` cap | **2.0** desktop, **1.5** mobile | `Math.min(dpr, cap)` on resize |
| Backing store area | **≤ 4.1 MP** (1440×1440 logical @ 2×, hero height capped at 1080 logical) | clamp canvas height to `min(innerHeight, 1080)` |
| Allocation per frame | **0 bytes** | all particles/trails pre-allocated in typed arrays (`Float32Array`) at init; no object literals, no array `push` in the loop |
| Bundle cost | **≤ 3.5 KB** gzipped | plain Canvas 2D, zero dependencies — no three.js, no p5, no WebGL |
| Resize handling | debounced **150ms** | re-seeds lattice, reuses the same typed arrays |
| Main-thread blocking on load | **0ms before LCP** | canvas mounts in a `"use client"` island, `requestIdleCallback`-gated with a 400ms `setTimeout` fallback, so it never competes with the hero LCP text |

Implementation notes that the budget depends on: a single `ctx.fillStyle` change per colour group per frame (batch all blue packets, then all green ones — `fillStyle` assignment is the dominant cost at this particle count); `ctx.clearRect` once per frame; `alpha` applied via pre-computed `rgba()` strings from a 20-step lookup table rather than `globalAlpha` churn; no `shadowBlur`, ever (it is the single most expensive Canvas 2D property and it is banned in this renderer — glow in the hero comes from CSS on the DOM layer above, not from canvas shadows); `canvas` element has `style: { contain: "strict" }`.

### 8.3 FPS governor

A rolling 30-frame mean frame time drives three tiers. Downgrades are one-way per session (no oscillation), each with a 2s cooldown:

| Tier | Entered when | Behaviour |
|---|---|---|
| **Full** | start (desktop, `dpr ≤ 2`) | 90 nodes, 14 packets, trails 10, sweep on, glyph rain on |
| **Reduced** | mean frame time > **22ms** for 30 consecutive frames | 48 nodes, 8 packets, trails 4, sweep on, glyph rain **off**, dpr clamped to 1 |
| **Static** | mean frame time > **28ms** for 30 frames while already Reduced | loop cancelled; one final frame of nodes + idle lattice edges remains painted |

### 8.4 Mobile behaviour — reduced, not disabled

| Viewport | Nodes | Packets | Trail length | Scan sweep | Glyph rain | DPR cap |
|---|---|---|---|---|---|---|
| ≥1024px | 90 | 14 | 10 | yes (9s) | 7 cols | 2.0 |
| 768–1023px | 60 | 10 | 6 | yes (11s) | off | 2.0 |
| 480–767px | 40 | 6 | 4 | yes (14s) | off | 1.5 |
| <480px | 28 | 4 | 0 (no trail) | **off** | off | 1.5 |
| `navigator.hardwareConcurrency <= 4` | force one tier down | | | | | |
| `navigator.connection.saveData === true` | **Static tier immediately** | | | | | |

Cell size scales with the node count so the lattice stays visually even: `cell = clamp(96 · sqrt(90 / nodeCount), 96, 180)`.

### 8.5 Pausing — required, not optional

```
IntersectionObserver(canvas, { threshold: 0 })
  → not intersecting: cancelAnimationFrame, flag paused
  → intersecting: reset lastTime = performance.now(), resume rAF

document.addEventListener("visibilitychange")
  → document.hidden: cancelAnimationFrame
  → visible: reset lastTime (so dt does not spike to 30s and teleport every packet), resume

window "pagehide" / React unmount
  → cancelAnimationFrame + remove all listeners + null the ctx reference
```

All motion integrates against a **clamped delta**: `dt = Math.min(performance.now() - lastTime, 33)`. This is what makes resume-after-hidden look correct instead of jumping.

### 8.6 Reduced-motion fallback

When `matchMedia("(prefers-reduced-motion: reduce)")` matches:

1. The animation loop **never starts**. No `requestAnimationFrame` is ever called.
2. Exactly **one** frame is rendered and left on screen: the full 90-node lattice at a fixed alpha of **0.34** (no breathing), **plus** all lattice edges drawn as 1px `#1C5F7F` lines at alpha **0.08** — the edges are normally revealed only by passing packets, so drawing them all statically makes the still frame *more* informative than a paused live frame.
3. **14 packets are drawn at rest**, each at a node, as 2px squares in `#35C3FF` / `#2BF59A` with no trails — the composition still reads as a network with traffic on it.
4. No scan sweep, no glyph rain, no cursor parallax.
5. The vignette and the CSS washes are unchanged (they are static gradients).
6. The listener is live: if the user flips the OS setting mid-session, `change` fires and the renderer either cancels the loop and paints the static frame, or starts the loop. No reload required.

There is also **no pointer parallax at all** in this design, under any motion setting — moving the whole lattice with the cursor is the first thing that makes a background like this feel cheap, and it is a guaranteed scroll-jank source on mid-range hardware.

---

## 9. ACCESSIBILITY RULES

### 9.1 Focus-visible ring — one spec, everywhere

```css
:where(a, button, [role="button"], input, textarea, select, summary, [tabindex]):focus-visible {
  outline: 2px solid var(--color-accent-blue);   /* #35C3FF */
  outline-offset: 2px;
  border-radius: inherit;
}
```

- Colour **`#35C3FF`**, width **2px**, offset **+2px**. Contrast of the ring against the surfaces it will sit on: **9.99:1** (`bg-base`), **9.46:1** (`bg-elevated`), **8.77:1** (`bg-overlay`), **7.69:1** (`bg-hover`). All clear the 3:1 requirement of WCAG 2.2 SC 1.4.11 by more than 2.5×.
- Offset overrides, and only these: `<ProjectCard>` uses `+3px` (it has a 10px radius and needs the breathing room); `<ContactLink>` and mobile menu rows use `-2px` (full-bleed rows would push a positive ring off-screen).
- `:focus` (non-visible) is **never** styled. `outline: none` without a `:focus-visible` replacement is forbidden — this is a review-blocking error.
- The ring is never animated, never glowed, and never replaced by a `box-shadow` (box-shadows are clipped by ancestor `overflow: hidden`, outlines are not).
- Focus order follows DOM order. A `.skip-link` is the first focusable element: visually hidden until focused, then pinned at `top: 12px; left: 12px`, styled as a `Button variant="primary" size="sm"`, targeting `#main`.

### 9.2 Touch targets and pointers

- Minimum interactive target: **44 × 44 px** (WCAG 2.2 SC 2.5.8 asks 24×24; we hold 44 because it is a touch-first page).
- Where a visual control is smaller than 44px (icon links, the copy glyph, filter chips, timeline nodes), expand the hit area with `padding` or a `::after { position: absolute; inset: -Npx; }` pseudo-element. Never by scaling up the icon.
- Spacing between adjacent targets: **≥ 8px**.
- `<Button size="sm">` (36px) is permitted **only** inside a parent row that is itself ≥44px tall, never as a standalone mobile tap target.
- All hover-only affordances are additive. Every hover state has a `:focus-visible` equivalent, and all card/row hover transforms are gated behind `@media (hover: hover) and (pointer: fine)` so they never fire on a touch tap.

### 9.3 Heading hierarchy

- Exactly **one** `<h1>` per page, in the hero, containing the person's name and claim. The `display-xl` style is applied to that `<h1>`.
- Each of the seven sections has exactly **one** `<h2>`, rendered by `<SectionHeading>`.
- Card titles, timeline roles, pipeline stage names and skill-category headers are `<h3>`.
- **Never skip a level** and never choose a heading tag for its size — size comes from the type token, structure comes from the tag.
- The `mono-label` eyebrow is **not** a heading. It is a `<p>` (or `<span>`) inside the heading block. Marking it up as a heading would create a phantom level.
- Each `<section>` carries `aria-labelledby` pointing at its own `<h2>` id, so the landmark list is navigable.
- `<main id="main">` wraps everything between nav and footer. `<nav>`, `<main>`, `<footer>` are the only landmarks.

### 9.4 ARIA requirements, by case

| Element | Requirement |
|---|---|
| Icon-only links (GitHub, LinkedIn, copy) | `aria-label` naming the destination or action, e.g. `aria-label="Omar's GitHub profile"` |
| External links | `target="_blank" rel="noopener noreferrer"` + an `.sr-only` span `"(opens in a new tab)"` |
| Hamburger trigger | `aria-label="Open menu"` / `"Close menu"`, `aria-expanded`, `aria-controls="mobile-menu"` |
| Mobile menu sheet | `role="dialog" aria-modal="true" aria-label="Site navigation"`, focus trapped, `Escape` closes, focus returns to the trigger |
| Nav active item | `aria-current="true"` on the item matching the in-view section |
| Terminal animated stream | `aria-hidden="true"` on the animated node + a sibling `.sr-only` `<pre>` with the complete transcript, including the `$`/`✓`/`!` prefixes as words (`"command:"`, `"ok:"`, `"warning:"`) |
| Skill meter bar | `aria-hidden="true"`; the level is read from the always-visible `levelText` plus an `.sr-only` `"4 out of 5"`. **No `role="meter"`** — real text is read correctly by every AT, a meter role is not. |
| `<StatWell>` value | The number and its caption are plain text; the caption is associated by DOM adjacency, not `aria-describedby` |
| Project filter chips | `role="tablist"` / `role="tab"` with `aria-selected`, or plain buttons with `aria-pressed` — pick **`aria-pressed` buttons**, since the grid below is not a tab panel |
| Filtered grid | `aria-live="polite"` on an `.sr-only` status node announcing `"Showing 4 of 9 projects"` |
| Copy action | `aria-live="polite"` region announcing `"Email address copied"` |
| AI Showcase stage list | A real `<ol>`; the active item gets `aria-current="step"`. Not a tablist — scroll position is not a tab selection. |
| AI Showcase progress (`03 / 05`) | Plain text, no `role="progressbar"` |
| `<DagGraph>` SVG | `aria-hidden="true"` — it is a decorative restatement of the stage list, which is real text |
| `<BackdropCanvas>` | `aria-hidden="true" role="presentation"`, plus `pointer-events: none` |
| Glitch ghost layers | CSS pseudo-elements, so invisible to AT by construction. Never duplicate glitch text as real DOM nodes. |
| Prefix glyphs, ticks, chevrons, status dots, rails, packets, scanlines | `aria-hidden="true"` if they are elements; preferably CSS backgrounds/pseudo-elements so the question does not arise. The availability **status** must also exist as the text `"Available for work"`, never as colour alone. |
| Images | `next/image` with a real `alt`; decorative imagery gets `alt=""` |
| Animated sections | Nothing is ever left at `opacity: 0` for a user whose JS failed. Reveal components render visible by default and are animated *down* to the hidden state only after JS confirms it can animate them back. |

### 9.5 Contrast rules — restated as hard, enforceable rules

1. **Body text is `text-primary`, `text-secondary`, or `text-muted`. Nothing else, ever.** Measured floors: 17.52 / 9.75 / 6.65 on `bg-base`; worst case anywhere in the system is `text-muted` on `bg-hover` at **5.12:1**. All pass AA body.
2. **No neon prose.** `accent-blue` / `accent-green` / `accent-amber` pass AA as text (9.99 / 14.05 / 11.18 on `bg-base`) and are permitted for links, large text, mono labels, metrics, icons, borders and glows — but **never for a paragraph, a list of prose, an input value, or any run of 20+ consecutive words.**
3. **Dim accents are not text.** `accent-blue-dim` (4.44:1) and `accent-green-dim` (3.33:1 on `bg-overlay`) fail AA body and are restricted to borders, rails, icon strokes ≥24px, inactive SVG edges, meter tracks, and glow stops.
4. **`accent-blue-deep` is decoration only.** At **2.87:1** it fails both AA and the 3:1 non-text threshold. It appears only in gradients, canvas pixels and glow stops, and may never be the sole indicator of a control's boundary or state.
5. **Filled accents carry dark ink.** `text-inverse` #05070A only — 9.99:1 on blue, 14.05:1 on green, 11.18:1 on amber. Light text on a neon fill is forbidden (`accent-blue` on `text-primary` = **1.75:1**).
6. **Neon never touches neon.** `accent-green` on `accent-blue` is **1.41:1**. No neon-on-neon text, no adjacent neon fills, no green text inside a blue-filled container.
7. **Translucent borders are never load-bearing alone.** Any state conveyed by a border must also change background or add text. `border-strong` at 32% alpha does not reach 3:1 on its own.
8. **The canvas may not erode text contrast.** The hero renderer caps every pixel inside the text bounding box (+24px) at alpha 0.12, which preserves the 17.52:1 and 9.75:1 measurements with the background live. Verify with a screenshot sample after implementation.
9. **Colour is never the only channel.** Status is colour **plus** a glyph **plus** a word: `● AVAILABLE FOR WORK`, `✓ ok`, `! warn`, `✕ err`. Terminal line kinds, the active pipeline stage, and the current timeline entry all satisfy this.
10. **Focus contrast is fixed at ≥7.69:1** by using `#35C3FF` on every surface in the system. No component may restyle the ring colour.

---

## 10. Implementation order (suggested, non-binding)

1. `globals.css` — §1, §2, §3, §4, §5.1 tokens. Nothing else until these land.
2. Primitives — `Section`, `SectionHeading`, `MonoLabel`, `Button`, `Reveal`, `SrOnly`, focus ring, skip link.
3. `NavBar` + `MobileMenu` (they gate every scroll test).
4. Static pass of all seven sections with zero animation — verify layout and the §9.5 contrast rules at 375 / 768 / 1280.
5. `TerminalFrame` + P9, then `GlitchText` + P8.
6. P1, P3, P4, P5, P6, P7.
7. AI Showcase: build the **stacked** (mobile / reduced-motion) layout first, then add the pin and P10 on top of it at `lg+`.
8. `BackdropCanvas` last, behind the idle-callback gate.
9. Audit pass: every component's reduced-motion branch, then every component's `:focus-visible` branch.
