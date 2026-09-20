import { createHash } from "node:crypto";
import { z } from "zod";
import { propertyInputSchema } from "@/lib/property-validation";
import { scanPropertyText, type PropertyInput } from "@/lib/property-shared";
import { extractAdEvidence, isRecentMail } from "./candidates";
import { portalCheckSchema, summarizePortalChecks, endedPortalListings } from "./portal-counts";
import { evidenceSchema, conditionChoiceSchema, RENTAL_IMPORT_POLICY, hasAdvertisingAllow, selectCondition, isCurrentEvidence } from "./policy";

export const rentalImportSchema = z.object({
  version: z.literal(1),
  email: z.object({ messageId: z.string().min(1), receivedAt: z.iso.datetime({ offset: true }), adQuote: z.string().min(1) }),
  source: z.object({
    provider: z.enum(["itandi", "reins", "other"]),
    roomId: z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/),
    url: z.url().startsWith("https://"),
    /** Provider ID alone cannot cross-match sites: require exact building + address + unit. */
    building: z.string().trim().min(1), address: z.string().trim().min(1), unit: z.string().trim().min(1),
    availability: z.enum(["available", "closed", "unknown"]),
    checkedAt: z.iso.datetime({ offset: true }),
    adQuote: z.string().min(1),
    adValidUntil: z.iso.datetime({ offset: true }).optional(),
  }),
  reins: z.object({
    propertyId: z.string().min(1), building: z.string().min(1), address: z.string().min(1), unit: z.string().min(1),
    advertising: z.enum(["allowed", "denied", "unknown"]),
    evidence: evidenceSchema,
  }).optional(),
  advertisingEvidence: z.array(z.object({
    provider: z.string().min(1), building: z.string().min(1), address: z.string().min(1), unit: z.string().min(1),
    status: z.enum(["allowed", "denied", "unknown"]), evidence: evidenceSchema,
  })).optional(),
  photoPermission: z.object({ status: z.enum(["allowed", "denied", "unknown"]), evidence: evidenceSchema }).optional(),
  conditionChoices: z.array(conditionChoiceSchema).optional(),
  portalChecks: z.array(portalCheckSchema).optional(),
  /** Only unresolved conflicts block registration. Resolved comparisons retain their evidence. */
  conflicts: z.array(z.string()),
  property: propertyInputSchema,
});
export type RentalImport = z.infer<typeof rentalImportSchema>;
export type GateResult = { ok: true; value: RentalImport; property: PropertyInput } | { ok: false; reasons: string[] };
const DAY = 86_400_000;
export function rentalIdentity(source: Pick<RentalImport["source"], "building" | "address" | "unit">) {
  const norm = (s: string) => s.normalize("NFKC").replace(/\s/g, "").toLowerCase();
  return createHash("sha256").update(`${norm(source.address)}|${norm(source.building)}|${norm(source.unit)}`).digest("hex").slice(0, 24);
}
function same(a: string, b: string) { return a.normalize("NFKC").replace(/\s/g, "").toLowerCase() === b.normalize("NFKC").replace(/\s/g, "").toLowerCase(); }
export function jstDate(now: Date) { return new Date(now.getTime() + 9 * 3600_000).toISOString().slice(0, 10); }
export const isFresh = isCurrentEvidence;

