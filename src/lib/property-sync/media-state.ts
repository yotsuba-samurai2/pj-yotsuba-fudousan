import { z } from "zod";

// Local, private evidence only. No PropertyInput, database, network or writer dependency.
const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/);
const revision = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const instant = z.iso.datetime({ precision: 3 });
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const identity = { propertyId: z.uuid(), episodeId: id, media: z.enum(["site", "athome"]) };
const surface = z.enum(["pc", "mobileWeb", "mobileApp", "unknown"]);
const listing = z.object({
  revision, managementId: id.nullable(), publicId: id.nullable(),
  changedAt: instant.optional(),
  desiredState: z.enum(["unconfigured", "published", "not_published"]),
  // Full source snapshot version, never the IndexNow content hash.
  propertyVersion: z.object({ updatedAt: instant, fullHash: hash }).strict(),
}).strict();
const observation = z.object({
  revision, listingRevision: revision, evidenceId: id, observedAt: instant,
  acquisition: z.enum(["manual", "official_export", "official_api", "mock"]), authorizationRef: id,
  visibility: z.enum(["published", "not_published", "unknown"]), exactUnitConfirmed: z.boolean(),
  contentHash: hash.nullable(),
  // Same-room company list only. This is never a search-result rank.
  companyFirst: z.enum(["yes", "no", "unknown", "not_applicable"]),
}).strict();
export const mediaStateSchema = z.object({
  schemaVersion: z.literal(1), ...identity, listing,
  observations: z.object({ pc: observation.optional(), mobileWeb: observation.optional(), mobileApp: observation.optional(), unknown: observation.optional() }).strict(),
}).strict().superRefine((state, ctx) => {
  for (const [device, value] of Object.entries(state.observations)) {
    if (value.listingRevision > state.listing.revision || !validObservation(state.media, device, value)) ctx.addIssue({ code: "custom", message: "INVALID_OBSERVATION" });
  }
});
const observationCommand = z.object({
  type: z.literal("observe"), ...identity, surface,
  expectedListingRevision: revision, expectedObservationRevision: revision,
  evidence: observation.omit({ revision: true, listingRevision: true }),
}).strict();
const listingCommand = z.object({
  type: z.literal("set_listing"), ...identity, expectedListingRevision: revision,
  listing: listing.omit({ revision: true, changedAt: true }),
}).strict();
export const mediaCommandSchema = z.discriminatedUnion("type", [observationCommand, listingCommand]);
export type MediaState = z.infer<typeof mediaStateSchema>;
export type MediaCommand = z.infer<typeof mediaCommandSchema>;
export type MediaResult = { status: "applied" | "unchanged"; state: MediaState } | { status: "held"; reason: string };

function validObservation(media: string, device: string, value: z.infer<typeof observation>): boolean {
  if (value.visibility !== "unknown" && !value.exactUnitConfirmed) return false;
  if (value.visibility === "published" && value.contentHash === null) return false;
  if (["yes", "no"].includes(value.companyFirst)) return media === "athome" && device !== "unknown" && value.visibility === "published" && value.exactUnitConfirmed;
  return true;
}

/** Pure CAS transition. Media evidence never changes properties.updated_at or internal. */
export function applyMediaCommand(input: unknown, command: unknown, now: string): MediaResult {
  const parsedState = mediaStateSchema.safeParse(input), parsedCommand = mediaCommandSchema.safeParse(command);
  if (!parsedState.success || !parsedCommand.success || !instant.safeParse(now).success) return { status: "held", reason: "INVALID_INPUT" };
  const state = parsedState.data, cmd = parsedCommand.data;
  if (state.propertyId !== cmd.propertyId || state.episodeId !== cmd.episodeId || state.media !== cmd.media) return { status: "held", reason: "BINDING_MISMATCH" };
  if (state.listing.revision !== cmd.expectedListingRevision) return { status: "held", reason: "LISTING_VERSION_CONFLICT" };
  if (cmd.type === "set_listing") {
    if (state.listing.revision === Number.MAX_SAFE_INTEGER) return { status: "held", reason: "VERSION_EXHAUSTED" };
    if (cmd.listing.propertyVersion.updatedAt > now) return { status: "held", reason: "FUTURE_PROPERTY_VERSION" };
    if (cmd.listing.propertyVersion.updatedAt < state.listing.propertyVersion.updatedAt || (state.listing.changedAt && now < state.listing.changedAt)) return { status: "held", reason: "PROPERTY_VERSION_REGRESSION" };
    if (cmd.listing.propertyVersion.updatedAt === state.listing.propertyVersion.updatedAt && cmd.listing.propertyVersion.fullHash !== state.listing.propertyVersion.fullHash) return { status: "held", reason: "SAME_TIMESTAMP_HASH_CONFLICT" };
    state.listing = { ...cmd.listing, revision: state.listing.revision + 1, changedAt: now };
    // Keep history; older listingRevision is not a current readback.
    return { status: "applied", state };
  }
  if (cmd.expectedObservationRevision === Number.MAX_SAFE_INTEGER) return { status: "held", reason: "VERSION_EXHAUSTED" };
  const value = observation.parse({ ...cmd.evidence, revision: cmd.expectedObservationRevision + 1, listingRevision: state.listing.revision });
  if (!validObservation(state.media, cmd.surface, value)) return { status: "held", reason: "UNVERIFIED_OBSERVATION" };
  if (value.observedAt > now) return { status: "held", reason: "FUTURE_OBSERVATION" };
  if (value.observedAt < state.listing.propertyVersion.updatedAt || (state.listing.changedAt && value.observedAt < state.listing.changedAt)) return { status: "held", reason: "OBSERVATION_BEFORE_LISTING" };
  const prior = state.observations[cmd.surface];
  if (prior?.evidenceId === value.evidenceId) {
    // zod establishes deterministic key order; a reused ID with different evidence is a conflict.
    return JSON.stringify(prior) === JSON.stringify(value) ? { status: "unchanged", state } : { status: "held", reason: "EVIDENCE_ID_CONFLICT" };
  }
  if ((prior?.revision ?? 0) !== cmd.expectedObservationRevision) return { status: "held", reason: "OBSERVATION_VERSION_CONFLICT" };
  if (prior && value.observedAt <= prior.observedAt) return { status: "held", reason: "OBSERVATION_TIME_ORDER" };
  state.observations[cmd.surface] = value;
  return { status: "applied", state };
}

/** Unknown/stale readback is never interpreted as success, absence or removal permission. */
export function currentMediaObservation(state: MediaState, device: z.infer<typeof surface>, now: string, maxAgeMs: number) {
  if (!instant.safeParse(now).success || !Number.isFinite(maxAgeMs) || maxAgeMs < 0) return undefined;
  const evidence = state.observations[device];
  if (!evidence || evidence.listingRevision !== state.listing.revision || evidence.acquisition === "mock") return undefined;
  if (evidence.observedAt < state.listing.propertyVersion.updatedAt || (state.listing.changedAt && evidence.observedAt < state.listing.changedAt)) return undefined;
  const age = Date.parse(now) - Date.parse(evidence.observedAt);
  return age >= 0 && age <= maxAgeMs ? structuredClone(evidence) : undefined;
}
