import { beforeEach, afterEach, expect, it, vi } from "vitest";
import type { Prisma, PrismaClient } from "@prisma/client";
import { createDbReviewedMailStore } from "../db/reviewed-mail-store";
import { reviewedMailFixture } from "../property-sync/__tests__/reviewed-mail-fixture";
import { reviewedMailAuthorityFixture } from "../property-sync/__tests__/reviewed-mail-authority-fixture";
import { contentHash } from "../property-sync/rules";
const at = "2026-10-26T02:00:00.000Z";
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date(at)); });
afterEach(() => vi.useRealTimers());
function setup() {
  const r = reviewedMailFixture(at).review, f = reviewedMailAuthorityFixture(r);
  const query = vi.fn(async (q: Prisma.Sql) => q.sql.includes("mail_review_records") ? [structuredClone(f.recordRow)] :
    f.headRows.filter(h => q.values.includes(h.kind) && q.values.includes(h.scope_key)).map(h => structuredClone(h)));
  const tx = { $queryRaw: query } as unknown as Prisma.TransactionClient;
  const transaction = vi.fn(async (run: (tx: Prisma.TransactionClient) => Promise<unknown>) => run(tx));
  const store = createDbReviewedMailStore({ $transaction: transaction } as unknown as Pick<PrismaClient, "$transaction">);
  const edit = (kind: string, change: (h: Record<string, unknown>) => void) => {
    const row = f.headRows.find(h => h.kind === kind)!; const v = JSON.parse(row.payload_json); change(v);
    row.revision++; row.payload_json = JSON.stringify(v); row.payload_hash = contentHash(v);
  };
  return { r, f, query, tx, transaction, store, edit, locked: () => store.lockCurrent(tx, f.reference), read: () => store.readImmutable(f.reference) };
}
it("loads immutable owner-scoped command and locks all current heads before returning an approved record", async () => {
  const s = setup(); expect(await s.read()).toEqual(s.r); expect(await s.locked()).toEqual(s.r);
  const sql = s.query.mock.calls.filter(([q]) => q.sql.includes("mail_authority_heads"));
  expect(sql).toHaveLength(2); for (const [q] of sql) expect(q.sql).toMatch(/ORDER BY[\s\S]*FOR SHARE/);
  expect(sql[1][0].values).toHaveLength(16);
});
it("revoked write permission preserves receipt recovery while read revocation denies both", async () => {
  const s = setup(); s.edit("operator", h => { (h.data as { canApply: boolean }).canApply = false; });
  expect(await s.read()).toEqual(s.r); expect(await s.locked()).toBeNull();
  s.edit("operator", h => { (h.data as { canRead: boolean }).canRead = false; });
  expect(await s.read()).toBeNull(); expect(await s.locked()).toBeNull();
});
it("review expiry/revocation never rewrites the retained original command", async () => {
  const s = setup(); s.edit("review", h => { h.status = "revoked"; });
  expect(await s.locked()).toBeNull(); expect(await s.read()).toEqual(s.r);
  vi.setSystemTime(new Date(Date.parse(s.r.expiresAt) + 1));
  s.edit("operator", h => { h.validUntil = "2026-10-30T00:00:00.000Z"; });
  expect(await s.read()).toEqual(s.r); expect(await s.locked()).toBeNull();
});
it.each(["reviewer", "episode", "review", "rules", "policies", "permissions", "materials"])("%s head change rejects an old review despite a matching record hash", async kind => {
  const s = setup(); s.edit(kind, h => { h.data = {}; }); expect(await s.locked()).toBeNull();
});
it.each(["operator", "reviewer", "episode", "review", "rules", "policies", "permissions", "materials"])("missing %s head holds without fallback to record approval", async kind => {
  const s = setup(); s.f.headRows = s.f.headRows.filter(h => h.kind !== kind); expect(await s.locked()).toBeNull();
});
it.each(["short-window", "future", "expired", "revoked", "hash", "duplicate", "precision", "row-scope"])("%s authority input fails closed", async kind => {
  const s = setup(), row = s.f.headRows.find(h => h.kind === "review")!;
  if (kind === "short-window") s.edit("review", h => { h.validUntil = new Date(Date.parse(s.r.expiresAt) - 1).toISOString(); });
  if (kind === "future") s.edit("review", h => { h.validFrom = new Date(Date.parse(at) + 1).toISOString(); });
  if (kind === "expired") s.edit("review", h => { h.validFrom = "2026-10-25T00:00:00.000Z"; h.validUntil = at; });
  if (kind === "revoked") s.edit("review", h => { h.status = "revoked"; });
  if (kind === "hash") row.payload_hash = "f".repeat(64);
  if (kind === "duplicate") row.payload_json = row.payload_json.replace('"schemaVersion":1', '"schemaVersion":1,"schemaVersion":1');
  if (kind === "precision") row.payload_json = row.payload_json.replace('"schemaVersion":1', '"schemaVersion":1.0000000000000000001');
  if (kind === "row-scope") row.scope_key = "foreign-review";
  if (["duplicate", "precision"].includes(kind)) await expect(s.locked()).rejects.toThrow(); else expect(await s.locked()).toBeNull();
});
it.each(["version", "reviewer", "missing-asset", "duplicate-asset", "future", "payload", "not-cleared"])("material %s cannot be accepted as a verified inventory", async kind => {
  const s = setup(); s.edit("materials", h => {
    const m = h.data as { publicPayload: { hash: string }; assets: Array<Record<string, unknown>> };
    if (kind === "version") delete m.assets[0].storageVersionRef;
    if (kind === "reviewer") m.assets[0].reviewerRef = "unapproved-reviewer";
    if (kind === "missing-asset") m.assets.pop();
    if (kind === "duplicate-asset") m.assets.push(m.assets[0]);
    if (kind === "future") m.assets[0].checkedAt = new Date(Date.parse(at) + 1).toISOString();
    if (kind === "payload") m.publicPayload.hash = "f".repeat(64);
    if (kind === "not-cleared") m.assets[0].status = "unreviewed";
  }); expect(await s.locked()).toBeNull();
});
it("column and body bindings are checked even if a faulty query exposes another owner's record", async () => {
  const s = setup(); s.f.recordRow.operator_ref = "foreign-operator"; expect(await s.read()).toBeNull();
  s.f.recordRow.operator_ref = s.r.operatorRef; s.f.recordRow.record_json = s.f.recordRow.record_json.replace('"schemaVersion":1', '"schemaVersion":1,"schemaVersion":1');
  await expect(s.read()).rejects.toThrow("DUPLICATE_JSON_KEY");
  expect(await s.store.readImmutable({ ...s.f.reference, operatorRef: "foreign-operator" })).toBeNull();
});
it("permissions and future rule history cannot be truncated while retaining a reviewed hash", async () => {
  const s = setup(); s.edit("rules", h => {
    const d = h.data as { history: unknown[] }; d.history.push({ ...s.r.plan.rule, status: "pending" });
  }); expect(await s.locked()).toBeNull();
});
it("read grant expiry during record I/O is checked after the read", async () => {
  const s = setup(), original = s.query.getMockImplementation()!;
  s.query.mockImplementation(async q => { const result = await original(q); if (q.sql.includes("mail_review_records")) vi.setSystemTime(new Date(s.r.expiresAt)); return result; });
  expect(await s.read()).toBeNull();
});
it("a hash-valid outer record cannot conceal duplicate keys inside the retained patch JSON", async () => {
  const s = setup(); s.r.patchJson = '{"title":"a","title":"b"}';
  s.f.reference.reviewHash = contentHash(s.r); s.f.recordRow.review_hash = contentHash(s.r); s.f.recordRow.record_json = JSON.stringify(s.r);
  await expect(s.read()).rejects.toThrow("DUPLICATE_JSON_KEY");
});
