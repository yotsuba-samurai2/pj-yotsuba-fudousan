import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Prisma, type PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { createReviewedMailImport, type ReviewedMailStore, type ReviewedMailRecord } from "../db/reviewed-mail-import";
import { createPropertyWriteRequests } from "../db/property-write-requests";
import { reviewedMailFixture, syntheticMailId as id } from "../property-sync/__tests__/reviewed-mail-fixture";
import { contentHash } from "../property-sync/rules";
import { rentalPublicationError } from "../rental-import/publication";
import { importRental, type RentalStore } from "../rental-import/lifecycle";
import type { RentalImport } from "../rental-import/validation";
import { toPublicProperty } from "../property-shared";

const at = "2026-10-26T02:00:00.000Z", actor = "synthetic-operator", origin = "https://demo.supabase.co";
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date(at)); vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", origin); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });
function setup(edit?: (r: ReviewedMailRecord) => void) {
  const f = reviewedMailFixture(at); if (edit) edit(f.review);
  const active = structuredClone(f.review);
  let row = { ...f.base, priceYen: BigInt(f.base.priceYen), createdAt: new Date(f.base.createdAt), updatedAt: new Date(f.base.updatedAt) };
  let receipts = new Map<string, Record<string, unknown>>(), effects = new Map<string, unknown>();
  const fault = { afterReceipt: false, lostReply: false, onTransaction: undefined as (() => void) | undefined };
  const raw = () => JSON.stringify(row, (_, v) => typeof v === "bigint" ? Number(v) : v);
  const property = { findUnique: vi.fn(async () => structuredClone(row)), updateMany: vi.fn(async ({ where, data }) => {
    if (where.id !== row.id || where.updatedAt.getTime() !== row.updatedAt.getTime()) return { count: 0 };
    for (const k of ["internal", "translations"]) if (data[k] === Prisma.JsonNull) data[k] = null;
    row = { ...row, ...data }; return { count: 1 };
  }) };
  const tx = { property, $queryRaw: vi.fn(async (q: Prisma.Sql) => {
    if (q.sql.includes("pg_advisory")) return [{ locked: true }];
    if (q.sql.includes("AS record_json")) return [{ record_json: raw() }];
    if (q.sql.includes("FROM public.properties")) return [{ id: row.id }];
    return receipts.has(String(q.values[0])) ? [structuredClone(receipts.get(String(q.values[0])))] : [];
  }), $executeRaw: vi.fn(async (q: Prisma.Sql) => {
    if (q.sql.includes("INSERT INTO public.property_write_receipts")) {
      const keys = ["request_id", "property_id", "request_hash", "expected_version", "result_version", "result_hash", "outcome", "reason", "initiator_hash"];
      receipts.set(String(q.values[0]), Object.fromEntries(keys.map((k, i) => [k, q.values[i]])));
      if (fault.afterReceipt) throw new Error("PRIVATE_RECEIPT_FAILURE");
    } else if (q.sql.includes("INSERT INTO public.property_publication_effects")) effects.set(String(q.values[0]), q.values[1]);
    else throw new Error("UNEXPECTED_TEST_SQL");
    return 1;
  }) };
  const transaction = vi.fn(async (run: (tx: Prisma.TransactionClient) => Promise<unknown>) => {
    fault.onTransaction?.();
    const before = structuredClone({ row, receipts, effects }); let result;
    try { result = await run(tx as unknown as Prisma.TransactionClient); } catch (e) { ({ row, receipts, effects } = before); throw e; }
    if (fault.lostReply) { fault.lostReply = false; throw new Error("PRIVATE_COMMIT_REPLY"); }
    return result;
  });
  const prisma = { $transaction: transaction } as unknown as Pick<PrismaClient, "$transaction">;
  const store = { readImmutable: vi.fn(async () => structuredClone(f.review)), lockCurrent: vi.fn(async () => structuredClone(active)) } satisfies ReviewedMailStore;
  const service = createReviewedMailImport(prisma, store, origin);
  const request = { requestId: randomUUID(), reviewRef: f.review.reviewRef, reviewHash: contentHash(f.review) };
  return { f, request, service, prisma, store, fault, property, tx, transaction, snapshot: () => structuredClone({ row, receipts, effects }),
    changeCurrent: (edit: (r: ReviewedMailRecord) => void) => edit(active), editWithoutVersion: (patch: Record<string, unknown>) => { Object.assign(row, patch); } };
}

it("approved synthetic input passes all gates, keeps the existing ID/slug/status and isolates internal evidence", async () => {
  const f = setup(), result = await f.service.apply(f.request, id, actor);
  expect(result).toMatchObject({ status: "applied", current: "matches" });
  const saved = f.snapshot(); expect(saved.row).toMatchObject({ id, slug: f.f.base.slug, status: "draft", priceYen: BigInt(120000) });
  expect(saved.row.internal.operatorMemo).toBe("PRIVATE_ORIGINAL_MEMO"); expect(saved.effects.size).toBe(1);
  expect(JSON.stringify([result, [...saved.receipts.values()], [...saved.effects.values()], toPublicProperty(f.f.next)])).not.toMatch(/PRIVATE_|companyIncome|reviewerRef/);
  expect(await f.service.apply(f.request, id, actor)).toMatchObject({ replayed: true });
  expect(f.store.lockCurrent).toHaveBeenCalledTimes(1); expect(f.property.updateMany).toHaveBeenCalledTimes(1);
});

