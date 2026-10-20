/**
 * Motion tokens mirroring docs/DESIGN_SYSTEM.md §5.1.
 *
 * These are the JS-side twins of the CSS easing/duration custom properties.
 * Durations are in seconds because that is what `motion` expects; the spec
 * states them in milliseconds.
 */

export type Ease = [number, number, number, number];

export const ease = {
  outExpo: [0.16, 1, 0.3, 1] as Ease,
  outQuart: [0.25, 1, 0.5, 1] as Ease,
  inOutQuint: [0.83, 0, 0.17, 1] as Ease,
  snap: [0.34, 1.56, 0.64, 1] as Ease,
  inQuad: [0.55, 0.085, 0.68, 0.53] as Ease,
};

/** Seconds. */
export const dur = {
  instant: 0.09,
  fast: 0.16,
  base: 0.24,
  slow: 0.42,
  slower: 0.64,
  reveal: 0.72,
};

/** Shared spring for `layoutId` playheads and the nav indicator. */
export const spring = {
  navInk: { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } as const,
  playhead: { type: "spring", stiffness: 300, damping: 30 } as const,
};

/**
 * Viewport trigger used by every scroll reveal (§P1). Centralised so the
 * trigger point is identical across sections.
 */
export const inViewOnce = {
  once: true,
  amount: 0.22,
  margin: "0px 0px -12% 0px",
} as const;
