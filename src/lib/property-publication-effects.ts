import { randomUUID } from "node:crypto";
import { z } from "zod";
import { detectPublicationChange, MAX_NOTIFY_ATTEMPTS } from "./property-publication";
import { contentHash } from "./property-sync/rules";
import type { AdminProperty } from "./property-shared";

export type EffectKind = "cache" | "notification";
const slug = z.string().regex(/^[a-z0-9-]+$/);
const path = z.string().regex(/^\/(?:en\/|zh-tw\/|zh\/)?bukken(?:\/[a-z0-9-]+)?$/);
export const publicationEffectPlanSchema = z.object({
  schemaVersion: z.literal(1), requestId: z.uuid(), propertyId: z.uuid(), resultVersion: z.iso.datetime({ precision: 3 }),
  initiatorHash: z.string().regex(/^[a-f0-9]{64}$/).optional(),
  cacheSlugs: z.array(slug).min(1).max(2), notificationPaths: z.array(path).max(16),
  changeKind: z.enum(["published", "changed", "unpublished", "expired"]).nullable(),
}).strict();
export type PublicationEffectPlan = z.infer<typeof publicationEffectPlanSchema>;
const stage = z.object({ status: z.enum(["pending", "running", "acknowledged", "not_required", "blocked"]),
  attempts: z.number().int().min(0).max(MAX_NOTIFY_ATTEMPTS), attemptId: z.uuid().nullable() }).strict();
export const publicationEffectStateSchema = z.object({ cache: stage, notification: stage }).strict();
export type PublicationEffectState = z.infer<typeof publicationEffectStateSchema>;
export type EffectRecord = { plan: PublicationEffectPlan; planHash: string; state: PublicationEffectState; revision: number };
export type EffectRef = { requestId: string; propertyId: string };
const refSchema = z.object({ requestId: z.uuid().transform(v => v.toLowerCase()), propertyId: z.uuid().transform(v => v.toLowerCase()) }).strict();

/** Only old/new public route identifiers are persisted, never raw property text or private fields. */
export const publicationEffectInitiatorHash = (actorRef: string) => contentHash({ schemaVersion: 1, purpose: "publication_effect_initiator", actorRef });
export function planPublicationEffects(requestId: string, before: AdminProperty, after: AdminProperty, now: Date, actorRef?: string): EffectRecord {
  const change = detectPublicationChange(before, after, now);
  const plan = publicationEffectPlanSchema.parse({ schemaVersion: 1, requestId, propertyId: after.id, resultVersion: after.updatedAt,
    ...(actorRef ? { initiatorHash: publicationEffectInitiatorHash(actorRef) } : {}),
    cacheSlugs: [...new Set([before.slug, after.slug])], notificationPaths: change?.urls ?? [], changeKind: change?.kind ?? null });
  return { plan, planHash: contentHash(plan), revision: 0, state: {
    cache: { status: "pending", attempts: 0, attemptId: null },
    notification: { status: change ? "pending" : "not_required", attempts: 0, attemptId: null },
  } };
}

export function verifyEffectRecord(raw: EffectRecord): EffectRecord | null {
  const p = publicationEffectPlanSchema.safeParse(raw.plan), s = publicationEffectStateSchema.safeParse(raw.state);
  if (!p.success || !s.success || contentHash(p.data) !== raw.planHash || !Number.isSafeInteger(raw.revision) || raw.revision < 0) return null;
  const state = s.data;
  if ((p.data.notificationPaths.length === 0) !== (p.data.changeKind === null)) return null;
  if ((state.notification.status === "not_required") !== (p.data.changeKind === null) || state.cache.status === "not_required") return null;
  for (const value of Object.values(state)) {
    if ((value.attempts === 0) !== (value.attemptId === null)) return null;
    if (["running", "acknowledged", "blocked"].includes(value.status) && value.attempts === 0) return null;
    if (value.status === "not_required" && value.attempts !== 0) return null;
    // blocked is terminal exhaustion; pending can never be at the retry limit.
    if (value.status === "blocked" && value.attempts !== MAX_NOTIFY_ATTEMPTS || value.status === "pending" && value.attempts === MAX_NOTIFY_ATTEMPTS) return null;
  }
  // A cache acknowledgement is terminal and precedes every notification attempt.
  // Reject inconsistent restored state before an already-resolved fast path can trust it.
  if (state.notification.attempts > 0 && state.cache.status !== "acknowledged") return null;
  return { plan: p.data, planHash: raw.planHash, state, revision: raw.revision };
}

export interface PublicationEffectStore {
  // Callback and optional replacement run atomically under one row lock. Never invokes external effects.
  change<T>(ref: EffectRef, run: (row: EffectRecord | null) => { value: T; state?: PublicationEffectState }): Promise<T>;
}
export type EffectTicket = Readonly<{ operationId: string; attemptId: string; targetHash: string; kind: EffectKind; targets: readonly string[] }>;
const proofSchema = z.object({ operationId: z.string(), attemptId: z.uuid(), targetHash: z.string().regex(/^[a-f0-9]{64}$/),
  outcome: z.enum(["acknowledged", "not_applied_final", "unknown"]) }).strict();
