import { z } from "zod";
import { changePlanSchema, planReferenceSchema } from "./change-plan";
import { contentHash } from "./rules";

const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/);
const instant = z.iso.datetime({ precision: 3 });
const count = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const hash = z.string().regex(/^[a-f0-9]{64}$/);
export const capacityScopeSchema = z.object({ media: z.enum(["site", "athome"]), accountRef: id,
  market: z.enum(["residential_rental", "sale", "business"]), categoryRef: id, capacityPoolId: id }).strict();
export const capacityConfigSchema = z.object({ version: count.min(1), scope: capacityScopeSchema,
  confirmation: z.enum(["confirmed", "unconfirmed"]), contractRef: id.nullable(), confirmedAt: instant.nullable(),
  isolation: z.enum(["independent", "shared", "unknown"]), limit: count.nullable(), newListingUnits: count.min(1).nullable(),
  validFrom: instant, validUntil: instant }).strict().refine(c => c.validUntil > c.validFrom);
const inclusion = z.object({ reservationId: z.uuid(), attemptId: z.uuid(), planReference: planReferenceSchema,
  listingRef: id, units: count.min(1), evidenceRef: id, observedAt: instant }).strict();
export const capacitySnapshotSchema = z.object({ version: count.min(1), snapshotId: z.uuid(), scope: capacityScopeSchema,
  observedAt: instant, validUntil: instant, used: count.nullable(), coverage: z.enum(["complete", "partial", "unknown"]),
  acquisition: z.enum(["manual_confirmed", "official_export", "official_api", "mock", "unknown"]), evidenceRef: id.nullable(),
  includedReservations: z.array(inclusion).max(500) }).strict().refine(s => s.validUntil > s.observedAt);
const terminal = z.object({ reservationId: z.uuid(), attemptId: z.uuid(), planReference: planReferenceSchema,
  outcome: z.enum(["failed_final", "cancelled_final"]), terminalAt: instant, observedAt: instant,
  evidenceRef: id, absentConfirmed: z.literal(true), finalityConfirmed: z.literal(true) }).strict();
const reservationSchema = z.object({ reservationId: z.uuid(), planReference: planReferenceSchema,
  binding: changePlanSchema.shape.binding, units: count.min(1), createdAt: instant, expiresAt: instant,
  configVersion: count.min(1), configHash: hash,
  phase: z.enum(["reserved", "attempted", "cancelled", "released"]), attemptId: z.uuid().nullable(), attemptedAt: instant.nullable() }).strict();
const commandSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("refresh"), config: capacityConfigSchema, snapshot: capacitySnapshotSchema,
    terminalAbsences: z.array(terminal).max(500) }).strict(),
  z.object({ type: z.literal("reserve"), reservationId: z.uuid(), plan: changePlanSchema,
    operation: z.enum(["new_listing", "update", "replace"]), expiresAt: instant }).strict(),
  z.object({ type: z.literal("cancel"), reservationId: z.uuid(), planReference: planReferenceSchema }).strict(),
  z.object({ type: z.literal("begin_attempt"), reservationId: z.uuid(), planReference: planReferenceSchema, attemptId: z.uuid() }).strict(),
]);
const requestSchema = z.object({ requestId: z.uuid(), actorRef: id, at: instant,
  expected: z.object({ sequence: count, headHash: hash }).strict(), command: commandSchema }).strict();
const stateSchema = z.object({ config: capacityConfigSchema.nullable(), snapshot: capacitySnapshotSchema.nullable(),
  reservations: z.array(reservationSchema).max(500) }).strict();
const outcomeSchema = z.object({ status: z.enum(["applied", "held"]), reason: z.string().regex(/^[A-Z_]+$/).nullable() }).strict();
const eventSchema = z.object({ sequence: count.min(1), recordedAt: instant, request: requestSchema,
  beforeHash: hash, afterHash: hash, outcome: outcomeSchema, previousHash: hash, eventHash: hash }).strict();
const journalSchema = z.object({ schemaVersion: z.literal(1), executable: z.literal(false),
  genesis: z.object({ scope: capacityScopeSchema, createdAt: instant }).strict(), state: stateSchema,
  events: z.array(eventSchema).max(1000), headHash: hash }).strict();
