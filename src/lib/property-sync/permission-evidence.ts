import { z } from "zod";
import { changePlanSchema } from "./change-plan";
import { contentHash, scopeSchema } from "./rules";

const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/);
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const instant = z.iso.datetime({ precision: 3 });
const common = {
  id, version: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  binding: changePlanSchema.shape.binding, scope: scopeSchema,
  effectiveFrom: instant, effectiveUntil: instant,
  status: z.enum(["pending", "approved", "denied", "revoked"]),
  approvedAt: instant.nullable(), approvalRef: id.nullable(), evidenceRef: id.nullable(), authorityRef: id.nullable(),
  acquisition: z.enum(["manual_confirmed", "official_export", "official_api", "mock", "unknown"]),
};
const review = z.object({ status: z.enum(["cleared", "blocked", "unreviewed"]), at: instant.nullable(), reviewerRef: id.nullable() }).strict();
export const permissionEvidenceSchema = z.discriminatedUnion("purpose", [
  z.object({ ...common, purpose: z.literal("advertising") }).strict(),
  z.object({ ...common, purpose: z.literal("material"), assetId: id,
    assetKind: z.enum(["public_payload", "photo", "floorplan"]), contentHash: hash, publicReview: review }).strict(),
]).superRefine((e, ctx) => {
  if (e.effectiveUntil <= e.effectiveFrom) ctx.addIssue({ code: "custom", message: "INVALID_PERMISSION_WINDOW" });
  if (e.purpose === "material" && ((e.assetId === "public-payload") !== (e.assetKind === "public_payload"))) {
    ctx.addIssue({ code: "custom", message: "INVALID_MATERIAL_ID" });
  }
});
export type PermissionEvidence = z.infer<typeof permissionEvidenceSchema>;
const manifestSchema = z.object({ schemaVersion: z.literal(1), binding: changePlanSchema.shape.binding, scope: scopeSchema,
  sourceVersion: changePlanSchema.shape.source.shape.version,
  publicPayload: z.object({ normalizationVersion: z.literal(1), hash }).strict(),
  assets: z.array(z.object({ assetId: id.refine(v => v !== "public-payload"), kind: z.enum(["photo", "floorplan"]), hash }).strict()).max(100),
  // Completeness must later be derived from the actual final payload, not asserted by an input flag.
  inventoryVerified: z.literal(false),
}).strict().refine(m => new Set(m.assets.map(a => a.assetId)).size === m.assets.length);
export const publicationManifestSchema = manifestSchema;
export type PublicationManifest = z.infer<typeof manifestSchema>;
type Target = { purpose: "advertising" } | { purpose: "material"; assetId: string; assetKind: "public_payload" | "photo" | "floorplan"; contentHash: string };
const held = (reason: string) => ({ status: "held" as const, executable: false as const, evidenceMatched: false as const, reason });

function selectEvidence(history: PermissionEvidence[], target: Target, now: string, expiresAt: string) {
  // Content hash/kind is checked AFTER selecting the latest asset family; filtering by hash would revive an older grant.
  const relevant = history.filter(e => e.purpose === target.purpose && (target.purpose === "advertising"
    || (e.purpose === "material" && e.assetId === target.assetId)));
  const identities = relevant.map(e => `${e.id}:${e.version}`);
  if (new Set(identities).size !== identities.length) return held("DUPLICATE_PERMISSION_VERSION");
  const started = relevant.filter(e => e.effectiveFrom <= now);
  if (!started.length) return held("PERMISSION_MISSING");
  if (new Set(started.map(e => e.id)).size !== 1) return held("AMBIGUOUS_PERMISSION_FAMILY");
  const selected = [...started].sort((a, b) => b.version - a.version)[0];
  if (started.some(e => e.version < selected.version && e.effectiveFrom > selected.effectiveFrom)) return held("PERMISSION_HISTORY_ORDER");
  if (selected.status !== "approved") return held("PERMISSION_NOT_APPROVED");
  if (!selected.approvedAt || selected.approvedAt > now || !selected.approvalRef || !selected.evidenceRef || !selected.authorityRef
    || selected.acquisition === "mock" || selected.acquisition === "unknown") return held("PERMISSION_UNCONFIRMED");
  if (now >= selected.effectiveUntil) return held("PERMISSION_EXPIRED");
  if (expiresAt > selected.effectiveUntil) return held("PERMISSION_EXPIRES_BEFORE_PLAN");
  // Any known successor, including pending/revoked or a new family, shortens this planning window.
  if (relevant.some(e => e.effectiveFrom > now && e.effectiveFrom < expiresAt)) return held("PERMISSION_CHANGES_BEFORE_PLAN");
  if (target.purpose === "material") {
    if (selected.purpose !== "material" || selected.assetKind !== target.assetKind || selected.contentHash !== target.contentHash) return held("MATERIAL_CONTENT_MISMATCH");
    if (selected.publicReview.status !== "cleared" || !selected.publicReview.at || selected.publicReview.at > now || !selected.publicReview.reviewerRef) return held("MATERIAL_REVIEW_UNCONFIRMED");
  }
  return { status: "selected" as const, evidence: selected };
}

