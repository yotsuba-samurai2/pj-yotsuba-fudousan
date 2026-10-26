// Synthetic authority assertions only. Never a production approval producer or an image verification routine.
import { mailAuthorityKeys } from "../../db/reviewed-mail-store";
import type { ReviewedMailRecord } from "../../db/reviewed-mail-import";
import { contentHash } from "../rules";
export function reviewedMailAuthorityFixture(r: ReviewedMailRecord) {
  const propertyId = r.match.target.propertyId, reviewHash = contentHash(r);
  const review = { reviewerRef: r.reviewerRef, evidenceRef: "synthetic-material-review", checkedAt: r.approvedAt, status: "cleared" };
  const data: Record<string, unknown> = {
    operator: { propertyId, operatorRef: r.operatorRef, canRead: true, canApply: true },
    reviewer: { propertyId, reviewerRef: r.reviewerRef, canApprove: true },
    episode: { propertyId, episodeId: r.match.target.episodeId },
    review: { propertyId, operatorRef: r.operatorRef, reviewRef: r.reviewRef, reviewHash },
    rules: { scope: r.plan.scope, history: r.ruleHistory }, policies: { scope: r.plan.scope, history: r.policyHistory },
    permissions: { binding: r.plan.binding, scope: r.plan.scope, history: r.permissions },
    materials: { binding: r.plan.binding, publicPayload: { hash: r.manifest.publicPayload.hash, ...review },
      assets: r.assets.map(a => ({ ...a, ...review, storageVersionRef: `synthetic-version-${a.assetId}` })) },
  };
  return { reference: { propertyId, operatorRef: r.operatorRef, reviewRef: r.reviewRef, reviewHash },
    recordRow: { review_ref: r.reviewRef, property_id: propertyId, operator_ref: r.operatorRef, review_hash: reviewHash, record_json: JSON.stringify(r) },
    headRows: mailAuthorityKeys(r).map(key => {
      const payload = { schemaVersion: 1, status: "active", validFrom: r.approvedAt, validUntil: r.expiresAt, data: data[key.kind] };
      return { ...key, revision: 1, payload_hash: contentHash(payload), payload_json: JSON.stringify(payload) };
    }) };
}
