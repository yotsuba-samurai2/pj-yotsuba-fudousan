import { describe, expect, it } from "vitest";
import { portalCheckSchema, summarizePortalChecks, type PortalCheck } from "../portal-counts";
import { validateRentalImport } from "../validation";
import { fixture, NOW } from "./fixtures";
const check = (): PortalCheck => ({ portal: "suumo", checkedAt: NOW.toISOString(), coverage: "complete", searchUrl: "https://suumo.jp/search", note: "全ページ・同一号室を確認", listings: [{ listingId: "a", url: "https://suumo.jp/a", company: "検証会社", status: "active", match: "confirmed", evidence: "同じ住所・建物・001号室を照合" }] });
describe("他社を含む候補物件ごとの掲載数", () => {
  it("同じ広告IDのURL違いを二重計上しない", () => { const c = check(); c.listings.push({ ...c.listings[0], url: "https://suumo.jp/a?ref=x" }); expect(summarizePortalChecks([c])[0]).toMatchObject({ status: "complete", confirmedCount: 1 }); });
  it("同じ部屋の別広告は別件で数える", () => { const c = check(); c.listings.push({ ...c.listings[0], listingId: "b", company: "別店舗" }); expect(summarizePortalChecks([c])[0].confirmedCount).toBe(2); });
  it("未確認をゼロ件としない", () => { expect(summarizePortalChecks([])[0].confirmedCount).toBeNull(); const c = check(); c.coverage = "unavailable"; expect(summarizePortalChecks([c])[0].confirmedCount).toBeNull(); });
  it("未照合は可能性あり、終了・別部屋は件数から除外", () => { const c = check(); c.listings.push({ ...c.listings[0], listingId: "b", match: "possible" }, { ...c.listings[0], listingId: "c", status: "ended" }, { ...c.listings[0], listingId: "d", match: "different" }); expect(summarizePortalChecks([c])[0]).toMatchObject({ status: "partial", confirmedCount: 1, possibleCount: 1 }); });
  it("同一広告の状態が矛盾したら確定数に含めない", () => { const c = check(); c.listings.push({ ...c.listings[0], status: "ended" }); expect(summarizePortalChecks([c])[0]).toMatchObject({ confirmedCount: 0, possibleCount: 1, status: "partial" }); });
  it("ITANDIとREINS掲載中ならポータルの終了だけで除外しない", () => { const v = fixture(), c = check(); c.listings[0].status = "ended"; v.portalChecks![0] = c; const result = validateRentalImport(v, NOW); expect(result.ok).toBe(true); });
  it("別号室の掲載終了では対象を除外しない", () => { const v = fixture(), c = check(); c.listings[0].status = "ended"; c.listings[0].match = "different"; v.portalChecks![0] = c; expect(validateRentalImport(v, NOW).ok).toBe(true); });
  it("3ポータルはv1.2の公開判定に使わない", () => {
    const v = fixture(); delete v.portalChecks; expect(validateRentalImport(v, NOW).ok).toBe(true);
    v.portalChecks = fixture().portalChecks!; v.portalChecks[1].checkedAt = "2020-01-01T00:00:00Z"; expect(validateRentalImport(v, NOW).ok).toBe(true);
    v.portalChecks[1] = { ...fixture().portalChecks![1], coverage: "unavailable", note: "サイトが応答せず再確認できなかった" }; expect(validateRentalImport(v, NOW).ok).toBe(true);
  });
  it("ポータルと異なる根拠URLを拒否", () => { const c = check(); c.searchUrl = "https://evil.example/search"; expect(portalCheckSchema.safeParse(c).success).toBe(false); });
});
