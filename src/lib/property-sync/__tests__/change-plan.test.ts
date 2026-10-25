import { expect, it } from "vitest";
import { createChangePlan, preflightChangePlan, type PlanContext } from "../change-plan";
import { applyMediaCommand } from "../media-state";
import { contentHash, type SyncRule } from "../rules";
import { mediaState, now, observe } from "./fixtures";

const later = "2026-10-24T12:05:00.000Z";
const expiry = "2026-10-24T13:00:00.000Z";
function fixture() {
  const state = mediaState();
  const rule: SyncRule = {
    id: "synthetic-family", version: 1,
    scope: { market: "residential_rental", audience: "global", clientRef: null },
    effectiveFrom: "2026-10-01T00:00:00.000Z", effectiveUntil: null,
    status: "approved", approvedAt: "2026-10-01T00:00:00.000Z", approvalRef: "synthetic-approval",
    // Synthetic values, never a default business policy.
    criteria: { market: "residential_rental", rentMinYen: 100, rentMaxYen: 200,
      minLayoutRooms: 2, preferredAreaSqm: null, leaseTypes: ["ordinary"], schoolScopeRef: "synthetic-schools",
      companyIncomeMinYen: 100, incomeTaxBasis: "included", maxEvidenceAgeHours: 1 },
  };
  const context: PlanContext = {
    requestedScope: structuredClone(rule.scope), ruleHistory: [rule], mediaState: state,
    snapshot: { propertyId: state.propertyId, episodeId: state.episodeId, market: "residential_rental",
      snapshotRef: "synthetic-read", capturedAt: now, version: structuredClone(state.listing.propertyVersion) },
  };
  const request = { planId: "00000000-0000-4000-8000-000000000002", jobVersion: 1, expiresAt: expiry,
    intent: { desiredState: "published" as const, managementId: "mgmt", publicId: "pub" } };
  return { context, request, rule };
}
function prepared() {
  const f = fixture(), result = createChangePlan(f.request, f.context, now);
  if (result.status !== "planned") throw new Error(result.reason);
  return { ...f, ...result };
}

it("計画は版・scope・変更前hashを固定し、入力と参照を共有しない", () => {
  const f = fixture(), before = structuredClone(f);
  const result = createChangePlan(f.request, f.context, now);
  expect(result).toMatchObject({ status: "planned", executable: false, plan: {
    jobVersion: 1, rule: { id: f.rule.id, version: 1 },
    source: { version: f.context.snapshot.version }, listingBefore: { revision: 1 },
  } });
  expect(f).toEqual(before);
  if (result.status !== "planned") return;
  expect(result.reference.hash).toBe(contentHash(result.plan));
  f.context.requestedScope.audience = "client";
  f.request.intent.publicId = "changed";
  expect(result.plan.scope.audience).toBe("global");
  expect(result.plan.intent.publicId).toBe("pub");
  expect(JSON.stringify(result)).not.toContain("companyIncomeMinYen");
  expect(JSON.stringify(result)).not.toContain("rentMaxYen");
});

it("同一計画の版照合が通っても未実装の適格性・許諾・実行条件で必ず保留", () => {
  const f = prepared();
  expect(preflightChangePlan(f.plan, f.context, f.reference, later)).toMatchObject({
    status: "held", executable: false, identityChecksPassed: true,
    reason: "ELIGIBILITY_AND_EXECUTION_GATES_UNIMPLEMENTED",
    pendingGates: expect.arrayContaining(["PROPERTY_ELIGIBILITY", "ADVERTISING_PERMISSION", "WRITER_FENCE"]),
  });
});

it("取下げ計画も確認済み募集終了や広告失効の根拠なしに実行可能にしない", () => {
  const f = fixture();
  const result = createChangePlan({ ...f.request, intent: { ...f.request.intent, desiredState: "not_published" } }, f.context, now);
  expect(result.status).toBe("planned");
  if (result.status !== "planned") return;
  expect(preflightChangePlan(result.plan, f.context, result.reference, now)).toMatchObject({ status: "held", executable: false, identityChecksPassed: true });
});

it.each(["intent", "source", "version", "id"])("計画の%s変更と自己再hashで保管側の期待hashを上書きできない", field => {
  const f = prepared(), altered = structuredClone(f.plan);
  if (field === "intent") altered.intent.publicId = "other";
  if (field === "source") altered.source.version.fullHash = "f".repeat(64);
  if (field === "version") altered.jobVersion++;
  if (field === "id") altered.planId = "00000000-0000-4000-8000-000000000003";
  expect(contentHash(altered)).not.toBe(f.reference.hash);
  expect(preflightChangePlan(altered, f.context, f.reference, later)).toMatchObject({ reason: "PLAN_REFERENCE_MISMATCH", identityChecksPassed: false });
});

