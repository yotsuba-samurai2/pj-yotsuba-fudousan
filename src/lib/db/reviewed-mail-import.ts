import "server-only";
import { z } from "zod";
import type { Prisma, PrismaClient } from "@prisma/client";
import { createPropertyWriteRequests, type PropertyWriteGuardContext, type PropertyWriteResult } from "./property-write-requests";
import { readPropertySourceRecord } from "./property-source-record";
import { mailCanonicalMatchRequestSchema, matchMailToCanonicalProperty } from "../property-sync/mail-canonical-match";
import { verifyMailInbox } from "../property-sync/local-mail-inbox";
import { MAIL_WINDOW_MS } from "../property-sync/mail-intake";
import { evaluateRentalFields, rentalEvaluationPolicySchema, rentalFieldEvidenceSchema } from "../property-sync/rental-field-evaluation";
import { changePlanSchema } from "../property-sync/change-plan";
import { publicationManifestSchema, matchPlanPermissionEvidence } from "../property-sync/permission-evidence";
import { contentHash, resolveRule } from "../property-sync/rules";
import { rentalImportSchema, validateRentalImport } from "../rental-import/validation";
import { isCurrentEvidence } from "../rental-import/policy";
import { isOwnedImage } from "../rental-import/media";
import { toPublicProperty } from "../property-shared";

const ref = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/), hash = z.string().regex(/^[a-f0-9]{64}$/);
const actor = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9:_-]{0,99}$/), instant = z.iso.datetime({ precision: 3 });
const marker = z.object({ schemaVersion: z.literal(1), reviewRef: ref }).strict();
const requestSchema = z.object({ requestId: z.uuid(), reviewRef: ref, reviewHash: hash }).strict();
export type ReviewedMailRequest = z.infer<typeof requestSchema>;
/** Private, immutable review artifact. A client-supplied object is never an approved store record. */
export const reviewedMailRecordSchema = z.object({ schemaVersion: z.literal(1), reviewRef: ref,
  operatorRef: actor, reviewerRef: ref, status: z.enum(["approved", "pending", "revoked"]), approvedAt: instant, expiresAt: instant,
  match: mailCanonicalMatchRequestSchema, inbox: z.unknown(), identityEvidence: z.unknown(),
  // Persist the exact reviewed command, so recovery never regenerates a different patch with today's dates/rules.
  patchJson: z.string().min(2).max(1_000_000), rental: z.unknown(),
  ruleHistory: z.unknown(), policyHistory: z.array(rentalEvaluationPolicySchema).max(1000), policyHash: hash,
  fields: rentalFieldEvidenceSchema, income: z.unknown(), school: z.unknown().optional(),
  plan: changePlanSchema, manifest: publicationManifestSchema, permissions: z.unknown(),
  assets: z.array(z.object({ url: z.url(), assetId: ref, kind: z.enum(["photo", "floorplan"]), hash }).strict()).max(100),
}).strict().refine(r => r.approvedAt < r.expiresAt);
export type ReviewedMailRecord = z.infer<typeof reviewedMailRecordSchema>;
type Reference = { propertyId: string; operatorRef: string; reviewRef: string; reviewHash: string };
/**
 * Server-owned adapters, never request JSON. No implementation/default production connection is supplied.
 * readImmutable must retain the original command even after expiry/revocation, scoped to this operator/property.
 * lockCurrent must validate authority, current episode, complete current rule/permission histories and actual
 * material hashes/reviews, holding their authoritative rows until tx ends. No remote calls under these locks.
 * Missing schema/authority/material verification must return null/throw, never assert approval from client data.
 */
export interface ReviewedMailStore {
  readImmutable(reference: Reference): Promise<unknown>;
  lockCurrent(tx: Prisma.TransactionClient, reference: Reference): Promise<unknown>;
}
const same = (a: unknown, b: unknown) => contentHash(a) === contentHash(b);
const held = (reason: string): PropertyWriteResult => ({ status: "held", reason });

