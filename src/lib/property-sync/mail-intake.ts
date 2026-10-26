import "server-only";
import { z } from "zod";
import { contentHash } from "./rules";
import { rentalFieldEvidenceSchema } from "./rental-field-evaluation";
import { CURRENT_RENTAL_ADOPTION_POLICY } from "../rental-import/adoption-policy";

const ref = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/);
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const instant = z.iso.datetime({ precision: 3 });
const integer = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
export const MAIL_WINDOW_MS = CURRENT_RENTAL_ADOPTION_POLICY.mailMaxAgeHours * 60 * 60 * 1000;
export const mailEnvelopeSchema = z.object({
  schemaVersion: z.literal(1), mailboxRef: ref, messageId: ref,
  // Set by the connector/export adapter, never by parsing the message's Date header.
  receivedAt: instant, receivedAtBasis: z.enum(["provider_internal_date", "unconfirmed"]),
  folder: z.enum(["incoming", "sent", "draft", "spam", "trash", "unknown"]),
  subject: z.string().max(1000),
  parts: z.array(z.object({ mimeType: z.enum(["text/plain", "text/html"]),
    decodedText: z.string().max(100_000), decoding: z.enum(["confirmed", "unknown", "failed"]),
  }).strict()).max(20),
  attachmentsPresent: z.boolean(),
}).strict().refine(e => e.parts.reduce((n, p) => n + Buffer.byteLength(p.decodedText, "utf8"), 0) <= 500_000);
export type MailEnvelope = z.infer<typeof mailEnvelopeSchema>;
const proposedFieldsSchema = z.object({
  rentYen: integer.nullable(), managementYen: integer.nullable(),
  mainRooms: integer.positive().nullable(), kitchen: z.enum(["K", "DK", "LDK"]).nullable(),
  areaSqm: z.number().positive().finite().max(Number.MAX_SAFE_INTEGER).nullable(),
  leaseType: z.enum(["ordinary", "fixed"]).nullable(), sourceUpdatedAt: instant.nullable(),
}).strict();
const reasonSchema = z.enum(["ADVERTISING_PROHIBITED", "PREPUBLICATION_NOTICE", "DECODE_REVIEW_REQUIRED",
  "HTML_REVIEW_REQUIRED", "ATTACHMENT_REVIEW_REQUIRED", "MULTIPLE_OR_CONFLICTING_FIELDS", "DIGEST_REQUIRES_ITEM_REVIEW",
  "AD_CHANGE_IS_NOT_NEW_LISTING", "MARKET_UNCONFIRMED", "SOURCE_UPDATE_UNCONFIRMED", "NORMALIZATION_UNCONFIRMED",
  "INCOME_UNCONFIRMED", "ADVERTISING_AND_MATERIAL_PERMISSION_UNCONFIRMED", "SINGLE_PROPERTY_BLOCK_UNCONFIRMED"]);
export const mailCandidateSchema = z.object({
  schemaVersion: z.literal(1), visibility: z.literal("internal_only"), executable: z.literal(false), publicationEligible: z.literal(false),
  mailboxRef: ref, messageId: ref, messageKey: hash, envelopeHash: hash, contentHash: hash,
  receivedAt: instant, assessedAt: instant,
  marketProposal: z.enum(["residential_rental", "sale", "business", "unknown"]),
  advertising: z.enum(["prohibited", "unconfirmed"]),
  noticeKind: z.enum(["digest", "ad_change", "property_or_unknown"]),
  fields: proposedFieldsSchema, pending: z.array(reasonSchema).min(1).max(20),
}).strict();
export type MailCandidate = z.infer<typeof mailCandidateSchema>;
const emptyFields = (): MailCandidate["fields"] => ({ rentYen: null, managementYen: null, mainRooms: null,
  kitchen: null, areaSqm: null, leaseType: null, sourceUpdatedAt: null });
const held = (reason: string) => ({ status: "held" as const, executable: false as const, reason });
const excluded = (reason: string) => ({ status: "excluded" as const, executable: false as const, reason });

