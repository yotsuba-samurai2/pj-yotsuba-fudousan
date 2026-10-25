import { z } from "zod";
import { changePlanSchema, pendingPlanGates, type ChangePlan, type ChangePlanReference } from "./change-plan";
import { preflightStoredPlan, type PreflightReaders } from "./stored-plan-preflight";
import { verifyPlanRegistry, type PlanRegistry } from "./plan-registry";
import { capacityScopeSchema, currentCapacity, verifyCapacityJournal, type CapacityJournal } from "./capacity-reservations";
import { matchPlanPermissionEvidence, permissionEvidenceSchema, publicationManifestSchema } from "./permission-evidence";
import { contentHash, scopeSchema, type RuleScope } from "./rules";

type Binding = z.infer<typeof changePlanSchema.shape.binding>;
type CapacityScope = z.infer<typeof capacityScopeSchema>;
export interface PlanDiagnosticReaders extends PreflightReaders {
  readPermissions(binding: Binding, scope: RuleScope, plan: ChangePlanReference): Promise<unknown>;
  readCapacity(scope: CapacityScope): Promise<unknown>;
}
const requestSchema = z.object({ binding: changePlanSchema.shape.binding, scope: scopeSchema, capacityScope: capacityScopeSchema,
  operation: z.enum(["new_listing", "update", "replace", "unknown"]), reservationId: z.uuid().nullable() }).strict();
const permissionInputsSchema = z.object({ manifest: publicationManifestSchema, history: z.array(permissionEvidenceSchema).max(1000) }).strict();
const pending = [...pendingPlanGates, "CAPACITY_POOL_CONTRACT_MAPPING", "EVIDENCE_AUTHENTICITY", "MATERIAL_INVENTORY_COMPLETENESS", "FINAL_PAYLOAD_AND_IMAGE_REVIEW"] as const;
const held = (reason: string) => ({ status: "held" as const, executable: false as const, diagnosticComplete: false as const, reason, pendingGates: [...pending] });
const same = (a: unknown, b: unknown) => contentHash(a) === contentHash(b);
class DiagnosticFailure extends Error { constructor(readonly code: string) { super(code); } }

function capacityCheck(journal: CapacityJournal, scope: CapacityScope, plan: ChangePlan, operation: string, reservationId: string | null, now: string) {
  const blocked = (reason: string) => ({ state: "held" as const, reason, referenceHash: null as string | null });
  if (operation !== "new_listing") return blocked("CAPACITY_OPERATION_UNSUPPORTED");
  if (plan.intent.desiredState !== "published") return blocked("NON_PUBLICATION_PLAN");
  const capacity = currentCapacity(journal, scope, now);
  if (capacity.status === "held") return blocked(capacity.reason);
  if (capacity.overCapacity) return blocked("CAPACITY_OVERCOMMITTED");
  const body = { token: capacity.token, configVersion: capacity.configVersion, snapshotVersion: capacity.snapshotVersion, scope,
    plan: { planId: plan.planId, jobVersion: plan.jobVersion, hash: contentHash(plan) }, checkedAt: now };
  if (reservationId === null) return { state: "unreserved" as const,
    reason: capacity.remaining >= capacity.newListingUnits ? "CAPACITY_REQUIRES_RESERVATION" : "CAPACITY_INSUFFICIENT", referenceHash: contentHash(body) };
  const reservation = journal.state.reservations.find(r => r.reservationId === reservationId);
  if (!reservation || !same(reservation.planReference, body.plan) || !same(reservation.binding, plan.binding)) return blocked("CAPACITY_RESERVATION_MISMATCH");
  if (reservation.phase !== "reserved") return blocked("CAPACITY_RESERVATION_NOT_PENDING");
  if (reservation.expiresAt <= now) return blocked("CAPACITY_RESERVATION_EXPIRED");
  if (reservation.configVersion !== journal.state.config!.version || reservation.configHash !== contentHash(journal.state.config)) return blocked("CAPACITY_RESERVATION_CONFIG_CHANGED");
  return { state: "reserved" as const, reason: "LOCAL_RESERVATION_MATCHED", referenceHash: contentHash({ ...body, reservationHash: contentHash(reservation) }) };
}

