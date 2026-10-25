import { randomUUID } from "node:crypto";
import { expect, it } from "vitest";
import { appendCapacityRequest, createCapacityJournal, currentCapacity, verifyCapacityJournal, type CapacityJournal, type CapacityRequest } from "../capacity-reservations";
import type { ChangePlan } from "../change-plan";
import { contentHash } from "../rules";
import { mediaState, now } from "./fixtures";

const scope = { media: "athome" as const, accountRef: "synthetic-account", market: "residential_rental" as const, categoryRef: "synthetic-rent", capacityPoolId: "synthetic-independent-pool" };
const expiry = "2026-10-24T12:15:00.000Z", later = "2026-10-24T12:20:00.000Z";
function request(journal: CapacityJournal, command: CapacityRequest["command"], at = now): CapacityRequest {
  return { requestId: randomUUID(), actorRef: "operator-test", at, expected: { sequence: journal.events.length, headHash: journal.headHash }, command };
}
function refresh(journal: CapacityJournal, at = now): Extract<CapacityRequest["command"], { type: "refresh" }> {
  return { type: "refresh", config: journal.state.config ?? { version: 1, scope, confirmation: "confirmed", contractRef: "synthetic-contract", confirmedAt: now,
    isolation: "independent", limit: 2, newListingUnits: 1, validFrom: "2026-10-24T00:00:00.000Z", validUntil: "2026-10-24T14:00:00.000Z" },
    snapshot: { version: (journal.state.snapshot?.version ?? 0) + 1, snapshotId: randomUUID(), scope, observedAt: at, validUntil: "2026-10-24T13:00:00.000Z",
      used: 1, coverage: "complete", acquisition: "manual_confirmed", evidenceRef: "synthetic-read", includedReservations: [] }, terminalAbsences: [] };
}
function plan(): ChangePlan {
  const state = mediaState();
  return { schemaVersion: 1, executable: false, planId: randomUUID(), jobVersion: 1, createdAt: now, expiresAt: "2026-10-24T13:00:00.000Z",
    binding: { propertyId: randomUUID(), episodeId: "episode-test", media: "athome" }, scope: { market: "residential_rental", audience: "global", clientRef: null },
    rule: { id: "synthetic", version: 1, hash: "a".repeat(64) }, source: { snapshotRef: "synthetic", capturedAt: now, version: state.listing.propertyVersion },
    listingBefore: { revision: 1, hash: contentHash(state.listing) }, intent: { desiredState: "published", managementId: null, publicId: null } };
}
const reserve = (): Extract<CapacityRequest["command"], { type: "reserve" }> => ({ type: "reserve", reservationId: randomUUID(), plan: plan(), operation: "new_listing", expiresAt: expiry });
function apply(journal: CapacityJournal, command: CapacityRequest["command"], at = now) {
  const result = appendCapacityRequest(journal, request(journal, command, at), at);
  if (result.status !== "recorded") throw new Error(result.reason);
  expect(verifyCapacityJournal(result.journal)).toEqual(result.journal);
  return result;
}
function ready() { const journal = createCapacityJournal(scope, now); return apply(journal, refresh(journal)).journal; }
function begun(at = now) {
  const initial = ready(), reserved = apply(initial, reserve()).journal, r = reserved.state.reservations[0];
  return apply(reserved, { type: "begin_attempt", reservationId: r.reservationId, planReference: r.planReference, attemptId: randomUUID() }, at).journal;
}
function included(journal: CapacityJournal, at = now) {
  const r = journal.state.reservations[0];
  return { reservationId: r.reservationId, attemptId: r.attemptId!, planReference: r.planReference, listingRef: "listing-test", units: r.units, evidenceRef: "synthetic-inclusion", observedAt: at };
}
function terminal(journal: CapacityJournal, at = now) {
  const r = journal.state.reservations[0];
  return { reservationId: r.reservationId, attemptId: r.attemptId!, planReference: r.planReference, outcome: "cancelled_final" as const,
    terminalAt: at, observedAt: at, evidenceRef: "synthetic-terminal", absentConfirmed: true as const, finalityConfirmed: true as const };
}

