import { randomUUID } from "node:crypto";
import { toPublicProperty, type AdminProperty, type PublicProperty } from "../property-shared";
import { createSyntheticDiagnosticFixture } from "./synthetic-diagnostic";
import { appendCapacityRequest, verifyCapacityJournal, type CapacityRequest } from "./capacity-reservations";
import { diagnoseStoredPlan } from "./plan-diagnostics";
import { appendMediaAudit, createMediaJournal, verifyMediaJournal, type AuditRequest } from "./audit";
import { currentMediaObservation, type MediaResult, type MediaState } from "./media-state";
import { contentHash } from "./rules";

export const syntheticWorkflowCases = ["workflow-success", "workflow-missing-permission", "workflow-unknown-capacity", "workflow-unconfirmed-rule",
  "workflow-unconfirmed-review", "workflow-source-conflict", "workflow-writer-conflict", "workflow-duplicate", "workflow-request-conflict",
  "workflow-response-lost", "workflow-response-unknown", "workflow-readback-mismatch"] as const;
export type SyntheticWorkflowCase = typeof syntheticWorkflowCases[number];
const expectedReasons: Record<SyntheticWorkflowCase, string> = {
  "workflow-success": "SIMULATED_READBACK_MATCHED", "workflow-missing-permission": "PERMISSION_MISSING",
  "workflow-unknown-capacity": "CAPACITY_CONFIG_UNCONFIRMED", "workflow-unconfirmed-rule": "RULE_NOT_APPROVED",
  "workflow-unconfirmed-review": "SIMULATION_REVIEW_REQUIRED", "workflow-source-conflict": "SAME_TIMESTAMP_HASH_CONFLICT",
  "workflow-writer-conflict": "LISTING_VERSION_CONFLICT", "workflow-duplicate": "SIMULATED_READBACK_MATCHED",
  "workflow-request-conflict": "REQUEST_ID_CONFLICT", "workflow-response-lost": "SIMULATED_READBACK_MATCHED",
  "workflow-response-unknown": "SIMULATION_OUTCOME_UNKNOWN", "workflow-readback-mismatch": "SIMULATION_READBACK_MISMATCH",
};
const label = { sourceOrigin: "synthetic_generated" as const, purpose: "workflow_demo" as const, executable: false as const,
  realSettingsVerified: false as const, realPermissionsVerified: false as const, mediaConnectionVerified: false as const, realPublicationVerified: false as const };
type Step = { stage: string; status: string; reason: string; referenceHash?: string };

/** Test-only storage seam. Only a generated property is passed; media remains mocked. */
export interface SyntheticAuditStore {
  initialize(state: MediaState, record: ReturnType<typeof createSyntheticDiagnosticFixture>["record"]): Promise<void>;
  read(): Promise<unknown>;
  apply(request: AuditRequest): Promise<MediaResult & { replayed?: boolean }>;
}

