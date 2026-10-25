import { z } from "zod";
import { changePlanSchema, preflightChangePlan } from "./change-plan";
import { activePlanReference, verifyPlanRegistry } from "./plan-registry";
import { fingerprintPropertySnapshot } from "./source-fingerprint";
import { contentHash, scopeSchema, type RuleScope } from "./rules";

type Binding = z.infer<typeof changePlanSchema.shape.binding>;
/** Inject only authorized readers. No DB client, credentials, writer or network adapter is created here. */
export interface PreflightReaders {
  readRegistry(binding: Binding): Promise<unknown>;
  readInputs(binding: Binding, scope: RuleScope): Promise<unknown>;
}
const inputsSchema = z.object({ recordJson: z.unknown(), metadataJson: z.unknown(), mediaState: z.unknown(), ruleHistory: z.unknown() }).strict();
const held = (reason: string) => ({ status: "held" as const, executable: false as const, identityChecksPassed: false as const, reason });

/** Read-only coordinator. A stable registry around input reads does not replace final writer CAS. */
export async function preflightStoredPlan(rawBinding: unknown, rawScope: unknown, readers: PreflightReaders) {
  try { return await runPreflight(rawBinding, rawScope, readers); }
  catch { return held("PREFLIGHT_FAILED"); }
}

async function runPreflight(rawBinding: unknown, rawScope: unknown, readers: PreflightReaders) {
  const binding = changePlanSchema.shape.binding.safeParse(rawBinding), scope = scopeSchema.safeParse(rawScope);
  if (!binding.success || !scope.success) return held("INVALID_PREFLIGHT_REQUEST");
  const initialReadAt = new Date().toISOString();
  let first: unknown;
  try { first = await readers.readRegistry(structuredClone(binding.data)); } catch { return held("REGISTRY_READ_FAILED"); }
  const journal = verifyPlanRegistry(first);
  if (!journal) return held("REGISTRY_INTEGRITY_ERROR");
  const initialNow = new Date().toISOString();
  if (initialNow < initialReadAt) return held("CLOCK_REGRESSION");
  const current = activePlanReference(journal, binding.data, initialNow);
  if (current.status !== "current") return held(current.reason);
  // Scope mismatch must be rejected before asking a reader for customer-scoped source inputs.
  const plan = journal.state.activePlan!;
  if (contentHash(plan.scope) !== contentHash(scope.data)) return held("SCOPE_MISMATCH");
  const inputReadAt = new Date().toISOString();
  if (inputReadAt < initialNow) return held("CLOCK_REGRESSION");
  let rawInputs: unknown;
  try { rawInputs = await readers.readInputs(structuredClone(binding.data), structuredClone(scope.data)); } catch { return held("SOURCE_READ_FAILED"); }
  const inputs = inputsSchema.safeParse(rawInputs), fingerprintAt = new Date().toISOString();
  if (fingerprintAt < inputReadAt) return held("CLOCK_REGRESSION");
  if (!inputs.success) return held("INVALID_SOURCE_INPUTS");
  const fingerprint = fingerprintPropertySnapshot(inputs.data.recordJson, inputs.data.metadataJson, fingerprintAt);
  if (fingerprint.status !== "fingerprinted") return held(fingerprint.reason);
  if (fingerprint.snapshot.capturedAt < inputReadAt) return held("SNAPSHOT_PREDATES_READ");
  let latest: unknown;
  try { latest = await readers.readRegistry(structuredClone(binding.data)); } catch { return held("REGISTRY_READ_FAILED"); }
  const fresh = verifyPlanRegistry(latest), checkedAt = new Date().toISOString();
  if (checkedAt < fingerprintAt) return held("CLOCK_REGRESSION");
  if (!fresh) return held("REGISTRY_INTEGRITY_ERROR");
  if (fresh.headHash !== journal.headHash || fresh.state.revision !== journal.state.revision) return held("REGISTRY_CHANGED_DURING_CHECK");
  const reference = activePlanReference(fresh, binding.data, checkedAt);
  if (reference.status !== "current") return held(reference.reason);
  const result = preflightChangePlan(plan, { requestedScope: scope.data, snapshot: fingerprint.snapshot,
    mediaState: inputs.data.mediaState, ruleHistory: inputs.data.ruleHistory }, reference.reference, checkedAt);
  return result.identityChecksPassed ? { ...result, registryToken: reference.registryToken } : result;
}