it("設定なしは保留し、確認済み使用数と予約を加算する", () => {
  const empty = createCapacityJournal(scope, now);
  expect(currentCapacity(empty, scope, now)).toMatchObject({ reason: "CAPACITY_CONFIG_UNCONFIRMED" });
  const journal = ready(), before = structuredClone(journal), result = apply(journal, reserve());
  expect(result.outcome.status).toBe("applied");
  expect(currentCapacity(result.journal, scope, now)).toMatchObject({ executable: false, limit: 2, used: 1, reserved: 1, remaining: 0 });
  expect(journal).toEqual(before);
  expect(apply(result.journal, reserve()).outcome).toMatchObject({ reason: "CAPACITY_FULL" });
});

it.each(["residential_rental", "sale", "business"] as const)("%sの設定枠を独立して保持し、別区分へ足さない", market => {
  const target = { ...scope, market, categoryRef: "configured-" + market, capacityPoolId: "independent-" + market };
  const journal = createCapacityJournal(target, now), command = refresh(journal);
  command.config = { ...command.config, scope: target, limit: 7, newListingUnits: 2 };
  command.snapshot = { ...command.snapshot, scope: target, used: 4 };
  const configured = apply(journal, command).journal, proposal = reserve(); proposal.plan.scope.market = market;
  const reserved = apply(configured, proposal).journal;
  expect(currentCapacity(reserved, target, now)).toMatchObject({ limit: 7, used: 4, reserved: 2, remaining: 1 });
});

it("確認済み0枠をunknown扱いせず満枠として保留", () => {
  const journal = ready(), command = refresh(journal); command.config = { ...command.config, version: 2, limit: 0 }; command.snapshot.used = 0;
  const zero = apply(journal, command).journal;
  expect(currentCapacity(zero, scope, now)).toMatchObject({ status: "available", limit: 0, used: 0, remaining: 0 });
  expect(apply(zero, reserve()).outcome).toMatchObject({ reason: "CAPACITY_FULL" });
});

it.each(["unconfirmed", "unknown-limit", "unknown-cost", "shared", "unknown-pool", "unknown-used", "partial", "mock", "stale"])("設定/観測の%sで旧値へ戻らず予約を停止", kind => {
  const journal = ready(), command = refresh(journal); command.config = { ...command.config, version: 2 };
  if (kind === "unconfirmed") command.config.confirmation = "unconfirmed";
  if (kind === "unknown-limit") command.config.limit = null;
  if (kind === "unknown-cost") command.config.newListingUnits = null;
  if (kind === "shared") command.config.isolation = "shared";
  if (kind === "unknown-pool") command.config.isolation = "unknown";
  if (kind === "unknown-used") command.snapshot.used = null;
  if (kind === "partial") command.snapshot.coverage = "partial";
  if (kind === "mock") command.snapshot.acquisition = "mock";
  if (kind === "stale") {
    expect(currentCapacity(journal, scope, journal.state.snapshot!.validUntil)).toMatchObject({ reason: "CAPACITY_SNAPSHOT_OUTSIDE_VALID_TIME" }); return;
  }
  const refreshed = apply(journal, command);
  expect(refreshed.outcome.status).toBe("applied");
  expect(apply(refreshed.journal, reserve()).outcome.status).toBe("held");
  expect(refreshed.journal.state.config?.version).toBe(2);
});

