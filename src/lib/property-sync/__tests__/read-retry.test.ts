import { expect, it } from "vitest";
import { proposeReadAttempt, readRetryReference, type ReadRetryPolicy, type ReadRetryRun, type ReadAttempt } from "../read-retry";
import { contentHash } from "../rules";

const time = (ms: number) => new Date(Date.parse("2026-10-24T12:00:00.000Z") + ms).toISOString();
function fixture() {
  const policy: ReadRetryPolicy = { id: "synthetic-policy", version: 1,
    target: { source: "athome", accountRef: "PRIVATE_ACCOUNT", operationRef: "PRIVATE_OPERATION", method: "GET", hostRef: "PRIVATE_HOST", path: "/synthetic-read",
      endpointContractHash: "a".repeat(64), semantics: "confirmed_read_only", acquisition: "official_export" },
    authorization: { status: "approved", reference: "PRIVATE_AUTHORIZATION", approvedAt: time(-1000) }, effectiveFrom: time(-1000), effectiveUntil: time(120000),
    sdkRetry: "disabled_confirmed", httpRetry: "disabled_confirmed", redirects: "reject", tlsValidation: "enabled",
    maxAttempts: 3, baseDelayMs: 2000, maxDelayMs: 5000, attemptTimeoutMs: 1000 };
  const run: ReadRetryRun = { id: "synthetic-run", version: 1, policy: readRetryReference(policy), requestFingerprint: "b".repeat(64), createdAt: time(0), deadline: time(100000) };
  const history: ReadAttempt[] = [];
  return { policy, run, expected: readRetryReference(run), history };
}
type Fixture = ReturnType<typeof fixture>;
function failed(f: Fixture, number = 1, started = 0, finished = 1000): ReadAttempt & { status: "failed" } {
  return { id: `attempt-${number}`, requestId: `request-${number}`, run: f.expected, requestFingerprint: f.run.requestFingerprint, number,
    startedAt: time(started), finishedAt: time(finished), status: "failed", failure: { category: "transient_network", httpStatus: null,
      classificationConfirmed: true, classificationRef: "PRIVATE_CLASSIFICATION", authenticationRequired: false, permissionDenied: false,
      challengeDetected: false, certificateFailure: false, redirected: false, retryAfter: { status: "absent" } } };
}
const run = (f = fixture(), at = time(1000)) => proposeReadAttempt(f.policy, f.run, f.expected, f.history, contentHash(f.history), at);
function rebind(f: Fixture) { f.run.policy = readRetryReference(f.policy); f.expected = readRetryReference(f.run); for (const a of f.history) a.run = f.expected; }

it("初回も総予算に含み、提案の再計算だけでは予算を消費せず実行しない", () => {
  const f = fixture(), before = structuredClone(f), result = run(f, time(0));
  expect(result).toMatchObject({ status: "suggested", executable: false, reason: "INITIAL_READ_REQUIRES_ATOMIC_START", nextAttemptNumber: 1,
    remainingAttempts: 3, notBefore: time(0), attemptTimeoutMs: 1000, reference: { run: f.expected, historyHash: contentHash([]) } });
  expect(run(f, time(0))).toEqual(result); expect(f).toEqual(before);
  expect(JSON.stringify(result)).not.toMatch(/PRIVATE_|path|accountRef|classificationRef/);
});
it("有限backoffと総予算を履歴から再現", () => {
  const f = fixture(); f.history = [failed(f)];
  expect(run(f)).toMatchObject({ status: "suggested", nextAttemptNumber: 2, remainingAttempts: 2, notBefore: time(3000) });
  f.history.push(failed(f, 2, 3000, 4000)); expect(run(f, time(4000))).toMatchObject({ nextAttemptNumber: 3, notBefore: time(8000), remainingAttempts: 1 });
  f.history.push(failed(f, 3, 8000, 9000)); expect(run(f, time(9000))).toMatchObject({ reason: "READ_ATTEMPT_BUDGET_EXHAUSTED" });
});
it("backoff上限とRetry-Afterの遅い方を使用し、期限へ短縮しない", () => {
  const f = fixture(); f.policy.maxAttempts = 4; rebind(f);
  f.history = [failed(f), failed(f, 2, 3000, 4000), failed(f, 3, 8000, 9000)];
  expect(run(f, time(9000))).toMatchObject({ notBefore: time(14000) });
  const a = f.history[2]; if (a.status !== "failed") throw new Error("fixture"); a.failure.retryAfter = { status: "valid", notBefore: time(20000) };
  expect(run(f, time(9000))).toMatchObject({ notBefore: time(20000) });
  a.failure.retryAfter = { status: "valid", notBefore: time(100000) };
  expect(run(f, time(9000))).toMatchObject({ reason: "READ_DEADLINE_EXHAUSTED" });
});
it("timeoutまで期限内に収まることを要求", () => {
  const f = fixture(); expect(run(f, time(99000))).toMatchObject({ status: "suggested", notBefore: time(99000) });
  expect(run(f, time(99001))).toMatchObject({ reason: "READ_DEADLINE_EXHAUSTED" });
});

