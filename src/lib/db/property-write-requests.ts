import { Prisma, type PrismaClient } from "@prisma/client";
import { z } from "zod";
import { createPropertyRepository } from "./property-repository";
import { propertyInputSchema, parsePropertyInput, parsePropertyPatch, bannedTermsError } from "../property-validation";
import { rentalPublicationError } from "../rental-import/publication";
import { contentHash } from "../property-sync/rules";
import type { AdminProperty, PropertyInput } from "../property-shared";
import { enqueuePublicationEffects } from "./publication-effects";
import { propertyHeldReceiptSchema, type PropertyHeldReceipt } from "../property-write-contract";
import { fingerprintPropertySource } from "../property-sync/source-fingerprint";
import { readPropertySourceRecord } from "./property-source-record";

const envelope = z.object({ requestId: z.uuid(), propertyId: z.uuid(), actorRef: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9:_-]{0,99}$/),
  expectedUpdatedAt: z.iso.datetime({ precision: 3 }), expectedSourceHash: z.string().regex(/^[a-f0-9]{64}$/).optional(),
  intakeReviewHash: z.string().regex(/^[a-f0-9]{64}$/).optional(),
  patchJson: z.string().min(2).max(1_000_000) }).strict();
const clearable = new Set(["priceNote", "publishedAt", "translations", "internal"]);
const fields = new Set(Object.keys(propertyInputSchema.shape));
const iso = (v: unknown): v is string => typeof v === "string" && Number.isFinite(Date.parse(v)) && new Date(v).toISOString() === v;

type Request = z.infer<typeof envelope> & { patch: Partial<PropertyInput>; requestHash: string };
/** JSON input owns its snapshot. Unknown root keys and unsafe numbers are rejected, null explicitly clears optional fields. */
export function normalizePropertyWriteRequest(raw: unknown): Request | null {
  try {
    const parsed = envelope.safeParse(raw); if (!parsed.success) return null;
    // PostgreSQL UUID equality is case-insensitive; locks, hashes and returned IDs must agree.
    const input = { ...parsed.data, requestId: parsed.data.requestId.toLowerCase(), propertyId: parsed.data.propertyId.toLowerCase() };
    if (!iso(input.expectedUpdatedAt) || !Number.isFinite(new Date(Date.parse(input.expectedUpdatedAt) + 1).getTime())) return null;
    if (Buffer.byteLength(input.patchJson, "utf8") > 1_000_000) return null;
    const patch = JSON.parse(input.patchJson);
    if (!patch || typeof patch !== "object" || Array.isArray(patch) || !Object.keys(patch).length || Object.keys(patch).some(k => !fields.has(k))) return null;
    const stack = [{ value: patch, depth: 0 }]; let nodes = 0;
    while (stack.length) {
      const { value, depth } = stack.pop()!;
      if (++nodes > 10_000 || depth > 32) return null;
      if (typeof value === "number" && (!Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER)) return null;
      if (value && typeof value === "object") for (const child of Object.values(value)) stack.push({ value: child, depth: depth + 1 });
    }
    for (const key of clearable) if (patch[key] === null) patch[key] = undefined;
    const checked = parsePropertyPatch(patch); if (!checked.ok || !Object.keys(checked.data).length) return null;
    const normalized = Object.fromEntries(Object.entries(checked.data).map(([k, v]) => [k, v === undefined ? null : v]));
    return { ...input, patch: checked.data, requestHash: contentHash({ schemaVersion: 1, operation: "property_update", propertyId: input.propertyId,
      actorRef: input.actorRef, expectedUpdatedAt: input.expectedUpdatedAt, patch: normalized,
      ...(input.expectedSourceHash === undefined ? {} : { expectedSourceHash: input.expectedSourceHash }),
      ...(input.intakeReviewHash === undefined ? {} : { intakeReviewHash: input.intakeReviewHash }) }) };
  } catch { return null; }
}
const receiptSchema = z.object({ request_id: z.uuid(), property_id: z.uuid(), request_hash: z.string().regex(/^[a-f0-9]{64}$/),
  expected_version: z.date(), result_version: z.date(), result_hash: z.string().regex(/^[a-f0-9]{64}$/), outcome: z.enum(["applied", "held"]),
  reason: z.enum(["SAVED", "VERSION_CONFLICT", "INVALID_PROPERTY", "PUBLICATION_GATE_REJECTED"]),
  initiator_hash: z.string().regex(/^[a-f0-9]{64}$/).nullable() }).strict();
