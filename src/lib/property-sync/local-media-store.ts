import "server-only";
import { appendMediaAudit, createMediaJournal, verifyMediaJournal, type AuditRequest } from "./audit";
import type { MediaResult } from "./media-state";
import { createPrivateJournalStore } from "./private-journal-store";

export type MediaStoreResult = MediaResult & { replayed?: boolean; auditSequence?: number };
const store = createPrivateJournalStore({
  create: createMediaJournal,
  verify: verifyMediaJournal,
  // request.at is part of the immutable idempotency key; do not substitute the store clock.
  append: (input, request) => ({ ...appendMediaAudit(input, request), executable: false as const }),
  errors: { invalidGenesis: "INVALID_MEDIA_STATE", invalidFile: "AUDIT_INTEGRITY_ERROR", capacity: "AUDIT_CAPACITY_REACHED" },
});

// Preserve the original void/throw API and explicit genesis checks. No implicit migration.
export async function createMediaStateFile(file: string, input: unknown): Promise<void> {
  createMediaJournal(input);
  const result = await store.create(file, input, "");
  if (result.status === "created") return;
  const error: NodeJS.ErrnoException = new Error(result.reason);
  if (result.reason === "STORE_ALREADY_EXISTS") error.code = "EEXIST";
  throw error;
}

/** Same media result contract; the journal envelope never escapes the file adapter. */
export async function applyMediaCommandFile(file: string, request: AuditRequest): Promise<MediaStoreResult> {
  const next = await store.apply(file, request);
  if (next.status === "held") return { status: "held", reason: next.reason };
  return { ...next.outcome, replayed: next.replayed, auditSequence: next.journal.events.length };
}
