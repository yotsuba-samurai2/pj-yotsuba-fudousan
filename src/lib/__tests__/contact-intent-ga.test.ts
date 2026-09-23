// 問い合わせ送信完了（contact_submit）に来訪元 intent を付ける（2026-09-23）
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contactIntentParam } from "@/lib/gtag";

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
});

describe("ContactForm", () => {
  it("送信完了イベントに intent を付ける", () => {
    const submit = FORM.slice(FORM.indexOf('gaEvent("contact_submit", {'), FORM.indexOf("router.push("));
    expect(submit).toContain("intent: intentParam");
    expect(FORM).toContain("setIntentParam(contactIntentParam(intent))");
  });
});
