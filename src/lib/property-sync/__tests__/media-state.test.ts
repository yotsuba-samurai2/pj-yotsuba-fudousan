import { afterEach, expect, it } from "vitest";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { applyMediaCommand, currentMediaObservation, type MediaCommand, type MediaState } from "../media-state";
import { applyMediaCommandFile, createMediaStateFile } from "../local-media-store";

const now = "2026-10-24T12:00:00.000Z";
function state(): MediaState {
  return { schemaVersion: 1, propertyId: "00000000-0000-4000-8000-000000000001", episodeId: "episode-2", media: "athome",
    listing: { revision: 1, changedAt: "2026-10-24T00:00:00.000Z", managementId: "mgmt-1", publicId: "public-1", desiredState: "published", propertyVersion: { updatedAt: "2026-10-24T00:00:00.000Z", fullHash: "a".repeat(64) } }, observations: {} };
}
function command(s = state()): Extract<MediaCommand, { type: "observe" }> {
  return { type: "observe", propertyId: s.propertyId, episodeId: s.episodeId, media: s.media, surface: "mobileWeb", expectedListingRevision: s.listing.revision, expectedObservationRevision: 0,
    evidence: { evidenceId: "evidence-1", observedAt: "2026-10-24T11:00:00.000Z", acquisition: "manual", authorizationRef: "manual-review", visibility: "published", exactUnitConfirmed: true, contentHash: "b".repeat(64), companyFirst: "unknown" } };
}
function applied(s: MediaState, cmd: MediaCommand): MediaState {
  const result = applyMediaCommand(s, cmd, now); expect(result.status).toBe("applied");
  if (result.status !== "applied") throw new Error("not applied"); return result.state;
}
it("100観測が物件本体・人のCAS版・掲載計画版を変えない", () => {
  const property = { updatedAt: state().listing.propertyVersion.updatedAt, internal: { memo: "private" } };
  const before = structuredClone(property), original = state(); let s = original;
  for (let i = 0; i < 100; i++) {
    const cmd = command(s); cmd.expectedObservationRevision = i;
    cmd.evidence.evidenceId = `evidence-${i}`; cmd.evidence.observedAt = new Date(Date.parse("2026-10-24T10:00:00.000Z") + i * 1000).toISOString();
    s = applied(s, cmd);
  }
  expect(s.observations.mobileWeb?.revision).toBe(100); expect(s.listing).toEqual(original.listing);
  expect(original.observations).toEqual({}); expect(property).toEqual(before);
  // Same pre-edit version is still usable for the separate manual property update.
  expect(property.updatedAt).toBe(before.updatedAt);
});
it.each(["propertyId", "episodeId", "media"] as const)("別の%sへ観測を流用しない", (field) => {
  const cmd = command(); Object.assign(cmd, { [field]: field === "propertyId" ? "00000000-0000-4000-8000-000000000002" : field === "media" ? "site" : "episode-old" });
  expect(applyMediaCommand(state(), cmd, now)).toEqual({ status: "held", reason: "BINDING_MISMATCH" });
});
it("古い観測版・順序逆転・未来時刻は採用しない", () => {
  const s = applied(state(), command()), cmd = command(); cmd.evidence.evidenceId = "evidence-2";
  expect(applyMediaCommand(s, cmd, now)).toMatchObject({ reason: "OBSERVATION_VERSION_CONFLICT" });
  cmd.expectedObservationRevision = 1;
  expect(applyMediaCommand(s, cmd, now)).toMatchObject({ reason: "OBSERVATION_TIME_ORDER" });
  cmd.evidence.observedAt = "2026-10-24T13:00:00.000Z";
  expect(applyMediaCommand(s, cmd, now)).toMatchObject({ reason: "FUTURE_OBSERVATION" });
});
it("同一受信の再試行は冪等、同じ根拠IDの別内容は競合", () => {
  const cmd = command(), s = applied(state(), cmd);
  expect(applyMediaCommand(s, cmd, now)).toMatchObject({ status: "unchanged", state: s });
  cmd.evidence.companyFirst = "yes";
  expect(applyMediaCommand(s, cmd, now)).toMatchObject({ reason: "EVIDENCE_ID_CONFLICT" });
});
it("PCとスマホの観測CASを独立させ、会社先頭と公開を区別する", () => {
  let s = applied(state(), command()); const pc = command(); pc.surface = "pc"; pc.evidence.companyFirst = "no";
  s = applied(s, pc);
  expect(s.observations.mobileWeb?.companyFirst).toBe("unknown"); expect(s.observations.pc?.visibility).toBe("published");
  expect(s.observations.pc?.companyFirst).toBe("no");
});
it("観測後も掲載計画を更新でき、旧掲載版の観測は現状証拠にしない", () => {
  const s = applied(state(), command());
  const cmd: MediaCommand = { type: "set_listing", propertyId: s.propertyId, episodeId: s.episodeId, media: s.media, expectedListingRevision: 1, listing: { ...s.listing, desiredState: "not_published" } };
  // Input deliberately excludes the observation-only revision.
  const { revision: _revision, changedAt: _changedAt, ...listing } = s.listing; cmd.listing = { ...listing, desiredState: "not_published" }; void _revision; void _changedAt;
  const changed = applied(s, cmd);
  expect(changed.observations).toEqual(s.observations); expect(changed.listing.revision).toBe(2);
  expect(currentMediaObservation(changed, "mobileWeb", now, 7200000)).toBeUndefined();
  expect(applyMediaCommand(changed, command(), now)).toMatchObject({ reason: "LISTING_VERSION_CONFLICT" });
});
it.each(["unmatched", "siteRank", "unknownDevice", "notPublished", "noHash"])("確認不足を公開成功・会社先頭にしない: %s", (kind) => {
  const s = state(), cmd = command(); cmd.evidence.companyFirst = "yes";
  if (kind === "unmatched") cmd.evidence.exactUnitConfirmed = false;
  if (kind === "siteRank") { s.media = "site"; cmd.media = "site"; }
  if (kind === "unknownDevice") cmd.surface = "unknown";
  if (kind === "notPublished") cmd.evidence.visibility = "not_published";
  if (kind === "noHash") cmd.evidence.contentHash = null;
  expect(applyMediaCommand(s, cmd, now)).toMatchObject({ reason: "UNVERIFIED_OBSERVATION" });
});
it("mock、古い観測、不正な鮮度指定を現状の公開確認に使わない", () => {
  const cmd = command(); let s = applied(state(), cmd);
  expect(currentMediaObservation(s, "mobileWeb", now, 7200000)?.visibility).toBe("published");
  expect(currentMediaObservation(s, "mobileWeb", now, 1000)).toBeUndefined();
  expect(currentMediaObservation(s, "mobileWeb", now, NaN)).toBeUndefined();
  cmd.evidence.acquisition = "mock"; s = applied(state(), cmd);
  expect(currentMediaObservation(s, "mobileWeb", now, 7200000)).toBeUndefined();
});
it("余分なネストの社内値・検索順位は入力で拒否し値をエラーへ出さない", () => {
  const cmd = command(); Object.assign(cmd.evidence, { internal: { ad: "PRIVATE_CANARY" }, searchRank: 1 });
  const result = applyMediaCommand(state(), cmd, now);
  expect(result).toEqual({ status: "held", reason: "INVALID_INPUT" }); expect(JSON.stringify(result)).not.toContain("PRIVATE_CANARY");
});

