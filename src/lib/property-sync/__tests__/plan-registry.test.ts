import { randomUUID } from "node:crypto";
import { expect, it } from "vitest";
import { activePlanReference, appendPlanRegistry, createPlanRegistry, verifyPlanRegistry, type PlanRegistry, type PlanRegistryRequest } from "../plan-registry";
import { type ChangePlan } from "../change-plan";
import { contentHash } from "../rules";
import { mediaState, now } from "./fixtures";

const expiry = "2026-10-24T13:00:00.000Z";
function plan(jobVersion = 1): ChangePlan {
  const state = mediaState();
  return { schemaVersion: 1, executable: false, planId: randomUUID(), jobVersion, createdAt: now, expiresAt: expiry,
    binding: { propertyId: state.propertyId, episodeId: state.episodeId, media: state.media },
    scope: { market: "residential_rental", audience: "global", clientRef: null },
    rule: { id: "synthetic", version: 1, hash: "a".repeat(64) },
    source: { snapshotRef: "synthetic", capturedAt: now, version: state.listing.propertyVersion },
    listingBefore: { revision: state.listing.revision, hash: contentHash(state.listing) },
    intent: { desiredState: "published", managementId: null, publicId: null } };
}
const ref = (p: ChangePlan) => ({ planId: p.planId, jobVersion: p.jobVersion, hash: contentHash(p) });
function fresh() { return createPlanRegistry(plan().binding, now); }
function register(journal: PlanRegistry, p = plan(journal.state.latestJobVersion + 1)): PlanRegistryRequest {
  return { requestId: randomUUID(), actorRef: "operator-test", at: now,
    expected: { revision: journal.state.revision, headHash: journal.headHash },
    command: { type: "register", plan: p, expectedActive: journal.state.activePlan ? ref(journal.state.activePlan) : null } };
}
function revoke(journal: PlanRegistry): PlanRegistryRequest {
  if (!journal.state.activePlan) throw new Error("NO_TEST_PLAN");
  return { ...register(journal), command: { type: "revoke", reference: ref(journal.state.activePlan), reason: "operator_request" } };
}
function apply(journal: PlanRegistry, request: PlanRegistryRequest) {
  const result = appendPlanRegistry(journal, request, request.at);
  if (result.status !== "recorded") throw new Error(result.reason);
  expect(verifyPlanRegistry(result.journal)).toEqual(result.journal);
  return result;
}

it("初回登録と撤回を記録し、呼出し元の入力と参照を共有しない", () => {
  const journal = fresh(), request = register(journal), before = structuredClone({ journal, request });
  const result = apply(journal, request);
  expect(result).toMatchObject({ executable: false, replayed: false, outcome: { status: "registered" }, journal: { state: { revision: 1, latestJobVersion: 1 } } });
  expect({ journal, request }).toEqual(before);
  expect(activePlanReference(result.journal, journal.genesis.binding, now)).toMatchObject({ status: "current", executable: false, reference: ref(request.command.type === "register" ? request.command.plan : plan()) });
  request.actorRef = "changed";
  expect(result.journal.events[0].request.actorRef).toBe("operator-test");
  const revoked = apply(result.journal, revoke(result.journal));
  expect(revoked.journal.state).toMatchObject({ revision: 2, latestJobVersion: 1, activePlan: null });
  expect(activePlanReference(revoked.journal, journal.genesis.binding, now)).toMatchObject({ reason: "NO_ACTIVE_PLAN" });
});

it("同じCASから二重登録せず、保留も監査revisionを進める", () => {
  const journal = fresh(), a = register(journal), b = register(journal);
  const first = apply(journal, a), second = apply(first.journal, b);
  expect(second.outcome).toEqual({ status: "held", reason: "REGISTRY_CONFLICT" });
  expect(second.journal.state).toMatchObject({ revision: 2, latestJobVersion: 1, activePlan: first.journal.state.activePlan });
  expect(second.journal.headHash).not.toBe(first.journal.headHash);
});

it("旧登録を再送しても新しい参照を維持し、元時刻で期限を復活させない", () => {
  const journal = fresh(), oldRequest = register(journal);
  const first = apply(journal, oldRequest), second = apply(first.journal, register(first.journal));
  const replay = apply(second.journal, oldRequest);
  expect(replay.replayed).toBe(true);
  expect(replay.journal).toEqual(second.journal);
  expect(activePlanReference(replay.journal, journal.genesis.binding, now)).toMatchObject({ reference: ref(second.journal.state.activePlan!) });
  expect(activePlanReference(replay.journal, journal.genesis.binding, expiry)).toMatchObject({ reason: "PLAN_EXPIRED" });
});

