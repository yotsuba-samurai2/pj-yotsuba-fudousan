import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { diagnoseStoredPlan } from "../plan-diagnostics";
import { appendPlanRegistry } from "../plan-registry";
import { appendCapacityRequest, type CapacityRequest } from "../capacity-reservations";
import { diagnosticFixture, checkedAt, expiresAt } from "./plan-diagnostic-fixtures";

beforeEach(() => { vi.useFakeTimers({ toFake: ["Date"] }); });
afterEach(() => { vi.useRealTimers(); });

it("計画/source/許諾/素材/容量をまとめても実行gateを緩めず空き枠を予約扱いしない", async () => {
  const f = diagnosticFixture(), result = await diagnoseStoredPlan(f.request, f.readers);
  expect(result).toMatchObject({ status: "diagnosed", executable: false, diagnosticComplete: true, reason: "EXECUTION_GATES_PENDING",
    checks: { identity: { matched: true }, permissions: { evidenceMatched: true }, capacity: { state: "unreserved", reason: "CAPACITY_REQUIRES_RESERVATION" } },
    pendingGates: expect.arrayContaining(["PROPERTY_ELIGIBILITY", "MEDIA_CAPACITY", "EXECUTION_APPROVAL", "WRITER_FENCE", "CAPACITY_POOL_CONTRACT_MAPPING", "MATERIAL_INVENTORY_COMPLETENESS"]) });
  expect(f.readers.readRegistry).toHaveBeenCalledTimes(4); expect(f.readers.readInputs).toHaveBeenCalledTimes(2);
  expect(f.readers.readPermissions).toHaveBeenCalledTimes(2); expect(f.readers.readCapacity).toHaveBeenCalledTimes(2);
  expect(JSON.stringify(result)).not.toMatch(/PRIVATE_|manifest|history|recordJson|sourceHash|contractRef|accountRef|adNote|rentMinYen/);
});
it("自分の正しい予約で残枠0になっていても二重に必要枠を加算しない", async () => {
  const f = diagnosticFixture(true);
  expect(await diagnoseStoredPlan(f.request, f.readers)).toMatchObject({ status: "diagnosed", checks: { capacity: { state: "reserved", reason: "LOCAL_RESERVATION_MATCHED" } }, executable: false });
});

