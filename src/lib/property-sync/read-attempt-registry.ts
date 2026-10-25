import { z } from "zod";
import { contentHash } from "./rules";
import { proposeReadAttempt, readAttemptSchema, readFailureSchema, readRetryPolicySchema, readRetryReference, readRetryRunSchema } from "./read-retry";

const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/), hash = z.string().regex(/^[a-f0-9]{64}$/), instant = z.iso.datetime({ precision: 3 });
const revision = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const reference = z.object({ id, version: revision.min(1), hash }).strict();
const token = z.object({ revision, headHash: hash }).strict();
const inputSchema = z.object({ policy: readRetryPolicySchema, run: readRetryRunSchema }).strict();
const resultSchema = z.discriminatedUnion("status", [z.object({ status: z.literal("succeeded"), resultHash: hash }).strict(),
  z.object({ status: z.literal("failed"), failure: readFailureSchema }).strict()]);
const commandSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("start"), attemptId: id, transportRequestId: id }).strict(),
  z.object({ type: z.literal("complete"), attemptId: id, startedAttemptHash: hash, result: resultSchema }).strict(),
]);
const requestSchema = z.object({ requestId: z.uuid(), actorRef: id, run: reference, expected: token, command: commandSchema }).strict();
const stateSchema = z.object({ revision, attempts: z.array(readAttemptSchema).max(10), owners: z.array(z.object({ attemptId: id, actorRef: id }).strict()).max(10) }).strict();
const outcomeSchema = z.object({ status: z.enum(["started", "completed", "held"]), reason: z.string().regex(/^[A-Z_]+$/).nullable(), attemptId: id.nullable() }).strict();
const eventSchema = z.object({ sequence: revision.min(1), recordedAt: instant, request: requestSchema, beforeHash: hash, afterHash: hash,
  outcome: outcomeSchema, previousHash: hash, eventHash: hash }).strict();
const genesisSchema = z.object({ input: inputSchema, createdAt: instant }).strict();
const journalSchema = z.object({ schemaVersion: z.literal(1), kind: z.literal("read_attempt_registry"), executable: z.literal(false),
  genesis: genesisSchema, state: stateSchema, events: z.array(eventSchema).max(1000), headHash: hash }).strict();
export type ReadAttemptRegistry = z.infer<typeof journalSchema>;
export type ReadAttemptRequest = z.infer<typeof requestSchema>;
type State = z.infer<typeof stateSchema>;
type Outcome = z.infer<typeof outcomeSchema>;
const emptyState = (): State => ({ revision: 0, attempts: [], owners: [] });
const held = (reason: string) => ({ status: "held" as const, executable: false as const, reason });
const genesisHash = (g: ReadAttemptRegistry["genesis"]) => contentHash({ schemaVersion: 1, kind: "read_attempt_registry", genesis: g });
const validGenesis = (g: ReadAttemptRegistry["genesis"]) => g.input.run.createdAt <= g.createdAt && g.createdAt < g.input.run.deadline
  && contentHash(g.input.run.policy) === contentHash(readRetryReference(g.input.policy));

export function createReadAttemptRegistry(input: unknown, createdAt: string): ReadAttemptRegistry {
  const genesis = genesisSchema.parse({ input, createdAt });
  if (!validGenesis(genesis)) throw new Error("INVALID_READ_REGISTRY_GENESIS");
  return { schemaVersion: 1, kind: "read_attempt_registry", executable: false, genesis, state: emptyState(), events: [], headHash: genesisHash(genesis) };
}