it("新しいjobの参照が保存された後は古いjobを拒否する", () => {
  const f = prepared();
  const newer = createChangePlan({ ...f.request, jobVersion: 2 }, f.context, now);
  if (newer.status !== "planned") throw new Error(newer.reason);
  expect(preflightChangePlan(f.plan, f.context, newer.reference, later)).toMatchObject({ reason: "PLAN_REFERENCE_MISMATCH" });
});

it.each(["same-time-hash", "new-time", "new-time-hash"])("独立した物件snapshotの手動変更%sを検出", change => {
  const f = prepared();
  if (change !== "same-time-hash") f.context.snapshot.version.updatedAt = "2026-10-24T11:00:00.000Z";
  if (change !== "new-time") f.context.snapshot.version.fullHash = "f".repeat(64);
  // The media state's source pointer remains stale intentionally.
  expect(preflightChangePlan(f.plan, f.context, f.reference, later)).toMatchObject({
    identityChecksPassed: false, reason: change === "same-time-hash" ? "SAME_TIMESTAMP_HASH_CONFLICT" : "PROPERTY_SOURCE_CONFLICT",
  });
});

it.each(["revision", "ids", "desiredState"])("掲載側の手動変更%sを検出", change => {
  const f = prepared();
  if (change === "revision") f.context.mediaState.listing.revision++;
  if (change === "ids") f.context.mediaState.listing.publicId = "new-public-id";
  if (change === "desiredState") f.context.mediaState.listing.desiredState = "not_published";
  expect(preflightChangePlan(f.plan, f.context, f.reference, later)).toMatchObject({ reason: "LISTING_SOURCE_CONFLICT" });
});

it("観測の追記だけでは掲載変更計画の版照合を壊さない", () => {
  const f = prepared(), observed = applyMediaCommand(f.context.mediaState, observe(), now);
  if (observed.status !== "applied") throw new Error("Unexpected observation result");
  f.context.mediaState = observed.state;
  expect(preflightChangePlan(f.plan, f.context, f.reference, later)).toMatchObject({ identityChecksPassed: true, executable: false });
});

it.each(["mock", "unknown", "stale"])("%sの観測を公開適格の証明に変えない", kind => {
  const f = prepared(), command = observe();
  if (kind === "mock") command.evidence.acquisition = "mock";
  if (kind === "unknown") { command.evidence.visibility = "unknown"; command.evidence.exactUnitConfirmed = false; command.evidence.companyFirst = "unknown"; }
  if (kind === "stale") command.evidence.observedAt = "2026-10-24T00:00:00.000Z";
  const observed = applyMediaCommand(f.context.mediaState, command, now);
  if (observed.status !== "applied") throw new Error("Unexpected observation result");
  f.context.mediaState = observed.state;
  expect(preflightChangePlan(f.plan, f.context, f.reference, later)).toMatchObject({ status: "held", executable: false });
});

it.each(["new-version", "same-version-hash", "revoked", "pending", "missing-condition", "expired"])("検査時のルール%sを再確認して保留", change => {
  const f = prepared();
  if (change === "new-version") f.rule.version++;
  if (change === "same-version-hash" && f.rule.criteria.market === "residential_rental") f.rule.criteria.rentMaxYen = 201;
  if (change === "revoked" || change === "pending") f.rule.status = change;
  if (change === "missing-condition" && f.rule.criteria.market === "residential_rental") f.rule.criteria.schoolScopeRef = null;
  if (change === "expired") f.rule.effectiveUntil = later;
  const result = preflightChangePlan(f.plan, f.context, f.reference, later);
  expect(result).toMatchObject({ status: "held", identityChecksPassed: false });
  if (change.startsWith("new-") || change === "same-version-hash") expect(result.reason).toBe("RULE_VERSION_CONFLICT");
});

it("未来のルール開始境界で旧計画を保留する", () => {
  const f = prepared();
  f.context.ruleHistory = [f.rule, { ...structuredClone(f.rule), version: 2, effectiveFrom: later }];
  expect(preflightChangePlan(f.plan, f.context, f.reference, now)).toMatchObject({ identityChecksPassed: true });
  expect(preflightChangePlan(f.plan, f.context, f.reference, later)).toMatchObject({ reason: "RULE_VERSION_CONFLICT" });
});