it.each(["market", "category", "pool", "account", "media"])("枠の%sが違うsnapshotを合算/流用しない", kind => {
  const journal = ready(), command = refresh(journal), different = structuredClone(scope) as { media: "athome" | "site"; accountRef: string; market: "residential_rental" | "sale"; categoryRef: string; capacityPoolId: string };
  if (kind === "market") different.market = "sale";
  if (kind === "category") different.categoryRef = "business-category";
  if (kind === "pool") different.capacityPoolId = "other-pool";
  if (kind === "account") different.accountRef = "other-account";
  if (kind === "media") different.media = "site";
  command.snapshot.scope = different;
  expect(apply(journal, command).outcome).toMatchObject({ reason: "CAPACITY_SCOPE_MISMATCH" });
  expect(currentCapacity(journal, different, now)).toMatchObject({ reason: "CAPACITY_SCOPE_MISMATCH" });
});

it("同一CASの同時予約・異なる要求による同じ予約/planの二重取得を拒否", () => {
  const journal = ready(), command = reserve(), a = request(journal, command), b = request(journal, reserve());
  const first = appendCapacityRequest(journal, a, now); if (first.status !== "recorded") throw new Error("fixture");
  expect(appendCapacityRequest(first.journal, b, now)).toMatchObject({ outcome: { reason: "CAPACITY_CONFLICT" } });
  expect(apply(first.journal, command).outcome).toMatchObject({ reason: "RESERVATION_IDENTITY_REUSED" });
  expect(apply(first.journal, { ...command, reservationId: randomUUID() }).outcome).toMatchObject({ reason: "RESERVATION_IDENTITY_REUSED" });
  const otherPlan = { ...command.plan, planId: randomUUID(), jobVersion: 2 };
  expect(apply(first.journal, { ...command, reservationId: randomUUID(), plan: otherPlan }).outcome).toMatchObject({ reason: "PROPERTY_ALREADY_RESERVED" });
});

it("予約応答を失っても同じ要求で二重計上せず、期限後は歴史的結果を有効予約としない", () => {
  const journal = ready(), r = request(journal, reserve()), saved = appendCapacityRequest(journal, r, now);
  if (saved.status !== "recorded") throw new Error("fixture");
  const replay = appendCapacityRequest(saved.journal, r, later);
  expect(replay).toMatchObject({ status: "recorded", replayed: true });
  if (replay.status !== "recorded") return;
  expect(replay.journal.events).toHaveLength(2);
  expect(currentCapacity(replay.journal, scope, later)).toMatchObject({ reserved: 0, remaining: 1 });
  expect(appendCapacityRequest(saved.journal, { ...r, actorRef: "changed" }, later)).toMatchObject({ reason: "REQUEST_ID_CONFLICT" });
});

it("未着手の取消しは枠を戻すが同じ予約ID/planを再利用しない", () => {
  const command = reserve(), reserved = apply(ready(), command).journal, r = reserved.state.reservations[0];
  const cancelled = apply(reserved, { type: "cancel", reservationId: r.reservationId, planReference: r.planReference }).journal;
  expect(currentCapacity(cancelled, scope, now)).toMatchObject({ reserved: 0, remaining: 1 });
  expect(apply(cancelled, command).outcome).toMatchObject({ reason: "RESERVATION_IDENTITY_REUSED" });
});

it("着手後は期限切れ・取消しで枠を解放せず照合を要求", () => {
  const journal = begun(), r = journal.state.reservations[0];
  expect(currentCapacity(journal, scope, later)).toMatchObject({ reserved: 1, remaining: 0 });
  expect(apply(journal, { type: "cancel", reservationId: r.reservationId, planReference: r.planReference }, later).outcome).toMatchObject({ reason: "ATTEMPT_REQUIRES_RECONCILIATION" });
});

it("当該snapshotのusedに含む予約だけ加算から外し、次snapshotの未対応は保守的に加算", () => {
  const journal = begun(), command = refresh(journal); command.snapshot.used = 2; command.snapshot.includedReservations = [included(journal)];
  const accounted = apply(journal, command).journal;
  expect(currentCapacity(accounted, scope, now)).toMatchObject({ used: 2, reserved: 0, remaining: 0, overCapacity: false });
  const next = refresh(accounted); next.snapshot.used = 2;
  const missingMapping = apply(accounted, next).journal;
  expect(currentCapacity(missingMapping, scope, now)).toMatchObject({ used: 2, reserved: 1, overCapacity: true });
});