type Receipt = z.infer<typeof receiptSchema>;
const referenceSchema = envelope.pick({ propertyId: true, requestId: true, actorRef: true });
const initiatorHash = (actorRef: string) => contentHash({ schemaVersion: 1, purpose: "property_write_initiator", actorRef });
export type PropertyWriteResult = { status: "held" | "unknown"; reason: string } | {
  status: "applied" | "held"; reason: Receipt["reason"]; requestId: string; replayed: boolean;
  resultVersion: string; resultHash: string; current: "matches" | "changed" | "missing";
};
class ReceiptConflict extends Error {}
export type PropertyWriteGuardContext = { requestId: string; actorRef: string; propertyId: string;
  expectedUpdatedAt: string; expectedSourceHash?: string; intakeReviewHash?: string; current: AdminProperty; next: PropertyInput };
type WriteOptions = { localPublicationEffects?: true;
  /** Trusted transaction-local authority reader only; never caller-supplied flags or external network calls. */
  reviewedMailGuard?: (context: PropertyWriteGuardContext, tx: Prisma.TransactionClient) => Promise<boolean> };
function result(receipt: Receipt, current: AdminProperty | null, replayed: boolean): PropertyWriteResult {
  return { status: receipt.outcome, reason: receipt.reason, requestId: receipt.request_id, replayed, resultVersion: receipt.result_version.toISOString(), resultHash: receipt.result_hash,
    current: !current ? "missing" : current.updatedAt === receipt.result_version.toISOString() && contentHash(current) === receipt.result_hash ? "matches" : "changed" };
}

/**
 * Explicitly injected local adapter; no production singleton, credentials or automatic fallback.
 * actorRef must come from the authenticated caller when a future route is wired.
 * Receipt + property CAS commit together. Receipts describe past outcomes, never replace current rows.
 * expectedSourceHash is an additive server-side guard; omitted legacy requests retain their exact hash.
 * This guard is not an episode, identity, eligibility or advertising authorization check.
 */
