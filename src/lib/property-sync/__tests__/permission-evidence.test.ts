import { expect, it } from "vitest";
import { matchPlanPermissionEvidence, type PermissionEvidence, type PublicationManifest } from "../permission-evidence";
import type { ChangePlan } from "../change-plan";
import { contentHash } from "../rules";
import { mediaState, now } from "./fixtures";

const expiry = "2026-10-24T13:00:00.000Z";
function fixture() {
  const state = mediaState();
  const plan: ChangePlan = { schemaVersion: 1, executable: false, planId: "00000000-0000-4000-8000-000000000002", jobVersion: 1,
    createdAt: now, expiresAt: expiry, binding: { propertyId: state.propertyId, episodeId: state.episodeId, media: state.media },
    scope: { market: "residential_rental", audience: "global", clientRef: null }, rule: { id: "synthetic", version: 1, hash: "a".repeat(64) },
    source: { snapshotRef: "synthetic", capturedAt: now, version: state.listing.propertyVersion },
    listingBefore: { revision: 1, hash: contentHash(state.listing) }, intent: { desiredState: "published", managementId: null, publicId: null } };
  const manifest: PublicationManifest = { schemaVersion: 1, binding: structuredClone(plan.binding), scope: structuredClone(plan.scope),
    sourceVersion: structuredClone(plan.source.version), publicPayload: { normalizationVersion: 1, hash: "b".repeat(64) },
    assets: [{ assetId: "photo-1", kind: "photo", hash: "c".repeat(64) }, { assetId: "floor-1", kind: "floorplan", hash: "d".repeat(64) }], inventoryVerified: false };
  const common = { id: "synthetic-ad", version: 1, binding: structuredClone(plan.binding), scope: structuredClone(plan.scope),
    effectiveFrom: "2026-10-24T10:00:00.000Z", effectiveUntil: "2026-10-24T14:00:00.000Z", status: "approved" as const,
    approvedAt: now, approvalRef: "PRIVATE_APPROVAL_REF", evidenceRef: "PRIVATE_EVIDENCE_REF", authorityRef: "PRIVATE_AUTHORITY_REF", acquisition: "manual_confirmed" as const };
  const history: PermissionEvidence[] = [{ ...common, purpose: "advertising" },
    { ...common, id: "synthetic-payload", purpose: "material", assetId: "public-payload", assetKind: "public_payload", contentHash: manifest.publicPayload.hash,
      publicReview: { status: "cleared", at: now, reviewerRef: "PRIVATE_REVIEWER_REF" } },
    ...manifest.assets.map(a => ({ ...common, id: "synthetic-" + a.assetId, purpose: "material" as const, assetId: a.assetId, assetKind: a.kind, contentHash: a.hash,
      publicReview: { status: "cleared" as const, at: now, reviewerRef: "PRIVATE_REVIEWER_REF" } }))];
  return structuredClone({ plan, manifest, history });
}
function run(f = fixture(), at = now) { return matchPlanPermissionEvidence(f.plan, f.manifest, f.history, at); }

it("広告・payload・全申告素材の根拠版を結び付けても実行gateは保留", () => {
  const f = fixture(), before = structuredClone(f), result = run(f);
  expect(result).toMatchObject({ status: "held", executable: false, evidenceMatched: true,
    reason: "PUBLICATION_PERMISSION_GATES_INCOMPLETE", reference: { planReference: { hash: contentHash(f.plan) }, manifestHash: contentHash(f.manifest),
      checkedAt: now, expiresAt: expiry, references: expect.arrayContaining([expect.objectContaining({ purpose: "advertising" }), expect.objectContaining({ assetId: "photo-1" })]) },
    pendingGates: expect.arrayContaining(["MATERIAL_INVENTORY_COMPLETENESS", "FINAL_PAYLOAD_AND_IMAGE_REVIEW"]) });
  expect(f).toEqual(before);
  expect(JSON.stringify(result)).not.toMatch(/PRIVATE_|approvalRef|evidenceRef|authorityRef|reviewerRef/);
  expect(run({ ...f, history: [...f.history].reverse() })).toEqual(result);
});

it.each(["media", "episode", "property", "market", "client"])("許諾の%s境界をまたいで流用しない", key => {
  const f = fixture();
  for (const grant of f.history) {
    if (key === "media") grant.binding.media = "site";
    if (key === "episode") grant.binding.episodeId = "another-episode";
    if (key === "property") grant.binding.propertyId = "00000000-0000-4000-8000-000000000003";
    if (key === "market") grant.scope.market = "sale";
    if (key === "client") grant.scope = { ...grant.scope, audience: "client", clientRef: "client-test" };
  }
  expect(run(f)).toMatchObject({ evidenceMatched: false, reason: "PERMISSION_MISSING" });
});

it.each(["advertising", "payload", "photo", "floorplan"])("%sだけの許諾欠落を他の根拠で補わない", missing => {
  const f = fixture();
  f.history = f.history.filter(e => missing === "advertising" ? e.purpose !== "advertising"
    : e.purpose !== "material" || e.assetId !== (missing === "payload" ? "public-payload" : missing === "photo" ? "photo-1" : "floor-1"));
  expect(run(f)).toMatchObject({ evidenceMatched: false, reason: "PERMISSION_MISSING" });
});