/** Diagnostic composition only. Every dependency is an injected authorized reader; no writer or live client. */
export async function diagnoseStoredPlan(rawRequest: unknown, readers: PlanDiagnosticReaders) {
  try {
    const parsed = requestSchema.safeParse(rawRequest);
    if (!parsed.success) return held("INVALID_PLAN_DIAGNOSTIC_REQUEST");
    const q = parsed.data;
    if (q.capacityScope.media !== q.binding.media || q.capacityScope.market !== q.scope.market) return held("CAPACITY_PLAN_SCOPE_MISMATCH");
    let previousAt = new Date().toISOString(), captured: PlanRegistry | undefined;
    const tick = () => { const at = new Date().toISOString(); if (at < previousAt) throw new DiagnosticFailure("DIAGNOSTIC_CLOCK_REGRESSION"); previousAt = at; return at; };
    const identityReaders: PreflightReaders = {
      readRegistry: async binding => { const value = structuredClone(await readers.readRegistry(structuredClone(binding))); captured = verifyPlanRegistry(value); return captured ?? null; },
      readInputs: async (binding, scope) => structuredClone(await readers.readInputs(structuredClone(binding), structuredClone(scope))),
    };
    const first = await preflightStoredPlan(q.binding, q.scope, identityReaders); tick();
    if (!first.identityChecksPassed) return held(first.reason);
    const initialRegistry = captured;
    if (!initialRegistry?.state.activePlan || !same(first.reference, { planId: initialRegistry.state.activePlan.planId,
      jobVersion: initialRegistry.state.activePlan.jobVersion, hash: contentHash(initialRegistry.state.activePlan) })) return held("DIAGNOSTIC_PLAN_REFERENCE_MISMATCH");
    const plan = structuredClone(initialRegistry.state.activePlan), initialToken = structuredClone(first.registryToken);
    const readPermissions = async () => {
      tick(); let raw: unknown;
      try { raw = structuredClone(await readers.readPermissions(structuredClone(q.binding), structuredClone(q.scope), structuredClone(first.reference))); }
      catch { throw new DiagnosticFailure("DIAGNOSTIC_PERMISSION_READ_FAILED"); }
      tick();
      const data = permissionInputsSchema.safeParse(raw);
      if (!data.success) throw new DiagnosticFailure("INVALID_DIAGNOSTIC_PERMISSION_INPUTS");
      if (data.data.history.some(e => !same(e.binding, q.binding) || !same(e.scope, q.scope))) throw new DiagnosticFailure("DIAGNOSTIC_PERMISSION_SCOPE_MISMATCH");
      return data.data;
    };
    const readCapacity = async () => {
      tick(); let raw: unknown;
      try { raw = structuredClone(await readers.readCapacity(structuredClone(q.capacityScope))); }
      catch { throw new DiagnosticFailure("DIAGNOSTIC_CAPACITY_READ_FAILED"); }
      tick(); const data = verifyCapacityJournal(raw);
      if (!data) throw new DiagnosticFailure("DIAGNOSTIC_CAPACITY_INTEGRITY_ERROR");
      if (!same(data.genesis.scope, q.capacityScope)) throw new DiagnosticFailure("DIAGNOSTIC_CAPACITY_SCOPE_MISMATCH");
      return data;
    };
    const firstPermissions = await readPermissions(), firstCapacity = await readCapacity();
    // A final timestamp alone cannot detect a revocation/cancellation/reservation made meanwhile.
    const lastPermissions = await readPermissions(), lastCapacity = await readCapacity();
    if (!same(firstPermissions, lastPermissions)) return held("PERMISSIONS_CHANGED_DURING_DIAGNOSTIC");
    if (firstCapacity.headHash !== lastCapacity.headHash || firstCapacity.events.length !== lastCapacity.events.length) return held("CAPACITY_CHANGED_DURING_DIAGNOSTIC");
    const final = await preflightStoredPlan(q.binding, q.scope, identityReaders), checkedAt = tick();
    if (!final.identityChecksPassed) return held(final.reason);
    if (!same(first.reference, final.reference)) return held("PLAN_CHANGED_DURING_DIAGNOSTIC");
    if (!same(initialToken, final.registryToken)) return held("REGISTRY_CHANGED_DURING_DIAGNOSTIC");
    if (checkedAt >= plan.expiresAt) return held("PLAN_EXPIRED");
    const permission = matchPlanPermissionEvidence(plan, lastPermissions.manifest, lastPermissions.history, checkedAt);
    const capacity = capacityCheck(lastCapacity, q.capacityScope, plan, q.operation, q.reservationId, checkedAt);
    // Explicit allowlist: never spread a dependency result or serialize its inputs/journals.
    const checks = { identity: { matched: true as const, referenceHash: first.reference.hash, registryHeadHash: final.registryToken.headHash },
      permissions: { evidenceMatched: permission.evidenceMatched, reason: permission.reason, referenceHash: permission.evidenceMatched ? permission.reference.hash : null }, capacity };
    const body = { plan: first.reference, registryToken: final.registryToken, permissionInputsHash: contentHash(lastPermissions),
      capacityHeadHash: lastCapacity.headHash, operation: q.operation, reservationHash: q.reservationId ? contentHash(q.reservationId) : null, checks, checkedAt };
    return { status: "diagnosed" as const, executable: false as const, diagnosticComplete: true as const, reason: "EXECUTION_GATES_PENDING",
      checkedAt, checks, pendingGates: [...pending], reference: { hash: contentHash(body) } };
  } catch (error) { return held(error instanceof DiagnosticFailure ? error.code : "PLAN_DIAGNOSTIC_FAILED"); }
}
