import { beforeEach, expect, it, vi } from "vitest";
import { Prisma, type PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { createPropertyWriteRequests } from "../db/property-write-requests";
import { createPropertyRepository, PropertyWriteConflictError } from "../db/property-repository";
import { fixture as rentalFixture } from "../rental-import/__tests__/fixtures";

const id = "00000000-0000-4000-8000-000000000001", at = "2026-10-25T12:00:00.000Z";
function fixture() {
  const input = { ...rentalFixture().property, status: "draft" as const };
  let row = { ...input, id, priceYen: BigInt(input.priceYen), createdAt: new Date(at), updatedAt: new Date(at) };
  let receipt: Record<string, unknown> | undefined;
  const fault = { afterInsert: false, lostReply: false, missing: false, hiddenReceiptId: false };
  const updateMany = vi.fn(async ({ where, data }) => {
    if (where.updatedAt.getTime() !== row.updatedAt.getTime() || (where.id && where.id !== id) || (where.slug && where.slug !== row.slug)) return { count: 0 };
    const converted = { ...data }; for (const key of ["internal", "translations"]) if (converted[key] === Prisma.JsonNull) converted[key] = null;
    row = { ...row, ...converted }; return { count: 1 };
  });
  const property = { findUnique: vi.fn(async () => fault.missing ? null : structuredClone(row)), updateMany, create: vi.fn(), update: vi.fn(), upsert: vi.fn() };
  const tx = { property, $queryRaw: vi.fn(async (query: Prisma.Sql) => {
    if (query.sql.includes("pg_advisory")) return [{ locked: true }];
    if (query.sql.includes("FROM public.properties")) return fault.missing ? [] : [{ id }];
    return receipt ? [structuredClone(receipt)] : [];
  }), $executeRaw: vi.fn(async (query: Prisma.Sql) => {
    if (fault.hiddenReceiptId) throw new Prisma.PrismaClientKnownRequestError("PRIVATE_SQL_ERROR", { code: "P2010", clientVersion: "6.19.3", meta: { code: "23505" } });
    const [request_id, property_id, request_hash, expected_version, result_version, result_hash, outcome, reason, initiator_hash] = query.values;
    receipt = { request_id, property_id, request_hash, expected_version, result_version, result_hash, outcome, reason, initiator_hash };
    if (fault.afterInsert) throw new Error("PRIVATE_CANARY_DRIVER_SECRET"); return 1;
  }) };
  const transaction = vi.fn(async (run: (client: Prisma.TransactionClient) => Promise<unknown>) => {
    const before = structuredClone(row), oldReceipt = structuredClone(receipt);
    let value;
    try { value = await run(tx as unknown as Prisma.TransactionClient); }
    catch (e) { row = before; receipt = oldReceipt; throw e; }
    if (fault.lostReply) { fault.lostReply = false; throw new Error("PRIVATE_CANARY_COMMIT_REPLY"); }
    return value;
  });
  const store = createPropertyWriteRequests({ $transaction: transaction } as unknown as Pick<PrismaClient, "$transaction">);
  const repo = createPropertyRepository({ property } as unknown as Pick<PrismaClient, "property">);
  return { store, repo, fault, property, tx, transaction, input, snapshot: () => structuredClone({ row, receipt }), receipt: () => receipt! };
}
const request = (patch = { title: "Synthetic changed" } as Record<string, unknown>) => ({ requestId: randomUUID(), propertyId: id, actorRef: "synthetic-operator", expectedUpdatedAt: at, patchJson: JSON.stringify(patch) });
beforeEach(() => vi.restoreAllMocks());

it.each([{ expectedUpdatedAt: "invalid" }, { actorRef: "" }, { patchJson: '{"updatedAt":"2027-01-01"}' }, { patchJson: "{}" }, { patchJson: '{"priceYen":9007199254740992}' }, { patchJson: '{"images":[{"url":"x","alt":{"internal":"private"}}]}' }])("invalid envelope/patch never opens SQL: %j", async patch => {
  const f = fixture(); expect(await f.store.apply({ ...request(), ...patch })).toEqual({ status: "held", reason: "INVALID_REQUEST" }); expect(f.transaction).not.toHaveBeenCalled();
});
it("same ID/normalized patch replays without writing; changed actor/content/version is rejected", async () => {
  const f = fixture(), r = request({ title: "Synthetic", priceNote: null });
  expect(await f.store.apply(r)).toMatchObject({ status: "applied", replayed: false, current: "matches" });
  const saved = f.snapshot();
  expect(await f.store.apply({ ...r, patchJson: '{ "priceNote": null, "title": "Synthetic" }' })).toMatchObject({ status: "applied", replayed: true });
  expect(await f.store.apply({ ...r, requestId: r.requestId.toUpperCase() })).toMatchObject({ requestId: r.requestId, replayed: true });
  for (const patch of [{ actorRef: "another" }, { propertyId: randomUUID() }, { expectedUpdatedAt: "2026-10-25T12:00:01.000Z" }, { patchJson: '{"title":"changed"}' }]) {
    expect(await f.store.apply({ ...r, ...patch })).toEqual({ status: "held", reason: "REQUEST_ID_CONFLICT" });
  }
  expect(f.snapshot()).toEqual(saved); expect(f.property.updateMany).toHaveBeenCalledTimes(1);
  expect(JSON.stringify(f.receipt())).not.toContain("Synthetic");
});
it("recovery after a later edit or missing current property reports past success separately", async () => {
  const f = fixture(), r = request(); await f.store.apply(r);
  const saved = await f.repo.getPropertyById(id); await f.repo.updateProperty(id, { title: "Later manual edit" }, saved!.updatedAt!);
  expect(await f.store.reconcile(r)).toMatchObject({ status: "applied", replayed: true, current: "changed" });
  f.fault.missing = true;
  expect(await f.store.reconcile(r)).toMatchObject({ status: "applied", current: "missing" });
  expect(f.tx.$executeRaw).toHaveBeenCalledTimes(1);
});
it("receipt insert failure rolls back both; missing receipt is unknown, same ID can be retried", async () => {
  const f = fixture(), r = request(), before = f.snapshot(); f.fault.afterInsert = true;
  expect(await f.store.apply(r)).toEqual({ status: "unknown", reason: "STORE_OUTCOME_UNKNOWN" }); expect(f.snapshot()).toEqual(before);
  expect(await f.store.reconcile(r)).toEqual({ status: "unknown", reason: "REQUEST_NOT_OBSERVED" });
  f.fault.afterInsert = false; expect(await f.store.apply(r)).toMatchObject({ status: "applied" });
});
it("lost commit reply preserves one receipt and same-ID readback/replay does not save again", async () => {
  const f = fixture(), r = request(); f.fault.lostReply = true;
  expect(await f.store.apply(r)).toEqual({ status: "unknown", reason: "STORE_OUTCOME_UNKNOWN" });
  expect(await f.store.reconcile(r)).toMatchObject({ status: "applied", current: "matches" });
  expect(await f.store.apply(r)).toMatchObject({ replayed: true }); expect(f.property.updateMany).toHaveBeenCalledTimes(1); expect(f.tx.$executeRaw).toHaveBeenCalledTimes(1);
});
it("stale request is held with an immutable outcome even if resubmitted", async () => {
  const f = fixture(), r = { ...request(), expectedUpdatedAt: "2026-10-24T12:00:00.000Z" };
  expect(await f.store.apply(r)).toMatchObject({ status: "held", reason: "VERSION_CONFLICT", replayed: false });
  expect(await f.store.apply(r)).toMatchObject({ status: "held", reason: "VERSION_CONFLICT", replayed: true });
  expect(f.property.updateMany).not.toHaveBeenCalled();
});
it("ID-only inspection confirms a held commit after reply loss without reading or writing the property", async () => {
  const f = fixture(), r = { ...request(), expectedUpdatedAt: "2026-10-24T12:00:00.000Z" };
  f.fault.lostReply = true; expect(await f.store.apply(r)).toMatchObject({ status: "unknown" });
  const saved = f.snapshot(), reads = f.property.findUnique.mock.calls.length;
  expect(await f.store.inspectHeld({ propertyId: id, requestId: r.requestId.toUpperCase(), actorRef: r.actorRef })).toEqual({ propertyId: id, requestId: r.requestId, reason: "VERSION_CONFLICT", resultVersion: at });
  expect(f.snapshot()).toEqual(saved); expect(f.property.findUnique).toHaveBeenCalledTimes(reads); expect(f.tx.$executeRaw).toHaveBeenCalledTimes(1);
  expect(f.tx.$queryRaw.mock.lastCall![0].sql).not.toMatch(/FOR UPDATE|pg_advisory/);
  expect(JSON.stringify(f.receipt())).not.toContain(r.actorRef);
});
it("foreign, unknown, legacy, applied or corrupt receipts never authorize reference removal", async () => {
  const f = fixture(), r = { ...request(), expectedUpdatedAt: "2026-10-24T12:00:00.000Z" }, ref = { propertyId: id, requestId: r.requestId, actorRef: r.actorRef };
  expect(await f.store.inspectHeld(ref)).toBeNull(); await f.store.apply(r);
  for (const override of [{ propertyId: randomUUID() }, { requestId: randomUUID() }, { actorRef: "foreign" }, { actorRef: "" }, { patchJson: "{}" }]) expect(await f.store.inspectHeld({ ...ref, ...override })).toBeNull();
  const receipt = structuredClone(f.receipt());
  for (const override of [{ initiator_hash: null }, { outcome: "applied" }, { reason: "SAVED" }, { reason: "REQUEST_ID_CONFLICT" }, { result_hash: "bad" }]) {
    Object.assign(f.receipt(), receipt, override); expect(await f.store.inspectHeld(ref)).toBeNull();
  }
  Object.assign(f.receipt(), receipt, { initiator_hash: null });
  expect(await f.store.reconcile(r)).toMatchObject({ status: "held", reason: "VERSION_CONFLICT", replayed: true });
  expect(f.receipt().initiator_hash).toBeNull(); expect(f.tx.$executeRaw).toHaveBeenCalledTimes(1);
});
it("public text gate is checked before saving and receipt contains no rejected text", async () => {
  const f = fixture();
  expect(await f.store.apply(request({ status: "published", description: "AD100 当社報酬 元付" }))).toMatchObject({ status: "held", reason: "PUBLICATION_GATE_REJECTED" });
  expect(f.property.updateMany).not.toHaveBeenCalled(); expect(JSON.stringify(f.receipt())).not.toMatch(/AD100|当社報酬|元付/);
});
it("invalid receipt is never treated as proof of success", async () => {
  const f = fixture(), r = request(); await f.store.apply(r); f.receipt().result_version = new Date(at);
  expect(await f.store.reconcile(r)).toEqual({ status: "held", reason: "RECEIPT_INTEGRITY_ERROR" });
});
it("formerly unconditional helpers require caller version and never use update/upsert fallback", async () => {
  const f = fixture(), before = f.snapshot();
  await expect(f.repo.updateProperty(id, { title: "unsafe" }, undefined as unknown as string)).rejects.toBeInstanceOf(PropertyWriteConflictError);
  await expect(f.repo.upsertPropertyBySlug(before.row.slug, f.input, undefined as unknown as string)).rejects.toBeInstanceOf(PropertyWriteConflictError);
  expect(f.snapshot()).toEqual(before); expect(f.property.findUnique).not.toHaveBeenCalled();
  await f.repo.updateProperty(id, { title: "safe" }, at);
  await expect(f.repo.updateProperty(id, { title: "stale" }, at)).rejects.toBeInstanceOf(PropertyWriteConflictError);
  expect(f.property.update).not.toHaveBeenCalled(); expect(f.property.upsert).not.toHaveBeenCalled();
});
it("create-only unique collision never replaces an existing row", async () => {
  const f = fixture(), before = f.snapshot();
  f.property.findUnique.mockResolvedValue(null);
  f.property.create.mockRejectedValue(new Prisma.PrismaClientKnownRequestError("hidden", { code: "P2002", clientVersion: "6.19.3" }));
  await expect(f.repo.upsertPropertyBySlug(before.row.slug, f.input, null)).rejects.toBeInstanceOf(PropertyWriteConflictError);
  expect(f.property.updateMany).not.toHaveBeenCalled(); expect(f.snapshot()).toEqual(before);
});
it("a UUID collision with an RLS-hidden receipt rolls back the property and returns conflict", async () => {
  const f = fixture(), before = f.snapshot(); f.fault.hiddenReceiptId = true;
  expect(await f.store.apply(request())).toEqual({ status: "held", reason: "REQUEST_ID_CONFLICT" });
  expect(f.snapshot()).toEqual(before);
});

it("image SQL accepts timestamp(3) snapshots as UTC and rejects ambiguous/invalid dates", async () => {
  const { buildBrowserImageUpdateSql } = await import("../rental-import/image-repair");
  const manifest = { slug: "rent-synthetic", provider: "eslife" as const, roomId: "synthetic", sourceUrl: "https://rent.es-square.net/room/synthetic", expectedCount: 1, visualReviewComplete: true as const, entries: [{ index: 0, file: "synthetic", kind: "photo" as const, alt: "Synthetic" }] };
  const target = { id, slug: manifest.slug, provider: manifest.provider, roomId: manifest.roomId, status: "draft", images: [], updatedAt: at };
  const sql = buildBrowserImageUpdateSql(target, manifest, []);
  for (const updatedAt of [at.slice(0, -1), at.slice(0, -1).replace("T", " "), "2026-10-25T21:00:00.000+09:00"]) expect(buildBrowserImageUpdateSql({ ...target, updatedAt }, manifest, [])).toBe(sql);
  for (const updatedAt of ["2026-10-25", "2026-02-30T12:00:00.000", "tomorrow"]) expect(() => buildBrowserImageUpdateSql({ ...target, updatedAt }, manifest, [])).toThrow("INVALID_EXPECTED_VERSION");
});
