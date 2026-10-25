import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createChangePlan, type PlanContext } from "../change-plan";
import { createPlanRegistry, appendPlanRegistry } from "../plan-registry";
import { fingerprintPropertySnapshot } from "../source-fingerprint";
import { preflightStoredPlan } from "../stored-plan-preflight";
import { applyMediaCommand } from "../media-state";
import type { SyncRule } from "../rules";
import { mediaState, now, observe } from "./fixtures";

const later = "2026-10-24T12:01:00.000Z", expiry = "2026-10-24T13:00:00.000Z";
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date(now)); });
afterEach(() => { vi.useRealTimers(); });
function fixture() {
  const state = mediaState();
  const record = { id: state.propertyId, slug: "synthetic", status: "published", dealType: "rental", category: "other", tradeMode: "broker",
    title: "synthetic", priceYen: 123, priceNote: null, locationText: "synthetic", access: [], spec: { area: 55 }, images: [],
    description: "synthetic", publishedAt: null, infoUpdatedAt: "2026-10-24", nextUpdateAt: "2026-10-25", locales: ["ja"],
    translations: null, internal: { adNote: "PRIVATE_CANARY" }, createdAt: state.listing.propertyVersion.updatedAt, updatedAt: state.listing.propertyVersion.updatedAt };
  const metadata = { propertyId: state.propertyId, episodeId: state.episodeId, market: "residential_rental" as const,
    snapshotRef: "synthetic-read", capturedAt: now };
  const fingerprint = fingerprintPropertySnapshot(JSON.stringify(record), JSON.stringify(metadata), now);
  if (fingerprint.status !== "fingerprinted") throw new Error(fingerprint.reason);
  state.listing.propertyVersion = fingerprint.snapshot.version;
  const rule: SyncRule = { id: "synthetic", version: 1, scope: { market: "residential_rental", audience: "global", clientRef: null },
    effectiveFrom: "2026-10-01T00:00:00.000Z", effectiveUntil: null, status: "approved", approvedAt: now, approvalRef: "synthetic",
    criteria: { market: "residential_rental", rentMinYen: 100, rentMaxYen: 200, minLayoutRooms: 2, preferredAreaSqm: null,
      leaseTypes: ["ordinary"], schoolScopeRef: "synthetic", companyIncomeMinYen: 100, incomeTaxBasis: "included", maxEvidenceAgeHours: 1 } };
  const context: PlanContext = { requestedScope: rule.scope, snapshot: fingerprint.snapshot, mediaState: state, ruleHistory: [rule] };
  const planned = createChangePlan({ planId: randomUUID(), jobVersion: 1, expiresAt: expiry,
    intent: { desiredState: "published", managementId: null, publicId: null } }, context, now);
  if (planned.status !== "planned") throw new Error(planned.reason);
  const empty = createPlanRegistry(planned.plan.binding, now);
  const registered = appendPlanRegistry(empty, { requestId: randomUUID(), actorRef: "operator-test", at: now,
    expected: { revision: 0, headHash: empty.headHash }, command: { type: "register", plan: planned.plan, expectedActive: null } }, now);
  if (registered.status !== "recorded") throw new Error(registered.reason);
  const data = { recordJson: JSON.stringify(record), metadataJson: JSON.stringify({ ...metadata, capturedAt: later }), mediaState: state, ruleHistory: [rule] };
  const readers = { readRegistry: vi.fn(async () => structuredClone(registered.journal)), readInputs: vi.fn(async () => structuredClone(data)) };
  vi.setSystemTime(new Date(later));
  return { state, record, metadata, rule, context, planned, empty, registered, data, readers, binding: planned.plan.binding, scope: rule.scope };
}

it("full source hash→計画→台帳→新読取りを接続しても8gate未実装で保留", async () => {
  const f = fixture(), result = await preflightStoredPlan(f.binding, f.scope, f.readers);
  expect(result).toMatchObject({ status: "held", executable: false, identityChecksPassed: true,
    reason: "ELIGIBILITY_AND_EXECUTION_GATES_UNIMPLEMENTED", registryToken: { revision: 1 }, pendingGates: expect.arrayContaining(["WRITER_FENCE", "ADVERTISING_PERMISSION"]) });
  expect(f.readers.readRegistry).toHaveBeenCalledTimes(2);
  expect(f.readers.readInputs).toHaveBeenCalledTimes(1);
  expect(JSON.stringify(result)).not.toMatch(/PRIVATE_CANARY|adNote|companyIncomeMinYen|rentMinYen|recordJson/);
});

it.each(["private", "public", "new-time"])("物件の%s変更は媒体stateが同じでも検出", async kind => {
  const f = fixture();
  if (kind === "private") f.record.internal.adNote = "changed";
  if (kind === "public") f.record.priceYen++;
  if (kind === "new-time") f.record.updatedAt = "2026-10-24T12:00:30.000Z";
  f.data.recordJson = JSON.stringify(f.record);
  expect(await preflightStoredPlan(f.binding, f.scope, f.readers)).toMatchObject({ identityChecksPassed: false,
    reason: kind === "new-time" ? "PROPERTY_SOURCE_CONFLICT" : "SAME_TIMESTAMP_HASH_CONFLICT" });
});

