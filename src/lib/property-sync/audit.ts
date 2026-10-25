import { z } from "zod";
import { applyMediaCommand, mediaCommandSchema, mediaStateSchema, type MediaResult, type MediaState } from "./media-state";
import { contentHash } from "./rules";

const hash = z.string().regex(/^[a-f0-9]{64}$/);
const instant = z.iso.datetime({ precision: 3 });
const actor = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/);
const outcomeSchema = z.object({ status: z.enum(["applied", "unchanged", "held"]), reason: z.string().regex(/^[A-Z_]+$/).nullable() }).strict();
const eventSchema = z.object({
  sequence: z.number().int().positive(), requestId: z.uuid(), actorRef: actor, at: instant,
  command: mediaCommandSchema.nullable(), commandHash: hash, beforeHash: hash, afterHash: hash,
  outcome: outcomeSchema, previousHash: hash, eventHash: hash,
}).strict();
const journalSchema = z.object({
  schemaVersion: z.literal(1), genesis: mediaStateSchema, state: mediaStateSchema,
  events: z.array(eventSchema).max(1000), headHash: hash,
}).strict().refine(j => Object.keys(j.genesis.observations).length === 0 && !!j.genesis.listing.changedAt && j.genesis.listing.changedAt >= j.genesis.listing.propertyVersion.updatedAt);
const requestSchema = z.object({ requestId: z.uuid(), actorRef: actor, at: instant, command: z.unknown() }).strict();
export type MediaJournal = z.infer<typeof journalSchema>;
export type AuditRequest = z.infer<typeof requestSchema>;
export type AuditResult = { status: "recorded"; journal: MediaJournal; outcome: MediaResult; replayed: boolean }
  | { status: "held"; reason: string };
const summarize = (result: MediaResult) => ({ status: result.status, reason: result.status === "held" ? result.reason : null });
function evaluate(state: MediaState, command: z.infer<typeof mediaCommandSchema> | null, at: string, history: MediaJournal["events"]): MediaResult {
  if (!command) return { status: "held", reason: "INVALID_COMMAND" };
  if (command.type === "observe") {
    const prior = history.find(e => e.outcome.status === "applied" && e.command?.type === "observe" && e.command.surface === command.surface && e.command.evidence.evidenceId === command.evidence.evidenceId);
    if (prior?.command?.type === "observe") return { status: "held", reason: contentHash(prior.command.evidence) === contentHash(command.evidence) ? "EVIDENCE_ALREADY_RECORDED" : "EVIDENCE_ID_CONFLICT" };
  }
  return applyMediaCommand(state, command, at);
}

export function createMediaJournal(input: unknown): MediaJournal {
  const state = mediaStateSchema.safeParse(input);
  if (!state.success) throw new Error("INVALID_MEDIA_STATE");
  if (Object.keys(state.data.observations).length || !state.data.listing.changedAt || state.data.listing.changedAt < state.data.listing.propertyVersion.updatedAt) throw new Error("EXPLICIT_GENESIS_REQUIRED");
  return { schemaVersion: 1, genesis: structuredClone(state.data), state: state.data, events: [], headHash: contentHash({ schemaVersion: 1, genesis: state.data }) };
}

/** Replay every event and check the final snapshot, not merely the last link. No secret/raw unknown input is logged. */
export function verifyMediaJournal(input: unknown): MediaJournal | undefined {
  const parsed = journalSchema.safeParse(input);
  if (!parsed.success) return undefined;
  const journal = parsed.data, seen = new Set<string>();
  let state: MediaState = journal.genesis, previousHash = contentHash({ schemaVersion: 1, genesis: state }), previousAt = "";
  for (const [index, event] of journal.events.entries()) {
    const { eventHash, ...body } = event;
    if (event.sequence !== index + 1 || seen.has(event.requestId) || event.at < previousAt || event.previousHash !== previousHash || event.commandHash !== contentHash(event.command) || event.beforeHash !== contentHash(state) || eventHash !== contentHash(body)) return undefined;
    const result = evaluate(state, event.command, event.at, journal.events.slice(0, index));
    if (contentHash(summarize(result)) !== contentHash(event.outcome)) return undefined;
    if (result.status !== "held") state = result.state;
    if (event.afterHash !== contentHash(state)) return undefined;
    seen.add(event.requestId); previousHash = eventHash; previousAt = event.at;
  }
  return journal.headHash === previousHash && contentHash(journal.state) === contentHash(state) ? journal : undefined;
}

export function appendMediaAudit(input: unknown, rawRequest: unknown): AuditResult {
  const journal = verifyMediaJournal(input), parsed = requestSchema.safeParse(rawRequest);
  if (!journal) return { status: "held", reason: "AUDIT_INTEGRITY_ERROR" };
  if (!parsed.success) return { status: "held", reason: "INVALID_AUDIT_REQUEST" };
  const request = parsed.data, checked = mediaCommandSchema.safeParse(request.command);
  const command = checked.success ? checked.data : null, commandHash = contentHash(command);
  const existing = journal.events.find(e => e.requestId === request.requestId);
  if (existing) {
    if (existing.commandHash !== commandHash || existing.actorRef !== request.actorRef || existing.at !== request.at) return { status: "held", reason: "REQUEST_ID_CONFLICT" };
    // Return the original result, but never return an old state as the current state.
    const outcome: MediaResult = existing.outcome.status === "held"
      ? { status: "held", reason: existing.outcome.reason! }
      : { status: "unchanged", state: journal.state };
    return { status: "recorded", journal, outcome, replayed: true };
  }
  if (journal.events.length >= 1000) return { status: "held", reason: "AUDIT_CAPACITY_REACHED" };
  if (journal.events.length && request.at < journal.events.at(-1)!.at) return { status: "held", reason: "AUDIT_TIME_ORDER" };
  const outcome = evaluate(journal.state, command, request.at, journal.events);
  const state = outcome.status === "held" ? journal.state : outcome.state;
  const body = { sequence: journal.events.length + 1, requestId: request.requestId, actorRef: request.actorRef, at: request.at, command, commandHash,
    beforeHash: contentHash(journal.state), afterHash: contentHash(state), outcome: summarize(outcome), previousHash: journal.headHash };
  const event = { ...body, eventHash: contentHash(body) };
  return { status: "recorded", journal: { ...journal, state, events: [...journal.events, event], headHash: event.eventHash }, outcome, replayed: false };
}