it.each(["client", "other-client", "market", "episode", "property", "media"])("別%sの計画として使い回せない", change => {
  const f = prepared();
  if (change === "client" || change === "other-client") f.context.requestedScope = { market: "residential_rental", audience: "client", clientRef: change };
  if (change === "market") { f.context.requestedScope.market = "sale"; f.context.snapshot.market = "sale"; }
  if (change === "episode") { f.context.snapshot.episodeId = "episode-2"; f.context.mediaState.episodeId = "episode-2"; }
  if (change === "property") { f.context.snapshot.propertyId = "00000000-0000-4000-8000-000000000003"; f.context.mediaState.propertyId = f.context.snapshot.propertyId; }
  if (change === "media") f.context.mediaState.media = "site";
  expect(preflightChangePlan(f.plan, f.context, f.reference, later)).toMatchObject({ status: "held", identityChecksPassed: false });
});

it("別顧客の承認履歴を欠けた全体条件に流用しない", () => {
  const f = fixture(); f.rule.scope = { market: "residential_rental", audience: "client", clientRef: "client-opaque" };
  expect(createChangePlan(f.request, f.context, now)).toMatchObject({ reason: "NO_EFFECTIVE_RULE" });
});

it("計画開始・失効の境界を扱う", () => {
  const f = prepared();
  expect(preflightChangePlan(f.plan, f.context, f.reference, "2026-10-24T11:59:59.999Z")).toMatchObject({ reason: "PLAN_NOT_STARTED" });
  expect(preflightChangePlan(f.plan, f.context, f.reference, now)).toMatchObject({ identityChecksPassed: true });
  expect(preflightChangePlan(f.plan, f.context, f.reference, expiry)).toMatchObject({ reason: "PLAN_EXPIRED" });
  expect(createChangePlan({ ...f.request, expiresAt: now }, f.context, now)).toMatchObject({ reason: "INVALID_PLAN_EXPIRY" });
});

it("ルール有効期間を超える計画は作らない", () => {
  const f = fixture(); f.rule.effectiveUntil = later;
  expect(createChangePlan(f.request, f.context, now)).toMatchObject({ reason: "PLAN_OUTLIVES_RULE" });
  expect(createChangePlan({ ...f.request, expiresAt: later }, f.context, now)).toMatchObject({ status: "planned" });
});

it.each(["future-read", "update-after-read", "old-read", "missing-listing-time", "future-listing-time"])("不正・未確認の時刻%sは照合できない", change => {
  const f = prepared();
  if (change === "future-read") f.context.snapshot.capturedAt = expiry;
  if (change === "update-after-read") f.context.snapshot.version.updatedAt = later;
  if (change === "old-read") f.context.snapshot.capturedAt = "2026-10-24T11:00:00.000Z";
  if (change === "missing-listing-time") delete f.context.mediaState.listing.changedAt;
  if (change === "future-listing-time") f.context.mediaState.listing.changedAt = expiry;
  expect(preflightChangePlan(f.plan, f.context, f.reference, later)).toMatchObject({ identityChecksPassed: false });
});

it("物件版が媒体に記録された版より古ければ作成を保留する", () => {
  const f = fixture(); f.context.snapshot.version.updatedAt = "2026-10-23T00:00:00.000Z";
  expect(createChangePlan(f.request, f.context, now)).toMatchObject({ reason: "PROPERTY_VERSION_REGRESSION" });
});

it("未知のネスト・不正な期待参照に含まれる生データを結果へ出さない", () => {
  const f = prepared();
  const results = [
    createChangePlan({ ...f.request, intent: { ...f.request.intent, internal: "PRIVATE_CANARY" } }, f.context, now),
    createChangePlan(f.request, { ...f.context, snapshot: { ...f.context.snapshot, address: "PRIVATE_CANARY" } }, now),
    preflightChangePlan({ ...f.plan, intent: { ...f.plan.intent, ad: "PRIVATE_CANARY" } }, f.context, f.reference, later),
    preflightChangePlan(f.plan, f.context, { ...f.reference, credential: "PRIVATE_CANARY" }, later),
  ];
  for (const result of results) {
    expect(result).toMatchObject({ status: "held", executable: false, identityChecksPassed: false });
    expect(JSON.stringify(result)).not.toContain("PRIVATE_CANARY");
  }
});

it("無効日時・欠落条件・不正入力は例外や暗黙の既定値にしない", () => {
  const f = prepared();
  for (const raw of [null, {}, [], { ...f.request, jobVersion: 0 }]) expect(createChangePlan(raw, f.context, now)).toMatchObject({ status: "held" });
  expect(createChangePlan(f.request, f.context, "invalid")).toMatchObject({ reason: "INVALID_PLAN_INPUT" });
  expect(preflightChangePlan(f.plan, null, f.reference, later)).toMatchObject({ reason: "INVALID_PREFLIGHT_INPUT" });
  f.context.ruleHistory = [];
  expect(createChangePlan(f.request, f.context, now)).toMatchObject({ reason: "NO_EFFECTIVE_RULE" });
});
