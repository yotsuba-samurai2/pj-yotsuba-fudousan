import { expect, it } from "vitest";
import { assessIncomingPropertyMail, MAIL_WINDOW_MS, proposeRentalEvidenceFromMail, type MailEnvelope } from "../mail-intake";
import { appendMailInbox, createMailInbox, verifyMailInbox } from "../local-mail-inbox";
import { parsePropertyInput } from "../../property-validation";
import { contentHash } from "../rules";

const now = "2026-10-26T00:00:00.000Z";
const binding = { propertyId: "00000000-0000-4000-8000-000000000001", episodeId: "synthetic-episode" };
function mail(): MailEnvelope {
  return { schemaVersion: 1, mailboxRef: "synthetic-work", messageId: "synthetic-001", receivedAt: now,
    receivedAtBasis: "provider_internal_date", folder: "incoming", subject: "新着物件", attachmentsPresent: false,
    parts: [{ mimeType: "text/plain", decoding: "confirmed", decodedText: "物件名: 合成テスト物件\n取引種別: 賃貸\n用途: 居住用\n賃料: 120,000円\n管理費: 8,000円\n間取り: 2DK\n専有面積: 47㎡\n契約形態: 普通借家\n物件更新日時: 2026-10-25T00:00:00.000Z\nAD: PRIVATE_AD_CANARY\n当社報酬: PRIVATE_INCOME_CANARY\n所在地: PRIVATE_ADDRESS_CANARY" }] };
}
function assess(m = mail(), at = now) {
  const r = assessIncomingPropertyMail(m, "synthetic-work", at);
  if (r.status !== "candidate") throw new Error(r.reason);
  return r.candidate;
}

it.each([
  ["物件情報・関連情報の第三者への転送およびサイト・ブログへの再配信を禁止します。", "prohibited", "prohibited"],
  ["第三者への転送は固くお断りします。サイトやブログへの再配信をご遠慮ください。", "prohibited", "prohibited"],
  ["第三者への転送を\n一切禁止します。サイトへの再配信を\n禁じます。", "prohibited", "prohibited"],
  ["第三者への転送は禁止。広告掲載可。", "prohibited", "unconfirmed"],
  ["個別提案可。サイトへの再配信は禁止します。", "unconfirmed", "prohibited"],
  ["広告不可。個別紹介のみ可。", "unconfirmed", "unconfirmed"],
  ["広告掲載可。個別紹介可。", "unconfirmed", "unconfirmed"],
  ["禁止事項：サイトやブログへの再配信。", "unconfirmed", "prohibited"],
  ["禁止事項：第三者への転送およびサイトへの再配信。", "prohibited", "prohibited"],
  ["サイトへの再配信は可能ですが、第三者への転送は禁止します。", "prohibited", "unconfirmed"],
  ["第三者への転送は禁止しますが、サイトへの再配信は可能です。", "prohibited", "unconfirmed"],
  ["サイトへの再配信は可能、第三者への転送は禁止します。", "prohibited", "unconfirmed"],
  ["サイトへの再配信、第三者への転送は禁止します。", "prohibited", "prohibited"],
  ["サイトへの再配信は不可、第三者への転送も不可です。", "prohibited", "prohibited"],
])("用途別の禁止を分離し、文言から転送許可を作らない: %s", (notice, customerForwarding, webRedistribution) => {
  const m = mail(); m.parts[0].decodedText += `\n${notice}`;
  const c = assess(m);
  expect(c.sourceRestrictions).toEqual({ schemaVersion: 1, customerForwarding, webRedistribution });
  expect(c.pending.includes("CUSTOMER_FORWARDING_PROHIBITED")).toBe(customerForwarding === "prohibited");
  expect(c.pending.includes("WEB_REDISTRIBUTION_PROHIBITED")).toBe(webRedistribution === "prohibited");
  expect(c.publicationEligible).toBe(false);
  expect(JSON.stringify(c)).not.toContain(notice); expect(JSON.stringify(c)).not.toContain("PRIVATE_");
});

it("HTMLの禁止は実行・取得せず保持し、復号失敗でも検出済みの禁止を消さない", () => {
  const m = mail();
  m.parts = [{ mimeType: "text/html", decoding: "failed", decodedText: "第三者への転送を<strong>禁止</strong>。サイトへの再配信を<b>禁止</b>。" }];
  expect(assess(m)).toMatchObject({ sourceRestrictions: { customerForwarding: "prohibited", webRedistribution: "prohibited" },
    pending: expect.arrayContaining(["HTML_REVIEW_REQUIRED", "DECODE_REVIEW_REQUIRED"]) });
});

