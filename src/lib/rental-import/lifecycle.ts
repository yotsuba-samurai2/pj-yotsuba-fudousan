import { createHash } from "node:crypto";
import { z } from "zod";
import { toPublicProperty, type AdminProperty, type PropertyInput } from "@/lib/property-shared";
import { isFresh, isPrimaryReference, validListingEvidence, rentalIdentity, rentalImportSchema, validateRentalImport } from "./validation";

export interface RentalStore {
  get(slug: string): Promise<AdminProperty | null>;
  create(input: PropertyInput): Promise<void>;
  /** Compare-and-swap protects edits made while a run is in progress. */
  update(slug: string, expectedUpdatedAt: string, input: Partial<PropertyInput>): Promise<boolean>;
}
export function publicDigest(p: PropertyInput) {
  const canonical = (v: unknown): unknown => Array.isArray(v) ? v.map(canonical) : v && typeof v === "object"
    ? Object.fromEntries(Object.entries(v).filter(([, v]) => v !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, canonical(v)])) : v;
  return createHash("sha256").update(JSON.stringify(canonical(toPublicProperty(p)))).digest("hex");
}
export type ImportResult = { action: "created" | "updated" | "held" | "closed" | "unchanged"; slug?: string; reasons?: string[] };

/** Closure evidence remains actionable when unrelated price, text or image fields are invalid. */
export function closureFromRentalImport(input: unknown, now: Date) {
  const parsed = rentalImportSchema.pick({ source: true }).extend({ reins: rentalImportSchema.shape.reins.optional() }).safeParse(input);
  if (!parsed.success) return null;
  const { source, reins } = parsed.data;
  if (source.provider !== "itandi") return null;
  const candidates = [
    { provider: "itandi" as const, listingId: source.roomId, availability: source.availability, evidence: source.listingEvidence },
    ...(reins && rentalIdentity(reins) === rentalIdentity(source) ? [{ provider: "reins" as const, listingId: reins.propertyId, availability: reins.availability, evidence: reins.listingEvidence }] : []),
  ];
  const ended = candidates.find((c) => (c.availability === "closed" || c.availability === "removed") && validListingEvidence(c.evidence, c.provider, now));
  if (!ended) return null;
  return { source, status: ended.availability as "closed" | "removed", confirmedBy: { provider: ended.provider, listingId: ended.listingId }, ...ended.evidence };
}

export async function importRental(input: unknown, store: RentalStore, now: Date, mode: "draft" | "published", maintenance = false): Promise<ImportResult> {
  const closure = closureFromRentalImport(input, now);
  if (closure) {
    const result = await closeRental(closure, store, now);
    return result.action === "unchanged" ? { action: "held", slug: result.slug, reasons: ["掲載終了のため登録対象外です"] } : result;
  }
  // Existing listings continue monitoring after the original email ages out of the intake window.
  const gate = validateRentalImport(input, now, mode, maintenance);
  if (!gate.ok) return { action: "held", reasons: gate.reasons };
  const p = gate.property;
  const existing = await store.get(p.slug);
  if (maintenance && !existing) return { action: "held", slug: p.slug, reasons: ["再確認の対象物件が存在しません"] };
  if (existing) {
    const metadata = existing.internal?.rentalImport as { lastPublicDigest?: string; paused?: boolean } | undefined;
    if (existing.status === "closed") return { action: "held", slug: p.slug, reasons: ["募集終了済み。再公開には管理者の確認が必要です"] };
    if (!metadata || metadata.paused || metadata.lastPublicDigest !== publicDigest(existing)) return { action: "held", slug: p.slug, reasons: ["手動編集済み、または自動更新が停止されています"] };
    // A draft run must not silently demote a listing already published by the operator.
    if (existing.status === "published" && mode === "draft") return { action: "held", slug: p.slug, reasons: ["公開済み物件の更新には公開モードが必要です"] };
    p.publishedAt = existing.publishedAt ?? p.publishedAt;
  }
  const meta = p.internal!.rentalImport as Record<string, unknown>;
  meta.lastPublicDigest = publicDigest(p);
  if (existing) {
    const success = await store.update(p.slug, existing.updatedAt!, p);
    return success ? { action: "updated", slug: p.slug } : { action: "held", slug: p.slug, reasons: ["同時更新を検出しました。次回再確認します"] };
  }
  await store.create(p);
  return { action: "created", slug: p.slug };
}

export const closureSchema = z.object({
  source: z.object({ building: z.string().min(1), address: z.string().min(1), unit: z.string().min(1), provider: z.enum(["itandi", "reins", "other"]), roomId: z.string().min(1) }),
  status: z.enum(["closed", "removed", "unknown"]),
  checkedAt: z.iso.datetime({ offset: true }),
  reference: z.string().min(1), quote: z.string().min(1),
  confirmedBy: z.object({ provider: z.enum(["itandi", "reins"]), listingId: z.string().min(1) }),
  /** Removal is confirmed only in an authenticated, functioning search/detail view. */
  authenticated: z.boolean(), siteOperational: z.boolean(), exactRoomMatched: z.boolean(),
}).strict();
export async function closeRental(input: unknown, store: RentalStore, now: Date): Promise<ImportResult> {
  const parsed = closureSchema.safeParse(input);
  if (!parsed.success) return { action: "held", reasons: ["掲載終了確認の形式が不正です"] };
  const v = parsed.data, slug = `rent-${rentalIdentity(v.source)}`;
  if (v.status === "unknown" || !v.authenticated || !v.siteOperational || !v.exactRoomMatched || !isFresh(v.checkedAt, now) || !isPrimaryReference(v.reference, v.confirmedBy.provider)) return { action: "held", slug, reasons: ["ITANDI・REINSの認証済み画面で同一号室の終了を確認してください。認証切れ・障害は終了扱いしません"] };
  const existing = await store.get(slug);
  if (!existing || existing.status === "closed") return { action: "unchanged", slug };
  const meta = existing.internal?.rentalImport as { source?: { provider?: string; roomId?: string }; reins?: { propertyId?: string } } | undefined;
  if (!meta || meta.source?.provider !== v.source.provider || meta.source?.roomId !== v.source.roomId) return { action: "held", slug, reasons: ["登録時の取得元と一致しません"] };
  const registeredId = v.confirmedBy.provider === "itandi" ? meta.source.roomId : meta.reins?.propertyId;
  if (v.confirmedBy.listingId !== registeredId) return { action: "held", slug, reasons: ["終了を確認した物件番号が登録時と一致しません"] };
  // Even manually edited imports must be withdrawn once closure is verified.
  const success = await store.update(slug, existing.updatedAt!, { status: "closed", internal: { ...existing.internal, rentalClosure: v } });
  return success ? { action: "closed", slug } : { action: "held", slug, reasons: ["同時更新を検出しました。再確認が必要です"] };
}