export function validateRentalImport(input: unknown, now: Date, mode: "draft" | "published" = "draft", maintenance = false): GateResult {
  const parsed = rentalImportSchema.safeParse(input);
  if (!parsed.success) return { ok: false, reasons: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) };
  const v = parsed.data, reasons: string[] = [];
  for (const ended of endedPortalListings(v.portalChecks ?? [])) reasons.push(`掲載終了のため登録対象外です: ${ended.portal} / ${ended.listing.listingId}`);
  if (!maintenance && !isRecentMail(v.email.receivedAt, now)) reasons.push("メールが直近1暦月の対象外です");
  for (const [label, quote] of [["メール", v.email.adQuote], ["取得元", v.source.adQuote]]) {
    const ads = extractAdEvidence(quote);
    const values = [...new Set(ads.map((a) => a.months))];
    if (!ads.length || ads.some((a) => a.ambiguous || a.months === null || a.months < 2) || values.length !== 1) reasons.push(`${label}のAD2か月以上を確定できません`);
  }
  if (v.source.availability !== "available") reasons.push("募集中を確認できません");
  if (!isFresh(v.source.checkedAt, now)) reasons.push("募集状況の確認が24時間以内ではありません");
  if (v.source.adValidUntil && Date.parse(v.source.adValidUntil) < now.getTime()) reasons.push("AD適用期限を過ぎています");
  const adEvidence = [
    ...(v.advertisingEvidence ?? []),
    ...(v.reins ? [{ ...v.reins, provider: "reins", status: v.reins.advertising }] : []),
  ];
  const adAllowed = adEvidence.some((a) => a.status === "allowed" && hasAdvertisingAllow(a.evidence.quote)
    && isFresh(a.evidence.checkedAt, now) && (["building", "address", "unit"] as const).every((key) => same(a[key], v.source[key])));
  if (!adAllowed) reasons.push("同一物件の広告可をいずれか1か所で確認してください");
  if (v.reins) for (const key of ["building", "address", "unit"] as const) if (!same(v.source[key], v.reins[key])) reasons.push(`REINSとの物件照合が不一致です: ${key}`);
  const resolved = new Set<string>(), fields = new Set<string>();
  const decisions: { field: string; rule: string; selectedIndex: number; value: string }[] = [];
  for (const choice of v.conditionChoices ?? []) {
    if (fields.has(choice.field)) { reasons.push(`条件の比較が重複しています: ${choice.field}`); continue; }
    fields.add(choice.field);
    const result = selectCondition(choice, now);
    if (!result.ok) { reasons.push(result.reason); continue; }
    if (v.property.spec.dealType === "rental") {
      if (choice.field === "conditions") {
        const current = v.property.spec.conditions, from = choice.replace;
        if (!from) { reasons.push("conditions: 置換する条項をreplaceに指定してください"); continue; }
        const occurrences = (text: string) => current.split(text).length - 1;
        if (occurrences(from) === 1) v.property.spec.conditions = current.replace(from, () => result.value);
        // Publication checks run again against the already selected public text.
        else if (occurrences(from) !== 0 || occurrences(result.value) !== 1) { reasons.push("conditions: 置換する条項を一意に特定できません"); continue; }
      } else v.property.spec[choice.field] = result.value;
    }
    choice.resolves.forEach((c) => resolved.add(c));
    decisions.push({ field: choice.field, rule: choice.rule, selectedIndex: result.index, value: result.value });
  }
  if (v.conflicts.length) reasons.push(...v.conflicts.filter((c) => !resolved.has(c)).map((c) => `要確認: ${c}`));
  if (v.property.dealType !== "rental" || v.property.spec.dealType !== "rental") reasons.push("賃貸物件のみ取込できます");
  if (!v.property.images.some((i) => i.kind === "photo") || !v.property.images.some((i) => i.kind === "floorplan")) reasons.push("写真と間取りが各1点以上必要です");
  if (v.property.spec.dealType === "rental") {
    for (const [key, value] of Object.entries(v.property.spec)) {
      if (typeof value === "string" && /入力なし|不明|未確認|要確認|確認中/.test(value)) reasons.push(`賃貸条件が未確認です: ${key}`);
    }
  }
  if (!same(v.property.locationText, v.source.address)) reasons.push("公開所在地が照合元と一致しません");
  if (!same(v.property.title.split(" ").join(""), `${v.source.building}${v.source.unit}`)) reasons.push("物件名・号室を照合元と一致させてください");
  if (v.source.provider === "itandi" && v.source.url !== `https://itandibb.com/rent_rooms/${v.source.roomId}`) reasons.push("ITANDIの部屋IDとURLが一致しません");
  if (v.property.spec.dealType === "rental" && !/不要|利用なし/.test(v.property.spec.guarantor) && !/[0-9０-９].*(?:円|%|％|ヶ月|か月)/.test(v.property.spec.guarantor)) reasons.push("保証会社の費用を確認してください");
  if (v.property.tradeMode !== "broker") reasons.push("自社の取引態様を媒介として確認してください");
  // Scan every public field including alt, translations, fees. Internal evidence is excluded deliberately.
  const { internal: _internal, ...publicData } = v.property;
  void _internal;
  const publicText = JSON.stringify({ ...publicData, slug: undefined, images: publicData.images.map(({ alt }) => ({ alt })) }).normalize("NFKC");
  const hits = scanPropertyText(publicText);
  if (/\bAD(?=[\s:：=0-9]|$)|広告費|業務委託料|\bREINS\b/i.test(publicText)) reasons.push("公開情報に業者間の広告料・取得元情報が含まれています");
  if (hits.length) reasons.push(`公開情報に禁止語・業者間情報があります: ${[...new Set(hits.map((h) => h.term))].join("、")}`);
  if (reasons.length) return { ok: false, reasons };
  const property: PropertyInput = {
    ...v.property, slug: `rent-${rentalIdentity(v.source)}`, status: mode,
    spec: { ...v.property.spec, ...(v.property.spec.dealType === "rental" ? { availabilityExpiresAt: new Date(Date.parse(v.source.checkedAt) + 26 * 3600_000).toISOString() } : {}) },
    infoUpdatedAt: jstDate(now), nextUpdateAt: jstDate(new Date(now.getTime() + DAY)),
    publishedAt: mode === "published" ? jstDate(now) : undefined,
    internal: { rentalImport: { version: 1, policy: RENTAL_IMPORT_POLICY, email: v.email, source: v.source, reins: v.reins, advertisingEvidence: v.advertisingEvidence, photoPermission: v.photoPermission, conditionChoices: v.conditionChoices, decisions, portalChecks: v.portalChecks, portalCounts: summarizePortalChecks(v.portalChecks ?? []) } },
  };
  return { ok: true, value: v, property };
}
