import { compileRentalSummaries, nextWeeklyReviewAt, type RentalFeed, type RentalSummary } from "./school-rental-feed";

/** A saved comparison snapshot is not evidence of current availability after its review deadline. */
export function isSchoolRentalSnapshotCurrent(checkedAt: string | null | undefined, now = new Date()): boolean {
  if (!checkedAt) return false;
  const checked = Date.parse(checkedAt);
  return Number.isFinite(checked) && checked <= now.getTime()
    && now.getTime() < Date.parse(nextWeeklyReviewAt(checkedAt));
}

/** Public-only projection; saved feeds and administrative preview remain unchanged. */
export function compileCurrentSchoolRentals(feeds: RentalFeed[], existing: Pick<RentalSummary, "building" | "unit" | "address">[] = [], now = new Date()) {
  const current = feeds.filter(feed => isSchoolRentalSnapshotCurrent(feed.checkedAt, now));
  return compileRentalSummaries(current, existing, now);
}