export function createPropertyWriteRequests(prisma: Pick<PrismaClient, "$transaction">, options?: WriteOptions) {
  async function run(raw: unknown, write: boolean): Promise<PropertyWriteResult> {
    const request = normalizePropertyWriteRequest(raw); if (!request) return { status: "held", reason: "INVALID_REQUEST" };
    try {
      return await prisma.$transaction(async tx => {
        // Always request lock then property lock. A reused ID across properties cannot race insertion.
        await tx.$queryRaw(Prisma.sql`SELECT true AS locked FROM pg_advisory_xact_lock(hashtextextended(${request.requestId}::text,0))`);
        await tx.$queryRaw(Prisma.sql`SELECT id FROM public.properties WHERE id=${request.propertyId} FOR UPDATE`);
        const repo = createPropertyRepository(tx), current = await repo.getPropertyById(request.propertyId);
        const receipts = await tx.$queryRaw<Receipt[]>(Prisma.sql`SELECT request_id,property_id,request_hash,expected_version,result_version,result_hash,outcome,reason,initiator_hash
          FROM public.property_write_receipts WHERE request_id=${request.requestId}::uuid`);
        if (receipts.length) {
          const stored = receiptSchema.safeParse(receipts[0]);
          if (receipts.length !== 1 || !stored.success) return { status: "held", reason: "RECEIPT_INTEGRITY_ERROR" };
          const receipt = stored.data;
          if (receipt.property_id !== request.propertyId || receipt.request_hash !== request.requestHash || receipt.expected_version.toISOString() !== request.expectedUpdatedAt ||
            receipt.initiator_hash !== null && receipt.initiator_hash !== initiatorHash(request.actorRef)) return { status: "held", reason: "REQUEST_ID_CONFLICT" };
          if ((receipt.outcome === "applied") !== (receipt.reason === "SAVED") || (receipt.outcome === "applied" && receipt.result_version <= receipt.expected_version)) return { status: "held", reason: "RECEIPT_INTEGRITY_ERROR" };
          return result(receipt, current, true);
        }
        if (!write) return { status: "unknown", reason: "REQUEST_NOT_OBSERVED" };
        if (!current) return { status: "held", reason: "PROPERTY_NOT_FOUND" };
        let sourceMatches = true;
        if (request.expectedSourceHash !== undefined) {
          const source = fingerprintPropertySource(await readPropertySourceRecord(tx, request.propertyId));
          sourceMatches = source.status === "fingerprinted" && source.propertyId === request.propertyId
            && source.version.updatedAt === request.expectedUpdatedAt && source.version.fullHash === request.expectedSourceHash;
        }
        let outcome: Receipt["outcome"] = "held", reason: Receipt["reason"] = "VERSION_CONFLICT";
        if (current.updatedAt === request.expectedUpdatedAt && sourceMatches) {
          const merged = parsePropertyInput({ ...current, ...request.patch });
          if (!merged.ok) reason = "INVALID_PROPERTY";
          else {
            const needsReview = request.intakeReviewHash !== undefined || Object.hasOwn(current.internal ?? {}, "reviewedMailImport")
              || Object.hasOwn(merged.data.internal ?? {}, "reviewedMailImport");
            // A status-only withdrawal cannot publish or alter any content/evidence. Retain the ordinary CAS stop path.
            const closing = current.status === "published" && request.patch.status === "closed" && Object.keys(request.patch).length === 1;
            const reviewed = needsReview && !!request.expectedSourceHash && !!request.intakeReviewHash && !!options?.reviewedMailGuard
              && await options.reviewedMailGuard(structuredClone({ requestId: request.requestId, actorRef: request.actorRef, propertyId: request.propertyId,
                expectedUpdatedAt: request.expectedUpdatedAt, expectedSourceHash: request.expectedSourceHash, intakeReviewHash: request.intakeReviewHash,
                current, next: merged.data }), tx);
            if (needsReview && !reviewed && !closing || bannedTermsError(merged.data)
              || rentalPublicationError(merged.data, new Date(), current, { reviewedMailImport: reviewed || closing })) reason = "PUBLICATION_GATE_REJECTED";
            else {
              await repo.updateProperty(request.propertyId, request.patch, request.expectedUpdatedAt);
              outcome = "applied"; reason = "SAVED";
            }
          }
        }
        const after = await repo.getPropertyById(request.propertyId); if (!after || !iso(after.updatedAt)) throw new Error("PROPERTY_READBACK_MISSING");
        const receipt: Receipt = { request_id: request.requestId, property_id: request.propertyId, request_hash: request.requestHash,
          expected_version: new Date(request.expectedUpdatedAt), result_version: new Date(after.updatedAt), result_hash: contentHash(after), outcome, reason,
          initiator_hash: initiatorHash(request.actorRef) };
        try {
          await tx.$executeRaw(Prisma.sql`INSERT INTO public.property_write_receipts
            (request_id,property_id,request_hash,expected_version,result_version,result_hash,outcome,reason,initiator_hash)
            VALUES (${receipt.request_id}::uuid,${receipt.property_id},${receipt.request_hash},${receipt.expected_version},${receipt.result_version},${receipt.result_hash},${receipt.outcome},${receipt.reason},${receipt.initiator_hash})`);
        } catch (error) {
          // Includes an existing but RLS-hidden ID. Do not run SQL inside the aborted transaction.
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2010" && error.meta?.code === "23505") throw new ReceiptConflict();
          throw error;
        }
        if (outcome === "applied" && options?.localPublicationEffects) await enqueuePublicationEffects(tx, request.requestId, current, after, request.actorRef);
        return result(receipt, after, false);
      }, { maxWait: 3000, timeout: 8000 });
    } catch (error) {
      // An exception may be a lost COMMIT reply. Never claim rollback or auto-retry here.
      return { status: error instanceof ReceiptConflict ? "held" : "unknown", reason: error instanceof ReceiptConflict ? "REQUEST_ID_CONFLICT" : "STORE_OUTCOME_UNKNOWN" };
    }
  }
  async function inspectHeld(raw: unknown): Promise<PropertyHeldReceipt | null> {
    const checked = referenceSchema.safeParse(raw); if (!checked.success) return null;
    const propertyId = checked.data.propertyId.toLowerCase(), requestId = checked.data.requestId.toLowerCase(), owner = initiatorHash(checked.data.actorRef);
    // Read-only. No property lock, mutation, owner backfill, or raw edit needed after remount.
    return prisma.$transaction(async tx => {
      const receipts = await tx.$queryRaw<Receipt[]>(Prisma.sql`SELECT request_id,property_id,request_hash,expected_version,result_version,result_hash,outcome,reason,initiator_hash
        FROM public.property_write_receipts WHERE request_id=${requestId}::uuid AND property_id=${propertyId} AND initiator_hash=${owner}`);
      if (receipts.length !== 1) return null;
      const parsed = receiptSchema.safeParse(receipts[0]); if (!parsed.success) return null;
      const row = parsed.data;
      if (row.request_id !== requestId || row.property_id !== propertyId || row.initiator_hash !== owner || row.outcome !== "held") return null;
      const result = propertyHeldReceiptSchema.safeParse({ propertyId, requestId, resultVersion: row.result_version.toISOString(), reason: row.reason });
      return result.success ? result.data : null;
    }, { maxWait: 3000, timeout: 8000 });
  }
  return { apply: (request: unknown) => run(request, true), reconcile: (request: unknown) => run(request, false), inspectHeld };
}
