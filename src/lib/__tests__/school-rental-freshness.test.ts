import { describe, expect, it } from "vitest";
import { isSchoolRentalSnapshotCurrent, compileCurrentSchoolRentals } from "../school-rental-freshness";
import { compilePrivateSchoolCounts, compileRentalDiscovery } from "../rental-discovery";
import type { RentalFeed } from "../school-rental-feed";

const checkedAt = "2026-10-31T04:00:00Z";
const feed = (date = checkedAt): RentalFeed => ({ version: 1, provider: "itandi", scope: "bunkyo-rent-175000-area-48", complete: true, checkedAt: date, records: [] });
describe("public school-rental snapshot freshness", () => {
  it("expires exactly at the next Sunday 13:00 JST review", () => {
    expect(isSchoolRentalSnapshotCurrent(checkedAt, new Date("2026-11-01T03:59:59Z"))).toBe(true);
    expect(isSchoolRentalSnapshotCurrent(checkedAt, new Date("2026-11-01T04:00:00Z"))).toBe(false);
  });
  it("rejects missing, invalid and future snapshots", () => {
    const now = new Date("2026-11-18T00:00:00Z");
    for (const date of [null, undefined, "garbage", "2026-11-19T00:00:00Z"]) expect(isSchoolRentalSnapshotCurrent(date, now)).toBe(false);
  });
  it("does not expose an expired market denominator or turn unknown private counts into zero", () => {
    const now = new Date("2026-11-18T00:00:00Z");
    expect(compileCurrentSchoolRentals([feed()], [], now).market.checkedAt).toBeNull();
    expect(compilePrivateSchoolCounts([feed()], [], now)).toBeNull();
    const result = compileRentalDiscovery([], [], "ja", checkedAt, now, { checkedAt, counts: { nezu: 187 } });
    expect(result.schools.find(s => s.slug === "nezu")).toMatchObject({ privateAvailableListings: null, totalAvailableListings: null, updatedAt: null });
  });
  it("keeps a fresh confirmed zero distinct from unavailable data", () => {
    const now = new Date("2026-11-18T00:00:00Z");
    expect(compilePrivateSchoolCounts([feed("2026-11-17T00:00:00Z")], [], now)?.counts.nezu).toBe(0);
    expect(compilePrivateSchoolCounts([feed("2026-11-17T00:00:00Z"), { ...feed(), provider: "reins" }], [], now)).toBeNull();
  });
});
