import { createReadAttemptRegistry, type ReadAttemptRegistry, type ReadAttemptRequest } from "../read-attempt-registry";
import { readRetryReference, type ReadRetryPolicy, type ReadRetryRun } from "../read-retry";
import { contentHash } from "../rules";

export const clock = (ms: number) => new Date(Date.parse("2026-10-24T12:00:00.000Z") + ms).toISOString();
export function registry() {
  const policy: ReadRetryPolicy = { id: "synthetic-policy", version: 1, target: { source: "local_validation", accountRef: "synthetic-account", operationRef: "synthetic-read",
    method: "GET", hostRef: "no-network", path: "/local", endpointContractHash: "a".repeat(64), semantics: "confirmed_read_only", acquisition: "local_validation" },
    authorization: { status: "approved", reference: "synthetic-approval", approvedAt: clock(-1000) }, effectiveFrom: clock(-1000), effectiveUntil: clock(120000),
    sdkRetry: "disabled_confirmed", httpRetry: "disabled_confirmed", redirects: "reject", tlsValidation: "enabled", maxAttempts: 2,
    baseDelayMs: 2000, maxDelayMs: 5000, attemptTimeoutMs: 1000 };
  const run: ReadRetryRun = { id: "synthetic-run", version: 1, policy: readRetryReference(policy), requestFingerprint: "b".repeat(64), createdAt: clock(0), deadline: clock(100000) };
  return createReadAttemptRegistry({ policy, run }, clock(0));
}
export function request(j: ReadAttemptRegistry, serial = 1): ReadAttemptRequest {
  return { requestId: `00000000-0000-4000-8000-${String(serial).padStart(12, "0")}`, actorRef: "synthetic-actor", run: readRetryReference(j.genesis.input.run),
    expected: { revision: j.state.revision, headHash: j.headHash }, command: { type: "start", attemptId: `attempt-${serial}`, transportRequestId: `transport-${serial}` } };
}
export function completion(j: ReadAttemptRegistry, serial = 2, outcome: "succeeded" | "failed" = "succeeded"): ReadAttemptRequest {
  const r = request(j, serial), attempt = j.state.attempts.at(-1)!;
  r.command = { type: "complete", attemptId: attempt.id, startedAttemptHash: contentHash(attempt), result: outcome === "succeeded" ? { status: "succeeded", resultHash: "c".repeat(64) }
    : { status: "failed", failure: { category: "transient_network", httpStatus: null, classificationConfirmed: true, classificationRef: "synthetic-classification", authenticationRequired: false,
      permissionDenied: false, challengeDetected: false, certificateFailure: false, redirected: false, retryAfter: { status: "absent" } } } };
  return r;
}
