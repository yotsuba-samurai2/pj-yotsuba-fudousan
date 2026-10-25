import { z } from "zod";
import { changePlanSchema, planReferenceSchema, type ChangePlan } from "./change-plan";
import { contentHash } from "./rules";

const hash = z.string().regex(/^[a-f0-9]{64}$/);
const instant = z.iso.datetime({ precision: 3 });
const revision = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const bindingSchema = changePlanSchema.shape.binding;
const tokenSchema = z.object({ revision, headHash: hash }).strict();
const commandSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("register"), plan: changePlanSchema, expectedActive: planReferenceSchema.nullable() }).strict(),
  z.object({ type: z.literal("revoke"), reference: planReferenceSchema,
    reason: z.enum(["operator_request", "new_evidence", "rule_changed"]) }).strict(),
]);
const requestSchema = z.object({ requestId: z.uuid(), actorRef: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/),
  at: instant, expected: tokenSchema, command: commandSchema }).strict();
const stateSchema = z.object({ revision, latestJobVersion: revision, activePlan: changePlanSchema.nullable() }).strict();
const outcomeSchema = z.object({ status: z.enum(["registered", "revoked", "held"]), reason: z.string().regex(/^[A-Z_]+$/).nullable() }).strict();
const eventSchema = z.object({ sequence: revision.min(1), recordedAt: instant, request: requestSchema, beforeHash: hash, afterHash: hash,
  outcome: outcomeSchema, previousHash: hash, eventHash: hash }).strict();
const genesisSchema = z.object({ binding: bindingSchema, createdAt: instant }).strict();
const journalSchema = z.object({ schemaVersion: z.literal(1), executable: z.literal(false), genesis: genesisSchema,
  state: stateSchema, events: z.array(eventSchema).max(1000), headHash: hash }).strict();
export type PlanRegistry = z.infer<typeof journalSchema>;
export type PlanRegistryRequest = z.infer<typeof requestSchema>;
type State = z.infer<typeof stateSchema>;
type Outcome = z.infer<typeof outcomeSchema>;
const emptyState = (): State => ({ revision: 0, latestJobVersion: 0, activePlan: null });
const reference = (plan: ChangePlan) => ({ planId: plan.planId, jobVersion: plan.jobVersion, hash: contentHash(plan) });
const held = (reason: string) => ({ status: "held" as const, executable: false as const, reason });
const genesisHash = (genesis: PlanRegistry["genesis"]) => contentHash({ schemaVersion: 1, type: "plan_registry", genesis });

/** One stream per property/episode/media. Global and client plans compete for the same writer target. */
export function createPlanRegistry(binding: unknown, createdAt: string): PlanRegistry {
  const genesis = genesisSchema.safeParse({ binding, createdAt });
  if (!genesis.success) throw new Error("INVALID_REGISTRY_GENESIS");
  return { schemaVersion: 1, executable: false, genesis: genesis.data, state: emptyState(), events: [], headHash: genesisHash(genesis.data) };
}

function evaluate(genesis: PlanRegistry["genesis"], state: State, headHash: string,
  request: PlanRegistryRequest, events: PlanRegistry["events"], recordedAt: string): { state: State; outcome: Outcome } {
  // Registry revision counts every recorded event, including a held CAS attempt.
  const reject = (reason: string) => ({ state: { ...state, revision: state.revision + 1 }, outcome: { status: "held" as const, reason } });
  if (request.expected.revision !== state.revision || request.expected.headHash !== headHash) return reject("REGISTRY_CONFLICT");
  if (state.revision === Number.MAX_SAFE_INTEGER) return reject("REGISTRY_VERSION_EXHAUSTED");
  const command = request.command;
  if (command.type === "register") {
    const plan = command.plan;
    if (contentHash(plan.binding) !== contentHash(genesis.binding)) return reject("BINDING_MISMATCH");
    if (contentHash(command.expectedActive) !== contentHash(state.activePlan ? reference(state.activePlan) : null)) return reject("PLAN_REFERENCE_MISMATCH");
    if (plan.createdAt > request.at || plan.expiresAt <= recordedAt) return reject("PLAN_OUTSIDE_VALID_TIME");
    if (plan.jobVersion !== state.latestJobVersion + 1) return reject("JOB_VERSION_CONFLICT");
    if (events.some(e => e.outcome.status === "registered" && e.request.command.type === "register" && e.request.command.plan.planId === plan.planId)) return reject("PLAN_ID_REUSED");
    return { state: { revision: state.revision + 1, latestJobVersion: plan.jobVersion, activePlan: plan },
      outcome: { status: "registered", reason: null } };
  }
  if (!state.activePlan) return reject("NO_ACTIVE_PLAN");
  if (contentHash(command.reference) !== contentHash(reference(state.activePlan))) return reject("PLAN_REFERENCE_MISMATCH");
  return { state: { ...state, revision: state.revision + 1, activePlan: null }, outcome: { status: "revoked", reason: null } };
}

