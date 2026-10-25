import { z } from "zod";
import { appendMediaAudit, verifyMediaJournal, type AuditRequest } from "./audit";
import type { MediaResult } from "./media-state";

export type SqlResult = { rows: Record<string, unknown>[] };
export interface SqlTransaction { query(sql: string, parameters: readonly unknown[]): Promise<SqlResult> }
/** Driver must commit all queries atomically or reject; no environment/connection is opened here. */
export interface SqlPort { transaction<T>(run: (tx: SqlTransaction) => Promise<T>): Promise<T> }
export class RolledBackTransaction extends Error { constructor() { super("TRANSACTION_ROLLED_BACK"); } }
const keySchema = z.object({ propertyId: z.uuid(), episodeId: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/), media: z.enum(["site", "athome"]) }).strict();
export type MediaKey = z.infer<typeof keySchema>;
export const mediaSql = {
  state: "SELECT version, genesis, state, head_hash FROM public.property_sync_media_state WHERE property_id=$1 AND episode_id=$2 AND media=$3 FOR UPDATE",
  events: "SELECT event FROM public.property_sync_media_audit WHERE property_id=$1 AND episode_id=$2 AND media=$3 ORDER BY sequence LIMIT 1001",
  append: "INSERT INTO public.property_sync_media_audit (property_id,episode_id,media,sequence,request_id,event) VALUES ($1,$2,$3,$4,$5::uuid,$6::jsonb)",
  update: "UPDATE public.property_sync_media_state SET version=version+1,state=$4::jsonb,head_hash=$5 WHERE property_id=$1 AND episode_id=$2 AND media=$3 AND version=$6 AND head_hash=$7 RETURNING version",
} as const;

/** Unwired adapter: only an explicitly injected local/mock driver can execute it in this unit. */
export function createDbMediaStore(port: SqlPort) {
  return {
    async apply(rawKey: unknown, request: AuditRequest): Promise<MediaResult & { replayed?: boolean; auditSequence?: number }> {
      const parsed = keySchema.safeParse(rawKey);
      if (!parsed.success) return { status: "held", reason: "INVALID_BINDING" };
      const key = parsed.data, parameters = [key.propertyId, key.episodeId, key.media];
      try {
        return await port.transaction(async tx => {
          const rows = (await tx.query(mediaSql.state, parameters)).rows;
          if (rows.length !== 1) return { status: "held" as const, reason: "STATE_NOT_INITIALIZED" };
          const row = rows[0], events = (await tx.query(mediaSql.events, parameters)).rows.map(r => r.event);
          const journal = verifyMediaJournal({ schemaVersion: 1, genesis: row.genesis, state: row.state, events, headHash: row.head_hash });
          if (!journal || row.version !== events.length || journal.state.propertyId !== key.propertyId || journal.state.episodeId !== key.episodeId || journal.state.media !== key.media) return { status: "held" as const, reason: "AUDIT_INTEGRITY_ERROR" };
          const next = appendMediaAudit(journal, request);
          if (next.status === "held") return next;
          if (!next.replayed) {
            const event = next.journal.events.at(-1)!;
            await tx.query(mediaSql.append, [...parameters, event.sequence, event.requestId, JSON.stringify(event)]);
            const changed = await tx.query(mediaSql.update, [...parameters, JSON.stringify(next.journal.state), next.journal.headHash, row.version, journal.headHash]);
            if (changed.rows.length !== 1) throw new Error("CAS_CONFLICT");
          }
          return { ...next.outcome, replayed: next.replayed, auditSequence: next.journal.events.length };
        });
      } catch (error) {
        // Unknown commit results require readback using the SAME requestId, not a new request.
        return { status: "held", reason: error instanceof RolledBackTransaction ? "TRANSACTION_ROLLED_BACK" : "STORE_OUTCOME_UNKNOWN" };
      }
    },
  };
}