it.each(["command", "actor", "time", "cas"])("同じrequestIdの%s変更は競合", change => {
  const journal = fresh(), request = register(journal), result = apply(journal, request), altered = structuredClone(request);
  if (change === "command" && altered.command.type === "register") altered.command.plan.intent.desiredState = "not_published";
  if (change === "actor") altered.actorRef = "other";
  if (change === "time") altered.at = "2026-10-24T12:01:00.000Z";
  if (change === "cas") altered.expected.revision++;
  expect(appendPlanRegistry(result.journal, altered, altered.at)).toMatchObject({ reason: "REQUEST_ID_CONFLICT" });
});

it("古い撤回/置換referenceは新しい計画を消さない", () => {
  const first = apply(fresh(), register(fresh())), oldRevoke = revoke(first.journal);
  const second = apply(first.journal, register(first.journal));
  oldRevoke.expected = { revision: second.journal.state.revision, headHash: second.journal.headHash };
  const stale = apply(second.journal, oldRevoke);
  expect(stale.outcome).toMatchObject({ reason: "PLAN_REFERENCE_MISMATCH" });
  const replacement = register(stale.journal);
  if (replacement.command.type === "register") replacement.command.expectedActive = ref(first.journal.state.activePlan!);
  expect(apply(stale.journal, replacement).outcome).toMatchObject({ reason: "PLAN_REFERENCE_MISMATCH" });
});

it.each(["reset", "skip", "reuse-id"])("撤回後の%sを拒否して旧計画へ戻らない", change => {
  const initial = fresh(), first = apply(initial, register(initial)), oldPlan = first.journal.state.activePlan!;
  const revoked = apply(first.journal, revoke(first.journal)), candidate = plan(change === "reset" ? 1 : change === "skip" ? 3 : 2);
  if (change === "reuse-id") candidate.planId = oldPlan.planId;
  const rejected = apply(revoked.journal, register(revoked.journal, candidate));
  expect(rejected.outcome).toMatchObject({ reason: change === "reuse-id" ? "PLAN_ID_REUSED" : "JOB_VERSION_CONFLICT" });
  expect(activePlanReference(rejected.journal, initial.genesis.binding, now)).toMatchObject({ reason: "NO_ACTIVE_PLAN" });
  const next = apply(rejected.journal, register(rejected.journal, plan(2)));
  expect(next.journal.state.latestJobVersion).toBe(2);
});

it("顧客scopeも同じ媒体targetの系列で置換し、別のjob1を作らない", () => {
  const initial = fresh(), first = apply(initial, register(initial)), next = plan(2);
  next.scope = { market: "residential_rental", audience: "client", clientRef: "client-fixture" };
  const second = apply(first.journal, register(first.journal, next));
  expect(second.journal.state.activePlan?.scope.audience).toBe("client");
  expect(activePlanReference(second.journal, initial.genesis.binding, now)).toMatchObject({ reference: ref(next) });
});

it.each(["property", "episode", "media", "future", "expired"])("不整合な計画%sを保留", kind => {
  const initial = fresh(), p = plan();
  if (kind === "property") p.binding.propertyId = randomUUID();
  if (kind === "episode") p.binding.episodeId = "other";
  if (kind === "media") p.binding.media = "site";
  if (kind === "future") p.createdAt = "2026-10-24T12:01:00.000Z";
  if (kind === "expired") p.expiresAt = "2026-10-24T12:00:00.001Z";
  const request = register(initial, p);
  if (kind === "expired") request.at = p.expiresAt;
  const result = apply(initial, request);
  expect(result.outcome.status).toBe("held");
  expect(result.journal.state.latestJobVersion).toBe(0);
});

it("期限切れ計画を置換できるが旧版へfallbackしない", () => {
  const initial = fresh(), first = apply(initial, register(initial)), next = plan(2);
  expect(activePlanReference(first.journal, initial.genesis.binding, expiry)).toMatchObject({ reason: "PLAN_EXPIRED" });
  next.createdAt = expiry; next.expiresAt = "2026-10-24T14:00:00.000Z";
  const request = register(first.journal, next); request.at = expiry;
  const replaced = apply(first.journal, request);
  expect(activePlanReference(replaced.journal, initial.genesis.binding, expiry)).toMatchObject({ reference: ref(next) });
});

