import { createHash } from "node:crypto";
import { z } from "zod";
import type { PropertyInput } from "@/lib/property-shared";

export const contentReviewSchema = z.object({
  checkedAt: z.iso.datetime({ offset: true }),
  digest: z.string().regex(/^[a-f0-9]{64}$/),
  locales: z.array(z.enum(["ja", "en", "zh-tw", "zh"])).min(1),
  reference: z.string().trim().min(1),
});
/** Bind a review to the final terms and every published text, rather than the pre-selection input. */
export function rentalContentDigest(p: PropertyInput) {
  const { availabilityExpiresAt: _expires, ...spec } = p.spec.dealType === "rental" ? p.spec : { ...p.spec, availabilityExpiresAt: undefined };
  void _expires;
  const data = { title: p.title, description: p.description, locationText: p.locationText, priceYen: p.priceYen, priceNote: p.priceNote,
    spec, translations: p.translations, locales: p.locales };
  const canonical = (v: unknown): unknown => Array.isArray(v) ? v.map(canonical) : v && typeof v === "object"
    ? Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([k, x]) => [k, canonical(x)])) : v;
  return createHash("sha256").update(JSON.stringify(canonical(data))).digest("hex");
}
