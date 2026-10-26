import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { LangCode } from "@/config/languages";
import { localizeFeeName, localizeFeeText } from "@/lib/legal/ryokin-i18n";
import { SECTIONS } from "@/lib/legal/ryokin-sections";

const state = vi.hoisted(() => ({ locale: "ja" as LangCode }));
vi.mock("@/lib/getRequestLocale", () => ({ getRequestLocale: async () => state.locale }));
vi.mock("@/components/shared/Breadcrumb", () => ({ Breadcrumb: () => null }));
vi.mock("@/components/shared/CtaBand", () => ({ CtaBand: () => null }));
vi.mock("@/components/shared/CrossLinkBanner", () => ({ CrossLinkBanner: () => null }));
vi.mock("@/lib/legal/nonresident-review", () => ({ getNonresidentServices: async () => null }));
vi.mock("@/components/legal/NonresidentCompanyReview", () => ({ NonresidentFeeTable: () => null, NonresidentReviewLinks: () => null }));
vi.mock("@/components/legal/FamilyTrustFees", () => ({ FamilyTrustFees: () => null }));
import Fees from "@/app/[locale]/(legal)/legal/ryokin/page";

const EXPECTED = [
  { name: "海外在住相続人対応加算", unit: "1人", price: "88,000円", value: 88000, priceUnit: "人" },
  { name: "海外送金事務代行報酬", unit: "解約元口座1口座", price: "38,500円", value: 38500, priceUnit: "解約元口座" },
];
const SCOPE = {
  ja: ["国籍だけを理由に加算せず", "同一案件・同一人につき1回", "受取口座ごとではありません", "送金・為替関連費用は別途", "金融機関所定の委任・本人確認・受理条件", "株式換価・長期の預り金管理は含みません", "同一作業の重複請求はせず", "資格者が確認", "税務は税理士、登記は司法書士へ別途直接"],
  en: ["Nationality alone does not trigger", "once per person in the same case", "rather than per receiving account", "foreign-exchange costs charged by banks and other providers are extra", "authorization, identity-verification and acceptance requirements", "Share liquidation and long-term custody of funds are excluded", "same work is not charged twice", "qualified professional confirms", "separate direct engagements with a tax accountant and a judicial scrivener"],
  "zh-tw": ["不因國籍本身加收", "同一案件的同一人僅收取1次", "並非按收款帳戶計算", "匯款及外匯相關費用另計", "委任、身分確認及受理條件", "不包含股票變現或長期保管款項", "同一作業不重複收費", "資格者確認", "分別另行直接委託稅理士及司法書士"],
  zh: ["不因国籍本身加收", "同一案件的同一人仅收取1次", "并非按收款账户计算", "汇款及外汇相关费用另计", "委任、身份确认及受理条件", "不包含股票变现或长期保管款项", "同一作业不重复收费", "资格者确认", "分别另行直接委托税理士及司法书士"],
};

describe("海外相続の追加報酬：承認された金額・算定単位・範囲", () => {
  it("相続欄へ2項目を追加し、既存の55,000円／行を保持する", () => {
    const inheritance = SECTIONS.find(s => s.href === "/legal/services/inheritance")!;
    for (const row of EXPECTED) expect(inheritance.rows).toContainEqual(row);
    expect(inheritance.rows.find(r => r.name === "金融機関 解約・名義変更")).toEqual({
      name: "金融機関 解約・名義変更", unit: "1件", price: "55,000円/1行", value: 55000,
    });
  });

  for (const locale of ["ja", "en", "zh-tw", "zh"] as const) {
    it(`${locale}: PC表とSPカードに同じ料金・単位があり、範囲注記が表示される`, async () => {
      state.locale = locale;
      const html = renderToStaticMarkup(await Fees());
      for (const tag of ["tr", "li"]) {
        const blocks = [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`, "g"))].map(m => m[0]);
        for (const row of EXPECTED) {
          const label = localizeFeeName(row.name, locale)!;
          const matching = blocks.filter(block => block.includes(label));
          expect(matching).toHaveLength(1);
          expect(matching[0]).toContain(localizeFeeText(row.unit, locale)!);
          expect(matching[0]).toContain(localizeFeeText(row.price, locale)!);
        }
      }
      for (const phrase of SCOPE[locale]) expect(html).toContain(phrase);
    });

    it(`${locale}: JSON-LDも税込額と1人／解約元口座の単位を出力する`, async () => {
      state.locale = locale;
      const html = renderToStaticMarkup(await Fees());
      const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]);
      const offers = graph["@graph"][0].offers;
      for (const row of EXPECTED) {
        const matches = offers.filter((offer: { name: string }) => offer.name === row.name);
        expect(matches).toHaveLength(1);
        expect(matches[0].priceSpecification).toEqual({
          "@type": "UnitPriceSpecification", price: row.value, priceCurrency: "JPY", valueAddedTaxIncluded: true,
          referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitText: row.priceUnit },
        });
      }
      expect(offers.find((offer: { name: string }) => offer.name === "金融機関 解約・名義変更").priceSpecification.price).toBe(55000);
    });
  }
});