it.each(["state", "head", "event", "outcome-rehashed", "sequence-rehashed", "genesis", "truncate"])("監査の%s改変を検出", kind => {
  const initial = fresh(), first = apply(initial, register(initial)), second = apply(first.journal, register(first.journal));
  const altered = structuredClone(second.journal);
  if (kind === "state") altered.state.latestJobVersion++;
  if (kind === "head") altered.headHash = "f".repeat(64);
  if (kind === "event") altered.events[0].request.actorRef = "other";
  if (kind === "genesis") altered.genesis.binding.episodeId = "other";
  if (kind === "truncate") altered.events.pop();
  if (kind.endsWith("rehashed")) {
    const event = altered.events.at(-1)!;
    if (kind === "outcome-rehashed") event.outcome = { status: "held", reason: "INVENTED" };
    else event.sequence++;
    const { eventHash: ignored, ...body } = event; void ignored;
    event.eventHash = contentHash(body); altered.headHash = event.eventHash;
  }
  expect(verifyPlanRegistry(altered)).toBeUndefined();
  expect(appendPlanRegistry(altered, register(second.journal), now)).toMatchObject({ reason: "REGISTRY_INTEGRITY_ERROR" });
});

it("不正な生データや未知ネストをログ/エラーに残さない", () => {
  const initial = fresh(), request = register(initial);
  const invalid = { ...request, command: { ...request.command, raw: { ad: "PRIVATE_CANARY" } } };
  const result = appendPlanRegistry(initial, invalid, now);
  expect(result).toMatchObject({ reason: "INVALID_REGISTRY_REQUEST" });
  expect(JSON.stringify(result)).not.toContain("PRIVATE_CANARY");
  expect(initial.events).toHaveLength(0);
});

it("無登録、時刻逆行、未来の履歴、別binding、容量超過を保留", () => {
  const initial = fresh();
  expect(activePlanReference(initial, initial.genesis.binding, now)).toMatchObject({ reason: "NO_ACTIVE_PLAN" });
  const request = register(initial); request.at = "2026-10-24T11:59:00.000Z";
  expect(appendPlanRegistry(initial, request, now)).toMatchObject({ reason: "REGISTRY_TIME_ORDER" });
  const first = apply(initial, register(initial));
  expect(activePlanReference(first.journal, initial.genesis.binding, request.at)).toMatchObject({ reason: "REGISTRY_FROM_FUTURE" });
  expect(activePlanReference(first.journal, { ...initial.genesis.binding, media: "site" }, now)).toMatchObject({ reason: "BINDING_MISMATCH" });
  expect(verifyPlanRegistry({ ...first.journal, events: Array(1001).fill(first.journal.events[0]) })).toBeUndefined();
});

it("未来の要求を履歴へ入れず、後続の正常要求を妨げない", () => {
  const initial = fresh(), future = register(initial);
  future.at = "2099-01-01T00:00:00.000Z";
  expect(appendPlanRegistry(initial, future, now)).toMatchObject({ reason: "REQUEST_FROM_FUTURE" });
  expect(initial.events).toHaveLength(0);
  expect(apply(initial, register(initial)).outcome.status).toBe("registered");
});

it("元時刻が有効でも受信時刻に失効した計画は登録しない", () => {
  const initial = fresh(), request = register(initial);
  const result = appendPlanRegistry(initial, request, expiry);
  expect(result).toMatchObject({ status: "recorded", outcome: { status: "held", reason: "PLAN_OUTSIDE_VALID_TIME" } });
  if (result.status !== "recorded") return;
  expect(result.journal.events[0].recordedAt).toBe(expiry);
  expect(verifyPlanRegistry(result.journal)).toEqual(result.journal);
  expect(appendPlanRegistry(result.journal, register(result.journal), now)).toMatchObject({ reason: "REGISTRY_FROM_FUTURE" });
});

it("再hashした受信時刻の逆行/要求より過去の時刻もreplayで拒否", () => {
  const initial = fresh(), first = apply(initial, register(initial));
  const altered = structuredClone(first.journal), event = altered.events[0];
  event.recordedAt = "2026-10-24T11:59:00.000Z";
  const { eventHash: ignored, ...body } = event; void ignored;
  event.eventHash = contentHash(body); altered.headHash = event.eventHash;
  expect(verifyPlanRegistry(altered)).toBeUndefined();
});