export type CapacityJournal = z.infer<typeof journalSchema>;
export type CapacityRequest = z.infer<typeof requestSchema>;
type State = z.infer<typeof stateSchema>;
const held = (reason: string) => ({ status: "held" as const, executable: false as const, reason });
const empty = (): State => ({ config: null, snapshot: null, reservations: [] });
const reference = (plan: z.infer<typeof changePlanSchema>) => ({ planId: plan.planId, jobVersion: plan.jobVersion, hash: contentHash(plan) });
const same = (a: unknown, b: unknown) => contentHash(a) === contentHash(b);
const genesisHash = (genesis: CapacityJournal["genesis"]) => contentHash({ schemaVersion: 1, type: "capacity_reservations", genesis });
const live = (r: State["reservations"][number], now: string) => r.phase === "attempted" || (r.phase === "reserved" && r.expiresAt > now);
const priorInclusions = (events: CapacityJournal["events"], reservationId: string) => events.flatMap(e =>
  e.outcome.status === "applied" && e.request.command.type === "refresh"
    ? e.request.command.snapshot.includedReservations.filter(i => i.reservationId === reservationId) : []);

function availability(state: State, now: string) {
  const c = state.config, s = state.snapshot;
  if (!c || c.confirmation !== "confirmed" || !c.contractRef || !c.confirmedAt || c.confirmedAt > now || c.limit === null || c.newListingUnits === null) return held("CAPACITY_CONFIG_UNCONFIRMED");
  if (c.isolation !== "independent") return held("CAPACITY_POOL_NOT_INDEPENDENT");
  if (now < c.validFrom || now >= c.validUntil) return held("CAPACITY_CONFIG_OUTSIDE_VALID_TIME");
  if (!s || s.used === null || s.coverage !== "complete" || !s.evidenceRef || ["mock", "unknown"].includes(s.acquisition)) return held("CAPACITY_SNAPSHOT_UNCONFIRMED");
  if (s.observedAt > now || now >= s.validUntil) return held("CAPACITY_SNAPSHOT_OUTSIDE_VALID_TIME");
  const included = new Set(s.includedReservations.map(i => i.reservationId));
  const reserved = state.reservations.filter(r => live(r, now) && !included.has(r.reservationId)).reduce((sum, r) => sum + BigInt(r.units), BigInt(0));
  const total = BigInt(s.used) + reserved;
  if (total > BigInt(Number.MAX_SAFE_INTEGER)) return held("CAPACITY_ACCOUNTING_OVERFLOW");
  return { status: "available" as const, executable: false as const, limit: c.limit, used: s.used, reserved: Number(reserved),
    remaining: Math.max(0, c.limit - Number(total)), overCapacity: total > BigInt(c.limit),
    newListingUnits: c.newListingUnits, validUntil: c.validUntil < s.validUntil ? c.validUntil : s.validUntil };
}

export function createCapacityJournal(rawScope: unknown, createdAt: string): CapacityJournal {
  const genesis = journalSchema.shape.genesis.safeParse({ scope: rawScope, createdAt });
  if (!genesis.success) throw new Error("INVALID_CAPACITY_GENESIS");
  return { schemaVersion: 1, executable: false, genesis: genesis.data, state: empty(), events: [], headHash: genesisHash(genesis.data) };
}

