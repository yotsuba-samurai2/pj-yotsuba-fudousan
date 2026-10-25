import { z } from "zod";
import { contentHash } from "./rules";

const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/), instant = z.iso.datetime({ precision: 3 });
const integer = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER), hash = z.string().regex(/^[a-f0-9]{64}$/);
const reference = z.object({ id, version: integer.min(1), hash }).strict();
export const readRetryPolicySchema = z.object({ id, version: integer.min(1),
  target: z.object({ source: z.enum(["site", "athome", "e_seikatsu", "itandi", "reins", "local_validation"]), accountRef: id, operationRef: id,
    method: z.enum(["GET", "HEAD", "POST"]), hostRef: id, path: z.string().max(300).regex(/^\/(?:[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\/?)?$/), endpointContractHash: hash,
    semantics: z.enum(["confirmed_read_only", "unknown", "write"]), acquisition: z.enum(["official_api", "official_export", "local_validation", "mock", "unknown"]) }).strict(),
  authorization: z.object({ status: z.enum(["approved", "pending", "revoked"]), reference: id.nullable(), approvedAt: instant.nullable() }).strict(),
  effectiveFrom: instant, effectiveUntil: instant,
  sdkRetry: z.enum(["disabled_confirmed", "enabled", "unknown"]), httpRetry: z.enum(["disabled_confirmed", "enabled", "unknown"]),
  redirects: z.enum(["reject", "unknown"]), tlsValidation: z.enum(["enabled", "disabled", "unknown"]),
  maxAttempts: integer.min(1).max(10), baseDelayMs: integer.min(1).max(86400000), maxDelayMs: integer.min(1).max(86400000), attemptTimeoutMs: integer.min(1).max(3600000),
}).strict().refine(p => p.effectiveFrom < p.effectiveUntil && p.baseDelayMs <= p.maxDelayMs);
export const readRetryRunSchema = z.object({ id, version: integer.min(1), policy: reference, requestFingerprint: hash, createdAt: instant, deadline: instant }).strict()
  .refine(r => r.createdAt < r.deadline);
const retryAfter = z.discriminatedUnion("status", [z.object({ status: z.literal("absent") }).strict(),
  z.object({ status: z.literal("valid"), notBefore: instant }).strict(), z.object({ status: z.literal("invalid") }).strict()]);
const failure = z.object({ category: z.enum(["authentication", "authorization", "captcha", "certificate", "rate_limit", "transient_network", "server_unavailable", "unknown"]),
  httpStatus: z.number().int().min(100).max(599).nullable(), classificationConfirmed: z.boolean(), classificationRef: id.nullable(),
  authenticationRequired: z.boolean(), permissionDenied: z.boolean(), challengeDetected: z.boolean(), certificateFailure: z.boolean(), redirected: z.boolean(),
  retryAfter }).strict();
export const readFailureSchema = failure;
const attemptBase = { id, requestId: id, run: reference, requestFingerprint: hash, number: integer.min(1).max(10), startedAt: instant };
export const readAttemptSchema = z.discriminatedUnion("status", [
  z.object({ ...attemptBase, status: z.literal("started") }).strict(),
  z.object({ ...attemptBase, status: z.literal("succeeded"), finishedAt: instant, resultHash: hash }).strict(),
  z.object({ ...attemptBase, status: z.literal("failed"), finishedAt: instant, failure }).strict(),
]);
export type ReadRetryPolicy = z.infer<typeof readRetryPolicySchema>;
export type ReadRetryRun = z.infer<typeof readRetryRunSchema>;
export type ReadAttempt = z.infer<typeof readAttemptSchema>;
export const readRetryReference = (p: { id: string; version: number }) => ({ id: p.id, version: p.version, hash: contentHash(p) });
const held = (reason: string) => ({ status: "held" as const, executable: false as const, reason });
const same = (a: unknown, b: unknown) => contentHash(a) === contentHash(b);

function failureDisposition(f: z.infer<typeof failure>): "retry" | string {
  // Stop signals win, even when a server also supplies Retry-After or a rate-limit label.
  if (f.authenticationRequired || f.category === "authentication" || f.httpStatus === 401) return "AUTHENTICATION_REQUIRED";
  if (f.permissionDenied || f.category === "authorization") return "PERMISSION_DENIED";
  if (f.challengeDetected || f.category === "captcha") return "CHALLENGE_REQUIRES_HUMAN";
  if (f.certificateFailure || f.category === "certificate") return "CERTIFICATE_FAILURE";
  if (f.redirected || (f.httpStatus !== null && f.httpStatus >= 300 && f.httpStatus < 400)) return "REDIRECT_NOT_AUTHORIZED";
  if (!f.classificationConfirmed || !f.classificationRef) return "FAILURE_CLASSIFICATION_UNCONFIRMED";
  if (f.retryAfter.status === "invalid") return "INVALID_RETRY_AFTER";
  if (f.category === "rate_limit" && (f.httpStatus === 429 || f.httpStatus === 403)) return "retry";
  if (f.httpStatus === 403) return "UNCLASSIFIED_FORBIDDEN";
  if (f.category === "transient_network" && (f.httpStatus === null || f.httpStatus === 408)) return "retry";
  if (f.category === "server_unavailable" && (f.httpStatus === 502 || f.httpStatus === 503 || f.httpStatus === 504)) return "retry";
  return "NON_RETRYABLE_FAILURE";
}

/** A replayable retry suggestion only. Never sleeps, calls an adapter, refreshes credentials or bypasses TLS. */
export function proposeReadAttempt(rawPolicy: unknown, rawRun: unknown, expectedRun: unknown, rawHistory: unknown, expectedHistoryHash: unknown, now: string) {
  try {
    if (!Array.isArray(rawHistory) || rawHistory.length > 10) return held("READ_HISTORY_LIMIT");
    const policy = readRetryPolicySchema.safeParse(rawPolicy), run = readRetryRunSchema.safeParse(rawRun), expected = reference.safeParse(expectedRun),
      history = z.array(readAttemptSchema).safeParse(rawHistory);
    if (!policy.success || !run.success || !expected.success || !history.success || !hash.safeParse(expectedHistoryHash).success || !instant.safeParse(now).success) return held("INVALID_READ_RETRY_INPUT");
    const p = policy.data, r = run.data, h = history.data;
    if (!same(expected.data, readRetryReference(r)) || !same(r.policy, readRetryReference(p)) || contentHash(h) !== expectedHistoryHash) return held("READ_RETRY_REFERENCE_MISMATCH");
    if (p.target.source === "reins") return held("REINS_AUTOMATION_UNSUPPORTED");
    if (p.target.semantics !== "confirmed_read_only" || p.target.acquisition === "unknown" || p.target.acquisition === "mock") return held("READ_OPERATION_UNCONFIRMED");
    if ((p.target.source === "local_validation") !== (p.target.acquisition === "local_validation")) return held("READ_OPERATION_UNCONFIRMED");
    if (p.authorization.status !== "approved" || !p.authorization.reference || !p.authorization.approvedAt || p.authorization.approvedAt > r.createdAt
      || r.createdAt < p.effectiveFrom || r.deadline > p.effectiveUntil) return held("READ_AUTHORIZATION_UNCONFIRMED");
    if (p.sdkRetry !== "disabled_confirmed" || p.httpRetry !== "disabled_confirmed") return held("NESTED_RETRY_NOT_DISABLED");
    if (p.redirects !== "reject") return held("REDIRECT_POLICY_UNCONFIRMED");
    if (p.tlsValidation !== "enabled") return held("TLS_VALIDATION_REQUIRED");
    if (r.createdAt > now) return held("READ_CLOCK_REGRESSION");
    let eligibleAt = Date.parse(r.createdAt), terminalReason: string | undefined;
    const attemptIds = new Set<string>(), requestIds = new Set<string>();
    for (const [index, attempt] of h.entries()) {
      if (terminalReason) return held("READ_ATTEMPT_AFTER_TERMINAL");
      if (!same(attempt.run, expected.data) || attempt.requestFingerprint !== r.requestFingerprint) return held("READ_ATTEMPT_BINDING_MISMATCH");
      if (attempt.number !== index + 1 || attempt.number > p.maxAttempts || attemptIds.has(attempt.id) || requestIds.has(attempt.requestId)) return held("INVALID_READ_ATTEMPT_SEQUENCE");
      attemptIds.add(attempt.id); requestIds.add(attempt.requestId);
      if (attempt.startedAt > now || Date.parse(attempt.startedAt) < eligibleAt || Date.parse(attempt.startedAt) + p.attemptTimeoutMs > Date.parse(r.deadline)) return held("INVALID_READ_ATTEMPT_TIME");
      if (attempt.status === "started") {
        if (index !== h.length - 1) return held("OVERLAPPING_READ_ATTEMPTS");
        return held("READ_ATTEMPT_IN_FLIGHT");
      }
      if (attempt.finishedAt < attempt.startedAt || attempt.finishedAt > now) return held("INVALID_READ_COMPLETION_TIME");
      if (attempt.status === "succeeded") terminalReason = "READ_SUCCEEDED";
      else {
        const disposition = failureDisposition(attempt.failure);
        if (disposition !== "retry") terminalReason = disposition;
        else {
          const backoff = Math.min(p.maxDelayMs, p.baseDelayMs * 2 ** (attempt.number - 1));
          eligibleAt = Math.max(Date.parse(attempt.finishedAt) + backoff,
            attempt.failure.retryAfter.status === "valid" ? Date.parse(attempt.failure.retryAfter.notBefore) : 0);
        }
      }
    }
    const body = { run: expected.data, historyHash: expectedHistoryHash as string, checkedAt: now };
    if (terminalReason) return { status: "terminal" as const, executable: false as const, reason: terminalReason, remainingAttempts: p.maxAttempts - h.length, reference: { ...body, hash: contentHash(body) } };
    if (h.length >= p.maxAttempts) return held("READ_ATTEMPT_BUDGET_EXHAUSTED");
    const notBefore = Math.max(eligibleAt, Date.parse(now));
    if (notBefore + p.attemptTimeoutMs > Date.parse(r.deadline)) return held("READ_DEADLINE_EXHAUSTED");
    return { status: "suggested" as const, executable: false as const, reason: h.length ? "RETRY_REQUIRES_ATOMIC_START" : "INITIAL_READ_REQUIRES_ATOMIC_START",
      nextAttemptNumber: h.length + 1, notBefore: new Date(notBefore).toISOString(), attemptTimeoutMs: p.attemptTimeoutMs,
      remainingAttempts: p.maxAttempts - h.length, reference: { ...body, hash: contentHash(body) } };
  } catch { return held("INVALID_READ_RETRY_INPUT"); }
}