it.each(["attempt", "plan", "units", "observation", "duplicate", "used-too-low"])("反映済み対応の%s不整合では加算を外さない", kind => {
  const journal = begun(), command = refresh(journal), item = included(journal);
  command.snapshot.used = 2;
  if (kind === "attempt") item.attemptId = randomUUID();
  if (kind === "plan") item.planReference = { ...item.planReference, hash: "e".repeat(64) };
  if (kind === "units") item.units++;
  if (kind === "observation") item.observedAt = "2026-10-24T11:59:59.999Z";
  command.snapshot.includedReservations = kind === "duplicate" ? [item, item] : [item];
  if (kind === "used-too-low") command.snapshot.used = 0;
  expect(apply(journal, command).outcome.status).toBe("held");
  expect(currentCapacity(journal, scope, now)).toMatchObject({ reserved: 1 });
});

it("終端取消完了と同snapshotの不在証跡でのみ着手済み予約を解放", () => {
  const journal = begun(), command = refresh(journal, later); command.terminalAbsences = [terminal(journal, later)];
  const released = apply(journal, command, later).journal;
  expect(released.state.reservations[0].phase).toBe("released");
  expect(currentCapacity(released, scope, later)).toMatchObject({ used: 1, reserved: 0, remaining: 1 });
  const r = request(journal, command, later), saved = appendCapacityRequest(journal, r, later);
  if (saved.status !== "recorded") throw new Error("fixture");
  expect(appendCapacityRequest(saved.journal, r, later)).toMatchObject({ replayed: true });
});

it.each(["absence-only", "not-final", "before-attempt", "simultaneous-present"])("不十分な終端証跡%sでは解放しない", kind => {
  const at = "2026-10-24T12:05:00.000Z", journal = begun(at), command = refresh(journal, later), proof = terminal(journal, later);
  if (kind === "before-attempt") proof.terminalAt = now;
  if (kind === "simultaneous-present") { command.snapshot.used = 2; command.snapshot.includedReservations = [included(journal, later)]; }
  const altered = { ...command, terminalAbsences: [{ ...proof, ...(kind === "absence-only" ? { outcome: "not_found" } : {}), ...(kind === "not-final" ? { finalityConfirmed: false } : {}) }] };
  const result = appendCapacityRequest(journal, { ...request(journal, command, later), command: altered }, later);
  expect(result.status === "held" || result.outcome.status === "held").toBe(true);
  expect(currentCapacity(journal, scope, later)).toMatchObject({ reserved: 1 });
});

it("既知の反映成功を後から終端失敗へ書き換えて解放しない", () => {
  const journal = begun(), command = refresh(journal); command.snapshot.used = 2; command.snapshot.includedReservations = [included(journal)];
  const accounted = apply(journal, command).journal, next = refresh(accounted, later);
  next.terminalAbsences = [{ ...terminal(accounted, later), outcome: "failed_final" }];
  expect(apply(accounted, next, later).outcome).toMatchObject({ reason: "TERMINAL_OUTCOME_CONFLICT" });
});

it.each(["earlier", "same-time"])("成功観測より%sの取消証跡は枠を解放しない", kind => {
  const journal = begun(), seenAt = "2026-10-24T12:10:00.000Z", command = refresh(journal, seenAt);
  command.snapshot.used = 2; command.snapshot.includedReservations = [included(journal, seenAt)];
  const accounted = apply(journal, command, seenAt).journal, next = refresh(accounted, later);
  next.terminalAbsences = [{ ...terminal(accounted, later), terminalAt: kind === "earlier" ? "2026-10-24T12:05:00.000Z" : seenAt }];
  expect(apply(accounted, next, later).outcome).toMatchObject({ reason: "TERMINAL_PRECEDES_CONFIRMED_PRESENCE" });
  next.terminalAbsences[0].terminalAt = "2026-10-24T12:15:00.000Z";
  expect(apply(accounted, next, later).journal.state.reservations[0].phase).toBe("released");
});

