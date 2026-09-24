import { z } from "zod";
import { lookupDistrictByAddress } from "./school-district";

export const providers = ["reins", "itandi", "eslife", "atbb"] as const;
export type FeedProvider = typeof providers[number];
export const SCHOOL_RENTAL_MIN_RENT_YEN = 175000;
export const SCHOOL_RENTAL_MIN_AREA_SQM = 48;
const text = z.string().trim().max(1600);
const condition = z.enum(["allowed", "consult", "not-allowed", "unknown"]);
// Unknown costs remain null: an empty source field must never become ¥0.
const yen = z.number().int().nonnegative().max(100000000).nullable();
export const summarySchema = z.object({
  building: text.min(1), unit: text, address: text.min(1),
  rentYen: z.number().int().positive().max(100000000), managementYen: yen, commonYen: yen,
  deposit: text, keyMoney: text, layout: text, areaSqm: z.number().positive().max(10000),
  availabilityText: text, pets: condition, foreignNationals: condition, corporate: condition,
  companyHousing: condition.default("unknown"), companyHousingTerms: text.default(""),
  petTerms: text, foreignTerms: text, corporateTerms: text,
  buildingType: text, access: text, built: text, structure: text, floors: text,
  contractType: text, contractPeriod: text, guaranteeDeposit: text, renewalFee: text,
  insurance: text, guarantor: text, otherFees: text,
}).strip();
export const feedRecordSchema = z.object({
  sourceId: z.string().trim().min(1).max(160),
  advertising: z.enum(["allowed", "contact-required", "not-allowed", "unknown"]),
  advertisingQuote: text.min(1),
  availability: z.enum(["active", "closed", "unknown"]),
  application: z.enum(["none", "present", "unknown"]), applicationQuote: text,
  adQuote: text, adStatus: z.enum(["confirmed", "consult", "none", "unknown"]),
  summary: summarySchema,
}).strip();
export const feedSchema = z.object({
  version: z.literal(1), provider: z.enum(providers),
  scope: z.literal("bunkyo-rent-175000-area-48"),
  checkedAt: z.iso.datetime({ offset: true }),
  // Replacing a feed is permitted only after all pages of this scope were checked.
  complete: z.literal(true), records: z.array(feedRecordSchema).max(1000),
  // Optional for reading legacy saved feeds; new API writes require this count.
  expectedCount: z.number().int().nonnegative().max(1000).optional(),
}).strip().superRefine((feed, ctx) => {
  if (feed.expectedCount !== undefined && feed.expectedCount !== feed.records.length)
    ctx.addIssue({ code: "custom", path: ["expectedCount"], message: "検索総登録数と取得件数が一致しません" });
  if (new Set(feed.records.map(r => r.sourceId)).size !== feed.records.length)
    ctx.addIssue({ code: "custom", message: "取得元の物件IDが重複しています" });
});
export type RentalFeed = z.infer<typeof feedSchema>;
export type FeedRecord = z.infer<typeof feedRecordSchema>;
export type RentalSummary = z.infer<typeof summarySchema>;
export type PublicRentalSummary = RentalSummary & { id: string; schoolSlug: string | null; checkedAt: string; nextReviewAt: string };

// Weekly review is a displayed schedule, never an automatic publication cutoff.
export function nextWeeklyReviewAt(checkedAt: string) {
  const checked = new Date(checkedAt);
  const next = new Date(checked);
  next.setUTCHours(3, 0, 0, 0); // Wednesday 12:00 in Asia/Tokyo.
  next.setUTCDate(next.getUTCDate() + (3 - next.getUTCDay() + 7) % 7);
  if (next.getTime() <= checked.getTime()) next.setUTCDate(next.getUTCDate() + 7);
  return next.toISOString();
}

