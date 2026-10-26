import "server-only";
import { Prisma, type PrismaClient } from "@prisma/client";
import { z } from "zod";
import { mailReviewCommandSchema, mailReviewResultSchema, type MailReviewCommand, type MailReviewResult } from "../mail-review-contract";
import { reviewedMailRecordSchema, validateLockedReview, type ReviewedMailRecord } from "./reviewed-mail-import";
import { lockMailReviewControl, lockMailReviewDependencies, readMailReviewHead, readMailReviewUnderReadLock } from "./reviewed-mail-store";
import { createPropertyRepository } from "./property-repository";
import { parsePropertyInput } from "../property-validation";
import { normalizePropertyWriteRequest } from "./property-write-requests";
import { parseBoundedJson } from "../property-sync/source-fingerprint";
import { contentHash } from "../property-sync/rules";

type Reference = { propertyId: string; operatorRef: string; reviewRef: string; reviewHash: string };
type HeldReason = Extract<MailReviewResult, { status: "held" }>["reason"];
const held = (reason: HeldReason): MailReviewResult => ({ status: "held", reason });
const unknown: MailReviewResult = { status: "unknown", reason: "STORE_OUTCOME_UNKNOWN" };
class ExpiredAuthority extends Error {}
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const receiptSchema = z.object({ request_id: z.uuid(), property_id: z.uuid(), actor_ref: z.string(), review_ref: z.string(), review_hash: hash,
  request_hash: hash, operation: z.enum(["register", "revoke"]), event: z.enum(["registered", "revoked", "already_revoked"]),
  head_revision: z.number().int().positive(), head_hash: hash }).strict();