it.each(["market", "media", "unknown-scope", "bad-request"])("%s不整合ならreaderを呼ばない", async key => {
  const f = diagnosticFixture();
  const raw = key === "unknown-scope" ? { ...f.request, capacityScope: null } : key === "bad-request" ? { ...f.request, raw: "PRIVATE" } : structuredClone(f.request);
  if (raw.capacityScope && key === "market") raw.capacityScope.market = "sale";
  if (raw.capacityScope && key === "media") raw.capacityScope.media = "site";
  expect(await diagnoseStoredPlan(raw, f.readers)).toMatchObject({ status: "held", diagnosticComplete: false });
  expect(f.readers.readRegistry).not.toHaveBeenCalled(); expect(f.readers.readPermissions).not.toHaveBeenCalled(); expect(f.readers.readCapacity).not.toHaveBeenCalled();
});
it("最初のidentity不一致では許諾/容量を取得しない", async () => {
  const f = diagnosticFixture(); f.record.priceYen++; f.data.recordJson = JSON.stringify(f.record);
  expect(await diagnoseStoredPlan(f.request, f.readers)).toMatchObject({ reason: "SAME_TIMESTAMP_HASH_CONFLICT" });
  expect(f.readers.readPermissions).not.toHaveBeenCalled(); expect(f.readers.readCapacity).not.toHaveBeenCalled();
});
it("媒体/顧客scope外の許諾を混ぜた入力を拒否", async () => {
  const f = diagnosticFixture(); f.permissions.history[0].scope = { ...f.request.scope, audience: "client", clientRef: "PRIVATE_CLIENT" };
  expect(await diagnoseStoredPlan(f.request, f.readers)).toMatchObject({ reason: "DIAGNOSTIC_PERMISSION_SCOPE_MISMATCH" });
});
it("許諾不足は根拠照合falseとして残す", async () => {
  const f = diagnosticFixture(); f.permissions.history = [];
  expect(await diagnoseStoredPlan(f.request, f.readers)).toMatchObject({ status: "diagnosed", checks: { permissions: { evidenceMatched: false, reason: "PERMISSION_MISSING", referenceHash: null } } });
});
it("最終読取りで判明した許諾撤回を古い入力の期限評価だけで見逃さない", async () => {
  const f = diagnosticFixture(), newer = structuredClone(f.permissions); newer.history[0].status = "revoked";
  f.readers.readPermissions.mockResolvedValueOnce(f.permissions).mockResolvedValueOnce(newer);
  expect(await diagnoseStoredPlan(f.request, f.readers)).toMatchObject({ reason: "PERMISSIONS_CHANGED_DURING_DIAGNOSTIC" });
});
function nextCapacity(f: ReturnType<typeof diagnosticFixture>, command: CapacityRequest["command"]) {
  const result = appendCapacityRequest(f.capacity, { requestId: randomUUID(), actorRef: "synthetic", at: checkedAt,
    expected: { sequence: f.capacity.events.length, headHash: f.capacity.headHash }, command }, checkedAt);
  if (result.status !== "recorded") throw new Error("fixture"); return result.journal;
}
it("取消や他予約によるcapacity head変更を検出", async () => {
  const f = diagnosticFixture(true), newer = nextCapacity(f, { type: "cancel", reservationId: f.request.reservationId!, planReference: f.planned.reference });
  f.readers.readCapacity.mockResolvedValueOnce(f.capacity).mockResolvedValueOnce(newer);
  expect(await diagnoseStoredPlan(f.request, f.readers)).toMatchObject({ reason: "CAPACITY_CHANGED_DURING_DIAGNOSTIC" });
});
it("同じmedia/marketでも別account/poolの容量台帳を受け入れない", async () => {
  const f = diagnosticFixture(); f.request.capacityScope = { ...f.request.capacityScope, accountRef: "other" };
  expect(await diagnoseStoredPlan(f.request, f.readers)).toMatchObject({ reason: "DIAGNOSTIC_CAPACITY_SCOPE_MISMATCH" });
});
it("最終preflightだけ新しい計画で成功しても初期計画へ混ぜない", async () => {
  const f = diagnosticFixture(), newPlan = { ...f.planned.plan, planId: randomUUID(), jobVersion: 2 };
  const next = appendPlanRegistry(f.registration.journal, { requestId: randomUUID(), actorRef: "synthetic", at: checkedAt,
    expected: { revision: 1, headHash: f.registration.journal.headHash }, command: { type: "register", expectedActive: f.planned.reference, plan: newPlan } }, checkedAt);
  if (next.status !== "recorded") throw new Error("fixture");
  f.readers.readRegistry.mockResolvedValueOnce(f.registration.journal).mockResolvedValueOnce(f.registration.journal).mockResolvedValue(next.journal);
  expect(await diagnoseStoredPlan(f.request, f.readers)).toMatchObject({ reason: "PLAN_CHANGED_DURING_DIAGNOSTIC" });
});
it("計画同一でも途中の監査head変更は診断を保留", async () => {
  const f = diagnosticFixture();
  const next = appendPlanRegistry(f.registration.journal, { requestId: randomUUID(), actorRef: "synthetic", at: checkedAt,
    expected: { revision: 0, headHash: f.empty.headHash }, command: { type: "revoke", reference: f.planned.reference, reason: "operator_request" } }, checkedAt);
  if (next.status !== "recorded") throw new Error("fixture");
  f.readers.readRegistry.mockResolvedValueOnce(f.registration.journal).mockResolvedValueOnce(f.registration.journal).mockResolvedValue(next.journal);
  expect(await diagnoseStoredPlan(f.request, f.readers)).toMatchObject({ reason: "REGISTRY_CHANGED_DURING_DIAGNOSTIC" });
});
it("許諾/容量読取り中にsourceが変われば最後の独立snapshotで検出", async () => {
  const f = diagnosticFixture(); f.readers.readCapacity.mockImplementation(async () => { f.record.internal.adNote = "PRIVATE_CHANGED"; f.data.recordJson = JSON.stringify(f.record); return f.capacity; });
  expect(await diagnoseStoredPlan(f.request, f.readers)).toMatchObject({ reason: "SAME_TIMESTAMP_HASH_CONFLICT" });
});