async function validateLockedReview(r: ReviewedMailRecord, context: PropertyWriteGuardContext, tx: Prisma.TransactionClient, ownedStorageOrigin: string) {
  const started = new Date().toISOString(), { current, next } = context, target = r.match.target;
  if (r.status !== "approved" || started < r.approvedAt || started >= r.expiresAt || r.operatorRef !== context.actorRef
    || target.propertyId !== context.propertyId || target.version.updatedAt !== context.expectedUpdatedAt || target.version.fullHash !== context.expectedSourceHash
    || current.status === "closed" || next.status !== current.status || next.slug !== current.slug || next.dealType !== "rental"
    || next.publishedAt !== current.publishedAt) return false;
  if (!same(next.internal?.reviewedMailImport, { schemaVersion: 1, reviewRef: r.reviewRef })) return false;
  const match = await matchMailToCanonicalProperty(r.match, {
    readInbox: async () => r.inbox, readIdentityEvidence: async () => r.identityEvidence, clock: () => new Date().toISOString(),
    readTarget: async binding => ({ recordJson: await readPropertySourceRecord(tx, binding.propertyId) ?? "",
      metadataJson: JSON.stringify({ ...binding, market: "residential_rental", snapshotRef: r.reviewRef, capturedAt: new Date().toISOString() }) }),
  });
  if (match.status !== "matched_proposal" || match.advertising === "prohibited") return false;
  // Read-time checks use the clock AFTER all awaited I/O; a slow read cannot preserve an expired grant.
  const now = new Date().toISOString(); if (now < started || now >= r.expiresAt) return false;
  const inbox = verifyMailInbox(r.inbox), candidate = inbox?.entries.find(e => e.candidate.messageKey === r.match.messageKey)?.candidate;
  const rental = rentalImportSchema.safeParse(r.rental);
  if (!candidate || !rental.success || rental.data.intake || rental.data.version !== 2 || !rental.data.email
    || rental.data.email.messageId !== candidate.messageId || Date.parse(rental.data.email.receivedAt) !== Date.parse(candidate.receivedAt)
    || rental.data.source.applicationStatus !== "not-applied" || !/^東京都\s*文京区/.test(rental.data.source.address.normalize("NFKC"))) return false;
  // Apply new-intake timing even though the destination property already exists. Never use maintenance's age exemption.
  const gate = validateRentalImport(rental.data, new Date(now), "published", false);
  if (!gate.ok || gate.property.slug !== current.slug || !rental.data.photoPermission || rental.data.photoPermission.status !== "allowed"
    || !isCurrentEvidence(rental.data.photoPermission.evidence.checkedAt, new Date(now))) return false;
  // Validator-generated dates/conditions/proof are part of the approved patch, not silently adopted after review.
  const expected = { ...gate.property, slug: current.slug, status: current.status, publishedAt: current.publishedAt };
  if (!same(toPublicProperty(next), toPublicProperty(expected)) || !same(next.internal?.rentalImport, gate.property.internal?.rentalImport)
    || !same(next.internal?.schoolDistrict, gate.property.internal?.schoolDistrict)) return false;
  const otherInternal = (v: Record<string, unknown> | undefined) => Object.fromEntries(Object.entries(v ?? {}).filter(([k]) => !["rentalImport", "schoolDistrict", "reviewedMailImport"].includes(k)));
  if (!same(otherInternal(current.internal), otherInternal(next.internal))) return false;
  const scope = r.plan.scope, binding = { propertyId: target.propertyId, episodeId: target.episodeId }, fields = r.fields;
  const policy = r.policyHistory.find(p => contentHash(p) === r.policyHash);
  if (scope.market !== "residential_rental" || scope.audience !== "global" || scope.clientRef !== null
    || !policy?.additionalChecks?.minimumArea || !policy.additionalChecks.propertyUpdateWindow || !policy.additionalChecks.incomeBasis
    || !policy.layoutAlternatives || policy.rentBasis !== "rent_only" || next.spec.dealType !== "rental"
    || fields.rentYen !== next.priceYen || fields.areaSqm !== next.spec.exclusiveAreaSqm
    || `${fields.mainRooms}${fields.kitchen}` !== next.spec.layout.normalize("NFKC").replace(/\s/g, "").toUpperCase()
    || (fields.leaseType === "ordinary" ? "普通借家" : fields.leaseType === "fixed" ? "定期借家" : null) !== next.spec.contractType) return false;
  const income = z.object({ totalYen: z.number(), basis: z.string(), taxBasis: z.string(), certainty: z.string() }).safeParse(r.income);
  if (!income.success || !rental.data.companyIncome || !same(income.data, {
    totalYen: rental.data.companyIncome.totalYen, basis: rental.data.companyIncome.basis,
    taxBasis: rental.data.companyIncome.taxBasis, certainty: rental.data.companyIncome.certainty })) return false;
  const evaluationRequest = { scope, binding, sourceHash: target.version.fullHash, expectedRuleHash: r.plan.rule.hash,
    expectedPolicyHash: r.policyHash, expectedEvidenceHash: contentHash(fields), expectedIncomeEvidenceHash: contentHash(r.income),
    ...(r.school === undefined ? {} : { expectedSchoolEvidenceHash: contentHash(r.school) }), asOf: now };
  const evaluate = (asOf: string) => evaluateRentalFields({ ...evaluationRequest, asOf }, r.ruleHistory, r.policyHistory, fields, r.income, r.school);
  const evaluated = evaluate(now);
  if (evaluated.status !== "evaluated" || evaluated.fieldVerdict !== "matched") return false;
  if (!same(r.plan.binding, { ...binding, media: "site" }) || !same(r.plan.source.version, target.version) || r.plan.expiresAt > r.expiresAt
    || r.manifest.publicPayload.hash !== contentHash(toPublicProperty(next)) || r.assets.length !== next.images.length
    || new Set(r.assets.map(a => a.url)).size !== r.assets.length || new Set(r.assets.map(a => a.assetId)).size !== r.assets.length) return false;
  for (const image of next.images) {
    const asset = r.assets.find(a => a.url === image.url);
    if (!asset || asset.kind !== (image.kind === "floorplan" ? "floorplan" : "photo") || !isOwnedImage(image.url, ownedStorageOrigin)) return false;
  }
  if (!same([...r.assets].map(({ assetId, kind, hash }) => ({ assetId, kind, hash })).sort((a, b) => a.assetId.localeCompare(b.assetId)),
    [...r.manifest.assets].sort((a, b) => a.assetId.localeCompare(b.assetId)))) return false;
  const permissions = matchPlanPermissionEvidence(r.plan, r.manifest, r.permissions, now);
  // Authenticity/actual image review/inventory authority come from lockCurrent, not this match boolean.
  if (!permissions.evidenceMatched) return false;
  const finalAt = new Date().toISOString();
  if (finalAt < now || finalAt >= r.expiresAt || !validateRentalImport(rental.data, new Date(finalAt), "published", false).ok
    || !isCurrentEvidence(rental.data.photoPermission.evidence.checkedAt, new Date(finalAt))) return false;
  const finalFields = evaluate(finalAt), finalPermissions = matchPlanPermissionEvidence(r.plan, r.manifest, r.permissions, finalAt);
  if (finalFields.status !== "evaluated" || finalFields.fieldVerdict !== "matched" || !finalPermissions.evidenceMatched) return false;
  const selected = resolveRule(r.ruleHistory, scope, finalAt);
  if (selected.status !== "selected" || selected.rule.criteria.market !== "residential_rental") return false;
  const maxAgeMs = selected.rule.criteria.maxEvidenceAgeHours! * 3600_000;
  const privateIncome = r.income as { observedAt: string };
  const deadlines = [Date.parse(r.expiresAt), Date.parse(r.plan.expiresAt),
    selected.rule.effectiveUntil ? Date.parse(selected.rule.effectiveUntil) : Infinity, policy.effectiveUntil ? Date.parse(policy.effectiveUntil) : Infinity,
    Date.parse(fields.observedAt) + maxAgeMs, Date.parse(privateIncome.observedAt) + maxAgeMs,
    Date.parse(fields.sourcePropertyUpdate!.updatedAt!) + policy.additionalChecks.propertyUpdateWindow.maxAgeHours * 3600_000 + 1,
    Date.parse(candidate.receivedAt) + MAIL_WINDOW_MS + 1,
    ...[rental.data.source.checkedAt, rental.data.source.listingEvidence.checkedAt, rental.data.source.rent.evidence.checkedAt,
      rental.data.companyIncome.evidence.checkedAt, rental.data.contentReview!.checkedAt, rental.data.photoPermission.evidence.checkedAt].map(t => Date.parse(t) + 24 * 3600_000 + 1)];
  return Date.now() < Math.min(...deadlines);
}