it("旧候補のhashを変更せず保存済みメールを再照合し、未知の許可フラグは受け付けない", () => {
  const box = createMailInbox({ mailboxRef: "synthetic-work" }, now), m = mail();
  const first = appendMailInbox(box, { expectedHeadHash: box.headHash, mail: m }, now);
  if (first.status !== "recorded") throw new Error(first.reason);
  const legacy = first.journal, entry = legacy.entries[0]; delete entry.candidate.sourceRestrictions;
  entry.entryHash = contentHash({ candidate: entry.candidate, possibleDuplicateOf: entry.possibleDuplicateOf, previousHash: entry.previousHash });
  legacy.headHash = entry.entryHash;
  const saved = JSON.stringify(legacy);
  expect(verifyMailInbox(legacy)).toEqual(legacy);
  const replay = appendMailInbox(legacy, { expectedHeadHash: box.headHash, mail: m }, new Date(Date.parse(now) + MAIL_WINDOW_MS + 1).toISOString());
  expect(replay).toMatchObject({ status: "recorded", replayed: true });
  if (replay.status !== "recorded") throw new Error(replay.reason);
  expect(JSON.stringify(replay.journal)).toBe(saved);
  const forged = { ...assess(), sourceRestrictions: { schemaVersion: 1, customerForwarding: "allowed", webRedistribution: "unconfirmed" } };
  expect(proposeRentalEvidenceFromMail(forged, binding)).toMatchObject({ reason: "INVALID_MAIL_CANDIDATE" });
});

it("直近7日の受信を提案に留め、原文・住所・ADを出力せず既存evidenceへ接続する", () => {
  const c = assess();
  expect(c).toMatchObject({ visibility: "internal_only", publicationEligible: false, advertising: "unconfirmed", marketProposal: "residential_rental",
    fields: { rentYen: 120000, managementYen: 8000, mainRooms: 2, kitchen: "DK", areaSqm: 47, leaseType: "ordinary", sourceUpdatedAt: "2026-10-25T00:00:00.000Z" } });
  expect(JSON.stringify(c)).not.toContain("PRIVATE_");
  expect(JSON.stringify(c)).not.toContain("合成テスト物件");
  expect(proposeRentalEvidenceFromMail(c, binding)).toMatchObject({ status: "proposed", eligibilityConfirmed: false,
    evidence: { normalization: "unconfirmed", normalizationContractRef: null,
      sourcePropertyUpdate: { updatedAt: "2026-10-25T00:00:00.000Z", basis: "unknown", evidenceRef: null } } });
  expect(proposeRentalEvidenceFromMail({ ...c, internal: { ad: "secret" } }, binding).status).toBe("held");
  // Mail candidates are not a second property master or a payload for the production writer.
  expect(parsePropertyInput(c).ok).toBe(false);
});

it.each([[-1, "held", "RECEIPT_FROM_FUTURE"], [0, "candidate", null], [MAIL_WINDOW_MS, "candidate", null],
  [MAIL_WINDOW_MS + 1, "excluded", "OUTSIDE_MAIL_WINDOW"]])("受信window境界 age=%s", (age, status, reason) => {
  const m = mail(); m.receivedAt = new Date(Date.parse(now) - age).toISOString();
  const result = assessIncomingPropertyMail(m, m.mailboxRef, now);
  expect(result.status).toBe(status); if (reason) expect(result).toMatchObject({ reason });
});

it("新着受信から物件更新日を推測せず、過去の更新日時をそのまま保留する", () => {
  const m = mail(); m.parts[0].decodedText = m.parts[0].decodedText.replace("2026-10-25", "2026-09-01");
  expect(assess(m).fields.sourceUpdatedAt).toBe("2026-09-01T00:00:00.000Z");
  m.parts[0].decodedText = m.parts[0].decodedText.replace(/^物件更新日時:.*$/m, "");
  expect(assess(m).fields.sourceUpdatedAt).toBeNull();
});

it.each(["sent", "draft", "spam", "trash"] as const)("%sを候補にしない", folder => {
  expect(assessIncomingPropertyMail({ ...mail(), folder }, "synthetic-work", now)).toMatchObject({ status: "excluded", reason: "NOT_INCOMING_MAIL" });
});

it("不明な受信日時・受信箱・別アカウント・過大入力を拒否する", () => {
  expect(assessIncomingPropertyMail({ ...mail(), receivedAtBasis: "unconfirmed" }, "synthetic-work", now)).toMatchObject({ reason: "RECEIPT_TIME_UNCONFIRMED" });
  expect(assessIncomingPropertyMail({ ...mail(), folder: "unknown" }, "synthetic-work", now)).toMatchObject({ reason: "INCOMING_FOLDER_UNCONFIRMED" });
  expect(assessIncomingPropertyMail(mail(), "other-mailbox", now)).toMatchObject({ reason: "MAILBOX_MISMATCH" });
  expect(assessIncomingPropertyMail({ ...mail(), subject: "a".repeat(1001) }, "synthetic-work", now)).toMatchObject({ reason: "INVALID_MAIL_INPUT" });
  const m = mail(); m.parts[0].decodedText = "あ".repeat(100_000); m.parts.push({ ...m.parts[0] });
  expect(assessIncomingPropertyMail(m, "synthetic-work", now)).toMatchObject({ reason: "INVALID_MAIL_INPUT" });
});

