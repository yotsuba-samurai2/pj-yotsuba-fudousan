// 問い合わせ送信完了（contact_submit）に来訪元 intent を付ける（2026-09-23）
import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { contactIntentParam, gaEvent } from "@/lib/gtag";
import { listSchools } from "@/lib/school-district";
import { CATEGORY_ORDER_BY_BUSINESS, CATEGORY_ORDER_DEFAULT } from "@/lib/shared/contact-intake";
import { MINPAKU_PURCHASE_INTENT } from "@/lib/shared/minpaku-purchase";

const FORM = fs.readFileSync(path.join(process.cwd(), "src/components/ui/ContactForm.tsx"), "utf8");

describe("contactIntentParam", () => {
  it("学区・物件などの既存 intent はそのまま通す", () => {
    expect(contactIntentParam("gakku-seishi-rental")).toBe("gakku-seishi-rental");
    expect(contactIntentParam("gakku-kohinatadaimachi-rental")).toBe("gakku-kohinatadaimachi-rental");
    expect(contactIntentParam("bukken-general")).toBe("bukken-general");
    expect(contactIntentParam("gakku")).toBe("gakku");
  });
  it("無ければ none、形の違う値（自由入力の混入）は other に丸める", () => {
    expect(contactIntentParam(null)).toBe("none");
    expect(contactIntentParam("")).toBe("none");
    expect(contactIntentParam("山田太郎")).toBe("other");
    expect(contactIntentParam("a@b.com")).toBe("other");
    expect(contactIntentParam("Gakku-Seishi")).toBe("other");
    expect(contactIntentParam("x".repeat(51))).toBe("other");
  });
  it("英数字の氏名・電話・顧客ID・受付番号でも既知CTAでなければother", () => {
    for (const value of ["taro-yamada", "09012345678", "client-123456", "y261025-7k3f", "john-smith-at-example-com", "ad100", "gakku-taro-yamada-rental", "gakku-seishi-rental-client-1"])
      expect(contactIntentParam(value)).toBe("other");
  });
  it("学校catalogの全20校×既存3経路を保持し未登録suffixを通さない", () => {
    expect(listSchools()).toHaveLength(20);
    for (const school of listSchools()) {
      for (const suffix of ["", "-rental", "-sale"]) {
        const value = `gakku-${school.slug}${suffix}`; expect(contactIntentParam(value)).toBe(value);
      }
      expect(contactIntentParam(`gakku-${school.slug}-private`)).toBe("other");
    }
  });
  it("既存の相談categoryと静的CTAを保持する", () => {
    const values = new Set([...Object.values(CATEGORY_ORDER_BY_BUSINESS).flat(), ...CATEGORY_ORDER_DEFAULT,
      "bukken-general", "bukken-gh", "gh-owner-page", MINPAKU_PURCHASE_INTENT]);
    for (const value of values) expect(contactIntentParam(value)).toBe(value);
  });
  it("余白・大文字・エンコード値を勝手に正規化して既知CTAへ変えない", () => {
    for (const value of [" bukken", "bukken ", "BUKKEN", "%62ukken", "gakku%2Dseishi", "bukken\n", "bukken\0"])
      expect(contactIntentParam(value)).toBe("other");
  });
});

afterEach(() => vi.unstubAllGlobals());
it("gtagへ渡るcustom intentは許可値だけで元の識別情報を含めない", () => {
  const gtag = vi.fn(); vi.stubGlobal("window", { gtag });
  gaEvent("contact_submit", { business: "realestate", intent: contactIntentParam("client-123456") });
  expect(gtag).toHaveBeenCalledWith("event", "contact_submit", { transport_type: "beacon", business: "realestate", intent: "other" });
  expect(JSON.stringify(gtag.mock.calls)).not.toContain("client-123456");
  gaEvent("contact_submit", { intent: contactIntentParam("gakku-seishi-rental") });
  expect(gtag).toHaveBeenLastCalledWith("event", "contact_submit", { transport_type: "beacon", intent: "gakku-seishi-rental" });
});

describe("ContactForm", () => {
  it("送信完了イベントに intent を付ける", () => {
    const submit = FORM.slice(FORM.indexOf('gaEvent("contact_submit", {'), FORM.indexOf("router.push("));
    expect(submit).toContain("intent: intentParam");
    expect(FORM).toContain("setIntentParam(contactIntentParam(intent))");
  });
});
