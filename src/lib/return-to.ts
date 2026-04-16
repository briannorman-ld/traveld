/** Same-origin article detail paths only (post-auth redirect). */
const ARTICLE_DETAIL = /^\/articles\/[a-z0-9-]+$/;

/**
 * Validates `returnTo` from a query string for safe client-side navigation
 * (no open redirects — internal article URLs only).
 */
export function normalizePostAuthReturnTo(
  raw: string | string[] | undefined | null,
): string | null {
  if (raw == null) return null;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string") return null;
  let s = value.trim();
  if (!s) return null;
  try {
    s = decodeURIComponent(s);
  } catch {
    return null;
  }
  if (!s.startsWith("/") || s.startsWith("//")) return null;
  if (s.includes("\0") || s.includes("//")) return null;
  if (!ARTICLE_DETAIL.test(s)) return null;
  return s;
}
