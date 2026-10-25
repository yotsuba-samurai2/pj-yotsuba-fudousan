import { randomUUID } from "node:crypto";
import { createChangePlan } from "./change-plan";
import { appendPlanRegistry, createPlanRegistry } from "./plan-registry";
import { appendCapacityRequest, createCapacityJournal } from "./capacity-reservations";
import { fingerprintPropertySnapshot } from "./source-fingerprint";
import { diagnoseStoredPlan } from "./plan-diagnostics";
import type { MediaState } from "./media-state";
import type { SyncRule } from "./rules";
import type { PermissionEvidence, PublicationManifest } from "./permission-evidence";

export const syntheticDiagnosticCases = ["baseline", "missing-permission", "unknown-capacity", "changed-source", "changed-plan"] as const;
export type SyntheticDiagnosticCase = typeof syntheticDiagnosticCases[number];
const label = { sourceOrigin: "synthetic_generated" as const, purpose: "diagnostic_demo" as const, executable: false as const,
  realSettingsVerified: false as const, realPermissionsVerified: false as const, mediaConnectionVerified: false as const };

/** Generates fictional data in memory at the real process clock. Never reads a property file or database. */
export function createSyntheticDiagnosticFixture(scenario: SyntheticDiagnosticCase = "baseline", media: MediaState["media"] = "athome") {
  if (!syntheticDiagnosticCases.includes(scenario)) throw new Error("UNKNOWN_SYNTHETIC_CASE");
  const createdAt = new Date().toISOString(), expiresAt = new Date(Date.parse(createdAt) + 3600000).toISOString(), propertyId = randomUUID();
  const record = { id: propertyId, slug: "synthetic-only", status: "draft", dealType: "rental", category: "other", tradeMode: "broker", title: "SYNTHETIC_PRIVATE_TITLE",
    priceYen: 123, priceNote: null, locationText: "SYNTHETIC_PRIVATE_ADDRESS", access: [], spec: { dealType: "rental" as const, exclusiveAreaSqm: 55, layout: "2DK", buildingType: "synthetic", structure: "synthetic", floors: "2", floorLocated: "1", builtYm: "2000-01", deliveryYm: "synthetic", accessText: "synthetic", managementFee: "synthetic", deposit: "synthetic", keyMoney: "synthetic", guaranteeDeposit: "synthetic", renewalFee: "synthetic", insurance: "synthetic", guarantor: "synthetic", otherFees: "synthetic", contractType: "synthetic", contractPeriod: "synthetic", conditions: "synthetic", internal: { ad: "SYNTHETIC_PRIVATE_NESTED_AD" } }, images: [], description: "SYNTHETIC_PRIVATE_DESCRIPTION",
    publishedAt: null, infoUpdatedAt: createdAt.slice(0, 10), nextUpdateAt: expiresAt.slice(0, 10), locales: ["ja"], translations: null,
    internal: { adNote: "SYNTHETIC_PRIVATE_AD" }, createdAt, updatedAt: createdAt };
  const metadata = { propertyId, episodeId: "synthetic-episode", market: "residential_rental" as const, snapshotRef: "synthetic-memory", capturedAt: createdAt };
  const fingerprint = fingerprintPropertySnapshot(JSON.stringify(record), JSON.stringify(metadata), createdAt);
  if (fingerprint.status !== "fingerprinted") throw new Error("SYNTHETIC_FIXTURE_INVALID");
  const state: MediaState = { schemaVersion: 1, propertyId, episodeId: metadata.episodeId, media,
    listing: { revision: 0, changedAt: createdAt, managementId: null, publicId: null, desiredState: "unconfigured", propertyVersion: fingerprint.snapshot.version }, observations: {} };
  // Deliberately fictional values exercise code branches; these are not Yotsuba business defaults.
  const rule: SyncRule = { id: "synthetic-rule", version: 1, scope: { market: "residential_rental", audience: "global", clientRef: null }, effectiveFrom: createdAt,
    effectiveUntil: expiresAt, status: "approved", approvedAt: createdAt, approvalRef: "synthetic-assumption", criteria: { market: "residential_rental", rentMinYen: 100,
      rentMaxYen: 200, minLayoutRooms: 2, preferredAreaSqm: null, leaseTypes: ["ordinary"], schoolScopeRef: "synthetic-school", companyIncomeMinYen: 100,
      incomeTaxBasis: "included", maxEvidenceAgeHours: 1 } };
  const planned = createChangePlan({ planId: randomUUID(), jobVersion: 1, expiresAt, intent: { desiredState: "published", managementId: null, publicId: media === "site" ? "synthetic-site-listing" : null } },
    { requestedScope: rule.scope, snapshot: fingerprint.snapshot, mediaState: state, ruleHistory: [rule] }, createdAt);
  if (planned.status !== "planned") throw new Error("SYNTHETIC_FIXTURE_INVALID");
  const empty = createPlanRegistry(planned.plan.binding, createdAt), registered = appendPlanRegistry(empty, { requestId: randomUUID(), actorRef: "synthetic-actor", at: createdAt,
    expected: { revision: 0, headHash: empty.headHash }, command: { type: "register", plan: planned.plan, expectedActive: null } }, createdAt);
  if (registered.status !== "recorded" || registered.outcome.status !== "registered") throw new Error("SYNTHETIC_FIXTURE_INVALID");
  const manifest: PublicationManifest = { schemaVersion: 1, binding: planned.plan.binding, scope: rule.scope, sourceVersion: planned.plan.source.version,
    publicPayload: { normalizationVersion: 1, hash: "c".repeat(64) }, assets: [], inventoryVerified: false };
  const common = { version: 1, binding: planned.plan.binding, scope: rule.scope, effectiveFrom: createdAt, effectiveUntil: expiresAt, status: "approved" as const,
    approvedAt: createdAt, approvalRef: "synthetic-assumption", evidenceRef: "synthetic-assumption", authorityRef: "synthetic-assumption", acquisition: "manual_confirmed" as const };
  const history: PermissionEvidence[] = scenario === "missing-permission" ? [] : [
    { ...common, id: "synthetic-ad", purpose: "advertising" }, { ...common, id: "synthetic-payload", purpose: "material", assetId: "public-payload",
      assetKind: "public_payload", contentHash: manifest.publicPayload.hash, publicReview: { status: "cleared", at: createdAt, reviewerRef: "synthetic-assumption" } }];
  const capacityScope = { media: state.media, accountRef: "synthetic-account", market: rule.scope.market, categoryRef: "synthetic-category", capacityPoolId: "synthetic-pool" };
  const capacityEmpty = createCapacityJournal(capacityScope, createdAt), unknownCapacity = scenario === "unknown-capacity";
  const capacity = appendCapacityRequest(capacityEmpty, { requestId: randomUUID(), actorRef: "synthetic-actor", at: createdAt,
    expected: { sequence: 0, headHash: capacityEmpty.headHash }, command: { type: "refresh", terminalAbsences: [],
      config: { version: 1, scope: capacityScope, confirmation: unknownCapacity ? "unconfirmed" : "confirmed", contractRef: unknownCapacity ? null : "synthetic-assumption",
        confirmedAt: unknownCapacity ? null : createdAt, isolation: "independent", limit: unknownCapacity ? null : 1, newListingUnits: 1, validFrom: createdAt, validUntil: expiresAt },
      snapshot: { version: 1, snapshotId: randomUUID(), scope: capacityScope, observedAt: createdAt, validUntil: expiresAt, used: 0, coverage: "complete",
        acquisition: "manual_confirmed", evidenceRef: "synthetic-assumption", includedReservations: [] } } }, createdAt);
  if (capacity.status !== "recorded" || capacity.outcome.status !== "applied") throw new Error("SYNTHETIC_FIXTURE_INVALID");
  return { createdAt, expiresAt, record, metadata, state, rule, planned, registered, manifest, history, capacityScope, capacity };
}

