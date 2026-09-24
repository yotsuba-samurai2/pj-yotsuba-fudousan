// ペット横断 指示書 版2.0 第11・12・18章・受入テスト T19・T21・T22・T24：ペット住宅フォーム
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PetOwnerForm } from "@/components/pet/PetOwnerForm";
import { PetRenterForm } from "@/components/pet/PetRenterForm";
import { PetHousingCta } from "@/components/pet/PetHousingCta";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => "/pet-housing" }));

const source = (file: string) => readFileSync(resolve(__dirname, "../../components/pet", file), "utf8");
const render = (c: () => unknown) => renderToStaticMarkup(createElement(c as never));

describe("フォームの表示", () => {
  it("借り手：必須項目・隠し欄・保存期間の明記。共有の同意欄は最初は出さない", () => {
    const html = render(PetRenterForm);
    expect(html).toContain('id="renter-form"');
    for (const label of ["お名前（受付名）", "賃貸／購入", "希望エリア", "動物の種類", "頭数"]) expect(html).toContain(label);
    expect(html).toContain('name="hp_field"');
    expect(html).toMatch(/aria-hidden="true"[^>]*>\s*<label>この欄は空のままにしてください/);
    expect(html).toContain("受付から1年で、その後削除します");
    expect(html).not.toContain("四葉行政書士事務所に伝えることに同意します");
  });

  it("大家：まだ決めていなくても相談できること、写真・図面は受付後に受け取ることを示す", () => {
    const html = render(PetOwnerForm);
    expect(html).toContain('id="owner-form"');
    expect(html).toContain("まだペット可にすると決めていなくても相談できます");
    expect(html).toContain("図面・写真は送信後に LINE かメールでお送りください");
    expect(html).not.toContain('type="file"');
  });

  it("入口は借り手と大家を分け、それぞれのフォームへ案内する", () => {
    const html = renderToStaticMarkup(createElement(PetHousingCta, { location: "hero" }));
    expect(html).toContain('href="#renter-form"');
    expect(html).toContain('href="#owner-form"');
    expect(html).toContain("多頭飼いできる家を探す");
    expect(html).toContain("ペット飼育者に貸せるか相談する");
  });
});

describe("送信と計測（ソースの確認）", () => {
  const hook = source("usePetInquiry.ts");

  it("完了は /thanks に移動せず、その場に受付番号を出す（受付番号を URL に載せない）", () => {
    expect(hook).not.toMatch(/router\.push|["'`]\/thanks|location\.href\s*=/); // コメントの説明文は対象外
    expect(hook).toContain("setReceiptNo(data.receiptNo)");
  });

  it("GA4 のパラメータは固定の値だけ（入力値を渡さない）", () => {
    const calls = hook.match(/gaEvent\([^)]*\)/g) ?? [];
    expect(calls.length).toBeGreaterThanOrEqual(4);
    for (const call of calls) expect(call).toMatch(/^gaEvent\("contact_(form_start|submit|submit_error)", \{ \.\.\.ga(, kind: "(validation|server|network)")? \}\)$/);
  });

  it("完了の計測はサーバーが受付番号を返したときの1回だけ", () => {
    const success = hook.indexOf('gaEvent("contact_submit", { ...ga })');
    expect(success).toBeGreaterThan(hook.indexOf('res.ok && typeof data.receiptNo === "string"'));
    expect(hook.match(/gaEvent\("contact_submit", /g)).toHaveLength(1);
  });

  it("同じ相談の再送は同じ idempotencyKey を使う（キーは最初の送信で1回だけ作る）", () => {
    expect(hook).toContain("key.current ??= newIdempotencyKey()");
  });

  it("共有の同意は来日予定が「ある」ときだけ送る（欄を閉じた後に残った値で共有しない）", () => {
    expect(source("PetRenterForm.tsx")).toContain('consentShare: f.arrival === "yes" && f.consentShare');
  });
});
