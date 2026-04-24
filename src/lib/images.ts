/**
 * Image URL helpers.
 *
 * We use picsum.photos with deterministic seeds so every page gets its own
 * unique image that stays stable across rebuilds (important for SEO / caching).
 *
 * Swap this helper for real curated images later by changing the body of
 * `heroImage()` etc. — every page picks up the change automatically.
 */
const BASE = 'https://picsum.photos/seed';

export function heroImage(seed: string, w = 1600, h = 900): string {
  return `${BASE}/${encodeURIComponent(seed)}/${w}/${h}`;
}

export function cardImage(seed: string, w = 600, h = 400): string {
  return `${BASE}/${encodeURIComponent(seed)}/${w}/${h}`;
}

export function avatarImage(seed: string, size = 96): string {
  return `${BASE}/${encodeURIComponent(seed)}/${size}/${size}`;
}
