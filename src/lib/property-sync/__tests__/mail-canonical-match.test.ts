import { expect, it, vi } from "vitest";
import { appendMailInbox, createMailInbox } from "../local-mail-inbox";
import { fingerprintPropertySnapshot } from "../source-fingerprint";
import { contentHash } from "../rules";
import { mailIdentityEvidenceSchema, matchMailToCanonicalProperty, type MailCanonicalReaders } from "../mail-canonical-match";
import { parsePropertyInput } from "../../property-validation";

const at = "2026-10-26T00:00:00.000Z";
const id = "00000000-0000-4000-8000-000000000001", otherId = "00000000-0000-4000-8000-000000000002";
function fixture() {
  const genesis = createMailInbox({ mailboxRef: "synthetic-work" }, at);
  const m = { schemaVersion: 1, mailboxRef: "synthetic-work", messageId: "synthetic-mail", receivedAt: at,
    receivedAtBasis: "provider_internal_date", folder: "incoming", subject: "新着合成物件", attachmentsPresent: false,
    parts: [{ mimeType: "text/plain", decoding: "confirmed", decodedText: "物件名: 合成A\n取引種別: 賃貸\n用途: 居住用\n賃料: 120000円\n間取り: 2DK\n専有面積: 47㎡\nAD: PRIVATE_MAIL_CANARY" }] };
  const added = appendMailInbox(genesis, { expectedHeadHash: genesis.headHash, mail: m }, at);
  if (added.status !== "recorded") throw new Error(added.reason);
  const inbox = added.journal, c = inbox.entries[0].candidate;
  const identity = { building: "合成テスト建物", address: "東京都文京区合成町1丁目2番3号", unit: "0201号室" };
  const record = { id, slug: "existing-synthetic-slug", status: "draft", dealType: "rental", category: "other", tradeMode: "broker",
    title: "合成テスト建物 201", priceYen: 130000, priceNote: null, locationText: "文京区合成町", access: [], spec: { area: 48 },
    images: [], description: "既存の説明文", publishedAt: null, infoUpdatedAt: "2026-10-25", nextUpdateAt: "2026-11-01",
    locales: ["ja"], translations: null, internal: { rentalImport: { source: { ...identity, provider: "itandi", roomId: "existing-source-1" } },
      adNote: "PRIVATE_CANONICAL_CANARY" }, createdAt: "2026-10-24T00:00:00.000Z", updatedAt: "2026-10-25T00:00:00.000Z" };
  const metadata = { propertyId: id, episodeId: "existing-episode", market: "residential_rental", snapshotRef: "synthetic-canonical-read", capturedAt: at };
  const fp = fingerprintPropertySnapshot(JSON.stringify(record), JSON.stringify(metadata), at);
  if (fp.status !== "fingerprinted") throw new Error(fp.reason);
  const target = { propertyId: id, episodeId: metadata.episodeId, version: fp.snapshot.version };
  const evidence = mailIdentityEvidenceSchema.parse({ evidenceRef: "synthetic-review", messageKey: c.messageKey,
    candidateHash: contentHash(c), target, status: "confirmed", method: "manual_exact_room", confirmedAt: at,
    reviewerRef: "synthetic-operator", sourceRef: "synthetic-authorized-evidence", identity });
  const request = { mailboxRef: "synthetic-work", messageKey: c.messageKey, candidateHash: contentHash(c),
    target, identityEvidenceRef: evidence.evidenceRef, identityEvidenceHash: contentHash(evidence) };
  const readers = { readInbox: vi.fn(async () => structuredClone(inbox)),
    readTarget: vi.fn(async () => ({ recordJson: JSON.stringify(record), metadataJson: JSON.stringify(metadata) })),
    readIdentityEvidence: vi.fn(async () => structuredClone(evidence)), clock: () => at } satisfies MailCanonicalReaders;
  const repin = () => {
    const current = fingerprintPropertySnapshot(JSON.stringify(record), JSON.stringify(metadata), at);
    if (current.status !== "fingerprinted") throw new Error(current.reason);
    request.target = { propertyId: metadata.propertyId, episodeId: metadata.episodeId, version: current.snapshot.version };
    evidence.target = structuredClone(request.target); request.identityEvidenceHash = contentHash(evidence);
  };
  return { inbox, record, metadata, evidence, request, readers, repin };
}