it("unconfigured adapter, wrong owner/property or client-provided facts cannot reach a writer", async () => {
  const f = setup();
  expect(await createReviewedMailImport(f.prisma).apply(f.request, id, actor)).toMatchObject({ reason: "REVIEWED_MAIL_STORE_UNCONFIGURED" });
  for (const request of [{ ...f.request, confirmed: true }, { ...f.request, patchJson: "{}" }]) expect(await f.service.apply(request, id, actor)).toMatchObject({ reason: "INVALID_REVIEWED_MAIL_REQUEST" });
  expect(await f.service.apply(f.request, id, "foreign-operator")).toMatchObject({ reason: "REVIEWED_MAIL_REFERENCE_MISMATCH" });
  expect(await f.service.apply(f.request, randomUUID(), actor)).toMatchObject({ reason: "REVIEWED_MAIL_REFERENCE_MISMATCH" });
  expect(f.transaction).not.toHaveBeenCalled();
});

it.each(["revoked", "episode", "rule", "permission", "asset-review"])("%s changes after immutable read are rejected inside the transaction", async kind => {
  const f = setup(); f.fault.onTransaction = () => f.changeCurrent(r => {
    if (kind === "revoked") r.status = "revoked";
    if (kind === "episode") r.match.target.episodeId = "later-episode";
    if (kind === "rule") (r.ruleHistory as Array<{ status: string }>)[0].status = "revoked";
    if (kind === "permission") (r.permissions as Array<{ status: string }>)[0].status = "revoked";
    if (kind === "asset-review") r.assets[0].hash = "f".repeat(64);
  });
  expect(await f.service.apply(f.request, id, actor)).toMatchObject({ status: "held", reason: "PUBLICATION_GATE_REJECTED" });
  expect(f.property.updateMany).not.toHaveBeenCalled(); expect(f.snapshot().effects.size).toBe(0);
});

it.each(["missing-income", "income-below", "income-mismatch", "old-update", "update-basis", "area", "field-normalization", "fixed-lease", "applied", "photo-denied", "missing-photo-grant", "wrong-payload", "wrong-image", "wrong-media", "client-rule", "slug-change", "status-change", "private-overwrite"])("%s cannot be promoted by an approved review flag", async kind => {
  const f = setup(r => {
    const rental = r.rental as RentalImport;
    if (kind === "missing-income") delete rental.companyIncome;
    if (kind === "income-below") rental.companyIncome!.totalYen = 199999;
    if (kind === "income-mismatch") (r.income as { totalYen: number }).totalYen = 300000;
    if (kind === "old-update") r.fields.sourcePropertyUpdate!.updatedAt = new Date(Date.parse(at) - 336 * 3600_000 - 1).toISOString();
    if (kind === "update-basis") r.fields.sourcePropertyUpdate!.basis = "retrieved_at";
    if (kind === "area") r.fields.areaSqm = 46.9;
    if (kind === "field-normalization") r.fields.normalization = "unconfirmed";
    if (kind === "fixed-lease") r.fields.leaseType = "fixed";
    if (kind === "applied") rental.source.applicationStatus = "applied";
    if (kind === "photo-denied") rental.photoPermission!.status = "denied";
    if (kind === "missing-photo-grant") r.permissions = (r.permissions as Array<{ assetId?: string }>).filter(p => p.assetId !== r.assets[0].assetId);
    if (kind === "wrong-payload") r.manifest.publicPayload.hash = "f".repeat(64);
    if (kind === "wrong-image") r.assets[0].url = "https://foreign.invalid/photo.jpg";
    if (kind === "wrong-media") r.plan.binding.media = "athome";
    if (kind === "client-rule") r.plan.scope = { ...r.plan.scope, audience: "client", clientRef: "individual-customer" };
    const patch = JSON.parse(r.patchJson);
    if (kind === "slug-change") patch.slug = "wrong-existing-slug";
    if (kind === "status-change") patch.status = "published";
    if (kind === "private-overwrite") delete patch.internal.operatorMemo;
    r.patchJson = JSON.stringify(patch);
  });
  expect(await f.service.apply(f.request, id, actor)).toMatchObject({ status: "held", reason: "PUBLICATION_GATE_REJECTED" });
  expect(f.property.updateMany).not.toHaveBeenCalled();
});