/** Matches private evidence assertions only. It cannot certify authority, image pixels or inventory completeness. */
export function matchPlanPermissionEvidence(rawPlan: unknown, rawManifest: unknown, rawHistory: unknown, now: string) {
  try {
    const plan = changePlanSchema.safeParse(rawPlan), manifest = manifestSchema.safeParse(rawManifest), history = z.array(permissionEvidenceSchema).max(1000).safeParse(rawHistory);
    if (!plan.success || !manifest.success || !history.success || !instant.safeParse(now).success) return held("INVALID_PERMISSION_INPUT");
    if (plan.data.intent.desiredState !== "published") return held("NON_PUBLICATION_PLAN");
    if (now < plan.data.createdAt || now >= plan.data.expiresAt) return held("PLAN_OUTSIDE_VALID_TIME");
    if (contentHash(manifest.data.binding) !== contentHash(plan.data.binding) || contentHash(manifest.data.scope) !== contentHash(plan.data.scope)) return held("MANIFEST_BINDING_MISMATCH");
    if (contentHash(manifest.data.sourceVersion) !== contentHash(plan.data.source.version)) return held("MANIFEST_SOURCE_CONFLICT");
    const relevant = history.data.filter(e => contentHash(e.binding) === contentHash(plan.data.binding) && contentHash(e.scope) === contentHash(plan.data.scope));
    const targets: Target[] = [{ purpose: "advertising" }, { purpose: "material", assetId: "public-payload", assetKind: "public_payload", contentHash: manifest.data.publicPayload.hash },
      ...[...manifest.data.assets].sort((a, b) => a.assetId < b.assetId ? -1 : 1).map(a => ({ purpose: "material" as const, assetId: a.assetId, assetKind: a.kind, contentHash: a.hash }))];
    const references = [];
    for (const target of targets) {
      const result = selectEvidence(relevant, target, now, plan.data.expiresAt);
      if (result.status === "held") return result;
      references.push({ purpose: target.purpose, assetId: target.purpose === "material" ? target.assetId : null,
        evidenceId: result.evidence.id, version: result.evidence.version, hash: contentHash(result.evidence) });
    }
    const body = { planReference: { planId: plan.data.planId, jobVersion: plan.data.jobVersion, hash: contentHash(plan.data) },
      sourceVersion: plan.data.source.version, manifestHash: contentHash(manifest.data), checkedAt: now, expiresAt: plan.data.expiresAt, references };
    return { status: "held" as const, executable: false as const, evidenceMatched: true as const,
      reason: "PUBLICATION_PERMISSION_GATES_INCOMPLETE" as const, reference: { ...body, hash: contentHash(body) },
      pendingGates: ["EVIDENCE_AUTHENTICITY", "MATERIAL_INVENTORY_COMPLETENESS", "FINAL_PAYLOAD_AND_IMAGE_REVIEW", "WRITER_RECHECK"] as const };
  } catch { return held("INVALID_PERMISSION_INPUT"); }
}
