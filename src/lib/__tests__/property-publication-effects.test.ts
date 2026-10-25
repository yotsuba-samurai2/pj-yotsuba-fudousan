import { expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { createPublicationEffectRunner, planPublicationEffects, verifyEffectRecord, type EffectProof, type EffectRecord, type EffectTicket, type PublicationEffectStore } from "../property-publication-effects";
import { fixture } from "../rental-import/__tests__/fixtures";
import type { AdminProperty } from "../property-shared";

const now = new Date("2026-10-25T00:00:00.000Z"), id = "00000000-0000-4000-8000-000000000001";
function property(): AdminProperty { return { ...fixture().property, id, slug: "synthetic-old", status: "published", internal: { memo: "PRIVATE_AD100_当社報酬_元付" }, createdAt: now.toISOString(), updatedAt: now.toISOString() }; }
function setup() {
  const before = property(), after = { ...before, slug: "synthetic-new", updatedAt: "2026-10-25T00:00:00.001Z" };
  let record = planPublicationEffects(randomUUID(), before, after, now), tail: Promise<unknown> = Promise.resolve();
  const faults = { before: false, after: false };
  const store: PublicationEffectStore = { change(ref, fn) {
    const work = tail.then(() => {
      if (faults.before) { faults.before = false; throw new Error("PRIVATE_SQL"); }
      const r = fn(ref.propertyId === id && ref.requestId === record.plan.requestId ? structuredClone(record) : null);
      if (r.state) record = { ...record, state: structuredClone(r.state), revision: record.revision + 1 };
      if (faults.after) { faults.after = false; throw new Error("PRIVATE_COMMIT_REPLY"); }
      return r.value;
    }); tail = work.catch(() => {}); return work;
  } };
  const proof = (t: EffectTicket, outcome: EffectProof["outcome"]): EffectProof => ({ operationId: t.operationId, attemptId: t.attemptId, targetHash: t.targetHash, outcome });
  const ledger = new Map<string, EffectProof>();
  const port = { run: vi.fn(async (t: EffectTicket) => { const p = ledger.get(t.attemptId) ?? proof(t, "acknowledged"); ledger.set(t.attemptId, p); return p; }),
    reconcile: vi.fn(async (t: EffectTicket) => ledger.get(t.attemptId) ?? proof(t, "unknown")) };
  return { before, after, ref: { requestId: record.plan.requestId, propertyId: id }, store, faults, port, proof, ledger,
    get: () => structuredClone(record), set: (r: EffectRecord) => { record = r; }, runner: createPublicationEffectRunner(store, { cache: port, notification: port }) };
}
it("date-only/private-only changes still invalidate cache but need no notification; rename includes both public paths", () => {
  const f = setup();
  expect(f.get().plan.notificationPaths).toEqual(expect.arrayContaining(["/bukken/synthetic-old", "/bukken/synthetic-new"]));
  expect(f.get().plan.cacheSlugs).toEqual(["synthetic-old", "synthetic-new"]);
  expect(JSON.stringify(f.get())).not.toMatch(/PRIVATE|AD100|当社報酬|元付|memo|description/);
  const record = planPublicationEffects(randomUUID(), f.before, { ...f.before, infoUpdatedAt: "2026-10-26", internal: { memo: "PRIVATE_OTHER" } }, now);
  expect(record.state.cache.status).toBe("pending"); expect(record.state.notification.status).toBe("not_required");
});
it("disabled port and wrong target never invoke an effect; notifications wait for cache acknowledgement", async () => {
  const f = setup();
  expect((await createPublicationEffectRunner(f.store, {}).resume(f.ref, "cache")).reason).toBe("EFFECT_DISABLED");
  expect((await f.runner.resume({ ...f.ref, propertyId: randomUUID() }, "cache")).reason).toBe("EFFECT_NOT_FOUND");
  expect((await f.runner.resume(f.ref, "notification")).reason).toBe("CACHE_NOT_ACKNOWLEDGED");
  expect(f.port.run).not.toHaveBeenCalled();
});
it("confirmed failure retries only the effect, completed stages never repeat, public propagation remains unverified", async () => {
  const f = setup(); f.port.run.mockImplementationOnce(async t => f.proof(t, "not_applied_final"));
  expect((await f.runner.resume(f.ref, "cache")).status).toBe("retry_ready");
  expect(f.port.run).toHaveBeenCalledTimes(1);
  expect((await f.runner.resume(f.ref, "cache")).status).toBe("acknowledged");
  expect((await f.runner.resume(f.ref, "notification")).publication).toBe("not_checked");
  await f.runner.resume(f.ref, "cache"); await f.runner.resume(f.ref, "notification"); expect(f.port.run).toHaveBeenCalledTimes(3);
  expect(f.port.run.mock.calls[0][0].attemptId).not.toBe(f.port.run.mock.calls[1][0].attemptId);
  expect(f.port.run.mock.calls[0][0].targetHash).toBe(f.port.run.mock.calls[1][0].targetHash);
  expect(f.port.run.mock.calls[1][0].targetHash).not.toBe(f.port.run.mock.calls[2][0].targetHash);
});
it("accepted effect with lost reply is reconciled without a second run", async () => {
  const f = setup(); f.port.run.mockImplementationOnce(async t => { f.ledger.set(t.attemptId, f.proof(t, "acknowledged")); throw new Error("PRIVATE_NETWORK"); });
  expect((await f.runner.resume(f.ref, "cache")).status).toBe("unknown");
  expect((await f.runner.resume(f.ref, "cache")).status).toBe("acknowledged"); expect(f.port.run).toHaveBeenCalledTimes(1);
});
it("unobserved attempt never authorizes replay, including a delayed original worker", async () => {
  const f = setup(); let release!: () => void;
  f.port.run.mockImplementationOnce(async t => { await new Promise<void>(r => { release = r; }); const p = f.proof(t, "acknowledged"); f.ledger.set(t.attemptId, p); return p; });
  const first = f.runner.resume(f.ref, "cache"); await vi.waitFor(() => expect(release).toBeTypeOf("function"));
  expect((await f.runner.resume(f.ref, "cache")).status).toBe("unknown"); expect(f.port.run).toHaveBeenCalledTimes(1);
  release(); expect((await first).status).toBe("acknowledged");
});
it("lost claim commit cannot call run; absence remains unknown until a terminal cancellation fences the old attempt", async () => {
  const f = setup(); f.faults.after = true;
  expect((await f.runner.resume(f.ref, "cache")).status).toBe("unknown"); expect(f.port.run).not.toHaveBeenCalled();
  expect((await f.runner.resume(f.ref, "cache")).status).toBe("unknown");
  const t = f.port.reconcile.mock.calls[0][0]; f.ledger.set(t.attemptId, f.proof(t, "not_applied_final"));
  expect((await f.runner.resume(f.ref, "cache")).status).toBe("retry_ready");
  // Simulated provider's terminal record rejects an old delayed call even after cancellation.
  expect((await f.port.run(t)).outcome).toBe("not_applied_final");
  expect((await f.runner.resume(f.ref, "cache")).status).toBe("acknowledged");
});
it("lost acknowledgement commit is resolved from state without sending or probing again", async () => {
  const f = setup(); f.port.run.mockImplementationOnce(async t => { f.faults.after = true; return f.proof(t, "acknowledged"); });
  expect((await f.runner.resume(f.ref, "cache")).status).toBe("unknown");
  expect((await f.runner.resume(f.ref, "cache")).status).toBe("acknowledged"); expect(f.port.run).toHaveBeenCalledTimes(1); expect(f.port.reconcile).not.toHaveBeenCalled();
});
it("a late completion from an older attempt cannot overwrite a newer resolved attempt", async () => {
  const f = setup(); let release!: () => void;
  f.port.run.mockImplementationOnce(async t => { await new Promise<void>(r => { release = r; }); return f.proof(t, "acknowledged"); });
  const old = f.runner.resume(f.ref, "cache"); await vi.waitFor(() => expect(release).toBeTypeOf("function"));
  f.port.reconcile.mockImplementationOnce(async t => f.proof(t, "not_applied_final"));
  expect((await f.runner.resume(f.ref, "cache")).status).toBe("retry_ready");
  expect((await f.runner.resume(f.ref, "cache")).status).toBe("acknowledged"); const resolved = f.get();
  // Even a contradictory delayed provider response cannot change the recorded newer attempt.
  release(); expect((await old).reason).toBe("STALE_EFFECT_ATTEMPT"); expect(f.get()).toEqual(resolved);
});
it("foreign, malformed and private-field proofs never establish success", async () => {
  for (const patch of [{ attemptId: randomUUID() }, { targetHash: "b".repeat(64) }, { operationId: "other" }, { internal: { ad: "PRIVATE" } }]) {
    const f = setup(); f.port.run.mockImplementationOnce(async t => ({ ...f.proof(t, "acknowledged"), ...patch }));
    expect((await f.runner.resume(f.ref, "cache")).status).toBe("unknown"); expect(f.get().state.cache.status).toBe("running");
  }
});
it("tampered plan/state is held before effects and retry exhaustion is terminal", async () => {
  const f = setup(), row = f.get(); row.plan.notificationPaths.push("https://private.test" as never); f.set(row);
  expect((await f.runner.resume(f.ref, "cache")).reason).toBe("EFFECT_INTEGRITY_ERROR"); expect(f.port.run).not.toHaveBeenCalled();
  const g = setup(); g.port.run.mockImplementation(async t => g.proof(t, "not_applied_final"));
  for (let n = 0; n < 6; n++) await g.runner.resume(g.ref, "cache");
  expect((await g.runner.resume(g.ref, "cache")).reason).toBe("ATTEMPTS_EXHAUSTED"); expect(g.port.run).toHaveBeenCalledTimes(6);
  expect(verifyEffectRecord(g.get())).not.toBeNull();
});
it("a notification attempt without prior cache acknowledgement is inconsistent, not a completed effect", async () => {
  for (const cache of [
    { status: "pending", attempts: 0, attemptId: null },
    { status: "running", attempts: 1, attemptId: randomUUID() },
    { status: "blocked", attempts: 6, attemptId: randomUUID() },
  ] as const) {
    const f = setup(), row = f.get(); row.state.cache = cache;
    row.state.notification = { status: "acknowledged", attempts: 1, attemptId: randomUUID() }; f.set(row);
    expect(verifyEffectRecord(row)).toBeNull();
    expect((await f.runner.resume(f.ref, "notification")).reason).toBe("EFFECT_INTEGRITY_ERROR");
    expect((await f.runner.resume(f.ref, "cache")).reason).toBe("EFFECT_INTEGRITY_ERROR");
    expect(f.port.run).not.toHaveBeenCalled(); expect(f.port.reconcile).not.toHaveBeenCalled(); expect(f.get()).toEqual(row);
  }
  const retry = setup(); await retry.runner.resume(retry.ref, "cache");
  retry.port.run.mockImplementationOnce(async t => retry.proof(t, "not_applied_final"));
  expect((await retry.runner.resume(retry.ref, "notification")).status).toBe("retry_ready");
  expect(verifyEffectRecord(retry.get())).not.toBeNull();
});