function transition(journal: Pick<CapacityJournal, "genesis" | "state" | "events" | "headHash">, request: CapacityRequest, now: string) {
  const reject = (reason: string) => ({ state: journal.state, outcome: { status: "held" as const, reason } });
  if (request.expected.sequence !== journal.events.length || request.expected.headHash !== journal.headHash) return reject("CAPACITY_CONFLICT");
  const state = structuredClone(journal.state), command = request.command;
  if (command.type === "refresh") {
    const { config: c, snapshot: s } = command;
    if (!same(c.scope, journal.genesis.scope) || !same(s.scope, journal.genesis.scope)) return reject("CAPACITY_SCOPE_MISMATCH");
    const configConflict = state.config && c.version === state.config.version
      ? !same(c, state.config) : c.version !== (state.config?.version ?? 0) + 1;
    if (configConflict) return reject("CONFIG_VERSION_CONFLICT");
    if (s.version !== (state.snapshot?.version ?? 0) + 1) return reject("SNAPSHOT_VERSION_CONFLICT");
    if (s.observedAt > now || (state.snapshot && s.observedAt < state.snapshot.observedAt)) return reject("SNAPSHOT_TIME_ORDER");
    if (journal.events.some(e => e.outcome.status === "applied" && e.request.command.type === "refresh" && e.request.command.snapshot.snapshotId === s.snapshotId)) return reject("SNAPSHOT_ID_REUSED");
    const ids = s.includedReservations.map(i => i.reservationId), listingIds = s.includedReservations.map(i => i.listingRef), terminals = command.terminalAbsences.map(t => t.reservationId);
    if (new Set(ids).size !== ids.length || new Set(listingIds).size !== listingIds.length || new Set(terminals).size !== terminals.length || terminals.some(t => ids.includes(t))) return reject("RECONCILIATION_DUPLICATE");
    if ((ids.length || terminals.length) && (s.used === null || s.coverage !== "complete" || !s.evidenceRef || ["mock", "unknown"].includes(s.acquisition) || now >= s.validUntil)) return reject("RECONCILIATION_UNCONFIRMED");
    let includedUnits = BigInt(0);
    for (const item of s.includedReservations) {
      const r = state.reservations.find(r => r.reservationId === item.reservationId);
      if (!r || r.phase !== "attempted" || r.attemptId !== item.attemptId || !same(r.planReference, item.planReference)
        || r.units !== item.units || item.observedAt !== s.observedAt || !r.attemptedAt || item.observedAt < r.attemptedAt) return reject("RECONCILIATION_BINDING_MISMATCH");
      if (priorInclusions(journal.events, r.reservationId).some(i => i.listingRef !== item.listingRef)) return reject("LISTING_REFERENCE_CHANGED");
      includedUnits += BigInt(item.units);
    }
    if (includedUnits > BigInt(s.used ?? 0)) return reject("RECONCILIATION_EXCEEDS_USED");
    for (const proof of command.terminalAbsences) {
      const r = state.reservations.find(r => r.reservationId === proof.reservationId);
      if (!r || r.phase !== "attempted" || r.attemptId !== proof.attemptId || !same(r.planReference, proof.planReference)
        || proof.observedAt !== s.observedAt || proof.terminalAt > s.observedAt || !r.attemptedAt || proof.terminalAt < r.attemptedAt) return reject("RECONCILIATION_BINDING_MISMATCH");
      const prior = priorInclusions(journal.events, r.reservationId);
      if (proof.outcome === "failed_final" && prior.length) return reject("TERMINAL_OUTCOME_CONFLICT");
      if (prior.some(i => proof.terminalAt <= i.observedAt)) return reject("TERMINAL_PRECEDES_CONFIRMED_PRESENCE");
      r.phase = "released";
    }
    state.config = c; state.snapshot = s;
  } else if (command.type === "reserve") {
    if (command.operation !== "new_listing" || command.plan.intent.desiredState !== "published") return reject("CAPACITY_OPERATION_UNSUPPORTED");
    if (command.plan.binding.media !== journal.genesis.scope.media || command.plan.scope.market !== journal.genesis.scope.market) return reject("CAPACITY_SCOPE_MISMATCH");
    if (command.plan.createdAt > request.at || command.plan.expiresAt <= now || command.expiresAt <= now || command.expiresAt > command.plan.expiresAt) return reject("RESERVATION_OUTSIDE_VALID_TIME");
    if (state.reservations.some(r => r.reservationId === command.reservationId || r.planReference.planId === command.plan.planId)) return reject("RESERVATION_IDENTITY_REUSED");
    if (state.reservations.some(r => live(r, now) && same(r.binding, command.plan.binding))) return reject("PROPERTY_ALREADY_RESERVED");
    const capacity = availability(state, now);
    if (capacity.status === "held") return reject(capacity.reason);
    if (command.expiresAt > capacity.validUntil) return reject("RESERVATION_OUTLIVES_CAPACITY_EVIDENCE");
    if (capacity.remaining < capacity.newListingUnits) return reject("CAPACITY_FULL");
    if (state.reservations.length >= 500) return reject("RESERVATION_HISTORY_CAPACITY");
    state.reservations.push({ reservationId: command.reservationId, planReference: reference(command.plan), binding: command.plan.binding,
      units: capacity.newListingUnits, createdAt: now, expiresAt: command.expiresAt,
      configVersion: state.config!.version, configHash: contentHash(state.config), phase: "reserved", attemptId: null, attemptedAt: null });
  } else {
    const r = state.reservations.find(r => r.reservationId === command.reservationId);
    if (!r || !same(r.planReference, command.planReference)) return reject("RESERVATION_REFERENCE_MISMATCH");
    if (command.type === "cancel") {
      if (r.phase === "attempted") return reject("ATTEMPT_REQUIRES_RECONCILIATION");
      if (r.phase !== "reserved") return reject("RESERVATION_TERMINAL");
      r.phase = "cancelled";
    } else {
      if (r.phase !== "reserved" || r.expiresAt <= now) return reject("RESERVATION_NOT_ACTIVE");
      if (r.configVersion !== state.config?.version || r.configHash !== contentHash(state.config)) return reject("RESERVATION_CONFIG_CHANGED");
      const capacity = availability(state, now);
      if (capacity.status === "held") return reject(capacity.reason);
      if (capacity.overCapacity) return reject("CAPACITY_FULL");
      if (state.reservations.some(other => other.attemptId === command.attemptId)) return reject("ATTEMPT_ID_REUSED");
      r.phase = "attempted"; r.attemptId = command.attemptId; r.attemptedAt = now;
    }
  }
  return { state, outcome: { status: "applied" as const, reason: null } };
}

