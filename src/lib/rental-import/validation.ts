import { createHash } from "node:crypto";
import { z } from "zod";
import { propertyInputSchema } from "@/lib/property-validation";
import { scanPropertyText, type PropertyInput } from "@/lib/property-shared";
import { extractAdEvidence, isRecentMail } from "./candidates";
import { portalCheckSchema, summarizePortalChecks } from "./portal-counts";
import { evidenceSchema, titleHighlightSchema, validTitleHighlight, TITLE_HIGHLIGHT_LABELS, conditionChoiceSchema, rentEvidenceSchema, validRentEvidence, isPrimaryReference, RENTAL_IMPORT_POLICY, hasAdvertisingAllow, selectCondition, isCurrentEvidence } from "./policy";
import { contentReviewSchema, rentalContentDigest } from "./content-review";

export const listingEvidenceSchema = evidenceSchema.extend({
  authenticated: z.boolean(), siteOperational: z.boolean(), exactRoomMatched: z.boolean(),
});
export { isPrimaryReference } from "./policy";
export function validListingEvidence(evidence: z.infer<typeof listingEvidenceSchema>, provider: "itandi" | "reins", now: Date) {
  return evidence.authenticated && evidence.siteOperational && evidence.exactRoomMatched && isFresh(evidence.checkedAt, now) && isPrimaryReference(evidence.reference, provider);
}