export type EffectProof = z.infer<typeof proofSchema>;
export interface PublicationEffectPort {
  // not_applied_final guarantees this attempt cannot later apply. A mere absence/timeout is unknown.
  run(ticket: EffectTicket): Promise<EffectProof>;
  reconcile(ticket: EffectTicket): Promise<EffectProof>;
}
export type EffectResult = { status: "acknowledged" | "not_required" | "retry_ready" | "unknown" | "held"; reason: string; publication: "not_checked" };
const out = (status: EffectResult["status"], reason: string): EffectResult => ({ status, reason, publication: "not_checked" });
const ticketFor = (r: EffectRecord, kind: EffectKind): EffectTicket => Object.freeze({ operationId: `${r.plan.requestId}:${kind}`,
  attemptId: r.state[kind].attemptId!, targetHash: contentHash({ planHash: r.planHash, kind }), kind,
  targets: Object.freeze([...(kind === "cache" ? r.plan.cacheSlugs : r.plan.notificationPaths)]) });

/** No network adapters, credentials, scans or timers. An explicit call resumes one saved request/effect. */
export function createPublicationEffectRunner(store: PublicationEffectStore, ports: Partial<Record<EffectKind, PublicationEffectPort>>) {
  return { async resume(rawRef: EffectRef, kind: EffectKind): Promise<EffectResult> {
    const ref = refSchema.safeParse(rawRef), port = ports[kind];
    if (!ref.success || !["cache", "notification"].includes(kind)) return out("held", "INVALID_EFFECT_REFERENCE");
    if (!port) return out("held", "EFFECT_DISABLED");
    try {
      const claimed = await store.change<{ ticket: EffectTicket; method: "run" | "reconcile" } | EffectResult>(ref.data, raw => {
        if (!raw) return { value: out("held", "EFFECT_NOT_FOUND") };
        const row = verifyEffectRecord(raw);
        if (!row || row.plan.propertyId !== ref.data.propertyId || row.plan.requestId !== ref.data.requestId) return { value: out("held", "EFFECT_INTEGRITY_ERROR") };
        const state = row.state[kind];
        if (state.status === "acknowledged" || state.status === "not_required") return { value: out(state.status, "EFFECT_ALREADY_RESOLVED") };
        if (state.status === "blocked") return { value: out("held", "ATTEMPTS_EXHAUSTED") };
        if (kind === "notification" && row.state.cache.status !== "acknowledged") return { value: out("held", "CACHE_NOT_ACKNOWLEDGED") };
        if (state.status === "running") return { value: { ticket: ticketFor(row, kind), method: "reconcile" } };
        const next = structuredClone(row.state);
        next[kind] = { status: "running", attempts: state.attempts + 1, attemptId: randomUUID() };
        return { state: next, value: { ticket: ticketFor({ ...row, state: next }, kind), method: "run" } };
      });
      if (!("ticket" in claimed)) return claimed;
      let proof;
      try { proof = proofSchema.safeParse(await port[claimed.method](claimed.ticket)); }
      catch { return out("unknown", "EFFECT_OUTCOME_UNKNOWN"); }
      if (!proof.success || proof.data.operationId !== claimed.ticket.operationId || proof.data.attemptId !== claimed.ticket.attemptId ||
        proof.data.targetHash !== claimed.ticket.targetHash || proof.data.outcome === "unknown") return out("unknown", "EFFECT_OUTCOME_UNKNOWN");
      return await store.change(ref.data, raw => {
        const row = raw && verifyEffectRecord(raw);
        if (!row || row.plan.propertyId !== ref.data.propertyId || row.plan.requestId !== ref.data.requestId) return { value: out("held", "EFFECT_INTEGRITY_ERROR") };
        const state = row.state[kind];
        if (state.attemptId !== claimed.ticket.attemptId || ticketFor(row, kind).targetHash !== claimed.ticket.targetHash) return { value: out("held", "STALE_EFFECT_ATTEMPT") };
        if (state.status === "acknowledged") return { value: out("acknowledged", "EFFECT_ALREADY_RESOLVED") };
        if (state.status !== "running") return { value: out("held", "STALE_EFFECT_ATTEMPT") };
        const next = structuredClone(row.state), acknowledged = proof.data.outcome === "acknowledged";
        next[kind].status = acknowledged ? "acknowledged" : state.attempts >= MAX_NOTIFY_ATTEMPTS ? "blocked" : "pending";
        return { state: next, value: acknowledged ? out("acknowledged", "EFFECT_ACKNOWLEDGED")
          : next[kind].status === "blocked" ? out("held", "ATTEMPTS_EXHAUSTED") : out("retry_ready", "ATTEMPT_CONFIRMED_NOT_APPLIED") };
      });
    } catch { return out("unknown", "EFFECT_STORE_OUTCOME_UNKNOWN"); }
  } };
}
