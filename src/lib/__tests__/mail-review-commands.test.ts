import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
import type { Prisma, PrismaClient } from "@prisma/client";
import { createMailReviewCommands } from "../db/mail-review-commands";
import { createMailReviewHttpHandler } from "../mail-review-http";
import { reviewedMailFixture } from "../property-sync/__tests__/reviewed-mail-fixture";
import { reviewedMailAuthorityFixture } from "../property-sync/__tests__/reviewed-mail-authority-fixture";
import { contentHash } from "../property-sync/rules";
import type { MailReviewResult } from "../mail-review-contract";

const at = "2026-10-26T02:00:00.000Z", uid = "00000000-0000-4000-8000-000000000056", origin = "https://demo.supabase.co";
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date(at)); vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", origin); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });
function setup(notice = "") {
  const f = reviewedMailFixture(at, undefined, notice, { operatorRef: `admin:${uid}`, reviewerRef: uid }), authority = reviewedMailAuthorityFixture(f.review);
  const row = { ...f.base, priceYen: BigInt(f.base.priceYen), createdAt: new Date(f.base.createdAt), updatedAt: new Date(f.base.updatedAt) };
  let heads = authority.headRows.filter(h => h.kind !== "review"), records: Record<string, unknown>[] = [], events: Record<string, unknown>[] = [];
  const fault = { afterAudit: false, lostReply: false, preparedFailure: false, expireAfterAudit: false, clockBackAfterAudit: false };
  const query = vi.fn(async (q: Prisma.Sql) => {
    if (q.sql.includes("pg_advisory")) return [{ locked: true }];
    if (q.sql.includes("AS record_json")) return [{ record_json: JSON.stringify(row, (_, v) => typeof v === "bigint" ? Number(v) : v) }];
    if (q.sql.includes("FROM public.properties")) return [{ id: row.id }];
    if (q.sql.includes("FROM property_sync_private.mail_review_events")) return events.filter(r => r.request_id === q.values[0]);
    if (q.sql.includes("UNION ALL")) return [...records.filter(r => r.review_ref === q.values[0]), ...heads.filter(h => h.kind === "review" && h.scope_key === q.values[1])];
    if (q.sql.includes("FROM property_sync_private.mail_review_records")) return records.filter(r => [r.review_ref, r.property_id, r.operator_ref, r.review_hash].every((v, i) => v === q.values[i]));
    if (q.sql.includes("mail_authority_heads")) return heads.filter(h => q.values.includes(h.kind) && q.values.includes(h.scope_key)).map(h => structuredClone(h));
    throw new Error("UNEXPECTED_SQL");
  });
  const execute = vi.fn(async (q: Prisma.Sql) => {
    if (q.sql.includes("INSERT INTO property_sync_private.mail_review_records")) {
      records.push(Object.fromEntries(["review_ref", "property_id", "operator_ref", "review_hash", "record_json"].map((k, i) => [k, q.values[i]])));
    } else if (q.sql.includes("INSERT INTO property_sync_private.mail_authority_heads")) {
      heads.push({ kind: "review", scope_key: String(q.values[0]), revision: 1, payload_hash: String(q.values[1]), payload_json: String(q.values[2]) });
    } else if (q.sql.includes("UPDATE property_sync_private.mail_authority_heads")) {
      const h = heads.find(h => h.kind === "review" && h.scope_key === q.values[3] && h.revision === q.values[4] && h.payload_hash === q.values[5]);
      if (!h) return 0;
      Object.assign(h, { revision: q.values[0], payload_hash: q.values[1], payload_json: q.values[2] });
    } else if (q.sql.includes("INSERT INTO property_sync_private.mail_review_events")) {
      const keys = ["request_id", "property_id", "review_ref", "actor_ref", "review_hash", "request_hash", "operation", "event", "before_revision", "before_hash", "head_revision", "head_hash"];
      // SELECT projection intentionally excludes before/created_at, as the real query does.
      events.push(Object.fromEntries(keys.map((k, i) => [k, q.values[i]]).filter(([k]) => !String(k).startsWith("before_"))));
      if (fault.afterAudit) throw new Error("PRIVATE_AUDIT_FAILURE");
      if (fault.expireAfterAudit) vi.setSystemTime(new Date(f.review.expiresAt));
      if (fault.clockBackAfterAudit) vi.setSystemTime(new Date(Date.parse(at) - 1));
    } else throw new Error("UNEXPECTED_SQL");
    return 1;
  });
  const property = { findUnique: vi.fn(async () => structuredClone(row)) };
  const transaction = vi.fn(async (run: (tx: Prisma.TransactionClient) => Promise<unknown>) => {
    const snapshot = structuredClone({ heads, records, events }); let result;
    try { result = await run({ $queryRaw: query, $executeRaw: execute, property } as unknown as Prisma.TransactionClient); }
    catch (e) { ({ heads, records, events } = snapshot); throw e; }
    if (fault.lostReply) { fault.lostReply = false; throw new Error("PRIVATE_REPLY_LOSS"); }
    return result;
  });
  const readPrepared = vi.fn(async () => { if (fault.preparedFailure) throw new Error("PRIVATE_PREPARED_FAILURE"); return JSON.stringify(f.review); });
  const prisma = { $transaction: transaction } as unknown as Pick<PrismaClient, "$transaction">;
  const service = createMailReviewCommands(prisma, { readPrepared, ownedStorageOrigin: origin });
  const command = { operation: "register" as const, requestId: randomUUID(), propertyId: row.id, reviewRef: f.review.reviewRef, reviewHash: contentHash(f.review), expectedRevision: 0 as const };
  const editHead = (kind: string, edit: (p: { status: string; validUntil: string; data: Record<string, unknown> }) => void) => {
    const h = heads.find(h => h.kind === kind)!; const p = JSON.parse(h.payload_json); edit(p); h.revision++; h.payload_json = JSON.stringify(p); h.payload_hash = contentHash(p);
  };
  return { f, command, service, prisma, fault, readPrepared, transaction, execute, row, editHead,
    snapshot: () => structuredClone({ heads, records, events }), removeHead: (kind: string) => { heads = heads.filter(h => h.kind !== kind); } };
}
function revoke(c: ReturnType<typeof setup>["command"], r: MailReviewResult) {
  if (r.status !== "recorded") throw new Error("EXPECTED_REGISTERED");
  return { ...c, requestId: randomUUID(), operation: "revoke" as const, expectedRevision: r.revision, expectedHeadHash: r.headHash };
}
it("registers one immutable review/head/audit, leaves property untouched and recovers without the preparation source", async () => {
  const s = setup(), before = structuredClone(s.row), result = await s.service.apply(s.command, uid);
  expect(result).toMatchObject({ status: "recorded", event: "registered", revision: 1 });
  expect(s.snapshot().records).toHaveLength(1); expect(s.snapshot().events).toHaveLength(1); expect(s.row).toEqual(before);
  expect(JSON.stringify([result, s.snapshot().events])).not.toMatch(/PRIVATE_|patchJson|companyIncome|record_json/);
  s.fault.preparedFailure = true;
  expect(await s.service.apply(s.command, uid)).toMatchObject({ ...result, replayed: true });
  expect(await s.service.reconcile(s.command, uid)).toMatchObject({ ...result, replayed: true });
  expect(s.snapshot().events).toHaveLength(1);
});
it.each(["operator", "reviewer", "episode", "rules", "policies", "permissions", "materials"])("missing %s cannot be fabricated by registration", async kind => {
  const s = setup(); s.removeHead(kind); const before = s.snapshot();
  expect(await s.service.apply(s.command, uid)).toMatchObject({ status: "held", reason: "REVIEW_NOT_AUTHORIZED" }); expect(s.snapshot()).toEqual(before);
});
it.each(["wrong-owner", "wrong-reviewer", "wrong-hash", "duplicate-json", "nested-duplicate"])("%s prepared record is held without writes", async variant => {
  const s = setup();
  if (variant === "wrong-owner") s.f.review.operatorRef = "foreign-owner";
  if (variant === "wrong-reviewer") s.f.review.reviewerRef = randomUUID();
  if (variant === "wrong-hash") s.command.reviewHash = "f".repeat(64);
  if (variant === "duplicate-json") s.readPrepared.mockResolvedValue('{"schemaVersion":1,"schemaVersion":1}');
  if (variant === "nested-duplicate") { s.f.review.patchJson = '{"title":"x","title":"y"}'; s.command.reviewHash = contentHash(s.f.review); }
  expect(await s.service.apply(s.command, uid)).toMatchObject({ status: "held", reason: "PREPARED_REVIEW_UNAVAILABLE" }); expect(s.execute).not.toHaveBeenCalled();
});
it.each(["stale-source", "redistribution-denial"])("%s blocks registration despite existing authority assertions", async variant => {
  const s = setup(variant === "redistribution-denial" ? "サイトへの再配信を禁止します。" : "");
  if (variant === "stale-source") s.row.priceYen += BigInt(1);
  expect(await s.service.apply(s.command, uid)).toMatchObject({ status: "held", reason: "REVIEW_NOT_ELIGIBLE" }); expect(s.execute).not.toHaveBeenCalled();
});
it("audit failure rolls back all writes; lost commit reply is read back without repeating writes", async () => {
  const s = setup(), before = s.snapshot(); s.fault.afterAudit = true;
  expect(await s.service.apply(s.command, uid)).toMatchObject({ status: "unknown" }); expect(s.snapshot()).toEqual(before);
  expect(await s.service.reconcile(s.command, uid)).toMatchObject({ reason: "RECEIPT_NOT_FOUND" });
  s.fault.afterAudit = false; s.fault.lostReply = true;
  expect(await s.service.apply(s.command, uid)).toMatchObject({ status: "unknown" });
  const calls = s.execute.mock.calls.length;
  expect(await s.service.reconcile(s.command, uid)).toMatchObject({ status: "recorded", replayed: true }); expect(s.execute).toHaveBeenCalledTimes(calls);
});
it("expiry during final writes rolls the entire registration back", async () => {
  const s = setup(), before = s.snapshot(); s.fault.expireAfterAudit = true;
  expect(await s.service.apply(s.command, uid)).toMatchObject({ status: "held", reason: "AUTHORITY_EXPIRED" }); expect(s.snapshot()).toEqual(before);
});
it("revoke after source change/review expiry uses current permissions and preserves historical changed receipt", async () => {
  const s = setup(), result = await s.service.apply(s.command, uid), c = revoke(s.command, result);
  s.row.priceYen += BigInt(1); vi.setSystemTime(new Date(s.f.review.expiresAt));
  for (const kind of ["operator", "reviewer"]) s.editHead(kind, p => { p.validUntil = "2026-10-27T00:00:00.000Z"; });
  s.editHead("operator", p => { p.data.canApply = false; });
  const revoked = await s.service.apply(c, uid); expect(revoked).toMatchObject({ status: "recorded", event: "revoked", revision: 2 });
  expect(await s.service.apply(c, uid)).toMatchObject({ ...revoked, replayed: true });
  expect(await s.service.reconcile(s.command, uid)).toMatchObject({ status: "recorded", event: "registered", current: "changed" });
  expect(await s.service.apply({ ...c, requestId: randomUUID() }, uid)).toMatchObject({ reason: "REVIEW_HEAD_CONFLICT" });
  expect(await s.service.apply(revoke(s.command, revoked), uid)).toMatchObject({ event: "already_revoked", revision: 2 });
  expect(await s.service.apply({ ...s.command, requestId: randomUUID() }, uid)).toMatchObject({ reason: "REVIEW_REFERENCE_EXISTS" });
});
it("reused request ID with altered CAS/actor is a conflict and read revocation prevents recovery", async () => {
  const s = setup(); const result = await s.service.apply(s.command, uid);
  expect(await s.service.apply({ ...revoke(s.command, result), requestId: s.command.requestId }, uid)).toMatchObject({ reason: "REQUEST_CONFLICT" });
  expect(await s.service.reconcile(s.command, randomUUID())).toMatchObject({ reason: "REQUEST_CONFLICT" });
  s.editHead("operator", p => { p.data.canRead = false; });
  expect(await s.service.reconcile(s.command, uid)).toMatchObject({ reason: "REVIEW_NOT_AUTHORIZED" });
});
it("revocation audit failure/permission expiry leave the active head intact", async () => {
  const s = setup(), registered = await s.service.apply(s.command, uid), c = revoke(s.command, registered), before = s.snapshot();
  s.fault.afterAudit = true; expect(await s.service.apply(c, uid)).toMatchObject({ status: "unknown" }); expect(s.snapshot()).toEqual(before);
  s.fault.afterAudit = false; s.fault.expireAfterAudit = true;
  expect(await s.service.apply(c, uid)).toMatchObject({ reason: "AUTHORITY_EXPIRED" }); expect(s.snapshot()).toEqual(before);
});
it("clock reversal during revocation audit cannot commit outside the checked authority interval", async () => {
  const s = setup(), registered = await s.service.apply(s.command, uid), before = s.snapshot();
  s.fault.clockBackAfterAudit = true;
  expect(await s.service.apply(revoke(s.command, registered), uid)).toMatchObject({ reason: "AUTHORITY_EXPIRED" }); expect(s.snapshot()).toEqual(before);
});
it.each([401, 403, 503] as const)("HTTP %s authorization precedes body/store access", async status => {
  const store = { apply: vi.fn(), reconcile: vi.fn() }, handler = createMailReviewHttpHandler({ authorize: async () => ({ status }), store });
  expect((await handler(new Request("https://example.test", { method: "POST", body: "invalid" }), "invalid", "apply")).status).toBe(status);
  expect(store.apply).not.toHaveBeenCalled();
});
it("HTTP rejects actor/raw approval injection, target mismatch, oversize and disabled store; only auth UID reaches store", async () => {
  const s = setup(), handler = createMailReviewHttpHandler({ authorize: async () => ({ uid }), store: s.service });
  const req = (body: unknown) => new Request("https://example.test", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  for (const body of [{ ...s.command, actorRef: "admin:other" }, { ...s.command, record: s.f.review }, { ...s.command, approved: true }, { large: "x".repeat(4096) }]) {
    expect((await handler(req(body), s.command.propertyId, "apply")).status).toBe(400);
  }
  expect((await handler(req(s.command), randomUUID(), "apply")).status).toBe(409);
  expect(s.transaction).not.toHaveBeenCalled();
  const disabled = createMailReviewHttpHandler({ authorize: async () => ({ uid }) });
  expect((await disabled(req(s.command), s.command.propertyId, "apply")).status).toBe(503);
  const response = await handler(req(s.command), s.command.propertyId, "apply"); expect(response.status).toBe(200);
  expect(response.headers.get("cache-control")).toBe("no-store"); expect(JSON.stringify(await response.json())).not.toMatch(/PRIVATE_|patchJson|companyIncome/);
});
it("HTTP response allowlist rejects nested private data and mismatched request receipts", async () => {
  const s = setup(), good = await s.service.apply(s.command, uid);
  for (const result of [{ ...good, internal: { ad: "PRIVATE_AD" } }, { ...good, requestId: randomUUID() }]) {
    const handler = createMailReviewHttpHandler({ authorize: async () => ({ uid }), store: { apply: async () => result, reconcile: async () => result } });
    const response = await handler(new Request("https://example.test", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(s.command) }), s.command.propertyId, "apply");
    expect(response.status).toBe(503); expect(JSON.stringify(await response.json())).not.toMatch(/PRIVATE_AD|internal/);
  }
});
it("inspection returns only current head metadata, preserves expired/revoked state, and requires current owner read authority", async () => {
  const s = setup(), ref = { propertyId: s.command.propertyId, reviewRef: s.command.reviewRef, reviewHash: s.command.reviewHash };
  expect(await s.service.inspect(ref, uid)).toEqual({ status: "unavailable" });
  const saved = await s.service.apply(s.command, uid), before = s.snapshot();
  expect(await s.service.inspect(ref, uid)).toMatchObject({ status: "present", revision: 1, reviewStatus: "active" });
  expect(s.snapshot()).toEqual(before); expect(await s.service.inspect(ref, randomUUID())).toEqual({ status: "unavailable" });
  await s.service.apply(revoke(s.command, saved), uid);
  expect(await s.service.inspect(ref, uid)).toMatchObject({ status: "present", revision: 2, reviewStatus: "revoked" });
  s.editHead("operator", p => { p.data.canRead = false; });
  expect(await s.service.inspect(ref, uid)).toEqual({ status: "unavailable" });
});