/** Deterministic replay detects accidental/tampered events, but is not a signature or external trust anchor. */
export function verifyPlanRegistry(input: unknown): PlanRegistry | undefined {
  const parsed = journalSchema.safeParse(input);
  if (!parsed.success) return undefined;
  const journal = parsed.data, seen = new Set<string>();
  let state = emptyState(), previousHash = genesisHash(journal.genesis), previousAt = journal.genesis.createdAt, previousRecordedAt = previousAt;
  for (const [index, event] of journal.events.entries()) {
    const { eventHash, ...body } = event;
    if (event.sequence !== index + 1 || seen.has(event.request.requestId) || event.request.at < previousAt
      || event.request.at > event.recordedAt || event.recordedAt < previousRecordedAt
      || event.previousHash !== previousHash || event.beforeHash !== contentHash(state) || eventHash !== contentHash(body)) return undefined;
    const next = evaluate(journal.genesis, state, previousHash, event.request, journal.events.slice(0, index), event.recordedAt);
    if (contentHash(next.outcome) !== contentHash(event.outcome) || event.afterHash !== contentHash(next.state)) return undefined;
    state = next.state; previousHash = eventHash; previousAt = event.request.at; previousRecordedAt = event.recordedAt; seen.add(event.request.requestId);
  }
  return journal.headHash === previousHash && contentHash(journal.state) === contentHash(state) ? journal : undefined;
}

export function appendPlanRegistry(input: unknown, rawRequest: unknown, now: string):
  ReturnType<typeof held> | { status: "recorded"; executable: false; journal: PlanRegistry; outcome: Outcome; replayed: boolean } {
  const journal = verifyPlanRegistry(input), parsed = requestSchema.safeParse(rawRequest);
  if (!journal) return held("REGISTRY_INTEGRITY_ERROR");
  // Unrecognized input is never copied into the audit stream.
  if (!parsed.success || !instant.safeParse(now).success) return held("INVALID_REGISTRY_REQUEST");
  const request = parsed.data, prior = journal.events.find(e => e.request.requestId === request.requestId);
  if (request.at > now) return held("REQUEST_FROM_FUTURE");
  if ((journal.events.at(-1)?.recordedAt ?? journal.genesis.createdAt) > now) return held("REGISTRY_FROM_FUTURE");
  if (prior) {
    if (contentHash(prior.request) !== contentHash(request)) return held("REQUEST_ID_CONFLICT");
    // Original outcome is historical. The returned journal always contains the latest state.
    return { status: "recorded", executable: false, journal, outcome: prior.outcome, replayed: true };
  }
  if (journal.events.length >= 1000) return held("REGISTRY_CAPACITY_REACHED");
  if (request.at < (journal.events.at(-1)?.request.at ?? journal.genesis.createdAt)) return held("REGISTRY_TIME_ORDER");
  const next = evaluate(journal.genesis, journal.state, journal.headHash, request, journal.events, now);
  const body = { sequence: journal.events.length + 1, recordedAt: now, request, beforeHash: contentHash(journal.state), afterHash: contentHash(next.state),
    outcome: next.outcome, previousHash: journal.headHash };
  const event = { ...body, eventHash: contentHash(body) };
  return { status: "recorded", executable: false, replayed: false, outcome: next.outcome,
    journal: { ...journal, state: next.state, events: [...journal.events, event], headHash: event.eventHash } };
}

/** Caller must load the current registry from its trusted store; old valid files cannot prove freshness. */
export function activePlanReference(input: unknown, expectedBinding: unknown, now: string) {
  const journal = verifyPlanRegistry(input), binding = bindingSchema.safeParse(expectedBinding);
  if (!journal) return held("REGISTRY_INTEGRITY_ERROR");
  if (!binding.success || !instant.safeParse(now).success) return held("INVALID_REGISTRY_LOOKUP");
  if (contentHash(binding.data) !== contentHash(journal.genesis.binding)) return held("BINDING_MISMATCH");
  if ((journal.events.at(-1)?.recordedAt ?? journal.genesis.createdAt) > now) return held("REGISTRY_FROM_FUTURE");
  const plan = journal.state.activePlan;
  if (!plan) return held("NO_ACTIVE_PLAN");
  if (plan.expiresAt <= now) return held("PLAN_EXPIRED");
  return { status: "current" as const, executable: false as const, reference: reference(plan),
    registryToken: { revision: journal.state.revision, headHash: journal.headHash } };
}