/** Small labelled-text contract only. No HTML rendering, URL fetches, MIME guessing or model calls. */
export function assessIncomingPropertyMail(raw: unknown, mailboxRef: string, now: string) {
  const parsed = mailEnvelopeSchema.safeParse(raw);
  if (!parsed.success || !ref.safeParse(mailboxRef).success || !instant.safeParse(now).success) return held("INVALID_MAIL_INPUT");
  const e = parsed.data;
  if (e.mailboxRef !== mailboxRef) return held("MAILBOX_MISMATCH");
  if (e.receivedAtBasis !== "provider_internal_date") return held("RECEIPT_TIME_UNCONFIRMED");
  const age = Date.parse(now) - Date.parse(e.receivedAt);
  if (age < 0) return held("RECEIPT_FROM_FUTURE");
  if (age > MAIL_WINDOW_MS) return excluded("OUTSIDE_MAIL_WINDOW");
  if (e.folder === "unknown") return held("INCOMING_FOLDER_UNCONFIRMED");
  if (e.folder !== "incoming") return excluded("NOT_INCOMING_MAIL");
  if (/routine completed|タスク実行結果|自動処理の実行報告/i.test(e.subject)) return excluded("AUTOMATION_REPORT");

  const pending: MailCandidate["pending"] = [];
  // These are conservative review hints; absence of a phrase never grants permission.
  const text = [e.subject, ...e.parts.map(p => p.decodedText)].join("\n").normalize("NFKC");
  const advertising = /広告\s*(?:一切\s*)?(?:厳禁|禁止|不可)|転載\s*(?:厳禁|禁止|不可)|掲載\s*(?:禁止|不可)/.test(text) ? "prohibited" : "unconfirmed";
  if (advertising === "prohibited") pending.push("ADVERTISING_PROHIBITED");
  if (/未公開|非公開|掲載前/.test(text)) pending.push("PREPUBLICATION_NOTICE");
  const decodeFailed = !e.parts.length || /\uFFFD|\x1b/.test(text) || e.parts.some(p => p.decoding !== "confirmed");
  const hasHtml = e.parts.some(p => p.mimeType === "text/html");
  if (decodeFailed) pending.push("DECODE_REVIEW_REQUIRED");
  if (hasHtml) pending.push("HTML_REVIEW_REQUIRED");
  if (e.attachmentsPresent) pending.push("ATTACHMENT_REVIEW_REQUIRED");
  const noticeKind = /日報|ダイジェスト/.test(e.subject) ? "digest" : /AD.*(?:増額|変更)/i.test(e.subject) ? "ad_change" : "property_or_unknown";
  if (noticeKind === "digest") pending.push("DIGEST_REQUIRES_ITEM_REVIEW");
  if (noticeKind === "ad_change") pending.push("AD_CHANGE_IS_NOT_NEW_LISTING");

  const fields = emptyFields();
  let marketProposal: MailCandidate["marketProposal"] = "unknown";
  const values = new Map<string, string[]>();
  if (!decodeFailed && !hasHtml && !e.attachmentsPresent && noticeKind === "property_or_unknown") {
    const lines = (e.parts[0]?.decodedText ?? "").normalize("NFKC").trim().split(/\r?\n/);
    // A single contiguous labelled block starting with its property name is required.
    // Fields after prose/separators cannot be joined to fields preceding them.
    let uncertainBlock = e.parts.length !== 1 || !/^物件名\s*[:：]\s*\S/.test(lines[0] ?? ""), ended = false;
    for (const line of lines) {
      const match = /^(取引種別|用途|物件名|賃料|管理費|間取り|専有面積|契約形態|物件更新日時)\s*[:：]\s*(.*?)\s*$/.exec(line.trim());
      if (!match) { ended = true; continue; }
      if (ended) uncertainBlock = true;
      values.set(match[1], [...(values.get(match[1]) ?? []), match[2]]);
    }
    // Even equal repeated labels may describe separate rooms. Never merge a multi-item digest.
    if (uncertainBlock) pending.push("SINGLE_PROPERTY_BLOCK_UNCONFIRMED");
    else if ([...values.values()].some(v => v.length > 1)) pending.push("MULTIPLE_OR_CONFLICTING_FIELDS");
    else {
      const get = (key: string) => values.get(key)?.[0];
      const money = (value?: string) => {
        if (!value || !/^(?:0|[1-9]\d*|[1-9]\d{0,2}(?:,\d{3})+)円$/.test(value)) return null;
        const n = Number(value.slice(0, -1).replaceAll(",", ""));
        return Number.isSafeInteger(n) ? n : null;
      };
      fields.rentYen = money(get("賃料")); fields.managementYen = money(get("管理費"));
      const layout = /^([1-9]\d?)(K|DK|LDK)$/.exec(get("間取り") ?? "");
      if (layout) { fields.mainRooms = Number(layout[1]); fields.kitchen = layout[2] as "K" | "DK" | "LDK"; }
      const area = /^(\d+(?:\.\d{1,2})?)\s*(?:m2|m²|㎡)$/.exec(get("専有面積") ?? "");
      if (area && Number(area[1]) > 0 && Number(area[1]) <= Number.MAX_SAFE_INTEGER) fields.areaSqm = Number(area[1]);
      fields.leaseType = get("契約形態") === "普通借家" ? "ordinary" : get("契約形態") === "定期借家" ? "fixed" : null;
      const updated = instant.safeParse(get("物件更新日時"));
      if (updated.success && updated.data <= e.receivedAt) fields.sourceUpdatedAt = updated.data;
      const use = get("用途"), deal = get("取引種別");
      marketProposal = use === "事業用" ? "business" : deal === "売買" ? "sale"
        : deal === "賃貸" && use === "居住用" ? "residential_rental" : "unknown";
    }
  }
  // No entity identity, new募集episode or publishing grant can be derived from a mail hint.
  if (marketProposal === "unknown") pending.push("MARKET_UNCONFIRMED");
  pending.push("SOURCE_UPDATE_UNCONFIRMED", "NORMALIZATION_UNCONFIRMED", "INCOME_UNCONFIRMED", "ADVERTISING_AND_MATERIAL_PERMISSION_UNCONFIRMED");
  const candidate: MailCandidate = { schemaVersion: 1, visibility: "internal_only", executable: false, publicationEligible: false,
    mailboxRef: e.mailboxRef, messageId: e.messageId, messageKey: contentHash({ mailboxRef: e.mailboxRef, messageId: e.messageId }),
    envelopeHash: contentHash(e), contentHash: contentHash({ subject: e.subject, parts: e.parts, attachmentsPresent: e.attachmentsPresent }),
    receivedAt: e.receivedAt, assessedAt: now, marketProposal, advertising, noticeKind, fields, pending };
  return { status: "candidate" as const, executable: false as const, candidate };
}

/** Proposal for the existing evaluator, always unconfirmed. No private prose/AD field crosses this boundary. */
export function proposeRentalEvidenceFromMail(raw: unknown, binding: unknown) {
  const candidate = mailCandidateSchema.safeParse(raw);
  if (!candidate.success) return held("INVALID_MAIL_CANDIDATE");
  const c = candidate.data;
  if (c.marketProposal !== "residential_rental") return held("MAIL_MARKET_NOT_RESIDENTIAL_RENTAL");
  const { sourceUpdatedAt, ...fields } = c.fields;
  const evidence = rentalFieldEvidenceSchema.safeParse({ binding, sourceHash: c.envelopeHash, observedAt: c.assessedAt,
    normalization: "unconfirmed", normalizationContractRef: null, ...fields,
    sourcePropertyUpdate: { updatedAt: sourceUpdatedAt, evidenceRef: null, basis: "unknown" } });
  return evidence.success ? { status: "proposed" as const, executable: false as const, eligibilityConfirmed: false as const,
    evidence: evidence.data } : held("INVALID_MAIL_EVIDENCE_BINDING");
}