/** Update-only composition. No production singleton/route, new property, upload, media operation or legacy fallback. */
export function createReviewedMailImport(prisma: Pick<PrismaClient, "$transaction">, store?: ReviewedMailStore, ownedStorageOrigin?: string) {
  const writer = createPropertyWriteRequests(prisma, { localPublicationEffects: true, reviewedMailGuard: async (context, tx) => {
    const m = marker.safeParse(context.next.internal?.reviewedMailImport);
    if (!store || !ownedStorageOrigin || !m.success || !context.intakeReviewHash) return false;
    const fresh = reviewedMailRecordSchema.safeParse(await store.lockCurrent(tx, { propertyId: context.propertyId, operatorRef: context.actorRef,
      reviewRef: m.data.reviewRef, reviewHash: context.intakeReviewHash }));
    return fresh.success && contentHash(fresh.data) === context.intakeReviewHash && fresh.data.reviewRef === m.data.reviewRef
      && await validateLockedReview(fresh.data, context, tx, ownedStorageOrigin);
  } });
  async function run(raw: unknown, propertyId: string, operatorRef: string, apply: boolean): Promise<PropertyWriteResult> {
    const req = requestSchema.safeParse(raw);
    if (!req.success || !z.uuid().safeParse(propertyId).success || !actor.safeParse(operatorRef).success) return held("INVALID_REVIEWED_MAIL_REQUEST");
    if (!store || !ownedStorageOrigin) return held("REVIEWED_MAIL_STORE_UNCONFIGURED");
    try {
      const reference = { propertyId: propertyId.toLowerCase(), operatorRef, reviewRef: req.data.reviewRef, reviewHash: req.data.reviewHash };
      const snapshot = reviewedMailRecordSchema.safeParse(await store.readImmutable(reference));
      if (!snapshot.success || snapshot.data.reviewRef !== reference.reviewRef || snapshot.data.operatorRef !== operatorRef
        || snapshot.data.match.target.propertyId !== reference.propertyId || contentHash(snapshot.data) !== reference.reviewHash) return held("REVIEWED_MAIL_REFERENCE_MISMATCH");
      const record = snapshot.data;
      const command = { requestId: req.data.requestId, propertyId: reference.propertyId, actorRef: operatorRef,
        expectedUpdatedAt: record.match.target.version.updatedAt, expectedSourceHash: record.match.target.version.fullHash,
        intakeReviewHash: reference.reviewHash, patchJson: record.patchJson };
      return await writer[apply ? "apply" : "reconcile"](command);
    } catch { return { status: "unknown", reason: "STORE_OUTCOME_UNKNOWN" }; }
  }
  return { apply: (r: unknown, id: string, actor: string) => run(r, id, actor, true), reconcile: (r: unknown, id: string, actor: string) => run(r, id, actor, false) };
}
