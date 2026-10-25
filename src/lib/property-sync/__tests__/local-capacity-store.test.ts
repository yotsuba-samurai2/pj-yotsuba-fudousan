import { randomUUID } from "node:crypto";
import { mkdtemp, readFile, readdir, rm, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { applyCapacityRequestFile, createCapacityFile, readCapacityFile } from "../local-capacity-store";
import { createPlanRegistryFile, readPlanRegistryFile } from "../local-plan-store";
import { currentCapacity, type CapacityJournal, type CapacityRequest } from "../capacity-reservations";
import type { ChangePlan } from "../change-plan";
import { mediaState, now } from "./fixtures";
import { contentHash } from "../rules";

const fault = vi.hoisted(() => ({ afterRename: false, directorySync: false, cleanup: false, partial: false }));
vi.mock("node:fs/promises", async importOriginal => {
  const fs = await importOriginal<typeof import("node:fs/promises")>();
  return { ...fs,
    open: async (...args: Parameters<typeof fs.open>) => {
      const handle = await fs.open(...args), path = String(args[0]);
      return new Proxy(handle, { get(target, key) {
        if (key === "writeFile" && fault.partial && path.endsWith(".tmp")) return async () => { await target.writeFile("{partial"); throw new Error("synthetic partial write"); };
        if (key === "sync" && fault.directorySync && !path.endsWith(".json") && !path.endsWith(".tmp")) return async () => { throw new Error("synthetic directory sync"); };
        const value = Reflect.get(target, key, target); return typeof value === "function" ? value.bind(target) : value;
      } });
    },
    rename: async (...args: Parameters<typeof fs.rename>) => { await fs.rename(...args); if (fault.afterRename) throw new Error("synthetic lost response"); },
    unlink: async (path: Parameters<typeof fs.unlink>[0]) => { if (fault.cleanup && String(path).endsWith(".lock")) throw new Error("synthetic cleanup"); return fs.unlink(path); },
  };
});
const dirs: string[] = [];
beforeEach(() => { vi.useFakeTimers({ toFake: ["Date"] }); vi.setSystemTime(new Date(now)); });
afterEach(async () => { Object.assign(fault, { afterRename: false, directorySync: false, cleanup: false, partial: false }); vi.useRealTimers(); await Promise.all(dirs.splice(0).map(d => rm(d, { recursive: true, force: true }))); });
const scope = { media: "athome" as const, accountRef: "account-test", market: "residential_rental" as const, categoryRef: "category-test", capacityPoolId: "pool-test" };
async function load(file: string) { const result = await readCapacityFile(file); if (result.status !== "read") throw new Error(result.reason); return result.journal; }
const request = (j: CapacityJournal, command: CapacityRequest["command"]): CapacityRequest => ({ requestId: randomUUID(), actorRef: "operator-test", at: new Date().toISOString(), expected: { sequence: j.events.length, headHash: j.headHash }, command });
function refresh(j: CapacityJournal): Extract<CapacityRequest["command"], { type: "refresh" }> {
  return { type: "refresh", config: j.state.config ?? { version: 1, scope, confirmation: "confirmed", contractRef: "contract-test", confirmedAt: now, isolation: "independent", limit: 2, newListingUnits: 1,
    validFrom: now, validUntil: "2026-10-24T14:00:00.000Z" }, snapshot: { version: (j.state.snapshot?.version ?? 0) + 1, snapshotId: randomUUID(), scope, observedAt: new Date().toISOString(), validUntil: "2026-10-24T13:00:00.000Z",
    used: 1, coverage: "complete", acquisition: "manual_confirmed", evidenceRef: "evidence-test", includedReservations: [] }, terminalAbsences: [] };
}
function reserve(): Extract<CapacityRequest["command"], { type: "reserve" }> {
  const s = mediaState();
  const plan: ChangePlan = { schemaVersion: 1, executable: false, planId: randomUUID(), jobVersion: 1, createdAt: now, expiresAt: "2026-10-24T13:00:00.000Z",
    binding: { propertyId: randomUUID(), episodeId: "episode-test", media: "athome" }, scope: { market: "residential_rental", audience: "global", clientRef: null },
    rule: { id: "rule-test", version: 1, hash: "a".repeat(64) }, source: { snapshotRef: "source-test", capturedAt: now, version: s.listing.propertyVersion },
    listingBefore: { revision: 1, hash: contentHash(s.listing) }, intent: { desiredState: "published", managementId: null, publicId: null } };
  return { type: "reserve", reservationId: randomUUID(), plan, operation: "new_listing", expiresAt: "2026-10-24T12:15:00.000Z" };
}
async function apply(file: string, command: CapacityRequest["command"]) {
  const j = await load(file), r = request(j, command), result = await applyCapacityRequestFile(file, r);
  expect(result).toMatchObject({ status: "recorded", outcome: { status: "applied" } });
  return load(file);
}
async function setup() {
  const dir = await mkdtemp(join(tmpdir(), "yotsuba-capacity-store-")); dirs.push(dir); const file = join(dir, "capacity.json");
  expect(await createCapacityFile(file, scope, now)).toMatchObject({ status: "created", executable: false });
  const j = await load(file); await apply(file, refresh(j)); return file;
}

it("private fileへ容量/予約/監査を保存し既存fileを上書きしない", async () => {
  const file = await setup(), j = await apply(file, reserve());
  expect((await stat(file)).mode & 0o777).toBe(0o600);
  expect(currentCapacity(j, scope, now)).toMatchObject({ reserved: 1, remaining: 0, executable: false });
  const before = await readFile(file, "utf8");
  expect(await createCapacityFile(file, scope, now)).toMatchObject({ reason: "STORE_ALREADY_EXISTS" });
  expect(await readFile(file, "utf8")).toBe(before);
});

it("同時writerと古いCASで枠を二重取得せず、業務上の保留も監査保存", async () => {
  const file = await setup(), j = await load(file), a = request(j, reserve()), b = request(j, reserve());
  const results = await Promise.all([applyCapacityRequestFile(file, a), applyCapacityRequestFile(file, b)]);
  expect(results.filter(r => r.status === "recorded" && r.outcome.status === "applied")).toHaveLength(1);
  const current = await load(file), loser = current.events.some(e => e.request.requestId === a.requestId && e.outcome.status === "applied") ? b : a;
  expect(await applyCapacityRequestFile(file, loser)).toMatchObject({ status: "recorded", outcome: { status: "held", reason: "CAPACITY_CONFLICT" } });
  expect((await load(file)).events).toHaveLength(3);
  expect(currentCapacity(await load(file), scope, now)).toMatchObject({ reserved: 1 });
});

it.each(["reserve", "begin", "inclusion", "release"])("%s保存後の応答喪失を同requestで再照合し二重適用しない", async step => {
  const file = await setup(); let j = await load(file), command: CapacityRequest["command"] = reserve();
  if (step !== "reserve") {
    j = await apply(file, command); const r = j.state.reservations[0];
    command = { type: "begin_attempt", reservationId: r.reservationId, planReference: r.planReference, attemptId: randomUUID() };
    if (step !== "begin") {
      j = await apply(file, command); const attempted = j.state.reservations[0]; command = refresh(j);
      if (step === "inclusion") { command.snapshot.used = 2; command.snapshot.includedReservations = [{ reservationId: attempted.reservationId, attemptId: attempted.attemptId!, planReference: attempted.planReference,
        listingRef: "listing-test", units: 1, evidenceRef: "inclusion-test", observedAt: now }]; }
      else command.terminalAbsences = [{ reservationId: attempted.reservationId, attemptId: attempted.attemptId!, planReference: attempted.planReference, outcome: "cancelled_final",
        terminalAt: now, observedAt: now, absentConfirmed: true, finalityConfirmed: true, evidenceRef: "terminal-test" }];
    }
  }
  const r = request(j, command); fault.afterRename = true;
  expect(await applyCapacityRequestFile(file, r)).toMatchObject({ reason: "STORE_OUTCOME_UNKNOWN" });
  const stored = await load(file); expect(stored.events).toHaveLength(j.events.length + 1);
  fault.afterRename = false;
  expect(await applyCapacityRequestFile(file, r)).toMatchObject({ status: "recorded", replayed: true });
  expect(await load(file)).toEqual(stored);
  expect(currentCapacity(stored, scope, now)).toMatchObject({ reserved: step === "inclusion" || step === "release" ? 0 : 1 });
  if (step === "release") expect(stored.state.reservations[0].phase).toBe("released");
});

it("同期障害継続中の再送を保存成功へ変えない", async () => {
  const file = await setup(), r = request(await load(file), reserve()); fault.directorySync = true;
  expect(await applyCapacityRequestFile(file, r)).toMatchObject({ reason: "STORE_OUTCOME_UNKNOWN" });
  expect(await applyCapacityRequestFile(file, r)).toMatchObject({ reason: "STORE_OUTCOME_UNKNOWN" });
  fault.directorySync = false;
  expect(await applyCapacityRequestFile(file, r)).toMatchObject({ status: "recorded", replayed: true });
  expect((await load(file)).events).toHaveLength(2);
});

it("保存前の部分書込みは旧state/auditを維持", async () => {
  const file = await setup(), r = request(await load(file), reserve()), before = await readFile(file, "utf8"); fault.partial = true;
  expect(await applyCapacityRequestFile(file, r)).toMatchObject({ reason: "LOCAL_IO_ERROR" });
  expect(await readFile(file, "utf8")).toBe(before);
  expect(await readdir(dirname(file))).toEqual(["capacity.json"]);
});

it("lock解放失敗は結果不明とし残留lockを自動解除しない", async () => {
  const file = await setup(), r = request(await load(file), reserve()); fault.cleanup = true;
  expect(await applyCapacityRequestFile(file, r)).toMatchObject({ reason: "STORE_OUTCOME_UNKNOWN" });
  fault.cleanup = false;
  expect((await load(file)).state.reservations).toHaveLength(1);
  expect(await applyCapacityRequestFile(file, r)).toMatchObject({ reason: "STORE_BUSY" });
});

it("計画台帳と容量台帳を誤って読み替えず既存fileを保持", async () => {
  const file = await setup(), planFile = join(dirname(file), "plan.json"), p = reserve().plan;
  expect(await createPlanRegistryFile(planFile, p.binding, now)).toMatchObject({ status: "created" });
  const bytes = await readFile(planFile, "utf8");
  expect(await readPlanRegistryFile(file)).toMatchObject({ reason: "REGISTRY_FILE_INVALID" });
  expect(await readCapacityFile(planFile)).toMatchObject({ reason: "CAPACITY_FILE_INVALID" });
  expect(await applyCapacityRequestFile(planFile, request(await load(file), reserve()))).toMatchObject({ reason: "CAPACITY_FILE_INVALID" });
  expect(await readFile(planFile, "utf8")).toBe(bytes);
});

it("未来の要求は追記前に拒否し、期限後の再送では現在の有効容量を確認", async () => {
  const file = await setup(), j = await load(file), r = request(j, reserve()), before = await readFile(file, "utf8");
  expect(await applyCapacityRequestFile(file, { ...r, at: "2099-01-01T00:00:00.000Z" })).toMatchObject({ reason: "CAPACITY_TIME_FROM_FUTURE" });
  expect(await readFile(file, "utf8")).toBe(before);
  expect(await applyCapacityRequestFile(file, r)).toMatchObject({ status: "recorded" });
  vi.setSystemTime(new Date("2026-10-24T12:20:00.000Z"));
  expect(await applyCapacityRequestFile(file, r)).toMatchObject({ status: "recorded", replayed: true });
  expect(currentCapacity(await load(file), scope, new Date().toISOString())).toMatchObject({ reserved: 0 });
});