function evaluate(genesis: ReadAttemptRegistry["genesis"], state: State, headHash: string, request: ReadAttemptRequest, now: string): { state: State; outcome: Outcome } {
  const reject = (reason: string) => ({ state: { ...state, revision: state.revision + 1 }, outcome: { status: "held" as const, reason, attemptId: null } });
  if (request.expected.revision !== state.revision || request.expected.headHash !== headHash) return reject("READ_REGISTRY_CONFLICT");
  if (contentHash(request.run) !== contentHash(readRetryReference(genesis.input.run))) return reject("READ_RUN_MISMATCH");
  const command = request.command;
  if (command.type === "start") {
    if (state.attempts.some(a => a.id === command.attemptId || a.requestId === command.transportRequestId)) return reject("READ_ATTEMPT_ID_REUSED");
    const suggestion = proposeReadAttempt(genesis.input.policy, genesis.input.run, request.run, state.attempts, contentHash(state.attempts), now);
    if (suggestion.status !== "suggested") return reject(suggestion.reason);
    if (suggestion.notBefore > now) return reject("READ_BACKOFF_NOT_ELAPSED");
    const attempt = readAttemptSchema.parse({ id: command.attemptId, requestId: command.transportRequestId, run: request.run, requestFingerprint: genesis.input.run.requestFingerprint,
      number: suggestion.nextAttemptNumber, startedAt: now, status: "started" });
    return { state: { revision: state.revision + 1, attempts: [...state.attempts, attempt], owners: [...state.owners, { attemptId: attempt.id, actorRef: request.actorRef }] },
      outcome: { status: "started", reason: null, attemptId: attempt.id } };
  }
  const index = state.attempts.findIndex(a => a.id === command.attemptId), prior = state.attempts[index];
  if (!prior) return reject("READ_ATTEMPT_NOT_FOUND");
  if (prior.status !== "started") return reject("READ_ATTEMPT_ALREADY_COMPLETED");
  if (state.owners.find(o => o.attemptId === prior.id)?.actorRef !== request.actorRef) return reject("READ_ATTEMPT_OWNER_MISMATCH");
  if (contentHash(prior) !== command.startedAttemptHash) return reject("READ_STARTED_ATTEMPT_MISMATCH");
  if (now < prior.startedAt) return reject("READ_COMPLETION_CLOCK_REGRESSION");
  const completed = readAttemptSchema.parse({ ...prior, ...command.result, finishedAt: now });
  const attempts = [...state.attempts]; attempts[index] = completed;
  return { state: { ...state, revision: state.revision + 1, attempts }, outcome: { status: "completed", reason: null, attemptId: prior.id } };
}

/** Hash/replay integrity only. An old intact copy is not proof of current authority or freshness. */
export function verifyReadAttemptRegistry(input: unknown): ReadAttemptRegistry | undefined {
  try {
    const parsed = journalSchema.safeParse(input);
    if (!parsed.success || !validGenesis(parsed.data.genesis)) return undefined;
    const journal = parsed.data, seen = new Set<string>();
    let state = emptyState(), head = genesisHash(journal.genesis), priorAt = journal.genesis.createdAt;
    for (const [index, event] of journal.events.entries()) {
      const { eventHash, ...body } = event;
      if (event.sequence !== index + 1 || event.recordedAt < priorAt || seen.has(event.request.requestId) || event.previousHash !== head
        || event.beforeHash !== contentHash(state) || eventHash !== contentHash(body)) return undefined;
      const next = evaluate(journal.genesis, state, head, event.request, event.recordedAt);
      // Reserve the final event for a valid completion, even after many held requests.
      if (index >= 999 && next.outcome.status !== "completed") return undefined;
      if (contentHash(next.outcome) !== contentHash(event.outcome) || event.afterHash !== contentHash(next.state)) return undefined;
      state = next.state; head = eventHash; priorAt = event.recordedAt; seen.add(event.request.requestId);
    }
    return journal.headHash === head && contentHash(journal.state) === contentHash(state) ? journal : undefined;
  } catch { return undefined; }
}

export function appendReadAttemptRequest(input: unknown, rawRequest: unknown, now: string):
  ReturnType<typeof held> | { status: "recorded"; executable: false; journal: ReadAttemptRegistry; outcome: Outcome; replayed: boolean } {
  const journal = verifyReadAttemptRegistry(input), parsed = requestSchema.safeParse(rawRequest);
  if (!journal) return held("READ_REGISTRY_INTEGRITY_ERROR");
  if (!parsed.success || !instant.safeParse(now).success) return held("INVALID_READ_REGISTRY_REQUEST");
  if ((journal.events.at(-1)?.recordedAt ?? journal.genesis.createdAt) > now) return held("READ_REGISTRY_FROM_FUTURE");
  const request = parsed.data, prior = journal.events.find(e => e.request.requestId === request.requestId);
  if (prior) {
    if (contentHash(prior.request) !== contentHash(request)) return held("READ_REQUEST_ID_CONFLICT");
    // Historical start success never authorizes a second send. Always return the latest journal.
    return { status: "recorded", executable: false, journal, outcome: prior.outcome, replayed: true };
  }
  if (journal.events.length >= 1000) return held("READ_REGISTRY_CAPACITY_REACHED");
  const next = evaluate(journal.genesis, journal.state, journal.headHash, request, now);
  if (journal.events.length >= 999 && next.outcome.status !== "completed") return held("READ_COMPLETION_CAPACITY_RESERVED");
  const body = { sequence: journal.events.length + 1, recordedAt: now, request, beforeHash: contentHash(journal.state), afterHash: contentHash(next.state),
    outcome: next.outcome, previousHash: journal.headHash };
  const event = { ...body, eventHash: contentHash(body) };
  return { status: "recorded", executable: false, replayed: false, outcome: next.outcome,
    journal: { ...journal, state: next.state, events: [...journal.events, event], headHash: event.eventHash } };
}
