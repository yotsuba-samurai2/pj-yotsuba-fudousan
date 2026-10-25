import { expect, it, vi } from "vitest";
import { createPropertyWriteHttpHandler } from "../property-write-http";
import { createPropertyEditSession } from "../property-edit-session";
import type { PropertyWriteCommand } from "../property-write-contract";
import { fixture } from "../rental-import/__tests__/fixtures";

const id = "00000000-0000-4000-8000-000000000001", uid = "00000000-0000-4000-8000-00000000000a";
const requestId = "00000000-0000-4000-8000-00000000000b", at = "2026-10-25T00:00:00.000Z";
const command: PropertyWriteCommand = { operation: "apply", propertyId: id, requestId, expectedUpdatedAt: at, patchJson: '{"title":"Synthetic"}' };
const saved = { status: "applied" as const, reason: "SAVED" as const, requestId, replayed: false,
  resultVersion: "2026-10-25T00:00:00.001Z", resultHash: "a".repeat(64), current: "matches" as const };
const req = (body: unknown = command) => new Request("https://local.invalid/api/property", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
function setup() {
  const store = { apply: vi.fn(async () => saved), reconcile: vi.fn(async () => ({ ...saved, replayed: true })) };
  const authorize = vi.fn(async () => ({ uid }));
  const handle = createPropertyWriteHttpHandler({ authorize, store });
  const send = vi.fn(async (body: Readonly<PropertyWriteCommand>) => handle(req(body), id));
  const session = createPropertyEditSession({ propertyId: id, expectedUpdatedAt: at, send, newRequestId: () => requestId });
  const input = { ...fixture().property, status: "draft" as const };
  return { store, authorize, handle, send, session, input };
}

it.each([401, 403, 503] as const)("authorization %i precedes body parsing/store access and emits no private error", async status => {
  const store = { apply: vi.fn(), reconcile: vi.fn() }, body = req();
  const handle = createPropertyWriteHttpHandler({ authorize: async () => ({ status }), store });
  const response = await handle(body, id);
  expect(response.status).toBe(status); expect(body.bodyUsed).toBe(false);
  expect(store.apply).not.toHaveBeenCalled(); expect(store.reconcile).not.toHaveBeenCalled();
  expect(response.headers.get("cache-control")).toBe("no-store");
});
it("absent store, invalid verified UID, and thrown auth errors fail closed without fallback", async () => {
  for (const authorize of [async () => ({ uid }), async () => ({ uid: "invalid" }), async () => { throw new Error("PRIVATE_TOKEN"); }]) {
    const response = await createPropertyWriteHttpHandler({ authorize })(req(), id);
    expect(response.status).toBe(503); expect(await response.text()).not.toContain("PRIVATE_TOKEN");
  }
});
it("actor and property binding come from verified identity/path; body substitution is rejected", async () => {
  const f = setup();
  for (const patch of [{ actorRef: "admin:other" }, { unknown: {} }]) expect((await f.handle(req({ ...command, ...patch }), id)).status).toBe(400);
  expect((await f.handle(req({ ...command, propertyId: uid }), id)).status).toBe(409);
  expect(f.store.apply).not.toHaveBeenCalled();
  const response = await f.handle(req({ ...command, requestId: requestId.toUpperCase() }), id.toUpperCase());
  expect(response.status).toBe(200);
  expect(f.store.apply).toHaveBeenCalledWith({ requestId, expectedUpdatedAt: at, patchJson: command.patchJson, propertyId: id, actorRef: `admin:${uid}` });
  expect(await response.text()).not.toMatch(/actorRef|patchJson|Synthetic/);
});
it("oversize/malformed bodies, non-JSON and unsupported methods never reach store", async () => {
  const f = setup();
  for (const request of [req({ ...command, patchJson: "x".repeat(2_100_001) }), new Request("https://local.invalid", { method: "POST", body: "{" }),
    new Request("https://local.invalid", { method: "POST", headers: { "content-type": "application/json" }, body: "{" }), new Request("https://local.invalid")]) {
    expect([400, 405]).toContain((await f.handle(request, id)).status);
  }
  expect(f.store.apply).not.toHaveBeenCalled(); expect(f.store.reconcile).not.toHaveBeenCalled();
});
it("unexpected nested output/exception is reduced to fixed unknown with no private fields", async () => {
  const f = setup();
  f.store.apply.mockResolvedValueOnce({ ...saved, internal: { adNote: "PRIVATE_AD100" } } as typeof saved);
  f.store.apply.mockRejectedValueOnce(new Error("PRIVATE_DATABASE_URL"));
  for (let i = 0; i < 2; i++) {
    const response = await f.handle(req(), id); expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ propertyId: id, requestId, result: { status: "unknown", reason: "STORE_OUTCOME_UNKNOWN" }, publication: "not_checked" });
  }
});
it("one immutable full edit survives double submit and caller mutation; omissions explicitly clear", async () => {
  const f = setup(); let release!: () => void;
  f.store.apply.mockImplementationOnce(async () => { await new Promise<void>(r => { release = r; }); return saved; });
  const input = { ...f.input, priceNote: undefined, internal: { memo: "Original private note" } };
  const pending = f.session.submit(input);
  input.title = "Changed while waiting"; input.internal.memo = "Changed private note";
  await f.session.submit(input); await f.session.retry(); await f.session.reconcile();
  expect(f.send).toHaveBeenCalledTimes(1);
  await vi.waitFor(() => expect(release).toBeTypeOf("function")); release();
  expect((await pending).phase).toBe("saved");
  const body = f.send.mock.calls[0][0];
  expect(JSON.parse(body.patchJson)).toMatchObject({ title: f.input.title, priceNote: null, internal: { memo: "Original private note" } });
  expect(Object.isFrozen(body)).toBe(true);
  expect(f.session.getSnapshot().message).toContain("公開反映は未確認");
});
it("reply loss never retries automatically and reconciles the original request", async () => {
  const f = setup();
  f.send.mockImplementationOnce(async body => { await f.handle(req(body), id); throw new Error("PRIVATE_REPLY_LOSS"); });
  expect((await f.session.submit(f.input)).phase).toBe("unknown");
  await f.session.retry(); expect(f.send).toHaveBeenCalledTimes(1);
  expect((await f.session.reconcile()).phase).toBe("saved");
  expect(f.send.mock.calls.map(([r]) => r.operation)).toEqual(["apply", "reconcile"]);
  expect(f.send.mock.calls[1][0]).toEqual({ ...f.send.mock.calls[0][0], operation: "reconcile" });
  expect(f.store.apply).toHaveBeenCalledTimes(1);
});
it("not-observed allows only explicit identical retry and still does not mean never executed", async () => {
  const f = setup(); f.send.mockRejectedValueOnce(new Error("Lost"));
  f.store.reconcile.mockResolvedValueOnce({ status: "unknown", reason: "REQUEST_NOT_OBSERVED" } as never);
  await f.session.submit(f.input);
  expect((await f.session.reconcile()).phase).toBe("not_observed");
  expect(f.session.getSnapshot().message).toContain("未実行とは確定していません");
  await f.session.submit({ ...f.input, title: "Must not replace" });
  expect((await f.session.retry()).phase).toBe("saved");
  expect(f.send.mock.calls[2][0]).toEqual(f.send.mock.calls[0][0]);
  expect(f.store.apply).toHaveBeenCalledTimes(1);
});
it.each(["changed", "missing"] as const)("historical saved result with current %s never triggers a new save", async current => {
  const f = setup(); f.store.apply.mockResolvedValueOnce({ ...saved, current } as never);
  expect((await f.session.submit(f.input)).phase).toBe(current);
  await f.session.submit(f.input); await f.session.retry();
  expect(f.store.apply).toHaveBeenCalledTimes(1);
});
it.each(["VERSION_CONFLICT", "PUBLICATION_GATE_REJECTED"] as const)("held %s preserves the request and never permits blind retry", async reason => {
  const f = setup(); f.store.apply.mockResolvedValueOnce({ ...saved, status: "held", reason } as never);
  expect((await f.session.submit(f.input)).phase).toBe("held");
  await f.session.retry(); expect(f.store.apply).toHaveBeenCalledTimes(1);
});
it("malformed, mismatched, HTTP inconsistent and non-advancing success responses stay unknown", async () => {
  const responses = [new Response("not json"), Response.json({ ok: true }),
    ...[{ ...saved, requestId: uid }, { ...saved, resultVersion: at }, { ...saved, internal: { ad: "PRIVATE" } }].map(result => Response.json({ propertyId: id, requestId, result, publication: "not_checked" })),
    Response.json({ propertyId: id, requestId, result: saved, publication: "not_checked" }, { status: 503 }),
    Response.json({ propertyId: uid, requestId, result: saved, publication: "not_checked" })];
  for (const response of responses) {
    const f = setup(); f.send.mockResolvedValueOnce(response);
    expect((await f.session.submit(f.input)).phase).toBe("unknown");
    expect(f.session.getSnapshot().message).not.toContain("PRIVATE");
  }
});
it("a transport aimed at another property cannot write even with the same expected version", async () => {
  const f = setup(); f.send.mockImplementationOnce(body => f.handle(req(body), uid));
  expect((await f.session.submit(f.input)).phase).toBe("unknown");
  expect(f.store.apply).not.toHaveBeenCalled();
});
it("an invalid stored receipt cannot be presented as proof that no save happened", async () => {
  const f = setup(); f.store.apply.mockResolvedValueOnce({ status: "held", reason: "RECEIPT_INTEGRITY_ERROR" } as never);
  expect((await f.session.submit(f.input)).phase).toBe("unknown");
  await f.session.retry(); expect(f.store.apply).toHaveBeenCalledTimes(1);
  expect(f.session.getSnapshot().message).toContain("画面を閉じず");
});
