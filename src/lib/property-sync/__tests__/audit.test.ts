import { expect, it } from "vitest";
import { appendMediaAudit, createMediaJournal, verifyMediaJournal, type MediaJournal, type AuditRequest } from "../audit";
import { applyMediaCommand, currentMediaObservation } from "../media-state";
import { contentHash } from "../rules";
import { mediaState, now, observe, request } from "./fixtures";
function append(j: MediaJournal, r: AuditRequest): MediaJournal { const result = appendMediaAudit(j, r); if (result.status !== "recorded") throw new Error(result.reason); return result.journal; }
it("既存観測や成立時刻不明のsnapshotを監査の起点として勝手に採用しない", () => {
  const s = mediaState(); s.observations.mobileWeb = { ...observe().evidence, revision: 1, listingRevision: 1 };
  expect(() => createMediaJournal(s)).toThrow("EXPLICIT_GENESIS_REQUIRED");
  const j = createMediaJournal(mediaState()); j.genesis = s; j.state = s; j.headHash = contentHash({ schemaVersion: 1, genesis: s });
  expect(verifyMediaJournal(j)).toBeUndefined();
  const empty = mediaState(); delete empty.listing.changedAt;
  expect(() => createMediaJournal(empty)).toThrow("EXPLICIT_GENESIS_REQUIRED");
});
it("100回の観測を順序付きで保持し、最終snapshotを全履歴から検証する", () => {
  let j = createMediaJournal(mediaState()); const original = structuredClone(j);
  for (let i = 0; i < 100; i++) j = append(j, request(observe(i)));
  expect(j.events).toHaveLength(100); expect(j.state.observations.mobileWeb?.revision).toBe(100); expect(verifyMediaJournal(j)).toEqual(j);
  expect(j.genesis).toEqual(original.genesis); expect(j.state.listing).toEqual(original.state.listing);
});
it("再送は履歴を増やさず、後続変更後も古い状態を返さない", () => {
  const r = request(); let j = append(createMediaJournal(mediaState()), r); j = append(j, request(observe(1)));
  const result = appendMediaAudit(j, r);
  expect(result).toMatchObject({ status: "recorded", replayed: true, outcome: { status: "unchanged", state: j.state } });
  if (result.status === "recorded") expect(result.journal.events).toHaveLength(2);
  expect(appendMediaAudit(j, { ...r, actorRef: "other" })).toMatchObject({ reason: "REQUEST_ID_CONFLICT" });
});
it("失敗も監査し、余分なネストの機密値を履歴に保存しない", () => {
  const j = append(createMediaJournal(mediaState()), request({ ...observe(), internal: { ad: "PRIVATE_CANARY" } }));
  expect(j.events[0].outcome).toEqual({ status: "held", reason: "INVALID_COMMAND" }); expect(j.events[0].command).toBeNull();
  expect(JSON.stringify(j)).not.toContain("PRIVATE_CANARY"); expect(verifyMediaJournal(j)).toEqual(j);
});
it.each(["state", "event", "remove", "reorder", "genesis"])("監査の%s改変を拒否する", field => {
  let j = append(createMediaJournal(mediaState()), request()); j = append(j, request(observe(1)));
  if (field === "state") j.state.listing.desiredState = "not_published";
  if (field === "event") j.events[0].actorRef = "other";
  if (field === "remove") j.events.splice(0, 1);
  if (field === "reorder") j.events.reverse();
  if (field === "genesis") j.genesis.listing.publicId = "other";
  expect(verifyMediaJournal(j)).toBeUndefined(); expect(appendMediaAudit(j, request())).toMatchObject({ reason: "AUDIT_INTEGRITY_ERROR" });
});
it("古い根拠IDの再利用を全履歴で拒否し、再hashだけでは偽の結果を受理しない", () => {
  let j = append(createMediaJournal(mediaState()), request()); j = append(j, request(observe(1)));
  const reused = observe(2); reused.evidence.evidenceId = "evidence-0";
  j = append(j, request(reused)); expect(j.events[2].outcome.reason).toBe("EVIDENCE_ID_CONFLICT"); expect(j.state.observations.mobileWeb?.revision).toBe(2);
  j.events[2].outcome = { status: "applied", reason: null };
  const { eventHash: _oldHash, ...body } = j.events[2]; void _oldHash; j.events[2].eventHash = contentHash(body); j.headHash = j.events[2].eventHash;
  expect(verifyMediaJournal(j)).toBeUndefined();
});
it("監査時刻の逆行・不正requestIdは書込みを止める", () => {
  const j = append(createMediaJournal(mediaState()), request());
  expect(appendMediaAudit(j, request(observe(1), "2026-10-24T11:59:59.000Z"))).toMatchObject({ reason: "AUDIT_TIME_ORDER" });
  expect(appendMediaAudit(j, { ...request(), requestId: "invalid" })).toMatchObject({ reason: "INVALID_AUDIT_REQUEST" });
});
it("独立レビュー再現: 物件版より古い観測と掲載計画前の観測を拒否する", () => {
  const s = mediaState(); s.listing.propertyVersion.updatedAt = "2026-10-24T11:30:00.000Z";
  expect(applyMediaCommand(s, observe(), now)).toMatchObject({ reason: "OBSERVATION_BEFORE_LISTING" });
  s.listing.propertyVersion.updatedAt = "2026-10-24T00:00:00.000Z"; s.listing.changedAt = "2026-10-24T11:30:00.000Z";
  expect(applyMediaCommand(s, observe(), now)).toMatchObject({ reason: "OBSERVATION_BEFORE_LISTING" });
  s.observations.mobileWeb = { ...observe().evidence, revision: 1, listingRevision: 1 };
  expect(currentMediaObservation(s, "mobileWeb", now, 7200000)).toBeUndefined();
});
it("物件版の逆行と同一ミリ秒の別hashを拒否する", () => {
  const s = mediaState(); const { revision: _rev, changedAt: _at, ...listing } = s.listing; void _rev; void _at;
  const cmd = { type: "set_listing", propertyId: s.propertyId, episodeId: s.episodeId, media: s.media, expectedListingRevision: 1, listing };
  cmd.listing.propertyVersion = { ...listing.propertyVersion, updatedAt: "2026-10-23T00:00:00.000Z" };
  expect(applyMediaCommand(s, cmd, now)).toMatchObject({ reason: "PROPERTY_VERSION_REGRESSION" });
  cmd.listing.propertyVersion = { ...s.listing.propertyVersion, fullHash: "c".repeat(64) };
  expect(applyMediaCommand(s, cmd, now)).toMatchObject({ reason: "SAME_TIMESTAMP_HASH_CONFLICT" });
});