export async function runSyntheticDiagnostic(scenario: SyntheticDiagnosticCase) {
  const { createdAt, record, metadata, state, rule, planned, registered, manifest, history, capacityScope, capacity } = createSyntheticDiagnosticFixture(scenario);
  let registry = registered.journal;
  const unknownCapacity = scenario === "unknown-capacity";
  let registryReads = 0, sourceReads = 0;
  const generatedSnapshots: string[] = [];
  const result = await diagnoseStoredPlan({ binding: planned.plan.binding, scope: rule.scope, capacityScope, operation: "new_listing", reservationId: null }, {
    readRegistry: async () => {
      if (++registryReads === 3 && scenario === "changed-plan") {
        const at = new Date().toISOString(), next = appendPlanRegistry(registry, { requestId: randomUUID(), actorRef: "synthetic-actor", at,
          expected: { revision: registry.state.revision, headHash: registry.headHash }, command: { type: "register", expectedActive: planned.reference,
            plan: { ...planned.plan, planId: randomUUID(), jobVersion: 2 } } }, at);
        if (next.status !== "recorded" || next.outcome.status !== "registered") throw new Error("SYNTHETIC_FIXTURE_INVALID"); registry = next.journal;
      }
      return structuredClone(registry);
    },
    readInputs: async () => {
      if (++sourceReads === 2 && scenario === "changed-source") record.priceYen++;
      const generatedAt = new Date().toISOString(); generatedSnapshots.push(generatedAt);
      return { recordJson: JSON.stringify(record), metadataJson: JSON.stringify({ ...metadata, capturedAt: generatedAt }), mediaState: structuredClone(state), ruleHistory: [structuredClone(rule)] };
    },
    readPermissions: async () => structuredClone({ manifest, history }), readCapacity: async () => structuredClone(capacity.journal),
  });
  const expectedReason = scenario === "changed-source" ? "SAME_TIMESTAMP_HASH_CONFLICT" : scenario === "changed-plan" ? "PLAN_CHANGED_DURING_DIAGNOSTIC" : "EXECUTION_GATES_PENDING";
  const expectedPermission = scenario !== "missing-permission", expectedCapacityReason = unknownCapacity ? "CAPACITY_CONFIG_UNCONFIRMED" : "CAPACITY_REQUIRES_RESERVATION";
  const expectedPermissionReason = expectedPermission ? "PUBLICATION_PERMISSION_GATES_INCOMPLETE" : "PERMISSION_MISSING";
  const expectedResultMatched = result.executable === false && result.reason === expectedReason
    && (scenario === "changed-source" || scenario === "changed-plan" ? result.status === "held" && !result.diagnosticComplete
      : result.status === "diagnosed" && result.diagnosticComplete && result.checks.identity.matched && result.checks.permissions.evidenceMatched === expectedPermission
        && result.checks.permissions.reason === expectedPermissionReason && result.checks.capacity.reason === expectedCapacityReason)
    && result.pendingGates.includes("WRITER_FENCE") && result.pendingGates.includes("EXECUTION_APPROVAL");
  return { ...label, scenario, generatedAt: createdAt, syntheticSnapshotGeneratedAt: generatedSnapshots, expectedResultMatched,
    expected: { reason: expectedReason, executable: false as const, diagnosticComplete: scenario !== "changed-source" && scenario !== "changed-plan",
      checks: scenario === "changed-source" || scenario === "changed-plan" ? null : { permissionEvidenceMatched: expectedPermission,
        permissionReason: expectedPermissionReason, capacityReason: expectedCapacityReason } }, result };
}
