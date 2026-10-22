type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

/**
 * Simple in-memory rate limiter (per IP).
 * @param req - The incoming request（NextRequest でも素の Request でも可。テストは素の Request で呼ぶ）
 * @param limit - Max requests per window (default: 10)
 * @param windowMs - Window duration in ms (default: 60000 = 1 minute)
 */
export function rateLimit(
  req: Request,
  limit = 10,
  windowMs = 60_000,
): { success: boolean; remaining: number } {
  cleanup();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const key = `${ip}:${new URL(req.url).pathname}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  entry.count++;
  if (entry.count > limit) {
    return { success: false, remaining: 0 };
  }

  return { success: true, remaining: limit - entry.count };
}