it("過去snapshotの掲載IDを後から別掲載へ結び直して加算を外さない", () => {
  const journal = begun(), command = refresh(journal); command.snapshot.used = 2; command.snapshot.includedReservations = [included(journal)];
  const first = apply(journal, command).journal;
  // A snapshot without a mapping must not erase the historical identity anchor.
  const gap = apply(first, refresh(first)).journal, next = refresh(gap, later);
  next.snapshot.used = 2; next.snapshot.includedReservations = [{ ...included(gap, later), listingRef: "other-listing" }];
  expect(apply(gap, next, later).outcome).toMatchObject({ reason: "LISTING_REFERENCE_CHANGED" });
  next.snapshot.includedReservations[0].listingRef = "listing-test";
  expect(apply(gap, next, later).outcome.status).toBe("applied");
});

it("契約の枠減少/消費単位変更は既存予約を削除せず着手を止める", () => {
  const reserved = apply(ready(), reserve()).journal, command = refresh(reserved); command.config = { ...command.config, version: 2, limit: 1, newListingUnits: 2 };
  const changed = apply(reserved, command).journal, r = changed.state.reservations[0];
  expect(currentCapacity(changed, scope, now)).toMatchObject({ overCapacity: true, reserved: 1 });
  expect(apply(changed, { type: "begin_attempt", reservationId: r.reservationId, planReference: r.planReference, attemptId: randomUUID() }).outcome).toMatchObject({ reason: "RESERVATION_CONFIG_CHANGED" });
  expect(changed.state.reservations).toHaveLength(1);
});

it.each(["update", "replace"])("消費枠が未実装の%sを新規掲載として計算しない", operation => {
  expect(apply(ready(), { ...reserve(), operation: operation as "update" | "replace" }).outcome).toMatchObject({ reason: "CAPACITY_OPERATION_UNSUPPORTED" });
});

it("期限・未来要求・古いsnapshot・未知キーを保留し、生値を返さない", () => {
  const journal = ready(), command = reserve(); command.expiresAt = "2026-10-24T13:30:00.000Z";
  expect(apply(journal, command).outcome.status).toBe("held");
  const future = request(journal, reserve(), "2099-01-01T00:00:00.000Z");
  expect(appendCapacityRequest(journal, future, now)).toMatchObject({ reason: "CAPACITY_TIME_FROM_FUTURE" });
  const old = refresh(journal); old.snapshot.observedAt = "2026-10-24T11:59:00.000Z";
  expect(apply(journal, old).outcome).toMatchObject({ reason: "SNAPSHOT_TIME_ORDER" });
  const invalid = appendCapacityRequest(journal, { ...request(journal, reserve()), raw: "PRIVATE_CANARY" }, now);
  expect(invalid).toMatchObject({ reason: "INVALID_CAPACITY_REQUEST" }); expect(JSON.stringify(invalid)).not.toContain("PRIVATE_CANARY");
});

it.each(["state", "event", "rehashed-outcome", "truncated"])("監査の%s改変を再生検査で検出", kind => {
  const journal = apply(ready(), reserve()).journal, altered = structuredClone(journal);
  if (kind === "state") altered.state.reservations[0].phase = "cancelled";
  if (kind === "event") altered.events[0].request.actorRef = "other";
  if (kind === "truncated") altered.events.pop();
  if (kind === "rehashed-outcome") {
    const e = altered.events.at(-1)!; e.outcome = { status: "held", reason: "INVENTED" };
    const { eventHash: ignored, ...body } = e; void ignored; e.eventHash = contentHash(body); altered.headHash = e.eventHash;
  }
  expect(verifyCapacityJournal(altered)).toBeUndefined();
});
