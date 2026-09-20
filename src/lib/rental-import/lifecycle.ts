import { createHash } from "node:crypto";
import { z } from "zod";
import { toPublicProperty, type AdminProperty, type PropertyInput } from "@/lib/property-shared";
import { isFresh, rentalIdentity, validateRentalImport } from "./validation";
import { isPortalUrl, PORTALS } from "./portal-counts";

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

export async function importRental(input: unknown, store: RentalStore, now: Date, mode: "draft" | "published", maintenance = false): Promise<ImportResult> {
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
  /** Public portals need no login, but must explicitly display closure for this room. */
  portal: z.enum(PORTALS).optional(),
  /** Removal is confirmed only in an authenticated, functioning search/detail view. */
  authenticated: z.boolean(), siteOperational: z.boolean(), exactRoomMatched: z.boolean(),
});
export async function closeRental(input: unknown, store: RentalStore, now: Date): Promise<ImportResult> {
  const parsed = closureSchema.safeParse(input);
  if (!parsed.success) return { action: "held", reasons: ["掲載終了確認の形式が不正です"] };
  const v = parsed.data, slug = `rent-${rentalIdentity(v.source)}`;
  const publicClosure = v.portal && v.status === "closed" && isPortalUrl(v.reference, v.portal) && /(?:掲載|募集)(?:が|は|を)?終了/.test(v.quote);
  if (v.status === "unknown" || (v.portal ? !publicClosure : !v.authenticated) || !v.siteOperational || !v.exactRoomMatched || !isFresh(v.checkedAt, now)) return { action: "held", slug, reasons: ["認証切れ・障害・物件照合未完了を掲載終了として扱いません"] };
  const existing = await store.get(slug);
  if (!existing || existing.status === "closed") return { action: "unchanged", slug };
  const meta = existing.internal?.rentalImport as { source?: { provider?: string; roomId?: string } } | undefined;
  if (!meta || meta.source?.provider !== v.source.provider || meta.source?.roomId !== v.source.roomId) return { action: "held", slug, reasons: ["登録時の取得元と一致しません"] };
  // Even manually edited imports must be withdrawn once closure is verified.
  const success = await store.update(slug, existing.updatedAt!, { status: "closed", internal: { ...existing.internal, rentalClosure: v } });
  return success ? { action: "closed", slug } : { action: "held", slug, reasons: ["同時更新を検出しました。再確認が必要です"] };
}
