import { isStaleListing, type AdminProperty } from "../property-shared";

type MaintenanceProperty = Pick<AdminProperty, "id" | "status" | "spec" | "infoUpdatedAt" | "nextUpdateAt">;
export type MaintenanceReason = "availability_due" | "update_due" | "stale";
export type MaintenanceItem = { id: string; reasons: MaintenanceReason[]; dueAt: number };

function publicationDay(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NaN;
  const utc = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(utc) || new Date(utc).toISOString().slice(0, 10) !== date) return NaN;
  return utc - 9 * 60 * 60_000;
}

/** For staff triage only. A due date is not evidence that a listing has ended. */
export function propertyMaintenanceQueue(properties: readonly MaintenanceProperty[], now: Date): MaintenanceItem[] {
  const current = now.getTime();
  const results: MaintenanceItem[] = [];
  for (const p of properties) {
    if (p.status !== "published") continue;
    const reasons: MaintenanceReason[] = [];
    const availability = p.spec?.dealType === "rental" && p.spec.availabilityExpiresAt
      ? Date.parse(p.spec.availabilityExpiresAt) : NaN;
    const nextUpdate = publicationDay(p.nextUpdateAt);
    if (availability <= current) reasons.push("availability_due");
    if (nextUpdate <= current) reasons.push("update_due");
    if (isStaleListing(p, now)) reasons.push("stale");
    if (!reasons.length) continue;
    const dueAt = reasons[0] === "availability_due" ? availability
      : reasons[0] === "update_due" ? nextUpdate : publicationDay(p.infoUpdatedAt);
    results.push({ id: p.id, reasons, dueAt });
  }
  const rank: Record<MaintenanceReason, number> = { availability_due: 0, update_due: 1, stale: 2 };
  return results.sort((a, b) => rank[a.reasons[0]] - rank[b.reasons[0]] || a.dueAt - b.dueAt || a.id.localeCompare(b.id));
}