it.each(["広告一切厳禁", "広告禁止", "転載不可", "掲載不可"])("未公開・%sは非公開の候補にのみ残す", phrase => {
  const m = mail(); m.subject = "未公開物件"; m.parts[0].decodedText += `\n個別紹介のみ可。${phrase}`;
  const c = assess(m);
  expect(c).toMatchObject({ advertising: "prohibited", publicationEligible: false });
  expect(c.pending).toContain("PREPUBLICATION_NOTICE");
  expect(c.pending).toContain("ADVERTISING_PROHIBITED");
});

it.each(["decode", "replacement", "escape", "html", "attachment", "duplicate", "digest", "ad-change"])("%sは物件情報を確定・混合しない", kind => {
  const m = mail();
  if (kind === "decode") m.parts[0].decoding = "unknown";
  if (kind === "replacement") m.parts[0].decodedText += "\uFFFD";
  if (kind === "escape") m.parts[0].decodedText += "\x1b$B";
  if (kind === "html") m.parts.push({ mimeType: "text/html", decoding: "confirmed", decodedText: '<img src="https://never-fetch.invalid/pixel"><script>fetch("https://never-fetch.invalid")</script>' });
  if (kind === "attachment") m.attachmentsPresent = true;
  if (kind === "duplicate") m.parts[0].decodedText += "\n賃料: 120,000円";
  if (kind === "digest") m.subject = "ATBB日報（転載可100件）";
  if (kind === "ad-change") m.subject = "ADを増額した物件";
  const c = assess(m);
  expect(c.fields.rentYen).toBeNull(); expect(c.fields.sourceUpdatedAt).toBeNull();
  expect(c.publicationEligible).toBe(false); expect(c.advertising).toBe("unconfirmed");
});

it.each([["売買", "居住用", "sale"], ["賃貸", "事業用", "business"], ["不明", "不明", "unknown"]])("%s/%sは賃貸の採用ルールに混ぜない", (deal, use, market) => {
  const m = mail(); m.parts[0].decodedText = m.parts[0].decodedText.replace("取引種別: 賃貸", `取引種別: ${deal}`).replace("用途: 居住用", `用途: ${use}`);
  const c = assess(m); expect(c.marketProposal).toBe(market);
  expect(proposeRentalEvidenceFromMail(c, binding)).toMatchObject({ reason: "MAIL_MARKET_NOT_RESIDENTIAL_RENTAL" });
});

it("自動処理の完了報告は元の物件情報として取り込まない", () => {
  expect(assessIncomingPropertyMail({ ...mail(), subject: "いい生活新着 — routine completed" }, "synthetic-work", now)).toMatchObject({ status: "excluded", reason: "AUTOMATION_REPORT" });
});

it.each(["separate-parts", "separate-blocks", "no-property-anchor"])("%sの別物件をラベルが重複しなくても混合しない", kind => {
  const m = mail(), a = "物件名: 合成A\n取引種別: 賃貸\n用途: 居住用\n賃料: 120000円", b = "物件B\n間取り: 2DK\n専有面積: 47㎡";
  if (kind === "separate-parts") m.parts = [a, b].map(decodedText => ({ mimeType: "text/plain", decoding: "confirmed", decodedText }));
  else m.parts[0].decodedText = kind === "separate-blocks" ? `${a}\n\n${b}` : a.replace("物件名: 合成A", "物件A");
  const c = assess(m);
  expect(Object.values(c.fields).every(v => v === null)).toBe(true);
  expect(c.pending).toContain("SINGLE_PROPERTY_BLOCK_UNCONFIRMED");
});

it("古いhead・同じmessageの変更・破損を拒否し、同文別mailは統合せず関連付ける", () => {
  const box = createMailInbox({ mailboxRef: "synthetic-work" }, now), m = mail();
  const request = { expectedHeadHash: box.headHash, mail: m }, first = appendMailInbox(box, request, now);
  if (first.status !== "recorded") throw new Error(first.reason);
  expect(verifyMailInbox(first.journal)).toBeDefined();
  expect(appendMailInbox(first.journal, request, now)).toMatchObject({ status: "recorded", replayed: true });
  expect(appendMailInbox(first.journal, { ...request, mail: { ...m, subject: "変化" } }, now)).toMatchObject({ reason: "MAIL_MESSAGE_CHANGED" });
  const second = { ...m, messageId: "synthetic-002" };
  expect(appendMailInbox(first.journal, { ...request, mail: second }, now)).toMatchObject({ reason: "MAIL_INBOX_CONFLICT" });
  const added = appendMailInbox(first.journal, { expectedHeadHash: first.journal.headHash, mail: second }, now);
  if (added.status !== "recorded") throw new Error(added.reason);
  expect(added.journal.entries).toHaveLength(2); expect(added.outcome.possibleDuplicateOf).toBe(first.outcome.messageKey);
  expect(verifyMailInbox(added.journal)).toBeDefined();
  added.journal.entries[0].candidate.fields.rentYen = 1;
  expect(verifyMailInbox(added.journal)).toBeUndefined();
});
