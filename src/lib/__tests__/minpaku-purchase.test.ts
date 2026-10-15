import { describe, expect, it } from "vitest";
import { MINPAKU_LISTINGS, hasCurrentListingPrice } from "../shared/minpaku-listings";
import { minpakuPurchaseMessage } from "../shared/minpaku-purchase";

describe("purchase inquiry content", () => {
  it("keeps multiple requested regions, undecided budget and questions in the consultation content", () => {
    const content = minpakuPurchaseMessage({ regions: ["北海道", "沖縄"], budget: "未定", purpose: "自己利用との併用" }, "利用できる期間を知りたい");
    expect(content).toContain("希望地域：北海道・沖縄");
    expect(content).toContain("予算：未定");
    expect(content).toContain("利用目的：自己利用との併用");
    expect(content).toContain("利用できる期間を知りたい");
  });
});

describe("source price validity", () => {
  it("hides rounded price figures after the source validity ends in Japan", () => {
    const listing = MINPAKU_LISTINGS.find((entry) => entry.id === "chitose")!;
    expect(hasCurrentListingPrice(listing, new Date("2026-10-31T14:59:59.999Z"))).toBe(true);
    expect(hasCurrentListingPrice(listing, new Date("2026-10-31T15:00:00.000Z"))).toBe(false);
  });
  it("keeps unavailable prices out of the public summary", () => {
    const sapporo = MINPAKU_LISTINGS.find((entry) => entry.id === "sapporo")!;
    expect(sapporo.price).toBeNull();
    expect(hasCurrentListingPrice(sapporo, new Date("2026-10-16T00:00:00+09:00"))).toBe(false);
  });
});
