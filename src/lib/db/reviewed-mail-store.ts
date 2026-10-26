import "server-only";
import { Prisma, type PrismaClient } from "@prisma/client";
import { z } from "zod";
import { reviewedMailRecordSchema, type ReviewedMailRecord, type ReviewedMailStore } from "./reviewed-mail-import";
import { contentHash } from "../property-sync/rules";
import { parseBoundedJson } from "../property-sync/source-fingerprint";

const ref = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/), hash = z.string().regex(/^[a-f0-9]{64}$/);
const actor = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9:_-]{0,99}$/), instant = z.iso.datetime({ precision: 3 });
const referenceSchema = z.object({ propertyId: z.uuid(), operatorRef: actor, reviewRef: ref, reviewHash: hash }).strict();
type Reference = z.infer<typeof referenceSchema>;
const kind = z.enum(["operator", "reviewer", "episode", "review", "rules", "policies", "permissions", "materials"]);
const keySchema = z.object({ kind, scope_key: ref }).strict();
export type MailAuthorityKey = z.infer<typeof keySchema>;
const envelopeSchema = z.object({ schemaVersion: z.literal(1), status: z.enum(["active", "revoked"]),
  validFrom: instant, validUntil: instant, data: z.unknown() }).strict().refine(h => h.validFrom < h.validUntil);
type AuthorityHead = { payload: z.infer<typeof envelopeSchema>; revision: number; hash: string };
const headSchema = keySchema.extend({ revision: z.number().int().positive().max(2147483647), payload_hash: hash,
  payload_json: z.string().max(8_000_000) }).strict();
const recordSchema = z.object({ review_ref: ref, property_id: z.uuid(), operator_ref: actor, review_hash: hash,
  record_json: z.string().max(8_000_000) }).strict();
const operatorSchema = z.object({ propertyId: z.uuid(), operatorRef: actor, canRead: z.boolean(), canApply: z.boolean() }).strict();
const materialReview = { reviewerRef: ref, evidenceRef: ref, checkedAt: instant, status: z.literal("cleared") };
const materialsSchema = z.object({ binding: reviewedMailRecordSchema.shape.plan.shape.binding,
  publicPayload: z.object({ hash, ...materialReview }).strict(),
  assets: z.array(z.object({ url: z.url(), assetId: ref, kind: z.enum(["photo", "floorplan"]), hash,
    storageVersionRef: ref, ...materialReview }).strict()).max(100),
}).strict();
const same = (a: unknown, b: unknown) => contentHash(a) === contentHash(b);
const keyId = (k: MailAuthorityKey) => `${k.kind}:${k.scope_key}`;
const operatorKey = (r: Pick<Reference, "propertyId" | "operatorRef">): MailAuthorityKey => ({ kind: "operator", scope_key: contentHash({ propertyId: r.propertyId, operatorRef: r.operatorRef }) });

