import { randomUUID } from "node:crypto";
import type { MediaState, MediaCommand } from "../media-state";
import type { AuditRequest } from "../audit";
export const now = "2026-10-24T12:00:00.000Z";
export function mediaState(): MediaState {
  return { schemaVersion: 1, propertyId: "00000000-0000-4000-8000-000000000001", episodeId: "episode-1", media: "athome",
    listing: { revision: 1, changedAt: "2026-10-24T00:00:00.000Z", managementId: "mgmt", publicId: "pub", desiredState: "published", propertyVersion: { updatedAt: "2026-10-24T00:00:00.000Z", fullHash: "a".repeat(64) } }, observations: {} };
}
export function observe(index = 0): Extract<MediaCommand, { type: "observe" }> {
  const s = mediaState();
  return { type: "observe", propertyId: s.propertyId, episodeId: s.episodeId, media: s.media, surface: "mobileWeb", expectedListingRevision: 1, expectedObservationRevision: index,
    evidence: { evidenceId: `evidence-${index}`, observedAt: new Date(Date.parse("2026-10-24T11:00:00.000Z") + index * 1000).toISOString(), acquisition: "manual", authorizationRef: "manual", visibility: "published", exactUnitConfirmed: true, contentHash: "b".repeat(64), companyFirst: "yes" } };
}
export const request = (command: unknown = observe(), at = now): AuditRequest => ({ requestId: randomUUID(), actorRef: "operator-test", at, command });
