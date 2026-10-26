// Synthetic only. No network, credentials, production rule defaults or runtime authority implementation.
import { fixture as rentalFixture } from "../../rental-import/__tests__/fixtures";
import { rentalContentDigest } from "../../rental-import/content-review";
import { rentalIdentity, validateRentalImport, type RentalImport } from "../../rental-import/validation";
import { reviewedMailRecordSchema } from "../../db/reviewed-mail-import";
import { toPublicProperty, type PropertyInput } from "../../property-shared";
import { createMailInbox, appendMailInbox } from "../local-mail-inbox";
import { fingerprintPropertySource } from "../source-fingerprint";
import { contentHash, type SyncRule } from "../rules";
import type { RentalEvaluationPolicy } from "../rental-field-evaluation";

export const syntheticMailId = "00000000-0000-4000-8000-000000000052";
export function reviewedMailFixture(at: string, baseJson?: string, sourceNotice = "", actors = { operatorRef: "synthetic-operator", reviewerRef: "synthetic-reviewer" }) {
  const { operatorRef, reviewerRef } = actors;
  const v: RentalImport = rentalFixture(), before = new Date(Date.parse(at) - 10_000).toISOString(), expiresAt = new Date(Date.parse(at) + 3600_000).toISOString();
  v.version = 2; delete v.reins;
  v.email = { messageId: "synthetic-reviewed-mail", receivedAt: at, adQuote: "PRIVATE_AD_EVIDENCE" };
  Object.assign(v.source, { checkedAt: at, availability: "available", applicationStatus: "not-applied", adQuote: "PRIVATE_AD_EVIDENCE",
    listingEvidence: { ...v.source.listingEvidence, checkedAt: at }, rent: { yen: 120000, evidence: { ...v.source.rent.evidence, checkedAt: at, quote: "賃料120000円" } },
    advertising: { status: "allowed", evidence: { checkedAt: at, reference: v.source.url, quote: "広告掲載可" } } });
  v.photoPermission = { status: "allowed", evidence: { checkedAt: at, reference: v.source.url, quote: "写真・間取り転載可" } };
  const { provider, roomId, building, address, unit } = v.source;
  v.companyIncome = { totalYen: 200000, basis: "company_total_including_ad", taxBasis: "included", certainty: "confirmed",
    source: { provider, roomId, building, address, unit }, messageId: v.email.messageId, reviewerRef,
    evidence: { checkedAt: at, reference: "synthetic-income-evidence", quote: "PRIVATE_REVIEWED_MAIL_INCOME" } };
  v.property.priceYen = 120000;
  if (v.property.spec.dealType !== "rental") throw new Error("INVALID_SYNTHETIC_SPEC");
  v.property.spec.layout = "2DK"; v.property.spec.exclusiveAreaSqm = 47;
  v.contentReview = { checkedAt: at, digest: rentalContentDigest(v.property), locales: ["ja"], reference: "synthetic-copy-review" };
  const base = baseJson ? JSON.parse(baseJson) : { ...v.property, id: syntheticMailId, slug: `rent-${rentalIdentity(v.source)}`, priceYen: 130000,
    priceNote: null, publishedAt: null, translations: null, internal: { rentalImport: { source: v.source }, operatorMemo: "PRIVATE_ORIGINAL_MEMO" },
    createdAt: before, updatedAt: before };
  const sourceJson = baseJson ?? JSON.stringify(base), fp = fingerprintPropertySource(sourceJson);
  if (fp.status !== "fingerprinted") throw new Error(fp.reason);
  const gate = validateRentalImport(v, new Date(at), "published"); if (!gate.ok) throw new Error("SYNTHETIC_RENTAL_GATE_INVALID");
  const reviewRef = "synthetic-reviewed-mail-52";
  const next: PropertyInput = { ...gate.property, slug: base.slug, status: base.status, publishedAt: base.publishedAt ?? undefined,
    internal: { ...base.internal, ...gate.property.internal, reviewedMailImport: { schemaVersion: 1, reviewRef } } };
  const patchJson = JSON.stringify({ ...next, priceNote: next.priceNote ?? null, publishedAt: next.publishedAt ?? null, translations: next.translations ?? null });
  const inbox = createMailInbox({ mailboxRef: "synthetic-mailbox" }, at);
  const recorded = appendMailInbox(inbox, { expectedHeadHash: inbox.headHash, mail: { schemaVersion: 1, mailboxRef: "synthetic-mailbox", messageId: v.email.messageId,
    receivedAt: at, receivedAtBasis: "provider_internal_date", folder: "incoming", subject: "合成確認用", attachmentsPresent: false,
    parts: [{ mimeType: "text/plain", decoding: "confirmed", decodedText: "物件名: 合成確認用\n取引種別: 賃貸\n用途: 居住用\n賃料: 120000円\n間取り: 2DK\n専有面積: 47㎡" + (sourceNotice ? `\n${sourceNotice}` : "") }] } }, at);
  if (recorded.status !== "recorded") throw new Error(recorded.reason);
  const candidate = recorded.journal.entries[0].candidate, target = { propertyId: base.id, episodeId: "synthetic-episode", version: fp.version };
  const identityEvidence = { evidenceRef: "synthetic-identity", messageKey: candidate.messageKey, candidateHash: contentHash(candidate), target,
    status: "confirmed", method: "manual_exact_room", confirmedAt: at, reviewerRef, sourceRef: "synthetic-source", identity: { building, address, unit } };
  const match = { mailboxRef: "synthetic-mailbox", messageKey: candidate.messageKey, candidateHash: contentHash(candidate), target,
    identityEvidenceRef: identityEvidence.evidenceRef, identityEvidenceHash: contentHash(identityEvidence) };
  const scope = { market: "residential_rental" as const, audience: "global" as const, clientRef: null };
  const rule: SyncRule = { id: "synthetic-mail-rule", version: 1, scope, effectiveFrom: before, effectiveUntil: expiresAt, status: "approved", approvedAt: before,
    approvalRef: "synthetic-only", criteria: { market: "residential_rental", rentMinYen: null, rentMaxYen: null, rentSelectionBasis: "company_income_total",
      minLayoutRooms: 1, preferredAreaSqm: null, leaseTypes: ["ordinary"], schoolScopeRef: "synthetic-bunkyo", companyIncomeMinYen: 200000, incomeTaxBasis: "included", maxEvidenceAgeHours: 24 } };
  const policy: RentalEvaluationPolicy = { id: "synthetic-mail-policy", version: 1, scope, ruleHash: contentHash(rule), effectiveFrom: before, effectiveUntil: expiresAt,
    status: "approved", approvedAt: before, approvalRef: "synthetic-only", rentBasis: "rent_only", minimumInclusive: true, maximumInclusive: true,
    roomCountBasis: "main_rooms_excluding_service_rooms", allowedKitchens: ["DK", "LDK"], normalizationContractRef: "synthetic-normalization",
    layoutAlternatives: [{ minimumMainRooms: 1, maximumMainRooms: 1, kitchens: ["LDK"] }, { minimumMainRooms: 2, maximumMainRooms: null, kitchens: ["DK", "LDK"] }],
    additionalChecks: { minimumArea: { mainRoomsAtLeast: 2, kitchens: ["DK", "LDK"], sqm: 47 },
      propertyUpdateWindow: { maxAgeHours: 336, boundary: "inclusive", basis: "elapsed_time" }, incomeBasis: "company_total_including_ad" } };
  const binding = { propertyId: base.id, episodeId: target.episodeId };
  const fields = { binding, sourceHash: fp.version.fullHash, observedAt: at, normalization: "confirmed", normalizationContractRef: policy.normalizationContractRef,
    rentYen: 120000, managementYen: null, mainRooms: 2, kitchen: "DK", areaSqm: 47, leaseType: "ordinary",
    sourcePropertyUpdate: { updatedAt: before, evidenceRef: "synthetic-source-update", basis: "source_listing_update" } };
  const income = { binding, sourceHash: fp.version.fullHash, observedAt: at, normalization: "confirmed", normalizationContractRef: policy.normalizationContractRef,
    evidenceRef: "synthetic-income", totalYen: 200000, basis: "company_total_including_ad", taxBasis: "included", certainty: "confirmed" };
  const plan = { schemaVersion: 1, executable: false, planId: "00000000-0000-4000-8000-000000000053", jobVersion: 1, createdAt: at, expiresAt,
    binding: { ...binding, media: "site" }, scope, rule: { id: rule.id, version: rule.version, hash: contentHash(rule) },
    source: { snapshotRef: reviewRef, capturedAt: at, version: fp.version }, listingBefore: { revision: 0, hash: "a".repeat(64) },
    intent: { desiredState: "published", managementId: null, publicId: null } };
  const assets = next.images.map((i, n) => ({ url: i.url, assetId: `synthetic-image-${n}`, kind: i.kind === "floorplan" ? "floorplan" : "photo", hash: (n === 0 ? "b" : "c").repeat(64) }));
  const manifest = { schemaVersion: 1, binding: plan.binding, scope, sourceVersion: fp.version, publicPayload: { normalizationVersion: 1, hash: contentHash(toPublicProperty(next)) },
    assets: assets.map(({ assetId, kind, hash }) => ({ assetId, kind, hash })), inventoryVerified: false };
  const common = { version: 1, binding: plan.binding, scope, effectiveFrom: before, effectiveUntil: expiresAt, status: "approved", approvedAt: before,
    approvalRef: "synthetic-only", evidenceRef: "synthetic-evidence", authorityRef: "synthetic-authority", acquisition: "manual_confirmed" };
  const permissions = [{ ...common, id: "synthetic-advertising", purpose: "advertising" },
    ...[{ assetId: "public-payload", kind: "public_payload", hash: manifest.publicPayload.hash }, ...manifest.assets].map(a => ({ ...common, id: `grant-${a.assetId}`,
      purpose: "material", assetId: a.assetId, assetKind: a.kind, contentHash: a.hash, publicReview: { status: "cleared", at: before, reviewerRef } }))];
  const review = reviewedMailRecordSchema.parse({ schemaVersion: 1, reviewRef, operatorRef, reviewerRef, status: "approved", approvedAt: at, expiresAt,
    match, inbox: recorded.journal, identityEvidence, patchJson, rental: v, ruleHistory: [rule], policyHistory: [policy], policyHash: contentHash(policy),
    fields, income, plan, manifest, permissions, assets });
  return { base: structuredClone(base), sourceJson, next: structuredClone(next), review: structuredClone(review) };
}
