/**
 * Canonical site URL. Set NEXT_PUBLIC_SITE_URL in the deployment
 * environment; the fallback keeps local builds and previews working.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://omaralhalabi.dev";