/** Server-injected preparation source, never body JSON. No default connection or automatic authority producer. */
export function createMailReviewCommands(prisma: Pick<PrismaClient, "$transaction">, options: {
  readPrepared?: (reference: Reference) => Promise<string | null>;
  ownedStorageOrigin?: string;
} = {}) {
  async function run(raw: unknown, authenticatedUid: string, apply: boolean): Promise<MailReviewResult> {
    const parsed = mailReviewCommandSchema.safeParse(raw), uid = z.uuid().safeParse(authenticatedUid);
    if (!parsed.success || !uid.success) return held("INVALID_REQUEST");
    const command = parsed.data, reviewerRef = uid.data.toLowerCase(), actorRef = `admin:${reviewerRef}`;
    const reference: Reference = { propertyId: command.propertyId, operatorRef: actorRef, reviewRef: command.reviewRef, reviewHash: command.reviewHash };
    const requestHash = contentHash({ ...command, actorRef });
    let prepared: ReviewedMailRecord | undefined;
    // Stage outside locks. Failure must not prevent recovering an already committed request.
    if (apply && command.operation === "register" && options.readPrepared) {
      try {
        const text = await options.readPrepared(reference);
        if (typeof text === "string" && text.length <= 8_000_000) {
          const rawRecord = parseBoundedJson(text), record = reviewedMailRecordSchema.safeParse(rawRecord);
          if (record.success && contentHash(rawRecord) === contentHash(record.data) && contentHash(record.data) === command.reviewHash
            && record.data.operatorRef === actorRef && record.data.reviewerRef === reviewerRef && record.data.reviewRef === command.reviewRef
            && record.data.match.target.propertyId === command.propertyId) {
            parseBoundedJson(record.data.patchJson); prepared = record.data;
          }
        }
      } catch { /* New registration is held below; historical recovery remains available. */ }
    }
    try {
      return await prisma.$transaction(async tx => {
        // Shared with the property writer: request -> property -> ordered authority rows.
        // Review-reference lock additionally prevents cross-property reference reuse; never acquired by the property writer.
        await tx.$queryRaw(Prisma.sql`SELECT 1 FROM pg_advisory_xact_lock(hashtextextended(${`mail-review-request:${command.requestId}`},0))`);
        await tx.$queryRaw(Prisma.sql`SELECT 1 FROM pg_advisory_xact_lock(hashtextextended(${`mail-review-ref:${command.reviewRef}`},0))`);
        const rows = await tx.$queryRaw<Array<{ id: string }>>(Prisma.sql`SELECT id FROM public.properties WHERE id=${command.propertyId} FOR UPDATE`);
        if (rows.length !== 1 || rows[0].id !== command.propertyId) return held("PROPERTY_NOT_FOUND");
        const receipts = await tx.$queryRaw<unknown[]>(Prisma.sql`SELECT request_id,property_id,actor_ref,review_ref,review_hash,request_hash,operation,event,head_revision,head_hash
          FROM property_sync_private.mail_review_events WHERE request_id=${command.requestId}::uuid`);
        if (receipts.length) {
          const receipt = receiptSchema.safeParse(receipts[0]);
          if (receipts.length !== 1 || !receipt.success) return unknown;
          const r = receipt.data;
          if (r.request_hash !== requestHash || r.actor_ref !== actorRef || r.property_id !== command.propertyId || r.review_ref !== command.reviewRef
            || r.review_hash !== command.reviewHash || r.operation !== command.operation || r.request_id !== command.requestId
            || (command.operation === "register" ? r.event !== "registered" : r.event === "registered")) return held("REQUEST_CONFLICT");
          const record = await readMailReviewUnderReadLock(tx, reference);
          if (!record || record.reviewerRef !== reviewerRef) return held("REVIEW_NOT_AUTHORIZED");
          const head = await readMailReviewHead(tx, record);
          // Recheck read authority after all I/O. Expired review/rules do not block historical receipts.
          if (!await readMailReviewUnderReadLock(tx, reference)) return held("REVIEW_NOT_AUTHORIZED");
          return mailReviewResultSchema.parse({ status: "recorded", requestId: r.request_id, event: r.event, revision: r.head_revision, headHash: r.head_hash,
            replayed: true, current: !head ? "missing" : head.revision === r.head_revision && head.hash === r.head_hash ? "matches" : "changed" });
        }
        if (!apply) return held("RECEIPT_NOT_FOUND");
        if (command.operation === "register") {
          if (!prepared || !options.ownedStorageOrigin) return held("PREPARED_REVIEW_UNAVAILABLE");
          const existing = await tx.$queryRaw<unknown[]>(Prisma.sql`SELECT review_ref FROM property_sync_private.mail_review_records WHERE review_ref=${command.reviewRef}
            UNION ALL SELECT scope_key FROM property_sync_private.mail_authority_heads WHERE kind='review' AND scope_key=${command.reviewRef}`);
          if (existing.length) return held("REVIEW_REFERENCE_EXISTS");
          if (!await lockMailReviewDependencies(tx, prepared)) return held("REVIEW_NOT_AUTHORIZED");
          const current = await createPropertyRepository(tx).getPropertyById(command.propertyId);
          const write = normalizePropertyWriteRequest({ requestId: command.requestId, propertyId: command.propertyId, actorRef,
            expectedUpdatedAt: prepared.match.target.version.updatedAt, expectedSourceHash: prepared.match.target.version.fullHash,
            intakeReviewHash: command.reviewHash, patchJson: prepared.patchJson });
          if (!current || !write) return held("REVIEW_NOT_ELIGIBLE");
          const next = parsePropertyInput({ ...current, ...write.patch });
          if (!next.ok || !await validateLockedReview(prepared, { requestId: command.requestId, propertyId: command.propertyId, actorRef,
            expectedUpdatedAt: prepared.match.target.version.updatedAt, expectedSourceHash: prepared.match.target.version.fullHash,
            intakeReviewHash: command.reviewHash, current, next: next.data }, tx, options.ownedStorageOrigin)) return held("REVIEW_NOT_ELIGIBLE");
          const payload = { schemaVersion: 1, status: "active", validFrom: prepared.approvedAt, validUntil: prepared.expiresAt,
            data: { propertyId: command.propertyId, operatorRef: actorRef, reviewRef: command.reviewRef, reviewHash: command.reviewHash } };
          const headHash = contentHash(payload);
          await tx.$executeRaw(Prisma.sql`INSERT INTO property_sync_private.mail_review_records (review_ref,property_id,operator_ref,review_hash,record_json)
            VALUES (${command.reviewRef},${command.propertyId},${actorRef},${command.reviewHash},${JSON.stringify(prepared)})`);
          await tx.$executeRaw(Prisma.sql`INSERT INTO property_sync_private.mail_authority_heads (kind,scope_key,revision,payload_hash,payload_json)
            VALUES ('review',${command.reviewRef},1,${headHash},${JSON.stringify(payload)})`);
          await append(tx, command, actorRef, requestHash, "registered", 1, headHash);
          // Dependencies are locked, but wall-clock expiry may occur during INSERT/trigger work.
          if (!await lockMailReviewDependencies(tx, prepared) || !await validateLockedReview(prepared, { requestId: command.requestId, propertyId: command.propertyId,
            actorRef, expectedUpdatedAt: prepared.match.target.version.updatedAt, expectedSourceHash: prepared.match.target.version.fullHash,
            intakeReviewHash: command.reviewHash, current, next: next.data }, tx, options.ownedStorageOrigin)) throw new ExpiredAuthority();
          return { status: "recorded", requestId: command.requestId, event: "registered", revision: 1, headHash, replayed: false, current: "matches" };
        }
        const control = await lockMailReviewControl(tx, reference);
        if (!control || control.record.reviewerRef !== reviewerRef) return held("REVIEW_NOT_AUTHORIZED");
        const { head } = control;
        if (head.revision !== command.expectedRevision || head.hash !== command.expectedHeadHash) return held("REVIEW_HEAD_CONFLICT");
        const already = head.payload.status === "revoked", revision = head.revision + (already ? 0 : 1);
        const payload = { ...head.payload, status: "revoked" }, headHash = contentHash(payload);
        if (!already) {
          const count = await tx.$executeRaw(Prisma.sql`UPDATE property_sync_private.mail_authority_heads SET revision=${revision},payload_hash=${headHash},payload_json=${JSON.stringify(payload)}
            WHERE kind='review' AND scope_key=${command.reviewRef} AND revision=${head.revision} AND payload_hash=${head.hash}`);
          if (count !== 1) throw new Error("REVIEW_CAS_FAILED");
        }
        const event = already ? "already_revoked" : "revoked";
        await append(tx, command, actorRef, requestHash, event, revision, headHash);
        const finalAt = new Date().toISOString();
        if (finalAt < control.checkedAt || finalAt >= control.authorityExpiresAt) throw new ExpiredAuthority();
        return { status: "recorded", requestId: command.requestId, event, revision, headHash, replayed: false, current: "matches" };
      }, { maxWait: 3000, timeout: 8000 });
    } catch (e) {
      // Never automatically repeat a possibly committed transaction. Reconcile the original request instead.
      return e instanceof ExpiredAuthority ? held("AUTHORITY_EXPIRED") : unknown;
    }
  }
  return { apply: (r: unknown, uid: string) => run(r, uid, true), reconcile: (r: unknown, uid: string) => run(r, uid, false) };
}

async function append(tx: Prisma.TransactionClient, c: MailReviewCommand, actor: string, requestHash: string,
  event: "registered" | "revoked" | "already_revoked", revision: number, headHash: string) {
  await tx.$executeRaw(Prisma.sql`INSERT INTO property_sync_private.mail_review_events
    (request_id,property_id,review_ref,actor_ref,review_hash,request_hash,operation,event,before_revision,before_hash,head_revision,head_hash,created_at)
    VALUES (${c.requestId}::uuid,${c.propertyId},${c.reviewRef},${actor},${c.reviewHash},${requestHash},${c.operation},${event},${c.expectedRevision},
    ${c.operation === "revoke" ? c.expectedHeadHash : null},${revision},${headHash},${new Date().toISOString()}::timestamptz)`);
}