/** Fixed addresses for current heads, never a caller-provided dependency list or an older version lookup. */
export function mailAuthorityKeys(r: ReviewedMailRecord): MailAuthorityKey[] {
  const propertyId = r.match.target.propertyId, scopeKey = contentHash(r.plan.scope), bindingKey = contentHash(r.plan.binding);
  return [operatorKey({ propertyId, operatorRef: r.operatorRef }),
    { kind: "reviewer", scope_key: contentHash({ propertyId, reviewerRef: r.reviewerRef }) },
    { kind: "episode", scope_key: propertyId }, { kind: "review", scope_key: r.reviewRef },
    { kind: "rules", scope_key: scopeKey }, { kind: "policies", scope_key: scopeKey },
    { kind: "permissions", scope_key: bindingKey }, { kind: "materials", scope_key: bindingKey }]
    .map(k => keySchema.parse(k)).sort((a, b) => keyId(a).localeCompare(keyId(b), "en"));
}
async function readRecord(tx: Pick<Prisma.TransactionClient, "$queryRaw">, r: Reference): Promise<ReviewedMailRecord | null> {
  const rows = await tx.$queryRaw<unknown[]>(Prisma.sql`SELECT review_ref,property_id,operator_ref,review_hash,record_json
    FROM property_sync_private.mail_review_records
    WHERE review_ref=${r.reviewRef} AND property_id=${r.propertyId} AND operator_ref=${r.operatorRef} AND review_hash=${r.reviewHash} LIMIT 2`);
  if (rows.length !== 1) return null;
  const row = recordSchema.safeParse(rows[0]); if (!row.success) return null;
  if (row.data.review_ref !== r.reviewRef || row.data.property_id !== r.propertyId || row.data.operator_ref !== r.operatorRef || row.data.review_hash !== r.reviewHash) return null;
  const raw = parseBoundedJson(row.data.record_json), record = reviewedMailRecordSchema.safeParse(raw);
  if (!record.success || !same(raw, record.data) || contentHash(record.data) !== r.reviewHash
    || record.data.reviewRef !== r.reviewRef || record.data.operatorRef !== r.operatorRef || record.data.match.target.propertyId !== r.propertyId) return null;
  parseBoundedJson(record.data.patchJson); // The command is a nested JSON string; do not hide duplicate keys/rounded numbers inside it.
  return record.data;
}
async function lockHeads(tx: Pick<Prisma.TransactionClient, "$queryRaw">, keys: MailAuthorityKey[]) {
  const conditions = keys.map(k => Prisma.sql`(kind=${k.kind} AND scope_key=${k.scope_key})`);
  const rows = await tx.$queryRaw<unknown[]>(Prisma.sql`SELECT kind,scope_key,revision,payload_hash,payload_json
    FROM property_sync_private.mail_authority_heads WHERE ${Prisma.join(conditions, " OR ")}
    ORDER BY kind COLLATE "C",scope_key COLLATE "C" FOR SHARE`);
  if (rows.length !== keys.length) return null;
  const heads = new Map<string, AuthorityHead>();
  for (const rawRow of rows) {
    const row = headSchema.safeParse(rawRow); if (!row.success || !keys.some(k => keyId(k) === keyId(row.data)) || heads.has(row.data.kind)) return null;
    const raw = parseBoundedJson(row.data.payload_json), value = envelopeSchema.safeParse(raw);
    if (!value.success || !same(raw, value.data) || contentHash(value.data) !== row.data.payload_hash) return null;
    heads.set(row.data.kind, { payload: value.data, revision: row.data.revision, hash: row.data.payload_hash });
  }
  return heads;
}
function active(head: AuthorityHead | undefined, now: string) {
  return !!head && head.payload.status === "active" && head.payload.validFrom <= now && now < head.payload.validUntil;
}
function canRead(data: unknown, r: Reference) {
  const grant = operatorSchema.safeParse(data);
  return grant.success && grant.data.canRead && grant.data.propertyId === r.propertyId && grant.data.operatorRef === r.operatorRef;
}
function approvedMaterials(raw: unknown, r: ReviewedMailRecord, now: string) {
  const parsed = materialsSchema.safeParse(raw); if (!parsed.success) return false;
  const m = parsed.data;
  if (!same(m.binding, r.plan.binding) || m.publicPayload.hash !== r.manifest.publicPayload.hash
    || new Set(m.assets.map(a => a.assetId)).size !== m.assets.length || new Set(m.assets.map(a => a.url)).size !== m.assets.length) return false;
  if ([m.publicPayload, ...m.assets].some(v => v.reviewerRef !== r.reviewerRef || v.checkedAt > now || v.checkedAt > r.approvedAt)) return false;
  const inventory = m.assets.map(({ url, assetId, kind, hash }) => ({ url, assetId, kind, hash })).sort((a, b) => a.assetId.localeCompare(b.assetId));
  return same(inventory, [...r.assets].sort((a, b) => a.assetId.localeCompare(b.assetId)));
}

function dependenciesMatch(heads: Map<string, AuthorityHead>, record: ReviewedMailRecord, now: string) {
  if ([...heads.values()].some(h => !active(h, now) || h.payload.validFrom > record.approvedAt || h.payload.validUntil < record.expiresAt)) return false;
  const propertyId = record.match.target.propertyId, r = { propertyId, operatorRef: record.operatorRef, reviewRef: record.reviewRef, reviewHash: contentHash(record) };
  const data = (kind: string) => heads.get(kind)?.payload.data, operator = operatorSchema.safeParse(data("operator"));
  return operator.success && operator.data.canApply && canRead(operator.data, r)
    && same(data("reviewer"), { propertyId, reviewerRef: record.reviewerRef, canApprove: true })
    && same(data("episode"), { propertyId, episodeId: record.match.target.episodeId })
    && same(data("rules"), { scope: record.plan.scope, history: record.ruleHistory })
    && same(data("policies"), { scope: record.plan.scope, history: record.policyHistory })
    && same(data("permissions"), { binding: record.plan.binding, scope: record.plan.scope, history: record.permissions })
    && approvedMaterials(data("materials"), record, now);
}

