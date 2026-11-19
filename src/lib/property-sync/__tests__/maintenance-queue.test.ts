import { describe, expect, it } from "vitest";
import { isPubliclyVisible, type AdminProperty } from "../../property-shared";
import { propertyMaintenanceQueue } from "../maintenance-queue";

const NOW = new Date("2026-11-19T00:00:00+09:00");
function listing(id: string, patch: Partial<AdminProperty> = {}): AdminProperty {
  return {
    id, slug: id, status: "published", dealType: "rental",
    spec: { dealType: "rental" } as AdminProperty["spec"],
    locales: ["ja"], infoUpdatedAt: "2026-11-18", nextUpdateAt: "2026-11-25", ...patch,
  } as AdminProperty;
}

describe("property listing maintenance queue", () => {
  it("queues the planned update at midnight JST, not at midnight UTC", () => {
    const p = listing("due", { nextUpdateAt: "2026-11-19" });
    expect(propertyMaintenanceQueue([p], new Date(NOW.getTime() - 1))).toEqual([]);
    expect(propertyMaintenanceQueue([p], NOW)).toEqual([{ id: "due", reasons: ["update_due"], dueAt: NOW.getTime() }]);
  });

  it("uses exact rental evidence expiry even when the display date was updated yesterday", () => {
    const p = listing("expires", { spec: { dealType: "rental", availabilityExpiresAt: NOW.toISOString() } as AdminProperty["spec"] });
    expect(propertyMaintenanceQueue([p], new Date(NOW.getTime() - 1))).toEqual([]);
    expect(propertyMaintenanceQueue([p], NOW)[0]?.reasons).toEqual(["availability_due"]);
    expect(isPubliclyVisible({ ...p, locales: ["ja"] }, "ja", NOW)).toBe(true);
    expect(p.status).toBe("published");
  });

  it("shows one review entry per row with all reasons, ordered by reason and oldest due", () => {
    const expiry = (daysAgo: number) => ({
      dealType: "rental", availabilityExpiresAt: new Date(NOW.getTime() - daysAgo * 86_400_000).toISOString(),
    }) as AdminProperty["spec"];
    const input = [
      listing("stale", { infoUpdatedAt: "2026-11-08" }),
      listing("newer-expiry", { spec: expiry(0) }),
      listing("next-update", { nextUpdateAt: "2026-11-09" }),
      listing("older-expiry", { spec: expiry(2), infoUpdatedAt: "2026-11-09", nextUpdateAt: "2026-11-15" }),
    ];
    const queue = propertyMaintenanceQueue(input, NOW);
    expect(queue.map(({ id }) => id)).toEqual(["older-expiry", "newer-expiry", "next-update", "stale"]);
    expect(queue[0]?.reasons).toEqual(["availability_due", "update_due", "stale"]);
    expect(input[0]?.id).toBe("stale");
  });

  it("excludes ended and draft records, future dates, and malformed dates rather than assuming closure", () => {
    const due = { nextUpdateAt: "2026-11-19" };
    expect(propertyMaintenanceQueue([
      listing("draft", { ...due, status: "draft" }),
      listing("closed", { ...due, status: "closed" }),
      listing("future"),
      listing("invalid", { nextUpdateAt: "2026-02-30", spec: { dealType: "rental", availabilityExpiresAt: "invalid" } as AdminProperty["spec"] }),
      listing("threshold", { infoUpdatedAt: "2026-11-12" }),
    ], NOW)).toEqual([]);
  });
});
