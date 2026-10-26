import "server-only";
import { z } from "zod";
import { registeredRentalIdentity } from "../registered-rental-identity";
import { addressKey, normalized, unitKey, unitNumber } from "../school-rental-feed";
import { planContextSchema } from "./change-plan";
import { contentHash } from "./rules";
import { fingerprintPropertySnapshot } from "./source-fingerprint";
import { verifyMailInbox } from "./local-mail-inbox";
import { MAIL_WINDOW_MS, proposeRentalEvidenceFromMail } from "./mail-intake";

const ref = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/), hash = z.string().regex(/^[a-f0-9]{64}$/);
const instant = z.iso.datetime({ precision: 3 });
const targetSchema = planContextSchema.shape.snapshot.pick({ propertyId: true, episodeId: true, version: true });
const roomIdentitySchema = z.object({ building: z.string().trim().min(1).max(300),
  address: z.string().trim().min(1).max(300), unit: z.string().trim().min(1).max(30) }).strict().refine(v =>
  !!normalized(v.building) && !!addressKey(v.address) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(unitNumber(v.unit))
  && !Object.values(v).some(value => value.normalize("NFKC").includes("|") || /^(?:unknown|不明|未定|未確認|n\/a|-+)$/i.test(value)));
export const mailIdentityEvidenceSchema = z.object({
  evidenceRef: ref, messageKey: hash, candidateHash: hash, target: targetSchema,
  status: z.enum(["confirmed", "pending", "revoked"]), method: z.enum(["manual_exact_room", "unconfirmed"]),
  confirmedAt: instant.nullable(), reviewerRef: ref.nullable(), sourceRef: ref.nullable(),
  identity: roomIdentitySchema,
}).strict();
const requestSchema = z.object({ mailboxRef: ref, messageKey: hash, candidateHash: hash,
  target: targetSchema, identityEvidenceRef: ref, identityEvidenceHash: hash }).strict();
export type MailCanonicalMatchRequest = z.infer<typeof requestSchema>;

/** Trusted read adapters only. No create/update/delete port and no list-all or source search. */
export type MailCanonicalReaders = {
  readInbox(mailboxRef: string): Promise<unknown>;
  readTarget(binding: { propertyId: string; episodeId: string }): Promise<{ recordJson: string; metadataJson: string } | null>;
  readIdentityEvidence(evidenceRef: string): Promise<unknown>;
  clock(): string;
};
const held = (reason: string) => ({ status: "held" as const, executable: false as const, reason });