export function normalized(value: string) {
  return value.normalize("NFKC").toLowerCase().replace(/[\s　・･]/g, "").replace(/[−ー－―]/g, "-");
}
export function unitNumber(value: string) {
  return normalized(value).replace(/号室$/, "").replace(/^0+(?=\d)/, "");
}
function buildingKey(s: Pick<RentalSummary, "building" | "unit">) {
  let name = s.building.normalize("NFKC").trim();
  // Remove only an explicitly separated room suffix matching the separate unit field.
  const room = name.match(/\s+(\d+)(?:号室)?$/);
  if (room && unitNumber(room[1]) === unitNumber(s.unit)) name = name.slice(0, room.index).trim();
  // Confirmed source spelling alias; do not strip arbitrary tower/wing parentheses.
  if (name === "真砂マンション(マサゴマンション)") name = "真砂マンション";
  return normalized(name);
}
export function addressKey(value: string) {
  return normalized(value).replace(/^東京都/, "").replace(/丁目|番地?|号/g, "-").replace(/-+$/, "");
}
export function unitKey(s: Pick<RentalSummary, "building" | "unit" | "address">) {
  // Missing unit is not evidence that two apartments are identical.
  if (!s.unit) return null;
  return `${addressKey(s.address)}|${buildingKey(s)}|${unitNumber(s.unit)}`;
}
export function sameUnit(a: Pick<RentalSummary, "building" | "unit" | "address">, b: Pick<RentalSummary, "building" | "unit" | "address">) {
  if (!a.unit || !b.unit || unitNumber(a.unit) !== unitNumber(b.unit)) return false;
  const aa = addressKey(a.address), bb = addressKey(b.address);
  return buildingKey(a) === buildingKey(b) && (aa === bb || aa.startsWith(`${bb}-`) || bb.startsWith(`${aa}-`));
}
export function rejectionReason(feed: RentalFeed, r: FeedRecord, now = new Date()): string | null {
  const time = Date.parse(feed.checkedAt);
  if (time > now.getTime()) return "未来の確認日時";
  if (r.advertising !== "allowed") return "広告可未確認・要連絡";
  if (r.availability !== "active" || r.application === "present") return "募集終了・申込あり";
  if (feed.provider !== "reins" && r.application !== "none") return "申込状態の根拠未確認";
  if (feed.provider !== "reins" && !r.applicationQuote) return "申込状態の根拠なし";
  if (!r.summary.address.includes("文京区") || r.summary.rentYen < SCHOOL_RENTAL_MIN_RENT_YEN || r.summary.areaSqm < SCHOOL_RENTAL_MIN_AREA_SQM) return "地域・賃料・面積の対象外";
  if (lookupDistrictByAddress(r.summary.address).status !== "determined") return "学区未確定";
  return null;
}

export function compileRentalSummaries(feeds: RentalFeed[], existing: Pick<RentalSummary, "building" | "unit" | "address">[] = [], now = new Date()) {
  const accepted: { feed: RentalFeed; row: FeedRecord }[] = [];
  const excluded: { provider: FeedProvider; sourceId: string; reason: string }[] = [];
  // Prefer the latest checked feed, with a deterministic tie break. Do not merge conflicting terms.
  const sorted = feeds.flatMap(feed => feed.records.map(row => ({ feed, row })))
    .sort((a, b) => Date.parse(b.feed.checkedAt) - Date.parse(a.feed.checkedAt) || a.feed.provider.localeCompare(b.feed.provider) || a.row.sourceId.localeCompare(b.row.sourceId));
  const withdrawals = sorted.filter(({ feed, row }) => Date.parse(feed.checkedAt) <= now.getTime()
    && (row.availability === "closed" || row.application === "present"));
  for (const item of sorted) {
    const { feed, row } = item;
    let reason = rejectionReason(feed, row, now);
    // A recent explicit withdrawal/application on any source overrides another source's active row.
    if (!reason && withdrawals.some(other => sameUnit(row.summary, other.row.summary))) reason = "別サイトで募集終了・申込あり";
    if (!reason && existing.some(p => sameUnit(row.summary, p))) reason = "既存物件に登録済み";
    if (!reason && accepted.some(p => sameUnit(row.summary, p.row.summary))) reason = "同一号室の重複";
    if (reason) excluded.push({ provider: feed.provider, sourceId: row.sourceId, reason });
    else accepted.push(item);
  }
  const summaries: PublicRentalSummary[] = accepted.map(({ feed, row }) => {
    const s = summarySchema.parse(row.summary);
    const district = lookupDistrictByAddress(s.address);
    // Internal source IDs and AD never enter the public shape.
    return { ...s, id: `rental-${stableId(`${feed.provider}:${row.sourceId}`)}`, schoolSlug: district.status === "determined" ? district.school.slug : null,
      checkedAt: feed.checkedAt, nextReviewAt: nextWeeklyReviewAt(feed.checkedAt) };
  }).sort((a, b) => a.rentYen - b.rentYen || a.building.localeCompare(b.building));
  // A duplicate source row can contain AD evidence missing from the selected public row.
  // Preserve that private evidence without replacing the displayed contract terms.
  const adEvidence = sorted.filter(({ feed, row }) => (row.adStatus === "confirmed" || row.adStatus === "consult")
    && !rejectionReason(feed, row, now)
    && accepted.some(item => item.row === row || sameUnit(item.row.summary, row.summary)));
  const adCandidates = adEvidence.filter((item, index) => !adEvidence.slice(0, index).some(other => sameUnit(item.row.summary, other.row.summary)))
    .map(({ feed, row }) => ({ provider: feed.provider, sourceId: row.sourceId, building: row.summary.building, unit: row.summary.unit, adStatus: row.adStatus, adQuote: row.adQuote }));
  return { summaries, excluded, adCandidates };
}
function stableId(value: string) {
  let hash = 2166136261;
  for (const char of value) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return (hash >>> 0).toString(36);
}

export function monthlyTotal(s: RentalSummary) {
  return s.managementYen === null || s.commonYen === null ? null : s.rentYen + s.managementYen + s.commonYen;
}