it("既存ID/募集回/完全hashへ候補を紐付け、同じ正本からの掲載境界を保つ", async () => {
  const f = fixture(), before = structuredClone({ record: f.record, inbox: f.inbox });
  const result = await matchMailToCanonicalProperty(f.request, f.readers);
  expect(result).toMatchObject({ status: "matched_proposal", destination: "existing_properties", executable: false, publicationEligible: false,
    canonicalTarget: f.request.target, fieldProposal: { evidence: { binding: { propertyId: id, episodeId: "existing-episode" },
      normalization: "unconfirmed", rentYen: 120000 } } });
  expect(f.readers.readTarget).toHaveBeenCalledTimes(2);
  expect(f.readers.readTarget).toHaveBeenNthCalledWith(1, { propertyId: id, episodeId: "existing-episode" });
  expect(f.record).toEqual(before.record); expect(f.inbox).toEqual(before.inbox);
  expect(JSON.stringify(result)).not.toMatch(/PRIVATE_|合成テスト建物|合成町|既存の説明文|existing-synthetic-slug/);
  expect(parsePropertyInput(result).ok).toBe(false);
  expect(await matchMailToCanonicalProperty(f.request, f.readers)).toEqual(result);
});

it.each(["different-id", "different-episode", "different-market", "same-time-edit", "new-version"])("%sで別の正本へ結合せず、編集を上書きしない", async kind => {
  const f = fixture();
  if (kind === "different-id") { f.record.id = otherId; f.metadata.propertyId = otherId; }
  if (kind === "different-episode") f.metadata.episodeId = "next-episode";
  if (kind === "different-market") f.metadata.market = "sale";
  if (kind === "same-time-edit") f.record.internal.adNote = "manual-change";
  if (kind === "new-version") f.record.updatedAt = at;
  const result = await matchMailToCanonicalProperty(f.request, f.readers);
  expect(result).toMatchObject({ status: "held", reason: kind.startsWith("different") ? "CANONICAL_TARGET_MISMATCH" : "CANONICAL_PROPERTY_VERSION_CONFLICT" });
  expect(f.readers.readTarget).toHaveBeenCalledTimes(1);
});

it.each(["room", "address-prefix", "building", "missing-room", "title-only", "placeholder", "closed"])("%sの曖昧一致・再募集を自動採用しない", async kind => {
  const f = fixture();
  if (kind === "room") f.evidence.identity.unit = "202";
  if (kind === "address-prefix") f.evidence.identity.address = "東京都文京区合成町1丁目2番";
  if (kind === "building") f.evidence.identity.building = "合成テスト建物別棟";
  if (kind === "missing-room") f.record.internal.rentalImport.source.unit = "";
  if (kind === "title-only") Object.assign(f.record.internal, { rentalImport: { source: null } });
  if (kind === "placeholder") f.record.internal.rentalImport.source.unit = "号室";
  if (kind === "closed") f.record.status = "closed";
  f.repin();
  const result = await matchMailToCanonicalProperty(f.request, f.readers);
  expect(result).toMatchObject({ status: "held" });
  expect(JSON.stringify(result)).not.toContain("合成");
});

it("幅・号室の既存正規化は再利用するが、価格や物件IDをそれから生成しない", async () => {
  const f = fixture();
  f.evidence.identity.unit = "２０１";
  f.evidence.identity.address = "文京区合成町１－２－３";
  f.request.identityEvidenceHash = contentHash(f.evidence);
  expect(await matchMailToCanonicalProperty(f.request, f.readers)).toMatchObject({ status: "matched_proposal", canonicalTarget: { propertyId: id } });
});

it.each(["unconfirmed", "revoked", "future", "missing-reviewer", "wrong-mail", "wrong-target", "changed-evidence"])("%sの名寄せ根拠は使わない", async kind => {
  const f = fixture();
  if (kind === "unconfirmed") f.evidence.method = "unconfirmed";
  if (kind === "revoked") f.evidence.status = "revoked";
  if (kind === "future") f.evidence.confirmedAt = "2026-10-26T00:00:01.000Z";
  if (kind === "missing-reviewer") f.evidence.reviewerRef = null;
  if (kind === "wrong-mail") f.evidence.messageKey = "0".repeat(64);
  if (kind === "wrong-target") f.evidence.target = { ...f.evidence.target, propertyId: otherId };
  if (kind !== "changed-evidence") f.request.identityEvidenceHash = contentHash(f.evidence);
  else f.evidence.sourceRef = "changed";
  expect(await matchMailToCanonicalProperty(f.request, f.readers)).toMatchObject({ status: "held" });
});