/** Generated inputs/mock media only. The CLI exposes no database URL, credentials or live mode. */
export async function runSyntheticWorkflow(scenario: SyntheticWorkflowCase, auditStore?: SyntheticAuditStore) {
  if (!syntheticWorkflowCases.includes(scenario)) throw new Error("UNKNOWN_SYNTHETIC_CASE");
  const f = createSyntheticDiagnosticFixture(scenario === "workflow-missing-permission" ? "missing-permission"
    : scenario === "workflow-unknown-capacity" ? "unknown-capacity" : "baseline", "site");
  const at = () => new Date().toISOString();
  let capacity = f.capacity.journal;
  let local = createMediaJournal(f.state), target = createMediaJournal(f.state);
  const reloadLocal = async () => {
    if (!auditStore) return;
    const checked = verifyMediaJournal(await auditStore.read());
    if (!checked || checked.state.propertyId !== f.state.propertyId || checked.state.episodeId !== f.state.episodeId || checked.state.media !== f.state.media) {
      throw new Error("SYNTHETIC_AUDIT_READBACK_INVALID");
    }
    local = checked;
  };
  if (auditStore) {
    try { await auditStore.initialize(structuredClone(f.state), structuredClone(f.record)); await reloadLocal(); }
    catch { throw new Error("SYNTHETIC_AUDIT_INITIALIZATION_FAILED"); }
  }
  let targetPayload: PublicProperty | null = null;
  let submissionCalls = 0, mutations = 0, duplicateReplayed = false, unknownResolvedByReadback = false;
  let reservationId: string | null = null;
  const steps: Step[] = [{ stage: "plan", status: "planned", reason: "SYNTHETIC_PLAN_REGISTERED", referenceHash: f.planned.reference.hash }];
  const proposed: AdminProperty = { ...f.record, status: "published", dealType: "rental", category: "other", tradeMode: "broker",
    priceNote: undefined, publishedAt: f.createdAt, locales: ["ja"], translations: undefined };
  const payload = toPublicProperty(proposed), payloadHash = contentHash(payload);
  const internalExcluded = !/SYNTHETIC_PRIVATE_(?:AD|NESTED_AD)"|"internal"|"adNote"/.test(JSON.stringify(payload));
  if (!internalExcluded) throw new Error("SYNTHETIC_PUBLIC_PROJECTION_FAILED");
  f.manifest.publicPayload.hash = payloadHash;
  for (const evidence of f.history) if (evidence.purpose === "material") evidence.contentHash = payloadHash;
  if (scenario === "workflow-unconfirmed-rule") f.rule.status = "pending";
  const readers = {
    readRegistry: async () => structuredClone(f.registered.journal),
    readInputs: async () => {
      await reloadLocal();
      return { recordJson: JSON.stringify(f.record), metadataJson: JSON.stringify({ ...f.metadata, capturedAt: at() }),
        mediaState: structuredClone(local.state), ruleHistory: [structuredClone(f.rule)] };
    },
    readPermissions: async () => structuredClone({ manifest: f.manifest, history: f.history }),
    readCapacity: async () => structuredClone(capacity),
  };
  const diagnose = () => diagnoseStoredPlan({ binding: f.planned.plan.binding, scope: f.rule.scope, capacityScope: f.capacityScope,
    operation: "new_listing", reservationId }, readers);
  const changeCapacity = (command: CapacityRequest["command"]) => {
    const now = at(), result = appendCapacityRequest(capacity, { requestId: randomUUID(), actorRef: "synthetic-workflow", at: now,
      expected: { sequence: capacity.events.length, headHash: capacity.headHash }, command }, now);
    if (result.status === "recorded") capacity = result.journal;
    return result.status === "held" ? result.reason : result.outcome.status === "held" ? result.outcome.reason! : null;
  };
  const finish = (status: "simulated" | "held" | "unknown", reason: string) => {
    const integrityVerified = !!verifyMediaJournal(local) && !!verifyMediaJournal(target) && !!verifyCapacityJournal(capacity);
    const requestEvents = target.events.filter(e => e.actorRef === "synthetic-workflow" && e.outcome.status === "applied");
    const expectedWrites = ["workflow-success", "workflow-duplicate", "workflow-request-conflict", "workflow-response-lost",
      "workflow-response-unknown", "workflow-readback-mismatch"].includes(scenario) ? 1 : 0;
    const pc = local.state.observations.pc, mobile = local.state.observations.mobileWeb;
    const matched = !!pc && !!mobile && pc.contentHash === payloadHash && mobile.contentHash === payloadHash;
    const expectedStatus = reason === "SIMULATED_READBACK_MATCHED" ? "simulated" : reason === "SIMULATION_OUTCOME_UNKNOWN" ? "unknown" : "held";
    const expectedResultMatched = reason === expectedReasons[scenario] && status === expectedStatus && integrityVerified && internalExcluded
      && mutations === expectedWrites && requestEvents.length === expectedWrites
      && (status !== "simulated" || matched) && (scenario !== "workflow-duplicate" || duplicateReplayed)
      && (scenario !== "workflow-response-lost" || (unknownResolvedByReadback && submissionCalls === 1))
      && (scenario !== "workflow-response-unknown" || (submissionCalls === 1 && !unknownResolvedByReadback && !pc && !mobile));
    return { ...label, scenario, generatedAt: f.createdAt, expectedResultMatched,
      expected: { reason: expectedReasons[scenario], mockMutations: expectedWrites },
      result: { status, reason, executable: false as const, auditPersistence: auditStore ? "injected_test_store" : "in_memory", pendingGates: initial.pendingGates, mockMutations: mutations, submissionCalls, duplicateReplayed, unknownResolvedByReadback,
        mockReadbackMatched: matched, internalExcluded, integrityVerified,
        realObservationAvailable: !!currentMediaObservation(local.state, "pc", at(), 3600000) || !!currentMediaObservation(local.state, "mobileWeb", at(), 3600000),
        reservationPhase: capacity.state.reservations[0]?.phase ?? null,
        mockTarget: { desiredState: target.state.listing.desiredState, listingRevision: target.state.listing.revision, payloadHash: targetPayload ? contentHash(targetPayload) : null },
        publicPreview: { slug: payload.slug, status: payload.status, dealType: payload.dealType, payloadHash },
        audit: { planEvents: f.registered.journal.events.length, capacityEvents: capacity.events.length, mediaEvents: local.events.length,
          mockTargetEvents: target.events.length, mediaHeadHash: local.headHash, mockTargetHeadHash: target.headHash },
        steps } };
  };
  const issue = (d: Awaited<ReturnType<typeof diagnose>>, reserved: boolean) => d.status !== "diagnosed" ? d.reason
    : !d.checks.permissions.evidenceMatched ? d.checks.permissions.reason
    : d.checks.capacity.state !== (reserved ? "reserved" : "unreserved") ? d.checks.capacity.reason
    : !reserved && d.checks.capacity.reason !== "CAPACITY_REQUIRES_RESERVATION" ? d.checks.capacity.reason : null;
  const initial = await diagnose(), initialIssue = issue(initial, false);
  steps.push({ stage: "preflight", status: initialIssue ? "held" : "checked", reason: initialIssue ?? "LOCAL_CHECKS_MATCHED_EXTERNAL_GATES_PENDING" });
  if (initialIssue) return finish("held", initialIssue);
  reservationId = randomUUID();
  const reservationIssue = changeCapacity({ type: "reserve", reservationId, plan: f.planned.plan, operation: "new_listing", expiresAt: f.expiresAt });
  if (reservationIssue) return finish("held", reservationIssue);
  const reserved = await diagnose(), reservedIssue = issue(reserved, true);
  if (reservedIssue) return finish("held", reservedIssue);
  // A synthetic test acknowledgement, never human execution approval or a change to a real gate.
  const confirmation = { plan: f.planned.reference, binding: f.planned.plan.binding, registryHeadHash: f.registered.journal.headHash,
    source: f.planned.plan.source.version, listingBefore: f.planned.plan.listingBefore, payloadHash,
    permissionsHash: contentHash({ manifest: f.manifest, history: f.history }), capacityHeadHash: capacity.headHash,
    targetListingHash: contentHash(target.state.listing) };
  const confirmationHash = contentHash(confirmation);
  steps.push({ stage: "confirm", status: scenario === "workflow-unconfirmed-review" ? "held" : "synthetic_confirmed",
    reason: scenario === "workflow-unconfirmed-review" ? "SIMULATION_REVIEW_REQUIRED" : "SYNTHETIC_CONFIRMATION_ONLY", referenceHash: confirmationHash });
  if (scenario === "workflow-unconfirmed-review") return finish("held", "SIMULATION_REVIEW_REQUIRED");
  if (scenario === "workflow-source-conflict") f.record.priceYen++;
  const final = await diagnose(), finalIssue = issue(final, true);
  if (finalIssue) { steps.push({ stage: "recheck", status: "held", reason: finalIssue }); return finish("held", finalIssue); }
  if (contentHash(target.state.listing) !== confirmation.targetListingHash || payloadHash !== confirmation.payloadHash
    || contentHash({ manifest: f.manifest, history: f.history }) !== confirmation.permissionsHash || capacity.headHash !== confirmation.capacityHeadHash) {
    return finish("held", "SIMULATION_CONFIRMATION_CHANGED");
  }
  const attemptId = randomUUID(), attemptIssue = changeCapacity({ type: "begin_attempt", reservationId, planReference: f.planned.reference, attemptId });
  if (attemptIssue) return finish("held", attemptIssue);
  const request: AuditRequest = { requestId: randomUUID(), actorRef: "synthetic-workflow", at: at(), command: { type: "set_listing", ...f.planned.plan.binding,
    expectedListingRevision: f.planned.plan.listingBefore.revision, listing: { ...f.planned.plan.intent, propertyVersion: f.planned.plan.source.version } } };
  if (scenario === "workflow-writer-conflict") {
    // A competing local actor changes the target after recheck; the old command must fail its own CAS.
    const competing = appendMediaAudit(target, { ...request, requestId: randomUUID(), actorRef: "synthetic-other",
      command: { ...request.command as object, listing: { ...f.planned.plan.intent, desiredState: "not_published", propertyVersion: f.planned.plan.source.version } } });
    if (competing.status !== "recorded" || competing.outcome.status !== "applied") throw new Error("SYNTHETIC_COMPETITOR_FAILED");
    target = competing.journal;
  }
  // Mock target and hash change together synchronously. Reuses the existing audit CAS/idempotency implementation.
  const submit = (r: AuditRequest) => {
    submissionCalls++;
    const next = appendMediaAudit(target, r);
    if (next.status === "held") return { status: "held" as const, reason: next.reason };
    target = next.journal;
    if (next.outcome.status === "applied" && !next.replayed) { targetPayload = structuredClone(payload); mutations++; }
    duplicateReplayed ||= next.replayed;
    return next.outcome.status === "held" ? { status: "held" as const, reason: next.outcome.reason }
      : { status: "saved" as const, reason: next.replayed ? "SAME_REQUEST_REPLAYED" : "MOCK_SAVE_ACKNOWLEDGED" };
  };
  const submitted = submit(request);
  steps.push({ stage: "mock_apply", ...submitted });
  if (submitted.status === "held") return finish("held", submitted.reason);
  if (scenario === "workflow-duplicate") {
    const second = submit(request); steps.push({ stage: "duplicate", ...second });
    if (second.status === "held") return finish("held", second.reason);
  }
  if (scenario === "workflow-request-conflict") {
    const second = submit({ ...request, command: { ...request.command as object, expectedListingRevision: 999 } });
    steps.push({ stage: "duplicate", ...second });
    return finish("held", second.reason);
  }
  const lost = scenario === "workflow-response-lost" || scenario === "workflow-response-unknown";
  if (lost) steps[steps.length - 1] = { stage: "mock_apply", status: "unknown", reason: "SIMULATION_OUTCOME_UNKNOWN" };
  if (scenario === "workflow-response-unknown") {
    steps.push({ stage: "readback", status: "unknown", reason: "SYNTHETIC_READER_UNAVAILABLE_NO_RESUBMIT" });
    return finish("unknown", "SIMULATION_OUTCOME_UNKNOWN");
  }
  // Read from the target's verified journal and saved payload hash, not from the submitted command alone.
  const readback = verifyMediaJournal(structuredClone(target));
  const receipt = readback?.events.find(e => e.requestId === request.requestId);
  const readView = (surface: "pc" | "mobileWeb") => {
    const view = structuredClone(targetPayload);
    if (!view) return null;
    if (surface === "mobileWeb" && scenario === "workflow-readback-mismatch") view.description = "synthetic-stale-mobile-view";
    return contentHash(view);
  };
  const pcHash = readView("pc"), mobileHash = readView("mobileWeb");
  if (!readback || !receipt || receipt.commandHash !== contentHash(request.command) || receipt.actorRef !== request.actorRef || receipt.at !== request.at || receipt.outcome.status !== "applied"
    || contentHash(readback.state) !== receipt.afterHash
    || readback.state.listing.revision !== f.planned.plan.listingBefore.revision + 1
    || pcHash !== confirmation.payloadHash || mobileHash !== confirmation.payloadHash) {
    steps.push({ stage: "readback", status: "held", reason: "SIMULATION_READBACK_MISMATCH" });
    return finish("held", "SIMULATION_READBACK_MISMATCH");
  }
  unknownResolvedByReadback = lost;
  const saveLocal = async (r: AuditRequest): Promise<string | null> => {
    if (!auditStore) {
      const next = appendMediaAudit(local, r);
      if (next.status !== "recorded" || next.outcome.status !== "applied") return "SYNTHETIC_LOCAL_REFLECTION_FAILED";
      local = next.journal; return null;
    }
    let saved: Awaited<ReturnType<SyntheticAuditStore["apply"]>>;
    try { saved = await auditStore.apply(structuredClone(r)); }
    catch { saved = { status: "held", reason: "STORE_OUTCOME_UNKNOWN" }; }
    if (saved.status === "held" && saved.reason !== "STORE_OUTCOME_UNKNOWN") return "LOCAL_MEDIA_SAVE_HELD";
    // Readback is required even after a normal acknowledgement. Never fall back to a predicted local state.
    try { await reloadLocal(); } catch { return "LOCAL_MEDIA_OUTCOME_UNKNOWN"; }
    const receipt = local.events.find(e => e.requestId === r.requestId);
    if (!receipt || receipt.actorRef !== r.actorRef || receipt.at !== r.at || receipt.commandHash !== contentHash(r.command)
      || receipt.outcome.status !== "applied" || receipt.afterHash !== contentHash(local.state)) return "LOCAL_MEDIA_OUTCOME_UNKNOWN";
    if (saved.status !== "held" && contentHash(saved.state) !== contentHash(local.state)) return "LOCAL_MEDIA_OUTCOME_UNKNOWN";
    steps.push({ stage: "local_audit", status: saved.status === "held" ? "reconciled" : "saved",
      reason: saved.status === "held" ? "LOCAL_COMMIT_CONFIRMED_BY_READBACK" : "LOCAL_JOURNAL_READBACK_MATCHED", referenceHash: local.headHash });
    return null;
  };
  const localIssue = await saveLocal(request);
  if (localIssue) return finish(localIssue === "LOCAL_MEDIA_OUTCOME_UNKNOWN" ? "unknown" : "held", localIssue);
  for (const surface of ["pc", "mobileWeb"] as const) {
    const observedAt = at(), observedIssue = await saveLocal({ requestId: randomUUID(), actorRef: "synthetic-workflow", at: observedAt,
      command: { type: "observe", ...f.planned.plan.binding, surface, expectedListingRevision: local.state.listing.revision, expectedObservationRevision: 0,
        evidence: { evidenceId: `synthetic-${surface}`, observedAt, acquisition: "mock", authorizationRef: "synthetic-only", visibility: "published",
          exactUnitConfirmed: true, contentHash: surface === "pc" ? pcHash : mobileHash, companyFirst: "not_applicable" } } });
    if (observedIssue) return finish(observedIssue === "LOCAL_MEDIA_OUTCOME_UNKNOWN" ? "unknown" : "held", observedIssue);
  }
  steps.push({ stage: "readback", status: "mock_matched", reason: "SIMULATED_READBACK_MATCHED", referenceHash: payloadHash });
  // Capacity remains attempted: mock visibility must never release/confirm a real reservation.
  return finish("simulated", "SIMULATED_READBACK_MATCHED");
}