it("same timestamp edit cannot be overwritten by a still-approved intake", async () => {
  const f = setup(); f.editWithoutVersion({ description: "Manual edit retained" });
  expect(await f.service.apply(f.request, id, actor)).toMatchObject({ reason: "VERSION_CONFLICT" }); expect(f.store.lockCurrent).not.toHaveBeenCalled();
  expect(f.snapshot().row.description).toBe("Manual edit retained");
});

it("plan expiry during the final source read blocks a new save even while review is still valid", async () => {
  const f = setup(r => { r.plan.expiresAt = new Date(Date.parse(at) + 1000).toISOString(); });
  const original = f.tx.$queryRaw.getMockImplementation()!; let reads = 0;
  f.tx.$queryRaw.mockImplementation(async q => {
    if (q.sql.includes("AS record_json") && ++reads === 3) vi.setSystemTime(new Date(Date.parse(at) + 2000));
    return original(q);
  });
  expect(await f.service.apply(f.request, id, actor)).toMatchObject({ status: "held", reason: "PUBLICATION_GATE_REJECTED" });
  expect(f.property.updateMany).not.toHaveBeenCalled();
});

it("an unchanged protected listing can still be closed safely through normal CAS, without stripping review", async () => {
  const f = setup(); await f.service.apply(f.request, id, actor); f.editWithoutVersion({ status: "published" });
  const current = f.snapshot().row;
  const writer = createPropertyWriteRequests(f.prisma);
  const request = { requestId: randomUUID(), propertyId: id, actorRef: actor, expectedUpdatedAt: current.updatedAt.toISOString(), patchJson: '{"status":"closed"}' };
  expect(await writer.apply(request)).toMatchObject({ status: "applied" });
  expect(f.snapshot().row.internal.reviewedMailImport).toEqual(current.internal.reviewedMailImport);
  expect(await writer.apply({ ...request, requestId: randomUUID(), expectedUpdatedAt: f.snapshot().row.updatedAt.toISOString(), patchJson: '{"status":"published"}' })).toMatchObject({ status: "held" });
});

it("lost response recovers after expiry and revocation without executing the review gates or sending again", async () => {
  const f = setup(); f.fault.lostReply = true;
  expect(await f.service.apply(f.request, id, actor)).toMatchObject({ status: "unknown" });
  vi.setSystemTime(new Date(Date.parse(at) + 8 * 86_400_000)); f.changeCurrent(r => { r.status = "revoked"; });
  expect(await f.service.reconcile(f.request, id, actor)).toMatchObject({ status: "applied", replayed: true });
  expect(await f.service.apply(f.request, id, actor)).toMatchObject({ status: "applied", replayed: true });
  expect(f.property.updateMany).toHaveBeenCalledTimes(1); expect(f.store.lockCurrent).toHaveBeenCalledTimes(1);
});

it("the full-property closure gate allows only a withdrawal with identical contents and private proof", () => {
  const f = setup(), existing = { ...f.f.next, status: "published" as const }, closed = { ...existing, status: "closed" as const };
  expect(rentalPublicationError(closed, new Date(at), existing)).toBeNull();
  for (const changed of [{ ...closed, title: "Another title" }, { ...closed, internal: { rentalImport: closed.internal!.rentalImport } },
    { ...closed, images: [] }, { ...closed, status: "published" as const }]) {
    expect(rentalPublicationError(changed, new Date(at), existing)).toContain("専用の再確認");
  }
});

it("receipt failure rolls back property/effects and an explicit same-ID retry follows readback", async () => {
  const f = setup(), before = f.snapshot(); f.fault.afterReceipt = true;
  expect(await f.service.apply(f.request, id, actor)).toMatchObject({ status: "unknown" }); expect(f.snapshot()).toEqual(before);
  expect(await f.service.reconcile(f.request, id, actor)).toMatchObject({ reason: "REQUEST_NOT_OBSERVED" });
  f.fault.afterReceipt = false;
  expect(await f.service.apply(f.request, id, actor)).toMatchObject({ status: "applied" });
});

it("normal writer/publication/legacy import cannot remove the marker and bypass review", async () => {
  const f = setup(); await f.service.apply(f.request, id, actor);
  const current = f.snapshot().row, patch = { ...f.f.next, internal: { rentalImport: f.f.next.internal!.rentalImport } };
  expect(await createPropertyWriteRequests(f.prisma).apply({ requestId: randomUUID(), propertyId: id, actorRef: actor,
    expectedUpdatedAt: current.updatedAt.toISOString(), patchJson: JSON.stringify(patch) })).toMatchObject({ reason: "PUBLICATION_GATE_REJECTED" });
  expect(rentalPublicationError(patch, new Date(at), f.f.next)).toContain("専用の再確認");
  const store: RentalStore = { get: async () => ({ ...f.f.next, id, updatedAt: current.updatedAt.toISOString(), createdAt: at }), create: vi.fn(), update: vi.fn() };
  expect(await importRental(f.f.review.rental, store, new Date(at), "published", true)).toMatchObject({ action: "held" });
  expect(store.update).not.toHaveBeenCalled(); expect(store.create).not.toHaveBeenCalled();
});