it.each(["property", "evidence", "candidate", "clock", "expiry"])("照合中の%s変化を再読取りで検出する", async kind => {
  const f = fixture(); let reads = 0;
  f.readers.readTarget.mockImplementation(async () => {
    reads++;
    if (reads === 2 && kind === "property") f.record.priceYen++;
    if (reads === 2 && kind === "evidence") f.evidence.status = "revoked";
    return { recordJson: JSON.stringify(f.record), metadataJson: JSON.stringify(f.metadata) };
  });
  if (kind === "candidate") f.readers.readInbox.mockImplementationOnce(async () => structuredClone(f.inbox)).mockImplementationOnce(async () => ({ ...f.inbox, entries: [] }));
  if (kind === "clock" || kind === "expiry") f.readers.clock = () => reads < 2 ? at : kind === "clock" ? "2026-10-25T00:00:00.000Z" : "2026-11-03T00:00:00.000Z";
  expect(await matchMailToCanonicalProperty(f.request, f.readers)).toMatchObject({ status: "held" });
});

it("reader障害・欠落・不正requestは内部情報を返さず、物件を新設しない", async () => {
  const f = fixture();
  expect(await matchMailToCanonicalProperty({ ...f.request, createIfMissing: true }, f.readers)).toMatchObject({ reason: "INVALID_CANONICAL_MATCH_REQUEST" });
  expect(f.readers.readTarget).not.toHaveBeenCalled();
  const missing: MailCanonicalReaders = { ...f.readers, readTarget: async () => null };
  expect(await matchMailToCanonicalProperty(f.request, missing)).toMatchObject({ reason: "CANONICAL_PROPERTY_NOT_FOUND" });
  f.readers.readTarget.mockRejectedValueOnce(new Error("PRIVATE_DATABASE_CANARY"));
  const result = await matchMailToCanonicalProperty(f.request, f.readers);
  expect(result).toMatchObject({ reason: "CANONICAL_MATCH_READ_FAILED" });
  expect(JSON.stringify(result)).not.toContain("PRIVATE_");
});

it("キー区切り文字を含む別tupleを同一物件として受理しない", async () => {
  const f = fixture();
  Object.assign(f.record.internal.rentalImport.source, { address: "文京区A|B", building: "C", unit: "201" });
  Object.assign(f.evidence.identity, { address: "文京区A", building: "B|C", unit: "201" });
  f.repin();
  expect(await matchMailToCanonicalProperty(f.request, f.readers)).toMatchObject({ status: "held" });
  f.record.internal.rentalImport.source.address = "文京区A"; f.record.internal.rentalImport.source.building = "B｜C"; f.repin();
  expect(await matchMailToCanonicalProperty(f.request, f.readers)).toMatchObject({ status: "held" });
});

it("以前採取したsnapshotを現在のDB再読取りとして扱わない", async () => {
  const f = fixture(); f.metadata.capturedAt = "2026-10-25T00:00:00.000Z";
  expect(await matchMailToCanonicalProperty(f.request, f.readers)).toMatchObject({ reason: "CANONICAL_SNAPSHOT_PREDATES_CHECK" });
});

it("既存取込sourceのネストした確認記録は住所/建物/号室の文字列検査へ渡さない", async () => {
  const f = fixture();
  Object.assign(f.record.internal.rentalImport.source, { rent: { yen: 130000, evidence: { reference: "PRIVATE_RENT_EVIDENCE" } },
    listingEvidence: { exactRoomMatched: true }, extra: null });
  f.repin();
  const result = await matchMailToCanonicalProperty(f.request, f.readers);
  expect(result).toMatchObject({ status: "matched_proposal" });
  expect(JSON.stringify(result)).not.toContain("PRIVATE_RENT_EVIDENCE");
});
