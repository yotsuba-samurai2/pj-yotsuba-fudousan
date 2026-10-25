import { expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { createPropertyRecoveryHttpHandler } from "../property-recovery-http";
import { createPropertyRecoverySession, type RecoveryStorage } from "../property-recovery-session";
import { createPropertyEditSession } from "../property-edit-session";
import { createPublicationEffectRunner, planPublicationEffects, type PublicationEffectStore } from "../property-publication-effects";
import { fixture } from "../rental-import/__tests__/fixtures";
import type { AdminProperty } from "../property-shared";
import type { PropertyRecoveryCommand } from "../property-recovery-contract";
import type { PropertyHeldReceipt } from "../property-write-contract";

const propertyId = "00000000-0000-4000-8000-000000000001", uid = "00000000-0000-4000-8000-00000000000a", at = "2026-10-25T00:00:00.000Z";
function memoryStorage() { const data = new Map<string, string>(); return { data, getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => { data.set(k, v); } }; }
function setup(storage = memoryStorage()) {
  const before = { ...fixture().property, id: propertyId, slug: "synthetic-old", status: "published", updatedAt: at } as AdminProperty;
  let record = planPublicationEffects(randomUUID(), before, { ...before, slug: "synthetic-new", updatedAt: "2026-10-25T00:00:00.001Z" }, new Date(at), `admin:${uid}`);
  const store: PublicationEffectStore = { async change(ref, fn) { const next = fn(ref.propertyId === propertyId && ref.requestId === record.plan.requestId ? structuredClone(record) : null); if (next.state) record = { ...record, state: next.state, revision: record.revision + 1 }; return next.value; } };
  const receipts = new Map(), port = { run: vi.fn(async t => { const proof = { operationId: t.operationId, attemptId: t.attemptId, targetHash: t.targetHash, outcome: "acknowledged" as const }; receipts.set(t.attemptId, proof); return proof; }),
    reconcile: vi.fn(async t => receipts.get(t.attemptId) ?? { operationId: t.operationId, attemptId: t.attemptId, targetHash: t.targetHash, outcome: "unknown" }) };
  const authorize = vi.fn<() => Promise<{ uid: string } | { status: 401 | 403 | 503 }>>(async () => ({ uid }));
  const runner = createPublicationEffectRunner(store, { cache: port, notification: port });
  const handle = createPropertyRecoveryHttpHandler({ authorize, store, runner });
  const request = (body: unknown) => new Request("https://local.invalid/recovery", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const send = vi.fn((body: Readonly<PropertyRecoveryCommand>) => handle(request(body), propertyId));
  const session = () => createPropertyRecoverySession({ propertyId, operatorId: uid, storage, send });
  return { storage, record: () => record, change: (value: typeof record) => { record = value; }, ref: { propertyId, requestId: record.plan.requestId }, port, authorize, handle, request, send, session };
}
it("remembered references contain no raw edit and a reopened session only inspects, then resumes explicitly", async () => {
  const f = setup(), first = f.session(); expect(first.remember(f.ref)).toBe(true);
  expect([...f.storage.data.values()][0]).toBe(JSON.stringify([f.ref]));
  const reopened = f.session(); expect(reopened.getSnapshot().selected).toBe(f.ref.requestId);
  await reopened.inspect(); expect(f.port.run).not.toHaveBeenCalled();
  expect(reopened.getSnapshot().summary!.cache.status).toBe("pending");
  await reopened.resume("cache"); await reopened.resume("notification");
  expect(f.port.run).toHaveBeenCalledTimes(2);
  await reopened.resume("cache"); await reopened.resume("notification"); expect(f.port.run).toHaveBeenCalledTimes(2);
  expect(reopened.forgetCompleted()).toBe(true); expect(JSON.parse([...f.storage.data.values()][0])).toEqual([]);
});
it("double clicks and reopening during a pending action never start a second effect", async () => {
  const f = setup(), s = f.session(); s.remember(f.ref); await s.inspect();
  let release!: () => void; const original = f.port.run.getMockImplementation()!;
  f.port.run.mockImplementationOnce(async t => { await new Promise<void>(r => { release = r; }); return original(t); });
  const pending = s.resume("cache"); await s.resume("cache"); await vi.waitFor(() => expect(release).toBeTypeOf("function"));
  const reopened = f.session(); await reopened.inspect(); expect(reopened.getSnapshot().summary!.cache.status).toBe("running");
  await reopened.resume("cache"); expect(reopened.getSnapshot().phase).toBe("unknown"); expect(f.port.run).toHaveBeenCalledTimes(1);
  release(); await pending; await reopened.inspect(); expect(reopened.getSnapshot().summary!.cache.status).toBe("acknowledged");
});
it("lost HTTP response discards stale controls; inspection recovers completed state without re-running", async () => {
  const f = setup(), s = f.session(); s.remember(f.ref); await s.inspect();
  f.send.mockImplementationOnce(async command => { await f.handle(f.request(command), propertyId); throw new Error("PRIVATE_HTTP_REPLY"); });
  await s.resume("cache"); expect(s.getSnapshot().phase).toBe("unknown"); expect(s.getSnapshot().summary).toBeNull();
  await s.resume("cache"); expect(f.port.run).toHaveBeenCalledTimes(1);
  await f.session().inspect(); expect(f.port.run).toHaveBeenCalledTimes(1);
});
it("missing plan after recording a reference is unknown, never a failed save or automatic replay", async () => {
  const f = setup(), s = f.session(); s.remember({ propertyId, requestId: randomUUID() });
  await s.inspect(); expect(s.getSnapshot().phase).toBe("unknown"); expect(s.getSnapshot().message).toContain("保存失敗とは確定していません");
  await s.resume("cache"); expect(f.port.run).not.toHaveBeenCalled(); expect(s.forgetCompleted()).toBe(false);
});
it("concurrent mounted sessions merge references rather than replace an older unresolved request", () => {
  const f = setup(), a = f.session(), b = f.session(), next = { propertyId, requestId: randomUUID() };
  a.remember(f.ref); b.remember(next); expect(JSON.parse([...f.storage.data.values()][0])).toEqual([f.ref, next]);
});
it("storage failure blocks a new property save before any write transport runs", async () => {
  const storage: RecoveryStorage = { getItem: () => null, setItem: () => { throw new Error("quota"); } };
  const f = setup(), s = createPropertyRecoverySession({ propertyId, operatorId: uid, storage, send: f.send }), send = vi.fn();
  const edit = createPropertyEditSession({ propertyId, expectedUpdatedAt: at, send, rememberRequest: s.remember });
  expect((await edit.submit(fixture().property)).message).toContain("保存を開始していません"); expect(send).not.toHaveBeenCalled(); expect(s.getSnapshot().storageReady).toBe(false);
});
it.each([401, 403, 503] as const)("authorization %i precedes parsing and all effect reads/writes", async status => {
  const f = setup(); f.authorize.mockResolvedValueOnce({ status }); const req = f.request({ ...f.ref, operation: "cache" });
  const response = await f.handle(req, propertyId); expect(response.status).toBe(status); expect(req.bodyUsed).toBe(false); expect(f.port.run).not.toHaveBeenCalled();
});
it("owner/legacy/target substitutions are rejected before effect execution and metadata never leaks", async () => {
  const f = setup();
  f.authorize.mockResolvedValueOnce({ uid: randomUUID() }); expect((await f.handle(f.request({ ...f.ref, operation: "cache" }), propertyId)).status).toBe(404);
  expect((await f.handle(f.request({ ...f.ref, propertyId: randomUUID(), operation: "cache" }), propertyId)).status).toBe(409);
  expect((await f.handle(f.request({ ...f.ref, actorRef: `admin:${uid}`, operation: "cache" }), propertyId)).status).toBe(400);
  const response = await f.handle(f.request({ ...f.ref, operation: "status" }), propertyId);
  expect(response.headers.get("cache-control")).toBe("no-store"); expect(await response.text()).not.toMatch(/initiatorHash|planHash|notificationPaths|synthetic-|internal|attemptId/);
  const old = f.record(); delete old.plan.initiatorHash;
  const { contentHash } = await import("../property-sync/rules"); old.planHash = contentHash(old.plan); f.change(old);
  expect((await f.handle(f.request({ ...f.ref, operation: "cache" }), propertyId)).status).toBe(404); expect(f.port.run).not.toHaveBeenCalled();
});
it("different operator/property namespaces do not restore previous references or accept foreign responses", async () => {
  const f = setup(), s = f.session(); s.remember(f.ref);
  expect(createPropertyRecoverySession({ propertyId, operatorId: randomUUID(), storage: f.storage, send: f.send }).getSnapshot().refs).toEqual([]);
  expect(createPropertyRecoverySession({ propertyId: randomUUID(), operatorId: uid, storage: f.storage, send: f.send }).getSnapshot().refs).toEqual([]);
  const original = await f.handle(f.request({ ...f.ref, operation: "status" }), propertyId), body = await original.json();
  f.send.mockResolvedValueOnce(Response.json({ ...body, propertyId: randomUUID() })); await s.inspect(); expect(s.getSnapshot().phase).toBe("unknown");
});
it("insufficient permission removes actionable state and requires a fresh successful inspection", async () => {
  const f = setup(), s = f.session(); s.remember(f.ref); await s.inspect(); f.authorize.mockResolvedValueOnce({ status: 403 });
  await s.resume("cache"); expect(s.getSnapshot().phase).toBe("forbidden"); expect(s.getSnapshot().summary).toBeNull();
  await s.resume("cache"); expect(f.port.run).not.toHaveBeenCalled();
  await s.inspect(); await s.resume("cache"); expect(f.port.run).toHaveBeenCalledTimes(1);
});
it("inconsistent restored cache/notification state never becomes a completed or removable reference", async () => {
  const f = setup(), row = f.record(), s = f.session();
  row.state.notification = { status: "acknowledged", attempts: 1, attemptId: randomUUID() }; f.change(row);
  s.remember(f.ref); await s.inspect();
  expect(s.getSnapshot().phase).toBe("unknown"); expect(s.getSnapshot().summary).toBeNull();
  expect(s.forgetCompleted()).toBe(false); expect(s.forgetConfirmedHeld()).toBe(false);
  await s.resume("cache"); await s.resume("notification"); expect(f.port.run).not.toHaveBeenCalled(); expect(s.getSnapshot().refs).toEqual([f.ref]);
});

function heldSetup() {
  const ref = { propertyId, requestId: randomUUID() }, storage = memoryStorage();
  const receipt: PropertyHeldReceipt = { ...ref, reason: "VERSION_CONFLICT", resultVersion: at };
  const inspectHeld = vi.fn(async () => receipt as PropertyHeldReceipt | null);
  const store: PublicationEffectStore = { async change(_ref, run) { return run(null).value; } };
  const authorize = vi.fn<() => Promise<{ uid: string } | { status: 401 | 403 | 503 }>>(async () => ({ uid }));
  const handle = createPropertyRecoveryHttpHandler({ authorize, store, receipts: { inspectHeld } });
  const send = vi.fn((command: Readonly<PropertyRecoveryCommand>) => handle(new Request("https://local.invalid/recovery", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(command) }), propertyId));
  const session = () => createPropertyRecoverySession({ propertyId, operatorId: uid, storage, send });
  return { ref, receipt, storage, inspectHeld, authorize, send, session };
}
it("only a status inspection exposes an allowlisted confirmed hold; authenticated actor cannot come from body", async () => {
  const f = heldSetup(), s = f.session(); s.remember(f.ref); await s.inspect();
  expect(f.inspectHeld).toHaveBeenCalledWith({ ...f.ref, actorRef: `admin:${uid}` });
  expect(s.getSnapshot().heldReceipt).toEqual(f.receipt); expect(s.getSnapshot().summary).toBeNull();
  await s.resume("cache"); await s.resume("notification"); expect(f.send).toHaveBeenCalledTimes(1);
  expect((await f.send({ ...f.ref, operation: "cache" })).status).toBe(404); expect(f.inspectHeld).toHaveBeenCalledTimes(1);
  const response = await f.send({ ...f.ref, operation: "status" }); expect(response.headers.get("cache-control")).toBe("no-store");
  expect(await response.json()).toEqual({ ...f.receipt, outcome: "confirmed_held", publication: "not_checked" });
  expect(s.forgetCompleted()).toBe(false); expect(s.forgetConfirmedHeld()).toBe(true); expect(f.session().getSnapshot().refs).toEqual([]);
});
it("50 refs block a new save without poisoning storage; explicit held removal frees exactly one slot", async () => {
  const f = heldSetup(), refs = Array.from({ length: 49 }, () => ({ propertyId, requestId: randomUUID() }));
  const s = f.session(); for (const ref of [...refs, f.ref]) expect(s.remember(ref)).toBe(true);
  const send = vi.fn(async () => Response.json({ error: "unknown" }, { status: 503 }));
  const edit = createPropertyEditSession({ propertyId, expectedUpdatedAt: at, send, rememberRequest: s.remember });
  await edit.submit(fixture().property); expect(send).not.toHaveBeenCalled(); expect(s.getSnapshot().storageReady).toBe(true); expect(s.getSnapshot().capacityReached).toBe(true);
  await s.inspect(); expect(s.forgetConfirmedHeld()).toBe(true); expect(s.getSnapshot().capacityReached).toBe(false); expect(s.getSnapshot().refs).toEqual(refs);
  await edit.submit(fixture().property); expect(send).toHaveBeenCalledTimes(1); expect(s.getSnapshot().refs).toHaveLength(50);
  expect([...f.storage.data.values()][0]).not.toMatch(/reason|resultVersion|patch|internal|title|initiator/);
});
it("unknown, forbidden, malformed, foreign or side-effect hold responses clear removal evidence", async () => {
  const f = heldSetup(), s = f.session(); s.remember(f.ref);
  const responses = [Response.json({ error: "missing" }, { status: 404 }), Response.json({ error: "forbidden" }, { status: 403 }),
    Response.json({ ...f.receipt, requestId: randomUUID(), outcome: "confirmed_held", publication: "not_checked" }),
    Response.json({ ...f.receipt, propertyId: randomUUID(), outcome: "confirmed_held", publication: "not_checked" }),
    Response.json({ ...f.receipt, outcome: "confirmed_held", publication: "not_checked", internal: "PRIVATE" })];
  for (const response of responses) { await s.inspect(); expect(s.getSnapshot().heldReceipt).not.toBeNull(); f.send.mockResolvedValueOnce(response); await s.inspect(); expect(s.getSnapshot().heldReceipt).toBeNull(); expect(s.forgetConfirmedHeld()).toBe(false); }
  const effects = setup(), e = effects.session(); e.remember(effects.ref); await e.inspect(); expect(e.forgetConfirmedHeld()).toBe(false);
  expect(s.getSnapshot().refs).toEqual([f.ref]);
});
it("receipt errors and accidental private fields fail closed; auth blocks receipt lookup", async () => {
  const f = heldSetup(); f.authorize.mockResolvedValueOnce({ status: 403 }); expect((await f.send({ ...f.ref, operation: "status" })).status).toBe(403); expect(f.inspectHeld).not.toHaveBeenCalled();
  f.inspectHeld.mockResolvedValueOnce({ ...f.receipt, internal: { ad: "PRIVATE_AD100" } } as PropertyHeldReceipt);
  f.inspectHeld.mockRejectedValueOnce(new Error("PRIVATE_DATABASE_URL"));
  for (let i = 0; i < 2; i++) { const r = await f.send({ ...f.ref, operation: "status" }); expect(r.status).toBe(503); expect(await r.text()).not.toMatch(/PRIVATE|internal/); }
});
it("reference removal preserves concurrently recorded refs and refuses failed storage writes", async () => {
  const f = heldSetup(), s = f.session(); s.remember(f.ref); await s.inspect();
  const other = { propertyId, requestId: randomUUID() }; f.session().remember(other);
  expect(s.forgetConfirmedHeld()).toBe(true); expect(f.session().getSnapshot().refs).toEqual([other]);
  s.remember(f.ref); await s.inspect(); f.storage.setItem = () => { throw new Error("quota"); };
  expect(s.forgetConfirmedHeld()).toBe(false); expect(s.getSnapshot().storageReady).toBe(false); expect(f.session().getSnapshot().refs).toContainEqual(f.ref);
});