async function readMatch(request: MailCanonicalMatchRequest, readers: MailCanonicalReaders, earliest: string) {
  const [rawInbox, rawTarget, rawEvidence] = await Promise.all([
    readers.readInbox(request.mailboxRef), readers.readTarget({ propertyId: request.target.propertyId, episodeId: request.target.episodeId }),
    readers.readIdentityEvidence(request.identityEvidenceRef),
  ]);
  const now = readers.clock();
  if (!instant.safeParse(now).success || now < earliest) return held("MATCH_CLOCK_INVALID");
  const inbox = verifyMailInbox(rawInbox);
  if (!inbox || inbox.genesis.binding.mailboxRef !== request.mailboxRef) return held("MAIL_INBOX_MISMATCH");
  const candidate = inbox.entries.find(e => e.candidate.messageKey === request.messageKey)?.candidate;
  if (!candidate || contentHash(candidate) !== request.candidateHash) return held("MAIL_CANDIDATE_CHANGED_OR_MISSING");
  if (candidate.assessedAt > now || candidate.receivedAt > now) return held("MAIL_CANDIDATE_FROM_FUTURE");
  if (Date.parse(now) - Date.parse(candidate.receivedAt) > MAIL_WINDOW_MS) return held("MAIL_OUTSIDE_MATCH_WINDOW");
  if (candidate.marketProposal !== "residential_rental") return held("MAIL_MARKET_NOT_RESIDENTIAL_RENTAL");
  if (!rawTarget) return held("CANONICAL_PROPERTY_NOT_FOUND");
  const fingerprint = fingerprintPropertySnapshot(rawTarget.recordJson, rawTarget.metadataJson, now);
  if (fingerprint.status !== "fingerprinted") return held(fingerprint.reason);
  const snapshot = fingerprint.snapshot;
  if (snapshot.capturedAt < earliest) return held("CANONICAL_SNAPSHOT_PREDATES_CHECK");
  if (snapshot.propertyId !== request.target.propertyId || snapshot.episodeId !== request.target.episodeId
    || snapshot.market !== "residential_rental") return held("CANONICAL_TARGET_MISMATCH");
  if (contentHash(snapshot.version) !== contentHash(request.target.version)) return held("CANONICAL_PROPERTY_VERSION_CONFLICT");

  // Parse only AFTER the existing bounded JSON scanner has rejected duplicates, lossy numbers and excessive depth.
  const record = z.object({ dealType: z.literal("rental"), status: z.enum(["draft", "published", "closed"]),
    internal: z.object({ rentalImport: z.object({ source: roomIdentitySchema.passthrough() }) }) }).safeParse(JSON.parse(rawTarget.recordJson));
  if (!record.success) return held("CANONICAL_EXPLICIT_IDENTITY_REQUIRED");
  if (record.data.status === "closed") return held("CANONICAL_RECRUITMENT_REVIEW_REQUIRED");
  const evidence = mailIdentityEvidenceSchema.safeParse(rawEvidence);
  if (!evidence.success) return held("INVALID_MAIL_IDENTITY_EVIDENCE");
  const e = evidence.data;
  if (e.evidenceRef !== request.identityEvidenceRef || contentHash(e) !== request.identityEvidenceHash
    || e.messageKey !== request.messageKey || e.candidateHash !== request.candidateHash
    || contentHash(e.target) !== contentHash(request.target)) return held("MAIL_IDENTITY_EVIDENCE_MISMATCH");
  if (e.status !== "confirmed" || e.method !== "manual_exact_room" || !e.confirmedAt || !e.reviewerRef || !e.sourceRef
    || e.confirmedAt < candidate.assessedAt || e.confirmedAt > now) return held("MAIL_IDENTITY_UNCONFIRMED");
  // Explicit stored source only. The legacy title-derived fallback is deliberately not reachable here.
  const registered = registeredRentalIdentity({ dealType: "rental", internal: record.data.internal, title: "", locationText: "" });
  const incomingKey = unitKey(e.identity), canonicalKey = registered && unitKey(registered);
  // Exact normalized key equality, never the looser address-prefix sameUnit matcher.
  if (!incomingKey || !canonicalKey || incomingKey !== canonicalKey) return held("MAIL_ROOM_IDENTITY_MISMATCH");
  const proposal = proposeRentalEvidenceFromMail(candidate, { propertyId: snapshot.propertyId, episodeId: snapshot.episodeId });
  if (proposal.status !== "proposed") return held(proposal.reason);
  return { status: "checked" as const, now, proposal, advertising: candidate.advertising };
}

/**
 * Link an internal proposal to a reviewed existing canonical ID/version; never insert or update properties.
 * The evidence reader must enforce authority/revocation. Hashes and caller-provided JSON are not authentication.
 * A successful result is a read-time check, not a reservation: any later writer must recheck and use CAS.
 */
export async function matchMailToCanonicalProperty(raw: unknown, readers: MailCanonicalReaders) {
  try {
    const request = requestSchema.safeParse(raw), started = readers.clock();
    if (!request.success || !instant.safeParse(started).success) return held("INVALID_CANONICAL_MATCH_REQUEST");
    const first = await readMatch(request.data, readers, started);
    if (first.status !== "checked") return first;
    // Re-read the canonical version, candidate and confirmation to reject mid-check edits/revocation.
    const final = await readMatch(request.data, readers, first.now);
    if (final.status !== "checked") return final;
    return { status: "matched_proposal" as const, executable: false as const, publicationEligible: false as const,
      visibility: "internal_only" as const, destination: "existing_properties" as const,
      canonicalTarget: request.data.target, candidateReference: { mailboxRef: request.data.mailboxRef, messageKey: request.data.messageKey, hash: request.data.candidateHash },
      identityEvidenceReference: { ref: request.data.identityEvidenceRef, hash: request.data.identityEvidenceHash },
      checkedAt: final.now, advertising: final.advertising, fieldProposal: final.proposal,
      pendingGates: ["CANONICAL_WRITE_REVIEW_AND_CAS", "CURRENT_EPISODE_AUTHENTICITY", "FIELD_NORMALIZATION_AND_RULES",
        "SOURCE_AUTHORIZATION", "ADVERTISING_AND_MATERIAL_PERMISSION", "MEDIA_EXECUTION_APPROVAL"] as const };
  } catch { return held("CANONICAL_MATCH_READ_FAILED"); }
}