/** Same seven dependency heads for a new review, before an immutable record/review head exists. Caller holds property lock. */
export async function lockMailReviewDependencies(tx: Prisma.TransactionClient, record: ReviewedMailRecord) {
  const heads = await lockHeads(tx, mailAuthorityKeys(record).filter(k => k.kind !== "review")), now = new Date().toISOString();
  return !!heads && now >= record.approvedAt && now < record.expiresAt && dependenciesMatch(heads, record, now);
}

/** Owner-scoped historical read; canApply/review expiry do not prevent receipt recovery. */
export async function readMailReviewUnderReadLock(tx: Prisma.TransactionClient, raw: unknown) {
  const parsed = referenceSchema.safeParse(raw); if (!parsed.success) return null;
  const r = parsed.data, heads = await lockHeads(tx, [operatorKey(r)]), now = new Date().toISOString();
  if (!heads || !active(heads.get("operator"), now) || !canRead(heads.get("operator")!.payload.data, r)) return null;
  const record = await readRecord(tx, r), finalAt = new Date().toISOString();
  return finalAt >= now && active(heads.get("operator"), finalAt) ? record : null;
}

/** Current state only; caller has already authorized the private record and holds the property lock. */
export async function readMailReviewHead(tx: Prisma.TransactionClient, record: ReviewedMailRecord) {
  const heads = await lockHeads(tx, [{ kind: "review", scope_key: record.reviewRef }]);
  const head = heads?.get("review");
  return head && same(head.payload.data, { propertyId: record.match.target.propertyId, operatorRef: record.operatorRef,
    reviewRef: record.reviewRef, reviewHash: contentHash(record) }) ? head : null;
}

/** Revocation checks only current read/reviewer authority, never eligibility, source freshness or expired permission. */
export async function lockMailReviewControl(tx: Prisma.TransactionClient, raw: unknown) {
  const parsed = referenceSchema.safeParse(raw); if (!parsed.success) return null;
  const r = parsed.data, record = await readRecord(tx, r); if (!record) return null;
  const heads = await lockHeads(tx, mailAuthorityKeys(record).filter(k => ["operator", "review", "reviewer"].includes(k.kind)));
  const now = new Date().toISOString(), head = heads?.get("review");
  if (!heads || !head || !active(heads.get("operator"), now) || !active(heads.get("reviewer"), now)
    || !canRead(heads.get("operator")!.payload.data, r)
    || !same(heads.get("reviewer")!.payload.data, { propertyId: r.propertyId, reviewerRef: record.reviewerRef, canApprove: true })
    || !same(head.payload.data, { propertyId: r.propertyId, operatorRef: r.operatorRef, reviewRef: r.reviewRef, reviewHash: r.reviewHash })) return null;
  return { record, head, checkedAt: now, authorityExpiresAt: [heads.get("operator")!.payload.validUntil, heads.get("reviewer")!.payload.validUntil].sort()[0] };
}

/**
 * Read-only DB adapter; no singleton, approval producer, DDL, grants or external asset fetch.
 * Heads are authoritative only when populated/revoked by a separately secured, audited review process.
 * A hash or stored assertion alone does not prove legal permission or pixel contents.
 */
export function createDbReviewedMailStore(prisma: Pick<PrismaClient, "$transaction">): ReviewedMailStore {
  return {
    async readImmutable(raw) {
      return prisma.$transaction(tx => readMailReviewUnderReadLock(tx, raw), { maxWait: 3000, timeout: 8000 });
    },
    async lockCurrent(tx, raw) {
      const parsed = referenceSchema.safeParse(raw); if (!parsed.success) return null;
      const r = parsed.data, record = await readRecord(tx, r); if (!record) return null;
      const heads = await lockHeads(tx, mailAuthorityKeys(record)), now = new Date().toISOString();
      if (!heads || !dependenciesMatch(heads, record, now)
        || !same(heads.get("review")!.payload.data, { propertyId: r.propertyId, operatorRef: r.operatorRef, reviewRef: r.reviewRef, reviewHash: r.reviewHash })) return null;
      const finalAt = new Date().toISOString();
      // Every head covers the review deadline; the service checks that deadline again immediately before saving.
      return finalAt >= now && finalAt < record.expiresAt ? record : null;
    },
  };
}
