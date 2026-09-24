// 2026-09-24 浦松判断 D-4：根拠資料のない「この一覧の掲載件数の平均2倍以上」を学区の比較一覧から削除した。
// 指示書（ペット横断 版2.0）第13章：根拠のない数値表現を使わない。4言語とも再発させない。
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RentalComparison } from "@/components/gakku/RentalComparison";
import type { PublicRentalSummary } from "@/lib/school-rental-feed";
import type { LangCode } from "@/config/languages";

const LOCALES: LangCode[] = ["ja", "en", "zh-tw", "zh"];
const row: PublicRentalSummary = {
  building: "試験マンション", unit: "205", address: "東京都文京区千石１丁目２０－２０",
  rentYen: 250000, managementYen: 10000, commonYen: 0, deposit: "1ヶ月", keyMoney: "1ヶ月", layout: "2LDK", areaSqm: 60,
  availabilityText: "相談", pets: "unknown", foreignNationals: "unknown", corporate: "unknown",
  companyHousing: "unknown", companyHousingTerms: "", petTerms: "", foreignTerms: "", corporateTerms: "",
  buildingType: "マンション", access: "都営三田線 千石 徒歩5分", built: "2000年1月", structure: "RC", floors: "3階",
  contractType: "普通借家", contractPeriod: "2年", guaranteeDeposit: "", renewalFee: "", insurance: "", guarantor: "", otherFees: "",
  id: "rental-test", schoolSlug: null, checkedAt: "2026-09-23T04:00:00Z", nextReviewAt: "2026-09-30T03:00:00Z",
};

describe("学区の比較一覧：相談枠の文言（D-4）", () => {
  it.each(LOCALES)("%s: 掲載件数の倍率を約束しない", locale => {
    const html = renderToStaticMarkup(createElement(RentalComparison, { rows: [row], locale }));
    expect(html).not.toMatch(/2倍|平均|twice|two times|on average/i);
  });

  it.each(LOCALES)("%s: 一覧にない物件の相談導線は残す", locale => {
    const html = renderToStaticMarkup(createElement(RentalComparison, { rows: [row], locale }));
    expect(html).toContain("contact?intent=bukken");
  });
});