const dirs: string[] = [];
afterEach(async () => { await Promise.all(dirs.splice(0).map(d => rm(d, { recursive: true, force: true }))); });
async function file() { const dir = await mkdtemp(join(tmpdir(), "yotsuba-media-")); dirs.push(dir); const f = join(dir, "media.json"); await createMediaStateFile(f, state()); return f; }
it("ファイルの同時更新では1件だけ保存し、古い版で上書きしない", async () => {
  const f = await file(), a = command(), b = command(); b.evidence.evidenceId = "second";
  const results = await Promise.all([applyMediaCommandFile(f, { requestId: randomUUID(), actorRef: "operator", at: now, command: a }), applyMediaCommandFile(f, { requestId: randomUUID(), actorRef: "operator", at: now, command: b })]);
  expect(results.filter(r => r.status === "applied")).toHaveLength(1);
  expect(results.filter(r => r.status === "held")).toHaveLength(1);
  expect(JSON.parse(await readFile(f, "utf8")).state.observations.mobileWeb.revision).toBe(1);
  expect((await stat(f)).mode & 0o777).toBe(0o600);
  await expect(createMediaStateFile(f, state())).rejects.toMatchObject({ code: "EEXIST" });
});
it("壊れたファイル・残ったlockは保留し、自動復旧や上書きをしない", async () => {
  const f = await file(); await writeFile(f, "broken PRIVATE_CANARY");
  expect(await applyMediaCommandFile(f, { requestId: randomUUID(), actorRef: "operator", at: now, command: command() })).toEqual({ status: "held", reason: "LOCAL_IO_ERROR" });
  expect(await readFile(f, "utf8")).toBe("broken PRIVATE_CANARY");
  await writeFile(`${f}.lock`, "");
  expect(await applyMediaCommandFile(f, { requestId: randomUUID(), actorRef: "operator", at: now, command: command() })).toEqual({ status: "held", reason: "STORE_BUSY" });
});
