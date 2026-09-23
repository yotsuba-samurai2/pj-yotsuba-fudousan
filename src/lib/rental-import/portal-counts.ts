import { z } from "zod";

export const PORTALS = ["suumo", "athome", "homes"] as const;
const hosts = { suumo: "suumo.jp", athome: "athome.co.jp", homes: "homes.co.jp" };
export function isPortalUrl(url: string, portal: typeof PORTALS[number]) {
  try {
    const parsed = new URL(url), host = hosts[portal];
    return parsed.protocol === "https:" && (parsed.hostname === host || parsed.hostname.endsWith(`.${host}`));
  } catch { return false; }
}
export const portalCheckSchema = z.object({
  portal: z.enum(PORTALS), checkedAt: z.iso.datetime({ offset: true }),
  coverage: z.enum(["complete", "partial", "unavailable"]),
  searchUrl: z.url(), note: z.string().min(1),
  listings: z.array(z.object({
    listingId: z.string().min(1), url: z.url(), company: z.string().min(1),
    status: z.enum(["active", "ended", "unknown"]),
    match: z.enum(["confirmed", "possible", "different"]),
    /** State which address, building, unit and supporting attributes were matched. */
    evidence: z.string().min(1),
  })),
}).superRefine((check, ctx) => {
  for (const url of [check.searchUrl, ...check.listings.map((l) => l.url)]) {
    if (!isPortalUrl(url, check.portal)) ctx.addIssue({ code: "custom", message: "件数の根拠URLを対象ポータルに揃えてください" });
  }
});
export type PortalCheck = z.infer<typeof portalCheckSchema>;
export function endedPortalListings(checks: PortalCheck[]) {
  return checks.flatMap((c) => c.listings.filter((l) => l.match === "confirmed" && l.status === "ended")
    .map((listing) => ({ portal: c.portal, checkedAt: c.checkedAt, listing })));
}
export function summarizePortalChecks(checks: PortalCheck[]) {
  return PORTALS.map((portal) => {
    const check = checks.filter((c) => c.portal === portal).sort((a, b) => Date.parse(b.checkedAt) - Date.parse(a.checkedAt))[0];
    if (!check || check.coverage === "unavailable") return { portal, status: "unavailable" as const, confirmedCount: null, possibleCount: null, checkedAt: check?.checkedAt, note: check?.note ?? "未確認" };
    // The same advertisement can have multiple URLs. Do not count URL variants twice.
    const groups = new Map<string, PortalCheck["listings"]>();
    check.listings.forEach((l) => groups.set(l.listingId, [...(groups.get(l.listingId) ?? []), l]));
    let confirmedCount = 0, possibleCount = 0;
    for (const rows of groups.values()) {
      if (rows.every((r) => r.status === "ended" || r.match === "different")) continue;
      if (rows.every((r) => r.status === "active" && r.match === "confirmed")) confirmedCount++;
      else possibleCount++;
    }
    return { portal, status: check.coverage === "complete" && !possibleCount ? "complete" as const : "partial" as const, confirmedCount, possibleCount, checkedAt: check.checkedAt, note: check.note };
  });
}