it.each([
  ["authenticationRequired", "AUTHENTICATION_REQUIRED"], ["permissionDenied", "PERMISSION_DENIED"],
  ["challengeDetected", "CHALLENGE_REQUIRES_HUMAN"], ["certificateFailure", "CERTIFICATE_FAILURE"], ["redirected", "REDIRECT_NOT_AUTHORIZED"],
] as const)("%sはrate制限ラベルとRetry-Afterより優先して停止", (flag, reason) => {
  const f = fixture(), a = failed(f); a.failure.category = "rate_limit"; a.failure.httpStatus = 403; a.failure[flag] = true;
  a.failure.retryAfter = { status: "valid", notBefore: time(5000) }; f.history = [a];
  expect(run(f)).toMatchObject({ status: "terminal", executable: false, reason });
});
it.each(["authentication", "authorization", "captcha", "certificate"] as const)("category %sだけでも停止", category => {
  const f = fixture(), a = failed(f); a.failure.category = category; f.history = [a]; expect(run(f)).toMatchObject({ status: "terminal" });
});
it("401は誤ったrate分類より優先、redirect先へ許可を継承しない", () => {
  const f = fixture(), a = failed(f); a.failure.category = "rate_limit"; a.failure.httpStatus = 401; f.history = [a];
  expect(run(f)).toMatchObject({ reason: "AUTHENTICATION_REQUIRED" }); a.failure.httpStatus = 302;
  expect(run(f)).toMatchObject({ reason: "REDIRECT_NOT_AUTHORIZED" });
});
it("403は確認済みrate根拠がある場合だけ提案", () => {
  const f = fixture(), a = failed(f); a.failure.httpStatus = 403; f.history = [a]; expect(run(f)).toMatchObject({ reason: "UNCLASSIFIED_FORBIDDEN" });
  a.failure.category = "rate_limit"; expect(run(f)).toMatchObject({ status: "suggested" });
  a.failure.classificationConfirmed = false; expect(run(f)).toMatchObject({ reason: "FAILURE_CLASSIFICATION_UNCONFIRMED" });
  a.failure.classificationConfirmed = true; a.failure.classificationRef = null; expect(run(f)).toMatchObject({ reason: "FAILURE_CLASSIFICATION_UNCONFIRMED" });
});
it.each([502, 503, 504])( "%sは確認済み一時server障害だけ提案", status => {
  const f = fixture(), a = failed(f); a.failure.httpStatus = status; a.failure.category = "server_unavailable"; f.history = [a];
  expect(run(f)).toMatchObject({ status: "suggested" });
});
it.each([400, 404, 500, 501])( "%sを無条件に一時障害として再試行しない", status => {
  const f = fixture(), a = failed(f); a.failure.httpStatus = status; a.failure.category = "server_unavailable"; f.history = [a];
  expect(run(f)).toMatchObject({ status: "terminal", reason: "NON_RETRYABLE_FAILURE" });
});
it("不正Retry-Afterを0秒に変換しない", () => {
  const f = fixture(), a = failed(f); a.failure.retryAfter = { status: "invalid" }; f.history = [a]; expect(run(f)).toMatchObject({ reason: "INVALID_RETRY_AFTER" });
});