export function verifyCapacityJournal(input: unknown): CapacityJournal | undefined {
  const parsed = journalSchema.safeParse(input);
  if (!parsed.success) return undefined;
  const journal = parsed.data, seen = new Set<string>();
  let state = empty(), headHash = genesisHash(journal.genesis), priorAt = journal.genesis.createdAt, priorReceived = priorAt;
  for (const [index, event] of journal.events.entries()) {
    const { eventHash, ...body } = event;
    if (event.sequence !== index + 1 || seen.has(event.request.requestId) || event.request.at < priorAt || event.request.at > event.recordedAt
      || event.recordedAt < priorReceived || event.previousHash !== headHash || event.beforeHash !== contentHash(state) || eventHash !== contentHash(body)) return undefined;
    const next = transition({ genesis: journal.genesis, state, headHash, events: journal.events.slice(0, index) }, event.request, event.recordedAt);
    if (!same(next.outcome, event.outcome) || event.afterHash !== contentHash(next.state)) return undefined;
    state = next.state; headHash = eventHash; priorAt = event.request.at; priorReceived = event.recordedAt; seen.add(event.request.requestId);
  }
  return journal.headHash === headHash && same(journal.state, state) ? journal : undefined;
}

export function appendCapacityRequest(input: unknown, rawRequest: unknown, now: string) {
  const journal = verifyCapacityJournal(input), parsed = requestSchema.safeParse(rawRequest);
  if (!journal) return held("CAPACITY_INTEGRITY_ERROR");
  if (!parsed.success || !instant.safeParse(now).success) return held("INVALID_CAPACITY_REQUEST");
  const request = parsed.data;
  if (request.at > now || (journal.events.at(-1)?.recordedAt ?? journal.genesis.createdAt) > now) return held("CAPACITY_TIME_FROM_FUTURE");
  const prior = journal.events.find(e => e.request.requestId === request.requestId);
  if (prior) return same(prior.request, request)
    ? { status: "recorded" as const, executable: false as const, replayed: true, journal, outcome: prior.outcome }
    : held("REQUEST_ID_CONFLICT");
  if (journal.events.length >= 1000) return held("CAPACITY_AUDIT_LIMIT");
  if (request.at < (journal.events.at(-1)?.request.at ?? journal.genesis.createdAt)) return held("CAPACITY_TIME_ORDER");
  const next = transition(journal, request, now);
  const body = { sequence: journal.events.length + 1, recordedAt: now, request, beforeHash: contentHash(journal.state), afterHash: contentHash(next.state), outcome: next.outcome, previousHash: journal.headHash };
  const event = { ...body, eventHash: contentHash(body) };
  return { status: "recorded" as const, executable: false as const, replayed: false, outcome: next.outcome,
    journal: { ...journal, state: next.state, events: [...journal.events, event], headHash: event.eventHash } };
}

export function currentCapacity(input: unknown, expectedScope: unknown, now: string) {
  const journal = verifyCapacityJournal(input), scope = capacityScopeSchema.safeParse(expectedScope);
  if (!journal) return held("CAPACITY_INTEGRITY_ERROR");
  if (!scope.success || !instant.safeParse(now).success) return held("INVALID_CAPACITY_LOOKUP");
  if (!same(scope.data, journal.genesis.scope)) return held("CAPACITY_SCOPE_MISMATCH");
  if ((journal.events.at(-1)?.recordedAt ?? journal.genesis.createdAt) > now) return held("CAPACITY_TIME_FROM_FUTURE");
  const result = availability(journal.state, now);
  return result.status === "held" ? result : { ...result, token: { sequence: journal.events.length, headHash: journal.headHash },
    configVersion: journal.state.config!.version, snapshotVersion: journal.state.snapshot!.version, observedAt: journal.state.snapshot!.observedAt };
}