it.each(["pending", "denied", "revoked", "expired"])("最新版%sから承認済み旧版へ戻らない", status => {
  const f = fixture(), latest = { ...f.history[0], version: 2 };
  if (status === "expired") latest.effectiveUntil = now;
  else latest.status = status as "pending" | "denied" | "revoked";
  f.history.push(latest);
  expect(run(f)).toMatchObject({ reason: status === "expired" ? "PERMISSION_EXPIRED" : "PERMISSION_NOT_APPROVED", evidenceMatched: false });
});

it.each(["missing-ref", "future-approval", "mock", "unknown"])("未確認の広告根拠%sを昇格させない", kind => {
  const f = fixture(), evidence = f.history[0];
  if (kind === "missing-ref") evidence.authorityRef = null;
  if (kind === "future-approval") evidence.approvedAt = "2026-10-24T12:00:00.001Z";
  if (kind === "mock" || kind === "unknown") evidence.acquisition = kind;
  expect(run(f)).toMatchObject({ reason: "PERMISSION_UNCONFIRMED" });
});

it.each(["hash", "kind"])("素材の最新版%sが違っても古い一致版へ戻らない", change => {
  const f = fixture(), latest = structuredClone(f.history[2]);
  if (latest.purpose !== "material") throw new Error("fixture");
  latest.version = 2;
  if (change === "hash") latest.contentHash = "e".repeat(64);
  else latest.assetKind = "floorplan";
  f.history.push(latest);
  expect(run(f)).toMatchObject({ reason: "MATERIAL_CONTENT_MISMATCH" });
});

it.each(["blocked", "unreviewed", "future", "missing-reviewer"])("素材の公開確認%sを許可の記載だけで通さない", kind => {
  const f = fixture(), material = f.history[2];
  if (material.purpose !== "material") throw new Error("fixture");
  if (kind === "blocked" || kind === "unreviewed") material.publicReview.status = kind;
  if (kind === "future") material.publicReview.at = "2026-10-24T12:00:00.001Z";
  if (kind === "missing-reviewer") material.publicReview.reviewerRef = null;
  expect(run(f)).toMatchObject({ reason: "MATERIAL_REVIEW_UNCONFIRMED" });
});

it("既知の後続版が計画期間内に始まる場合は保留し、同じ失効境界は許容", () => {
  const f = fixture();
  f.history.push({ ...f.history[0], version: 2, status: "revoked", effectiveFrom: "2026-10-24T12:30:00.000Z" });
  expect(run(f)).toMatchObject({ reason: "PERMISSION_CHANGES_BEFORE_PLAN" });
  f.history.at(-1)!.effectiveFrom = expiry;
  expect(run(f)).toMatchObject({ evidenceMatched: true, executable: false });
  f.history[0].effectiveUntil = "2026-10-24T12:30:00.000Z";
  expect(run(f)).toMatchObject({ reason: "PERMISSION_EXPIRES_BEFORE_PLAN" });
});

it.each(["duplicate", "family", "order"])("曖昧な履歴%sを保留", kind => {
  const f = fixture(), next = structuredClone(f.history[0]);
  if (kind === "family") next.id = "another-family";
  if (kind === "order") { next.version = 2; next.effectiveFrom = "2026-10-24T09:00:00.000Z"; }
  f.history.push(next);
  expect(run(f)).toMatchObject({ reason: kind === "duplicate" ? "DUPLICATE_PERMISSION_VERSION" : kind === "family" ? "AMBIGUOUS_PERMISSION_FAMILY" : "PERMISSION_HISTORY_ORDER" });
});

it.each(["binding", "scope", "source", "duplicate-asset"])("manifestの%s不整合を保留", change => {
  const f = fixture();
  if (change === "binding") f.manifest.binding.media = "site";
  if (change === "scope") f.manifest.scope.market = "business";
  if (change === "source") f.manifest.sourceVersion.fullHash = "e".repeat(64);
  if (change === "duplicate-asset") f.manifest.assets.push({ ...f.manifest.assets[0], hash: "e".repeat(64) });
  expect(run(f).evidenceMatched).toBe(false);
});

it("申告素材を省略しても素材集合の完全性は合格へ昇格しない", () => {
  const f = fixture(); f.manifest.assets = [];
  expect(run(f)).toMatchObject({ evidenceMatched: true, executable: false, pendingGates: expect.arrayContaining(["MATERIAL_INVENTORY_COMPLETENESS"]) });
  expect(matchPlanPermissionEvidence(f.plan, { ...f.manifest, inventoryVerified: true }, f.history, now)).toMatchObject({ evidenceMatched: false });
});

it("同時刻の期限切れ・未開始・取下げ計画を広告許可の評価で実行可能にしない", () => {
  const f = fixture();
  expect(run(f, expiry)).toMatchObject({ reason: "PLAN_OUTSIDE_VALID_TIME" });
  expect(run(f, "2026-10-24T11:59:59.999Z")).toMatchObject({ reason: "PLAN_OUTSIDE_VALID_TIME" });
  f.plan.intent.desiredState = "not_published";
  expect(run(f)).toMatchObject({ reason: "NON_PUBLICATION_PLAN" });
});

it("根拠本文/未知ネストを入力・出力に混入させない", () => {
  const f = fixture();
  const result = matchPlanPermissionEvidence(f.plan, f.manifest, [{ ...f.history[0], raw: { ad: "PRIVATE_CANARY" } }, ...f.history.slice(1)], now);
  expect(result).toMatchObject({ reason: "INVALID_PERMISSION_INPUT", evidenceMatched: false });
  expect(JSON.stringify(result)).not.toContain("PRIVATE_CANARY");
});
