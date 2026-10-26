import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { LangCode } from "@/config/languages";
import { LABOR_ANCILLARY_FEES, type AncillarySection } from "@/lib/labor/ancillary-fees";
import { LABOR_PLAN_COPY } from "@/lib/labor/plan-copy";
import { getLaborPriceStructuredData } from "@/lib/labor/structured-data";

const state = vi.hoisted(() => ({ locale: "ja" as LangCode }));
vi.mock("@/lib/getRequestLocale", () => ({ getRequestLocale: async () => state.locale }));
vi.mock("@/components/shared/Breadcrumb", () => ({ Breadcrumb: () => null }));
vi.mock("@/components/shared/CtaBand", () => ({ CtaBand: () => null }));
vi.mock("@/components/shared/CrossLinkBanner", () => ({ CrossLinkBanner: () => null }));
import Prices from "@/app/[locale]/(labor)/labor/ryokin/page";

const SCOPE = {
  ja: ["亡くなった方1名・代表請求者1名", "人数を乗じません", "事前のお見積り", "生計同一関係", "必要な死亡届", "通常の補正", "翻訳・証明書取得・認証・国際郵送", "特別調査", "複数基金・共済", "遺族年金の新規請求", "脱退一時金", "不服申立て", "返納金そのものや立替送金は含みません", "重複加算しません", "支給を保証せず", "資格者が個別に確認", "別受任・別契約・別請求", "同一業務を二重請求しません"],
  en: ["one deceased pension recipient and one representative claimant", "not multiplied", "advance estimate", "shared livelihood", "required death notification", "routine corrections", "translation, certificate retrieval, authentication, international postage", "special investigations", "multiple pension funds or mutual-aid associations", "new survivors’ pension claims", "lump-sum withdrawal payments", "appeals", "repayment amount itself", "not added together", "not guaranteed", "qualified professional", "separate contract and invoice", "not charged twice"],
  "zh-tw": ["亡者1名、代表請求人1名", "不乘以", "事前報價", "生計同一關係", "必要的死亡申報", "通常的補正", "翻譯、證明書取得、認證、國際郵寄", "特別調查", "多個年金基金或共濟", "新申請遺屬年金", "脫退一時金", "不服申訴", "不包含返還款項本身", "不重複加收", "不保證", "資格者", "分別受任、分別簽約及請款", "同一業務不重複收費"],
  zh: ["逝者1名、代表请求人1名", "不乘以", "事前报价", "生计同一关系", "必要的死亡申报", "通常的补正", "翻译、证明书取得、认证、国际邮寄", "特别调查", "多个养老金基金或共济", "新申请遗属养老金", "脱退一时金", "不服申诉", "不包含返还款项本身", "不重复加收", "不保证", "资格者", "分别受任、分别签约及请款", "同一业务不重复收费"],
};

for (const locale of ["ja", "en", "zh-tw", "zh"] as const) {
  describe(`死亡後の年金手続報酬 (${locale})`, () => {
    const sections: AncillarySection[] = LABOR_ANCILLARY_FEES[locale].sections;
    const section = sections.find(s => s.id === "post-death-pension")!;

    it("1事案の55,000円と返納のみ16,500円〜を対象範囲とともに表示する", async () => {
      state.locale = locale;
      const html = renderToStaticMarkup(await Prices());
      const visible = html.match(/<section[^>]*id="post-death-pension"[^>]*>([\s\S]*?)<\/section>/)![1];
      const escape = (text: string) => renderToStaticMarkup(<>{text}</>);
      expect(section.rows).toHaveLength(2);
      expect(section.rows[0].value).toBe(55000);
      expect(section.rows[0].price).toMatch(/55,000/);
      expect(section.rows[1].price).toMatch(/16,500/);
      expect(section.rows[1].price).toMatch(/〜|From|起/);
      expect(section.rows[1].value).toBeUndefined();
      for (const row of section.rows) {
        expect(visible).toContain(escape(row.name));
        expect(visible).toContain(escape(row.unit));
        expect(visible).toContain(escape(row.price));
      }
      expect(visible).toContain(LABOR_PLAN_COPY[locale].tax);
      for (const phrase of SCOPE[locale]) expect(visible).toContain(escape(phrase));
    });

    it("税込55,000円は1事案の単価にし、16,500円〜を確定総額Offerにしない", () => {
      const offers = getLaborPriceStructuredData(locale).offers;
      const newOffers = offers.filter(offer => offer.name.startsWith(`${section.title} / `));
      expect(newOffers).toHaveLength(1);
      expect(newOffers[0].name).toContain(section.rows[0].name);
      expect(newOffers[0].priceSpecification).toEqual({
        "@type": "UnitPriceSpecification", price: 55000, priceCurrency: "JPY", valueAddedTaxIncluded: true,
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitText: section.rows[0].priceUnit },
      });
      expect(offers.some(offer => offer.name.includes(section.rows[1].name))).toBe(false);
    });

    it("既存障害年金と脱退一時金の報酬を保持する", () => {
      const disability = sections.find(s => s.rows.some(r => r.price.includes("30,000")))!;
      expect(disability.rows).toHaveLength(3);
      expect(disability.rows[0].price).toContain("30,000");
      expect(disability.rows[0].price).toContain("3");
      expect(disability.rows[1].price).toContain("15%");
      const withdrawal = sections.find(s => s.id === "dattai-ichijikin")!;
      expect(withdrawal.rows[0].value).toBe(44000);
      expect(withdrawal.rows[0].price).toContain("44,000");
    });
  });
}