it.each(["sdk-enabled", "sdk-unknown", "http-enabled", "http-unknown"])("%sなら掛け算retryを認めない", key => {
  const f = fixture(); if (key.startsWith("sdk")) f.policy.sdkRetry = key.endsWith("enabled") ? "enabled" : "unknown";
  else f.policy.httpRetry = key.endsWith("enabled") ? "enabled" : "unknown";
  rebind(f); expect(run(f)).toMatchObject({ reason: "NESTED_RETRY_NOT_DISABLED" });
});
it.each(["disabled", "unknown"] as const)("証明書検証%sで再試行を提案しない", tlsValidation => {
  const f = fixture(); f.policy.tlsValidation = tlsValidation; rebind(f); expect(run(f)).toMatchObject({ reason: "TLS_VALIDATION_REQUIRED" });
});
it.each(["write", "unknown"] as const)("GETでも%sはread-onlyではない", semantics => {
  const f = fixture(); f.policy.target.semantics = semantics; rebind(f); expect(run(f)).toMatchObject({ reason: "READ_OPERATION_UNCONFIRMED" });
});
it("REINSはこの再試行契約の対象外", () => {
  const f = fixture(); f.policy.target.source = "reins"; rebind(f); expect(run(f)).toMatchObject({ reason: "REINS_AUTOMATION_UNSUPPORTED" });
});
it.each(["revoked", "late-approval", "short-validity", "unconfirmed-redirect"])("許可・期限%sを守る", key => {
  const f = fixture();
  if (key === "revoked") f.policy.authorization.status = "revoked";
  if (key === "late-approval") f.policy.authorization.approvedAt = time(1);
  if (key === "short-validity") f.policy.effectiveUntil = time(99999);
  if (key === "unconfirmed-redirect") f.policy.redirects = "unknown";
  rebind(f); expect(run(f)).toMatchObject({ reason: key === "unconfirmed-redirect" ? "REDIRECT_POLICY_UNCONFIRMED" : "READ_AUTHORIZATION_UNCONFIRMED" });
});

it("run/設定/履歴hashが変わった提案を再利用しない", () => {
  const f = fixture(); f.policy.target.accountRef = "other"; expect(run(f)).toMatchObject({ reason: "READ_RETRY_REFERENCE_MISMATCH" });
  rebind(f); expect(proposeReadAttempt(f.policy, f.run, f.expected, [], "c".repeat(64), time(0))).toMatchObject({ reason: "READ_RETRY_REFERENCE_MISMATCH" });
});
it("未完了試行は期限が過ぎても推測で再開始しない", () => {
  const f = fixture(); f.history = [{ id: "attempt-1", requestId: "request-1", run: f.expected, requestFingerprint: f.run.requestFingerprint, number: 1, startedAt: time(0), status: "started" }];
  expect(run(f, time(150000))).toMatchObject({ reason: "READ_ATTEMPT_IN_FLIGHT" });
  f.history.push(failed(f, 2, 3000, 4000)); expect(run(f, time(4000))).toMatchObject({ reason: "OVERLAPPING_READ_ATTEMPTS" });
});
it("停止理由の後に勝手な試行履歴を追加しない", () => {
  const f = fixture(), a = failed(f); a.failure.permissionDenied = true; f.history = [a, failed(f, 2, 3000, 4000)];
  expect(run(f, time(4000))).toMatchObject({ reason: "READ_ATTEMPT_AFTER_TERMINAL" });
});
it("成功後は終了し再試行しない", () => {
  const f = fixture(); f.history = [{ id: "attempt-1", requestId: "request-1", run: f.expected, requestFingerprint: f.run.requestFingerprint,
    number: 1, startedAt: time(0), status: "succeeded", finishedAt: time(1000), resultHash: "c".repeat(64) }];
  expect(run(f)).toMatchObject({ status: "terminal", reason: "READ_SUCCEEDED" });
});
it.each(["sequence", "duplicate-id", "duplicate-request", "binding", "early-start", "future-start", "future-end", "end-before-start"])("履歴%sを拒否", key => {
  const f = fixture(), a = failed(f), b = failed(f, 2, 3000, 4000); f.history = [a, b];
  if (key === "sequence") b.number = 3;
  if (key === "duplicate-id") b.id = a.id;
  if (key === "duplicate-request") b.requestId = a.requestId;
  if (key === "binding") b.requestFingerprint = "c".repeat(64);
  if (key === "early-start") b.startedAt = time(2999);
  if (key === "future-start") b.startedAt = time(5000);
  if (key === "future-end") b.finishedAt = time(5000);
  if (key === "end-before-start") b.finishedAt = time(2999);
  expect(run(f, time(4000))).toMatchObject({ status: "held" });
});
it("URLquery/応答本文を入力契約や出力へ混入させない", () => {
  const f = fixture(); f.policy.target.path = "/read?token=PRIVATE_TOKEN"; expect(run(f)).toMatchObject({ reason: "INVALID_READ_RETRY_INPUT" });
  f.policy.target.path = "/read"; rebind(f);
  const a = { ...failed(f), responseBody: "PRIVATE_BODY" };
  expect(proposeReadAttempt(f.policy, f.run, f.expected, [a], contentHash([a]), time(1000))).toEqual({ status: "held", executable: false, reason: "INVALID_READ_RETRY_INPUT" });
});
it.each(["//other/path", "/api//read", "/../read", "/%2fother"])("host変更/曖昧な正規化を生むpath %sを拒否", path => {
  const f = fixture(); f.policy.target.path = path; rebind(f); expect(run(f)).toMatchObject({ reason: "INVALID_READ_RETRY_INPUT" });
});
