import "server-only";
import { z } from "zod";
import { contentHash } from "./rules";
import { createPrivateJournalStore } from "./private-journal-store";
import { assessIncomingPropertyMail, MAIL_WINDOW_MS, mailCandidateSchema, mailEnvelopeSchema, type MailCandidate } from "./mail-intake";

const hash = z.string().regex(/^[a-f0-9]{64}$/), instant = z.iso.datetime({ precision: 3 });
const bindingSchema = z.object({ mailboxRef: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/) }).strict();
const genesisSchema = z.object({ binding: bindingSchema, createdAt: instant }).strict();
const entrySchema = z.object({ candidate: mailCandidateSchema, possibleDuplicateOf: hash.nullable(), previousHash: hash, entryHash: hash }).strict();
const inboxSchema = z.object({ schemaVersion: z.literal(1), visibility: z.literal("internal_only"), executable: z.literal(false),
  genesis: genesisSchema, entries: z.array(entrySchema).max(250), headHash: hash }).strict();
export type MailInbox = z.infer<typeof inboxSchema>;
type Outcome = { status: "queued"; messageKey: string; possibleDuplicateOf: string | null };
const held = (reason: string) => ({ status: "held" as const, executable: false as const, reason });
const genesisHash = (genesis: MailInbox["genesis"]) => contentHash({ type: "private_mail_inbox", schemaVersion: 1, genesis });

export function createMailInbox(binding: unknown, createdAt: string): MailInbox {
  const genesis = genesisSchema.parse({ binding, createdAt });
  return { schemaVersion: 1, visibility: "internal_only", executable: false, genesis,
    entries: [], headHash: genesisHash(genesis) };
}

/** Integrity check, not an authority signature. Restrict access to the containing directory as well. */
export function verifyMailInbox(raw: unknown): MailInbox | undefined {
  const parsed = inboxSchema.safeParse(raw);
  if (!parsed.success) return undefined;
  const inbox = parsed.data, seen = new Set<string>(), contents = new Map<string, string>();
  let previousHash = genesisHash(inbox.genesis), previousAt = inbox.genesis.createdAt;
  for (const entry of inbox.entries) {
    const { entryHash, ...body } = entry, c = entry.candidate;
    if (c.mailboxRef !== inbox.genesis.binding.mailboxRef || seen.has(c.messageKey)
      || c.messageKey !== contentHash({ mailboxRef: c.mailboxRef, messageId: c.messageId })
      || c.assessedAt < previousAt || c.receivedAt > c.assessedAt || Date.parse(c.assessedAt) - Date.parse(c.receivedAt) > MAIL_WINDOW_MS
      || entry.previousHash !== previousHash || entryHash !== contentHash(body)
      || entry.possibleDuplicateOf !== (contents.get(c.contentHash) ?? null)) return undefined;
    seen.add(c.messageKey); if (!contents.has(c.contentHash)) contents.set(c.contentHash, c.messageKey);
    previousHash = entryHash; previousAt = c.assessedAt;
  }
  return inbox.headHash === previousHash ? inbox : undefined;
}

export function appendMailInbox(rawInbox: unknown, rawRequest: unknown, now: string):
  ReturnType<typeof held> | { status: "recorded"; executable: false; journal: MailInbox; outcome: Outcome; replayed: boolean } {
  const inbox = verifyMailInbox(rawInbox);
  if (!inbox) return held("MAIL_INBOX_INTEGRITY_ERROR");
  const request = z.object({ expectedHeadHash: hash, mail: z.unknown() }).strict().safeParse(rawRequest);
  if (!request.success || !instant.safeParse(now).success) return held("INVALID_MAIL_INBOX_REQUEST");
  const lastAt = inbox.entries.at(-1)?.candidate.assessedAt ?? inbox.genesis.createdAt;
  if (now < lastAt) return held("MAIL_INBOX_FROM_FUTURE");
  const mail = mailEnvelopeSchema.safeParse(request.data.mail);
  if (!mail.success) return held("INVALID_MAIL_INPUT");
  if (mail.data.mailboxRef !== inbox.genesis.binding.mailboxRef) return held("MAILBOX_MISMATCH");
  const key = contentHash({ mailboxRef: mail.data.mailboxRef, messageId: mail.data.messageId });
  const prior = inbox.entries.find(e => e.candidate.messageKey === key);
  const outcome = (entry: MailInbox["entries"][number]): Outcome => ({ status: "queued", messageKey: entry.candidate.messageKey,
    possibleDuplicateOf: entry.possibleDuplicateOf });
  if (prior) {
    if (prior.candidate.envelopeHash !== contentHash(mail.data)) return held("MAIL_MESSAGE_CHANGED");
    // Historical reconciliation, not a new read/intake. It must survive the seven-day boundary.
    return { status: "recorded", executable: false, journal: inbox, outcome: outcome(prior), replayed: true };
  }
  const assessed = assessIncomingPropertyMail(mail.data, inbox.genesis.binding.mailboxRef, now);
  if (assessed.status !== "candidate") return held(assessed.reason);
  const candidate: MailCandidate = assessed.candidate;
  if (request.data.expectedHeadHash !== inbox.headHash) return held("MAIL_INBOX_CONFLICT");
  if (inbox.entries.length >= 250) return held("MAIL_INBOX_CAPACITY_REACHED");
  const possibleDuplicateOf = inbox.entries.find(e => e.candidate.contentHash === candidate.contentHash)?.candidate.messageKey ?? null;
  const body = { candidate, possibleDuplicateOf, previousHash: inbox.headHash }, entry = { ...body, entryHash: contentHash(body) };
  return { status: "recorded", executable: false, replayed: false, outcome: outcome(entry),
    journal: { ...inbox, entries: [...inbox.entries, entry], headHash: entry.entryHash } };
}

const store = createPrivateJournalStore({ create: createMailInbox, verify: verifyMailInbox, append: appendMailInbox,
  errors: { invalidGenesis: "INVALID_MAIL_INBOX_GENESIS", invalidFile: "MAIL_INBOX_FILE_INVALID", capacity: "MAIL_INBOX_CAPACITY_REACHED" } });
export const createMailInboxFile = store.create;
export const readMailInboxFile = store.read;
export const applyMailInboxFile = store.apply;
