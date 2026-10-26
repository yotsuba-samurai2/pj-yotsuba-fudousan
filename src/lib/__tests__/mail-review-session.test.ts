import { expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { createMailReviewSession, type MailReviewTransport } from "../mail-review-session";
import { createMailReviewTransport } from "../mail-review-transport";
import type { MailReviewCommand, MailReviewInspection, MailReviewResult } from "../mail-review-contract";
const propertyId = "00000000-0000-4000-8000-000000000057", operatorId = "00000000-0000-4000-8000-000000000058";
const reference = { propertyId, reviewRef: "synthetic-review-ui", reviewHash: "a".repeat(64) };
function setup() {
  const data = new Map<string, string>(), storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); } };
  let head: Extract<MailReviewInspection, { status: "present" }> | null = null, lost = false, forbidden = false;
  let hold: Promise<void> | undefined;
  const receipts = new Map<string, MailReviewResult>(), writes: MailReviewCommand[] = [];
  const send = vi.fn<MailReviewTransport>(async (action, input) => {
    if (forbidden) return Response.json({ error: "FORBIDDEN" }, { status: 403 });
    if (action === "inspect") return Response.json({ ...reference, result: head ?? { status: "unavailable" } }, { status: head ? 200 : 503 });
    const c = input as MailReviewCommand;
    let result = receipts.get(c.requestId);
    if (result) result = { ...result, ...(result.status === "recorded" ? { replayed: true, current: result.headHash === head?.headHash ? "matches" : "changed" } : {}) } as MailReviewResult;
    else if (action === "reconcile") result = { status: "held", reason: "RECEIPT_NOT_FOUND" };
    else {
      if (hold) await hold;
      if (c.operation === "register" && head) result = { status: "held", reason: "REVIEW_REFERENCE_EXISTS" };
      else if (c.operation === "revoke" && (head?.revision !== c.expectedRevision || head.headHash !== c.expectedHeadHash)) result = { status: "held", reason: "REVIEW_HEAD_CONFLICT" };
      else {
        writes.push(c);
        head = { status: "present", reviewStatus: c.operation === "register" ? "active" : "revoked", revision: c.expectedRevision + 1,
          headHash: (c.operation === "register" ? "b" : "c").repeat(64), expiresAt: "2026-10-27T00:00:00.000Z" };
        result = { status: "recorded", event: c.operation === "register" ? "registered" : "revoked", requestId: c.requestId, revision: head.revision, headHash: head.headHash, replayed: false, current: "matches" };
        receipts.set(c.requestId, result);
        if (lost) { lost = false; throw new Error("PRIVATE_REPLY_LOST"); }
      }
    }
    return Response.json({ propertyId, requestId: c.requestId, result }, { status: result.status === "recorded" ? 200 : result.status === "held" ? 409 : 503 });
  });
  const create = () => createMailReviewSession({ reference, operatorId, storage, send });
  return { create, send, writes, data, storage, receipts, lose: () => { lost = true; }, forbid: (v = true) => { forbidden = v; },
    setHead: (value: NonNullable<typeof head>) => { head = value; },
    hold: () => { let release!: () => void; hold = new Promise<void>(r => { release = r; }); return () => { hold = undefined; release(); }; } };
}
it("opening only inspects, double click sends once, and completed remount does not repeat registration", async () => {
  const s = setup(), view = s.create(); await view.refresh(); expect(s.writes).toHaveLength(0); expect(view.canRegister()).toBe(true);
  const release = s.hold(), first = view.register(), second = view.register();
  expect(view.getSnapshot().phase).toBe("busy"); expect(view.canRegister()).toBe(false); expect(s.send.mock.calls.filter(c => c[0] === "apply")).toHaveLength(1);
  release(); await Promise.all([first, second]); expect(view.getSnapshot().phase).toBe("recorded"); expect(view.canRevoke()).toBe(true);
  const reopened = s.create(); expect(reopened.canRevoke()).toBe(false); await reopened.refresh();
  expect(reopened.canRevoke()).toBe(true); expect(s.writes).toHaveLength(1);
  expect([...s.data.values()].join()).not.toMatch(/accessToken|PRIVATE_|patchJson|income|title/);
  expect(Object.keys(JSON.parse([...s.data.values()][0]).command).sort()).toEqual(["expectedRevision", "operation", "propertyId", "requestId", "reviewHash", "reviewRef"]);
});
it("lost commit reply is recovered after remount, and revocation uses a fresh ID/current head", async () => {
  const s = setup(), view = s.create(); s.lose(); await view.register();
  expect(view.getSnapshot().phase).toBe("unknown"); expect(view.canRegister()).toBe(false); expect(view.canRevoke()).toBe(false);
  await view.retry(); expect(s.writes).toHaveLength(1);
  const reopened = s.create(); await reopened.refresh(); expect(reopened.getSnapshot().result).toMatchObject({ replayed: true });
  const original = reopened.getSnapshot().command!; s.lose(); await reopened.revoke(); expect(reopened.getSnapshot().phase).toBe("unknown");
  const last = s.create(); await last.refresh(); expect(last.getSnapshot().head?.reviewStatus).toBe("revoked"); expect(last.canRevoke()).toBe(false);
  await last.revoke(); expect(s.writes).toHaveLength(2); expect(last.getSnapshot().command!.requestId).not.toBe(original.requestId);
});
it("leave during a request, missing receipt and later completion preserve the original request", async () => {
  const s = setup(), view = s.create(), release = s.hold(), first = view.register();
  const reopened = s.create(); await reopened.refresh(); expect(reopened.getSnapshot().phase).toBe("not_observed"); expect(s.writes).toHaveLength(0);
  expect(s.send.mock.calls.filter(c => c[0] === "apply")).toHaveLength(1); release(); await first; await reopened.reconcile();
  expect(reopened.getSnapshot().result).toMatchObject({ status: "recorded", replayed: true }); expect(s.writes).toHaveLength(1);
});
it("confirmed absence permits only explicit retry of exactly the retained command", async () => {
  const s = setup(), original = s.send.getMockImplementation()!;
  s.send.mockImplementationOnce(async () => { throw new Error("BEFORE_DELIVERY"); });
  const view = s.create(); await view.register(); const request = view.getSnapshot().command; await view.retry(); expect(s.writes).toHaveLength(0);
  s.send.mockImplementation(original); await view.refresh(); expect(view.getSnapshot().phase).toBe("not_observed"); await view.retry();
  expect(s.writes).toEqual([request]); expect(view.getSnapshot().command).toEqual(request);
});
it("stale-head revocation is held, current head is re-read, and a new explicit revoke uses that version", async () => {
  const s = setup(), view = s.create(); await view.register();
  s.setHead({ status: "present", revision: 4, headHash: "d".repeat(64), reviewStatus: "active", expiresAt: "2026-10-20T00:00:00.000Z" });
  await view.revoke(); expect(view.getSnapshot().result).toMatchObject({ reason: "REVIEW_HEAD_CONFLICT" }); expect(s.writes).toHaveLength(1);
  expect(view.canRevoke()).toBe(true); const stale = view.getSnapshot().command!.requestId;
  await view.revoke(); expect(s.writes[1]).toMatchObject({ operation: "revoke", expectedRevision: 4, expectedHeadHash: "d".repeat(64) });
  expect(s.writes[1].requestId).not.toBe(stale);
});
it.each(["unavailable", "write-throws", "write-dropped", "corrupt", "foreign-property"])("storage %s never begins a mutation", async variant => {
  const s = setup();
  if (variant === "corrupt" || variant === "foreign-property") {
    await s.create().register(); const key = [...s.data.keys()][0];
    s.data.set(key, variant === "corrupt" ? "not-json" : JSON.stringify({ schemaVersion: 1, command: { ...s.writes[0], propertyId: randomUUID() } }));
    s.send.mockClear();
  }
  const storage = variant === "unavailable" ? undefined : variant.startsWith("write") ? { getItem: s.storage.getItem, setItem: () => { if (variant === "write-throws") throw new Error("PRIVATE_QUOTA"); } } : s.storage;
  const view = createMailReviewSession({ reference, operatorId, storage, send: s.send }); await view.register(); await view.revoke();
  expect(s.send).not.toHaveBeenCalled(); expect(view.canRegister()).toBe(false);
});
it("a changed stored request prevents an old session from resending", async () => {
  const s = setup(), view = s.create(); s.send.mockRejectedValueOnce(new Error("LOST")); await view.register(); await view.refresh();
  const key = [...s.data.keys()][0], value = JSON.parse(s.data.get(key)!); value.command.requestId = randomUUID(); s.data.set(key, JSON.stringify(value));
  const calls = s.send.mock.calls.length; await view.retry(); expect(s.send).toHaveBeenCalledTimes(calls); expect(view.getSnapshot().phase).toBe("blocked");
});
it("permission loss clears actionable state and restoration requires a new server inspection", async () => {
  const s = setup(), view = s.create(); await view.register(); s.forbid(); await view.refresh();
  expect(view.getSnapshot().phase).toBe("forbidden"); expect(view.canRevoke()).toBe(false);
  s.forbid(false); await view.refresh(); expect(view.canRevoke()).toBe(true); expect(s.writes).toHaveLength(1);
});
it.each(["property", "request", "event", "revision", "private", "http"])("%s response mismatch remains unknown with original reference retained", async variant => {
  const s = setup(), original = s.send.getMockImplementation()!;
  s.send.mockImplementation(async (action, input) => {
    const r = await original(action, input); if (action !== "apply") return r;
    const b = await r.json();
    if (variant === "property") b.propertyId = randomUUID(); if (variant === "request") b.result.requestId = randomUUID();
    if (variant === "event") b.result.event = "revoked"; if (variant === "revision") b.result.revision = 20;
    if (variant === "private") b.result.internal = { ad: "PRIVATE_AD" };
    return Response.json(b, { status: variant === "http" ? 503 : 200 });
  });
  const view = s.create(); await view.register(); expect(view.getSnapshot().phase).toBe("unknown"); expect(view.canRevoke()).toBe(false);
  expect(view.getSnapshot().command).not.toBeNull(); expect(JSON.stringify(view.getSnapshot())).not.toContain("PRIVATE_AD");
});
it("transport derives a fixed relative endpoint, sends current auth only, and rejects a switched user/property", async () => {
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({})), readSession = vi.fn(async () => ({ uid: operatorId, accessToken: "synthetic-token" }));
  const send = createMailReviewTransport({ propertyId, operatorId, readSession, fetch: fetcher }); await send("inspect", reference);
  expect(fetcher).toHaveBeenCalledWith(`/api/admin/bukken/${propertyId}/mail-review/inspect`, expect.objectContaining({ method: "POST", cache: "no-store", credentials: "omit", redirect: "error", headers: { "Content-Type": "application/json", Authorization: "Bearer synthetic-token" } }));
  readSession.mockResolvedValue({ uid: randomUUID(), accessToken: "other-token" }); expect((await send("inspect", reference)).status).toBe(401); expect(fetcher).toHaveBeenCalledTimes(1);
  await expect(send("inspect", { ...reference, propertyId: randomUUID() })).rejects.toThrow("PROPERTY_TARGET_CONFLICT"); expect(fetcher).toHaveBeenCalledTimes(1);
});
