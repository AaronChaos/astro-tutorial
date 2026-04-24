/**
 * Pool picker + token resolver.
 *
 * This is the tiny engine that makes programmatic SEO idempotent:
 *   - `pickVariation()` picks the same variation for the same seed, every build.
 *   - `resolveTokens()` replaces {niche}, {location} etc. inside a chosen variation.
 *
 * Keep this file boring. It's the hot path for every landing page.
 */

/** Stable string hash (djb2-ish). Same seed -> same number on every build. */
function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Deterministically pick one variation from a named pool.
 * Different pools can (and should) use different seed suffixes so they don't
 * lockstep across the site.
 */
export function pickVariation(
  pools: Record<string, string[]> | undefined,
  poolName: string,
  seed: string,
): string {
  const variations = pools?.[poolName];
  if (!variations || variations.length === 0) return '';
  return variations[hash(`${poolName}:${seed}`) % variations.length];
}

/**
 * Resolve {tokens} inside a string using a context object.
 * Supports a tiny filter chain: {niche|title}, {niche|lower}, {niche|upper}.
 */
export function resolveTokens(
  text: string,
  ctx: Record<string, string | number | undefined>,
): string {
  return text.replace(/\{(\w+)(?:\|(\w+))?\}/g, (_m, key, filter) => {
    const raw = ctx[key];
    if (raw === undefined || raw === null) return '';
    let value = String(raw);
    switch (filter) {
      case 'lower': value = value.toLowerCase(); break;
      case 'upper': value = value.toUpperCase(); break;
      case 'title': value = value.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase()); break;
    }
    return value;
  });
}

/**
 * Pick + resolve in one call. This is what 95% of pages will use.
 */
export function pick(
  pools: Record<string, string[]> | undefined,
  poolName: string,
  seed: string,
  ctx: Record<string, string | number | undefined>,
): string {
  const picked = pickVariation(pools, poolName, seed);
  return resolveTokens(picked, ctx);
}