it("観測追記だけでは掲載計画を失効させない", async () => {
  const f = fixture(), observation = applyMediaCommand(f.state, observe(), later);
  if (observation.status === "held") throw new Error(observation.reason);
  f.data.mediaState = observation.state;
  expect(await preflightStoredPlan(f.binding, f.scope, f.readers)).toMatchObject({ identityChecksPassed: true, executable: false });
});

it.each(["replaced", "revoked", "held-event"])("入力読取り中のregistry %s変更で停止", async kind => {
  const f = fixture(), command = kind === "revoked" ? { type: "revoke", reference: f.planned.reference, reason: "operator_request" }
    : { type: "register", expectedActive: f.planned.reference,
      plan: { ...f.planned.plan, planId: randomUUID(), jobVersion: kind === "held-event" ? 3 : 2 } };
  const next = appendPlanRegistry(f.registered.journal, { requestId: randomUUID(), actorRef: "operator-test", at: later,
    expected: { revision: 1, headHash: f.registered.journal.headHash }, command }, later);
  if (next.status !== "recorded") throw new Error(next.reason);
  f.readers.readRegistry.mockResolvedValueOnce(f.registered.journal).mockResolvedValueOnce(next.journal);
  expect(await preflightStoredPlan(f.binding, f.scope, f.readers)).toMatchObject({ reason: "REGISTRY_CHANGED_DURING_CHECK", identityChecksPassed: false });
});

it.each(["first-registry", "source", "last-registry"])("%s reader例外の生値を返さない", async kind => {
  const f = fixture(), error = new Error("PRIVATE_CANARY source credentials");
  if (kind === "first-registry") f.readers.readRegistry.mockRejectedValueOnce(error);
  if (kind === "source") f.readers.readInputs.mockRejectedValueOnce(error);
  if (kind === "last-registry") f.readers.readRegistry.mockResolvedValueOnce(f.registered.journal).mockRejectedValueOnce(error);
  const result = await preflightStoredPlan(f.binding, f.scope, f.readers);
  expect(result).toMatchObject({ reason: kind === "source" ? "SOURCE_READ_FAILED" : "REGISTRY_READ_FAILED" });
  expect(JSON.stringify(result)).not.toMatch(/PRIVATE_CANARY|credentials/);
});

it.each(["invalid", "scope", "binding", "empty", "expired"])("%sではsourceを取得しない", async kind => {
  const f = fixture(); let binding: unknown = f.binding, scope: unknown = f.scope;
  if (kind === "invalid") binding = { ...f.binding, raw: "PRIVATE_CANARY" };
  if (kind === "scope") scope = { ...f.scope, audience: "client", clientRef: "client-test" };
  if (kind === "binding") binding = { ...f.binding, episodeId: "other" };
  if (kind === "empty") f.readers.readRegistry.mockResolvedValue(f.empty);
  if (kind === "expired") vi.setSystemTime(new Date(expiry));
  expect((await preflightStoredPlan(binding, scope, f.readers)).identityChecksPassed).toBe(false);
  expect(f.readers.readInputs).not.toHaveBeenCalled();
});

it.each(["old-snapshot", "pending-rule", "listing-change", "missing-field", "wrong-episode"])("sourceの%sを保留", async kind => {
  const f = fixture();
  if (kind === "old-snapshot") f.data.metadataJson = JSON.stringify(f.metadata);
  if (kind === "pending-rule") f.data.ruleHistory = [{ ...f.rule, version: 2, status: "pending" }];
  if (kind === "listing-change") f.data.mediaState.listing.revision++;
  if (kind === "missing-field") { const { internal: ignored, ...partial } = f.record; void ignored; f.data.recordJson = JSON.stringify(partial); }
  if (kind === "wrong-episode") f.data.metadataJson = JSON.stringify({ ...f.metadata, capturedAt: later, episodeId: "other" });
  expect((await preflightStoredPlan(f.binding, f.scope, f.readers)).identityChecksPassed).toBe(false);
});

it.each(["clock-backwards", "expires-during-read"])("%sを最終時刻で検出", async kind => {
  const f = fixture();
  f.readers.readInputs.mockImplementationOnce(async () => { vi.setSystemTime(new Date(kind === "clock-backwards" ? now : expiry)); return structuredClone(f.data); });
  expect(await preflightStoredPlan(f.binding, f.scope, f.readers)).toMatchObject({ reason: kind === "clock-backwards" ? "CLOCK_REGRESSION" : "PLAN_EXPIRED" });
});

it("readerへ渡したbinding/scopeの変更が次の照合へ混入しない", async () => {
  const f = fixture();
  const readers = { readRegistry: async (binding: { episodeId: string }) => { binding.episodeId = "changed"; return f.registered.journal; },
    readInputs: async (_binding: unknown, scope: { audience: string }) => { scope.audience = "changed"; return f.data; } };
  expect(await preflightStoredPlan(f.binding, f.scope, readers)).toMatchObject({ identityChecksPassed: true });
  expect(f.binding.episodeId).toBe("episode-1"); expect(f.scope.audience).toBe("global");
});