it.each(["mismatched", "cancelled", "attempted", "expired", "config-changed"])("予約%sを再利用しない", async key => {
  const f = diagnosticFixture(true);
  if (key === "mismatched") f.request.reservationId = randomUUID();
  if (key === "cancelled" || key === "attempted") {
    const newer = nextCapacity(f, key === "cancelled" ? { type: "cancel", reservationId: f.request.reservationId!, planReference: f.planned.reference }
      : { type: "begin_attempt", reservationId: f.request.reservationId!, planReference: f.planned.reference, attemptId: randomUUID() });
    f.readers.readCapacity.mockResolvedValue(newer);
  }
  if (key === "expired") {
    // Reserve an alternate plan-valid interval ending just before this diagnostic, with both capacity reads identical.
    const g = diagnosticFixture(false);
    const reserve = appendCapacityRequest(g.capacity, { requestId: randomUUID(), actorRef: "synthetic", at: g.planned.plan.createdAt,
      expected: { sequence: g.capacity.events.length, headHash: g.capacity.headHash }, command: { type: "reserve", reservationId: f.request.reservationId!, plan: f.planned.plan,
        operation: "new_listing", expiresAt: checkedAt } }, g.planned.plan.createdAt);
    if (reserve.status !== "recorded") throw new Error("fixture");
    f.readers.readCapacity.mockResolvedValue(reserve.journal);
  }
  if (key === "config-changed") {
    if (f.refresh.type !== "refresh") throw new Error("fixture");
    const newer = nextCapacity(f, { ...f.refresh, config: { ...f.refresh.config, version: 2, limit: 2 }, snapshot: { ...f.refresh.snapshot, version: 2, snapshotId: randomUUID(), observedAt: checkedAt } });
    f.readers.readCapacity.mockResolvedValue(newer);
  }
  expect(await diagnoseStoredPlan(f.request, f.readers)).toMatchObject({ status: "diagnosed", checks: { capacity: { state: "held", reason: {
    mismatched: "CAPACITY_RESERVATION_MISMATCH", cancelled: "CAPACITY_RESERVATION_NOT_PENDING", attempted: "CAPACITY_RESERVATION_NOT_PENDING",
    expired: "CAPACITY_RESERVATION_EXPIRED", "config-changed": "CAPACITY_RESERVATION_CONFIG_CHANGED" }[key] } } });
});
it.each(["update", "replace", "unknown"] as const)("%sをnew_listing容量として評価しない", async operation => {
  const f = diagnosticFixture(); expect(await diagnoseStoredPlan({ ...f.request, operation }, f.readers)).toMatchObject({ checks: { capacity: { reason: "CAPACITY_OPERATION_UNSUPPORTED" } } });
});
it("最終source照合中に失効した容量snapshotを検査開始時刻で通さない", async () => {
  const f = diagnosticFixture(), expiredAt = "2026-10-24T12:01:01.000Z";
  if (f.refresh.type !== "refresh") throw new Error("fixture");
  const newer = nextCapacity(f, { ...f.refresh, snapshot: { ...f.refresh.snapshot, version: 2, snapshotId: randomUUID(), observedAt: checkedAt, validUntil: expiredAt } });
  f.readers.readCapacity.mockResolvedValue(newer);
  f.readers.readInputs.mockResolvedValueOnce(f.data).mockImplementation(async () => {
    vi.setSystemTime(new Date(expiredAt)); return { ...f.data, metadataJson: JSON.stringify({ ...JSON.parse(f.data.metadataJson), capturedAt: expiredAt }) };
  });
  expect(await diagnoseStoredPlan(f.request, f.readers)).toMatchObject({ status: "diagnosed", checks: { capacity: { state: "held", reason: "CAPACITY_SNAPSHOT_OUTSIDE_VALID_TIME" } } });
});
it.each(["permissions", "capacity"])("%s reader例外の生値を返さない", async target => {
  const f = diagnosticFixture(), error = new Error("PRIVATE credentials response");
  if (target === "permissions") f.readers.readPermissions.mockRejectedValue(error); else f.readers.readCapacity.mockRejectedValue(error);
  const result = await diagnoseStoredPlan(f.request, f.readers);
  expect(result).toMatchObject({ reason: target === "permissions" ? "DIAGNOSTIC_PERMISSION_READ_FAILED" : "DIAGNOSTIC_CAPACITY_READ_FAILED" });
  expect(JSON.stringify(result)).not.toMatch(/PRIVATE|credentials|response/);
});
it("後続readerが前の共有objectを改変しても初期根拠を差し替えられない", async () => {
  const f = diagnosticFixture(); f.readers.readPermissions.mockImplementation(async () => f.permissions);
  f.readers.readCapacity.mockImplementation(async () => { f.permissions.history[0].status = "revoked"; return f.capacity; });
  expect(await diagnoseStoredPlan(f.request, f.readers)).toMatchObject({ reason: "PERMISSIONS_CHANGED_DURING_DIAGNOSTIC" });
});
it.each(["regression", "expiry"])("読取り段階の%sを検出", async kind => {
  const f = diagnosticFixture(); f.readers.readPermissions.mockImplementationOnce(async () => { vi.setSystemTime(new Date(kind === "regression" ? "2026-10-24T12:00:59.000Z" : expiresAt)); return f.permissions; });
  expect(await diagnoseStoredPlan(f.request, f.readers)).toMatchObject({ reason: kind === "regression" ? "DIAGNOSTIC_CLOCK_REGRESSION" : "PLAN_EXPIRED" });
});