export const rentalImportSchema = z.object({
  version: z.union([z.literal(1), z.literal(2)]),
  email: z.object({ messageId: z.string().min(1), receivedAt: z.iso.datetime({ offset: true }), adQuote: z.string().min(1) }),
  source: z.object({
    provider: z.enum(["itandi", "reins", "other"]),
    roomId: z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/),
    url: z.url().startsWith("https://"),
    /** Provider ID alone cannot cross-match sites: require exact building + address + unit. */
    building: z.string().trim().min(1), address: z.string().trim().min(1), unit: z.string().trim().min(1),
    availability: z.enum(["available", "closed", "removed", "unknown"]),
    /** Early gate: an ITANJI application means the room must not be imported. */
    applicationStatus: z.enum(["not-applied", "applied", "unknown"]).optional(),
    checkedAt: z.iso.datetime({ offset: true }),
    listingEvidence: listingEvidenceSchema,
    rent: rentEvidenceSchema,
    adQuote: z.string().min(1),
    /** A single affirmative ITANJI advertising observation is sufficient. */
    advertising: z.object({ status: z.enum(["allowed", "denied", "unknown"]), evidence: evidenceSchema }).optional(),
    adValidUntil: z.iso.datetime({ offset: true }).optional(),
  }),
  /** Deprecated v1.1 evidence. Accepted only for migration of old drafts; never read for a v1.2 decision. */
  reins: z.object({
    propertyId: z.string().min(1), building: z.string().min(1), address: z.string().min(1), unit: z.string().min(1),
    advertising: z.enum(["allowed", "denied", "unknown"]),
    evidence: evidenceSchema,
    availability: z.enum(["available", "closed", "removed", "unknown"]),
    listingEvidence: listingEvidenceSchema,
    rent: rentEvidenceSchema,
  }).optional(),
  advertisingEvidence: z.array(z.object({
    provider: z.string().min(1), building: z.string().min(1), address: z.string().min(1), unit: z.string().min(1),
    status: z.enum(["allowed", "denied", "unknown"]), evidence: evidenceSchema,
  })).optional(),
  photoPermission: z.object({ status: z.enum(["allowed", "denied", "unknown"]), evidence: evidenceSchema }).optional(),
  conditionChoices: z.array(conditionChoiceSchema).optional(),
  titleHighlights: z.array(titleHighlightSchema).max(3).optional(),
  contentReview: contentReviewSchema.optional(),
  unconfirmedTerms: z.object({
    fields: z.array(z.enum(["guaranteeDeposit", "insurance", "guarantor", "conditions"])).min(1),
    operatorInstruction: z.literal("未確認です。未確認と書いてください。"),
    recordedAt: z.iso.datetime({ offset: true }),
  }).optional(),
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
  // Reject applied rooms before any expensive detail, image, or condition work.
  if ((v.source.applicationStatus ?? "unknown") === "applied") reasons.push("ITANJIで申込済みのため対象外です");
  const legacyMigration = !!v.reins && !v.source.advertising && !(v.advertisingEvidence ?? []).some((a) => a.provider === "itandi");
  if (legacyMigration) {
    // Compatibility only: old saved drafts can be rechecked while the operator
    // migrates them. New records must supply ITANJI evidence explicitly.
    if (v.reins!.availability !== "available" || !validListingEvidence(v.reins!.listingEvidence, "reins", now)) reasons.push("旧形式のREINS根拠が期限切れです");
  }
  // SUUMO・アットホーム・HOME'Sは判定に使わない。REINSは広告可の確認だけ許可する。
  if (!maintenance && !isRecentMail(v.email.receivedAt, now)) reasons.push("メールが直近1暦月の対象外です");
  for (const [label, quote] of [["メール", v.email.adQuote], ["取得元", v.source.adQuote]]) {
    const ads = extractAdEvidence(quote);
    const values = [...new Set(ads.map((a) => a.months))];
    if (!ads.length || ads.some((a) => a.ambiguous || a.months === null || a.months < 2) || values.length !== 1) reasons.push(`${label}のAD2か月以上を確定できません`);
  }
  if (v.source.provider !== "itandi" || v.source.availability !== "available" || !validListingEvidence(v.source.listingEvidence, "itandi", now)) reasons.push("ITANDIで同一号室の現在の掲載を確認してください");
  if (!validRentEvidence(v.source.rent, "itandi", now)) reasons.push("ITANJIの賃料の原文と金額を確認してください");
  v.property.priceYen = legacyMigration ? Math.max(v.source.rent.yen, v.reins!.rent.yen) : v.source.rent.yen;
  if (legacyMigration && (!validRentEvidence(v.reins!.rent, "reins", now))) reasons.push("旧形式のREINS賃料根拠が不正です");
  if (!isFresh(v.source.checkedAt, now)) reasons.push("募集状況の確認が24時間以内ではありません");
  if (v.source.adValidUntil && Date.parse(v.source.adValidUntil) < now.getTime()) reasons.push("AD適用期限を過ぎています");
  const adEvidence = [
    ...(v.advertisingEvidence ?? []).filter((a) => a.provider === "itandi"),
    ...(v.advertisingEvidence ?? []).filter((a) => a.provider === "reins"),
    ...(v.source.advertising ? [{ ...v.source, provider: "itandi", status: v.source.advertising.status, evidence: v.source.advertising.evidence }] : []),
    ...(legacyMigration && v.reins ? [{ ...v.reins, provider: "reins", status: v.reins.advertising, evidence: v.reins.evidence }] : []),
  ];
  const adAllowed = adEvidence.some((a) => (a.provider === "itandi" || a.provider === "reins") && a.status === "allowed" && hasAdvertisingAllow(a.evidence.quote)
    && isFresh(a.evidence.checkedAt, now) && (["building", "address", "unit"] as const).every((key) => same(a[key], v.source[key])));
  if (!adAllowed) reasons.push("同一号室の広告可をITANJIまたはREINSで確認してください");
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
  if (mode === "published") {
    const review = v.contentReview;
    if (!review || !isFresh(review.checkedAt, now) || review.digest !== rentalContentDigest(v.property)
    || (v.property.locales ?? ["ja"]).some((locale) => !review.locales.includes(locale))) reasons.push("採用後の条件と日本語本文・公開する各翻訳を照合し、contentReviewに記録してください");
  }
  if (v.property.dealType !== "rental" || v.property.spec.dealType !== "rental") reasons.push("賃貸物件のみ取込できます");
  if (!v.property.images.some((i) => i.kind === "photo") || !v.property.images.some((i) => i.kind === "floorplan")) reasons.push("写真と間取りが各1点以上必要です");
  const disclosedUnknown = (key: string, value: string) => !!v.unconfirmedTerms
    && (v.unconfirmedTerms.fields as string[]).includes(key) && value.includes("未確認");
  if (v.unconfirmedTerms && Date.parse(v.unconfirmedTerms.recordedAt) > now.getTime()) reasons.push("未確認表示の指示日時が未来です");
  if (v.property.spec.dealType === "rental") {
    for (const [key, value] of Object.entries(v.property.spec)) {
      if (typeof value === "string" && /入力なし|不明|未確認|要確認|確認中/.test(value) && !disclosedUnknown(key, value)) reasons.push(`賃貸条件が未確認です: ${key}`);
    }
  }
  if (!same(v.property.locationText, v.source.address)) reasons.push("公開所在地が照合元と一致しません");
  const highlights = v.titleHighlights ?? [];
  if (new Set(highlights.map(h => h.kind)).size !== highlights.length || highlights.some(h => !validTitleHighlight(h, now) || h.evidence.reference !== v.source.url)) reasons.push("物件名に入れる可条件をITANJIの同一物件の原文で確認してください");
  const titlePrefix = (["foreignResidents", "corporateLease", "pets"] as const).filter(kind => highlights.some(h => h.kind === kind)).map(kind => `【${TITLE_HIGHLIGHT_LABELS[kind]}】`).join("");
  if (!same(v.property.title.split(" ").join(""), `${titlePrefix}${v.source.building}${v.source.unit}`)) reasons.push("物件名・号室を照合元と一致させてください");
  if (v.source.provider === "itandi" && v.source.url !== `https://itandibb.com/rent_rooms/${v.source.roomId}`) reasons.push("ITANDIの部屋IDとURLが一致しません");
  if (v.property.spec.dealType === "rental" && !disclosedUnknown("guarantor", v.property.spec.guarantor) && !/不要|利用なし/.test(v.property.spec.guarantor) && !/[0-9０-９].*(?:円|%|％|ヶ月|か月)/.test(v.property.spec.guarantor)) reasons.push("保証会社の費用を確認してください");
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
    spec: { ...v.property.spec, ...(v.property.spec.dealType === "rental" ? { availabilityExpiresAt: new Date(Math.min(Date.parse(v.source.checkedAt), Date.parse(v.source.listingEvidence.checkedAt), ...(legacyMigration ? [Date.parse(v.reins!.listingEvidence.checkedAt)] : [])) + 26 * 3600_000).toISOString() } : {}) },
    infoUpdatedAt: jstDate(now), nextUpdateAt: jstDate(new Date(now.getTime() + DAY)),
    publishedAt: mode === "published" ? jstDate(now) : undefined,
    internal: { rentalImport: { version: 2, policy: RENTAL_IMPORT_POLICY, email: v.email, source: v.source, advertisingEvidence: v.advertisingEvidence, photoPermission: v.photoPermission, conditionChoices: v.conditionChoices, titleHighlights: v.titleHighlights, unconfirmedTerms: v.unconfirmedTerms, contentReview: v.contentReview, decisions, migration: v.reins ? { legacyReins: v.reins, legacyPortalChecks: summarizePortalChecks(v.portalChecks ?? []) } : undefined } },
  };
  return { ok: true, value: v, property };
}
