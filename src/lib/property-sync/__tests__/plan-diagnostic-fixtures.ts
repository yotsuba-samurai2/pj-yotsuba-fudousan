import { randomUUID } from "node:crypto";
import { vi } from "vitest";
import { createChangePlan, type PlanContext } from "../change-plan";
import { appendPlanRegistry, createPlanRegistry } from "../plan-registry";
import { fingerprintPropertySnapshot } from "../source-fingerprint";
import { appendCapacityRequest, createCapacityJournal, type CapacityRequest } from "../capacity-reservations";
import { contentHash, type SyncRule } from "../rules";
import type { PermissionEvidence, PublicationManifest } from "../permission-evidence";
import { mediaState, now } from "./fixtures";

export const checkedAt = "2026-10-24T12:01:00.000Z", expiresAt = "2026-10-24T13:00:00.000Z";
export function diagnosticFixture(reserved = false) {
  const state = mediaState();
  const record = { id: state.propertyId, slug: "synthetic", status: "published", dealType: "rental", category: "other", tradeMode: "broker", title: "PRIVATE_TITLE",
    priceYen: 123, priceNote: null, locationText: "PRIVATE_ADDRESS", access: [], spec: { area: 55 }, images: [], description: "PRIVATE_DESCRIPTION", publishedAt: null,
    infoUpdatedAt: "2026-10-24", nextUpdateAt: "2026-10-25", locales: ["ja"], translations: null, internal: { adNote: "PRIVATE_AD" },
    createdAt: state.listing.propertyVersion.updatedAt, updatedAt: state.listing.propertyVersion.updatedAt };
  const metadata = { propertyId: state.propertyId, episodeId: state.episodeId, market: "residential_rental", snapshotRef: "synthetic", capturedAt: now };
  const fingerprint = fingerprintPropertySnapshot(JSON.stringify(record), JSON.stringify(metadata), now);
  if (fingerprint.status !== "fingerprinted") throw new Error(fingerprint.reason);
  state.listing.propertyVersion = fingerprint.snapshot.version;
  const rule: SyncRule = { id: "synthetic-rule", version: 1, scope: { market: "residential_rental", audience: "global", clientRef: null }, effectiveFrom: now, effectiveUntil: null,
    status: "approved", approvedAt: now, approvalRef: "PRIVATE_RULE", criteria: { market: "residential_rental", rentMinYen: 100, rentMaxYen: 200, minLayoutRooms: 2,
      preferredAreaSqm: null, leaseTypes: ["ordinary"], schoolScopeRef: "synthetic", companyIncomeMinYen: 100, incomeTaxBasis: "included", maxEvidenceAgeHours: 1 } };
  const context: PlanContext = { requestedScope: rule.scope, snapshot: fingerprint.snapshot, mediaState: state, ruleHistory: [rule] };
  const planned = createChangePlan({ planId: randomUUID(), jobVersion: 1, expiresAt, intent: { desiredState: "published", managementId: null, publicId: null } }, context, now);
  if (planned.status !== "planned") throw new Error(planned.reason);
  const empty = createPlanRegistry(planned.plan.binding, now);
  const registration = appendPlanRegistry(empty, { requestId: randomUUID(), actorRef: "synthetic", at: now, expected: { revision: 0, headHash: empty.headHash },
    command: { type: "register", plan: planned.plan, expectedActive: null } }, now);
  if (registration.status !== "recorded") throw new Error(registration.reason);
  const data = { recordJson: JSON.stringify(record), metadataJson: JSON.stringify({ ...metadata, capturedAt: checkedAt }), mediaState: state, ruleHistory: [rule] };
  const manifest: PublicationManifest = { schemaVersion: 1, binding: planned.plan.binding, scope: rule.scope, sourceVersion: planned.plan.source.version,
    publicPayload: { normalizationVersion: 1, hash: "c".repeat(64) }, assets: [], inventoryVerified: false };
  const common = { version: 1, binding: planned.plan.binding, scope: rule.scope, effectiveFrom: now, effectiveUntil: expiresAt,
    status: "approved" as const, approvedAt: now, approvalRef: "PRIVATE_PERMISSION", evidenceRef: "PRIVATE_EVIDENCE", authorityRef: "PRIVATE_AUTHORITY", acquisition: "manual_confirmed" as const };
  const history: PermissionEvidence[] = [{ ...common, id: "synthetic-ad", purpose: "advertising" }, { ...common, id: "synthetic-payload", purpose: "material",
    assetId: "public-payload", assetKind: "public_payload", contentHash: manifest.publicPayload.hash, publicReview: { status: "cleared", at: now, reviewerRef: "PRIVATE_REVIEWER" } }];
  const permissions = { manifest, history }, capacityScope = { media: state.media, accountRef: "PRIVATE_ACCOUNT", market: rule.scope.market, categoryRef: "PRIVATE_CATEGORY", capacityPoolId: "PRIVATE_POOL" };
  let capacity = createCapacityJournal(capacityScope, now);
  const refresh: CapacityRequest["command"] = { type: "refresh", config: { version: 1, scope: capacityScope, confirmation: "confirmed", contractRef: "PRIVATE_CONTRACT", confirmedAt: now,
    isolation: "independent", limit: 1, newListingUnits: 1, validFrom: now, validUntil: expiresAt }, snapshot: { version: 1, snapshotId: randomUUID(), scope: capacityScope,
    observedAt: now, validUntil: expiresAt, used: 0, coverage: "complete", acquisition: "manual_confirmed", evidenceRef: "PRIVATE_SNAPSHOT", includedReservations: [] }, terminalAbsences: [] };
  const apply = (command: CapacityRequest["command"]) => {
    const result = appendCapacityRequest(capacity, { requestId: randomUUID(), actorRef: "synthetic", at: now, expected: { sequence: capacity.events.length, headHash: capacity.headHash }, command }, now);
    if (result.status !== "recorded" || result.outcome.status !== "applied") throw new Error("fixture"); capacity = result.journal;
  };
  apply(refresh);
  const reservationId = reserved ? randomUUID() : null;
  if (reservationId) apply({ type: "reserve", reservationId, plan: planned.plan, operation: "new_listing", expiresAt });
  const request = { binding: planned.plan.binding, scope: rule.scope, capacityScope, operation: "new_listing" as const, reservationId };
  const readers = { readRegistry: vi.fn(async () => structuredClone(registration.journal)), readInputs: vi.fn(async () => structuredClone(data)),
    readPermissions: vi.fn(async () => structuredClone(permissions)), readCapacity: vi.fn(async () => structuredClone(capacity)) };
  vi.setSystemTime(new Date(checkedAt));
  return { request, readers, planned, data, record, rule, registration, capacity, permissions, refresh, apply, empty, sourceHash: contentHash(record) };
}
