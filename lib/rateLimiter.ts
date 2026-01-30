type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

export interface RateLimiterOptions {
  windowMs?: number; // default 15 minutes
  max?: number; // default 5
}

const DEFAULTS: Required<RateLimiterOptions> = {
  windowMs: 15 * 60 * 1000,
  max: 5,
};

export function consumeRateLimit(key: string, opts?: RateLimiterOptions) {
  const { windowMs, max } = { ...DEFAULTS, ...opts };
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  store.set(key, entry);
  return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
}

export function resetRateLimit(key: string) {
  store.delete(key);
}

// Expose a way to inspect usage (for debugging in dev)
export function _dumpRateLimiter() {
  return Array.from(store.entries()).map(([k, v]) => ({ key: k, ...v }));
}
