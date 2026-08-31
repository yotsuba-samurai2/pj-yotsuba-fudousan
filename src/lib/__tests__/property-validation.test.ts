import { describe, it, expect } from "vitest";
import {
  parsePropertyInput,
  parsePropertyPatch,
  bannedTermsError,
} from "@/lib/property-validation";

const validHouse = {
  slug: "test-house",
  status: "draft",
  dealType: "house",
  category: "gh",
  tradeMode: "broker",
  title: "テスト戸建",
  priceYen: 58_000_000,
  locationText: "東京都文京区小日向",
  access: [{ line: "丸ノ内線", station: "茗荷谷", distanceM: 400 }],
  spec: {
    dealType: "house",
    landAreaSqm: 85.12,
    privateRoadAreaSqm: 0,
    buildingAreaSqm: 92.34,
    builtYm: "2005-03",
    deliveryYm: "即時",
  },
  images: [],
  description: "説明",
  infoUpdatedAt: "2026-09-01",
  nextUpdateAt: "2026-09-15",
  locales: ["ja"],
};

describe("parsePropertyInput", () => {
  it("正しい入力を受け付ける", () => {
    const r = parsePropertyInput(validHouse);
    expect(r.ok).toBe(true);
  });

  it("種別ごとの必須項目の欠落を拒否する（戸建で建物面積なし）", () => {
    const { buildingAreaSqm: _omit, ...spec } = validHouse.spec;
    const r = parsePropertyInput({ ...validHouse, spec });
    expect(r.ok).toBe(false);
  });

  it("土地は地目・用途地域・建ぺい率・容積率・法令制限が必須（別表3）", () => {
    const r = parsePropertyInput({
      ...validHouse,
      dealType: "land",
      spec: { dealType: "land", landAreaSqm: 100, privateRoadAreaSqm: 0 },
    });
    expect(r.ok).toBe(false);
    const ok = parsePropertyInput({
      ...validHouse,
      dealType: "land",
      spec: {
        dealType: "land",
        landAreaSqm: 100,
        privateRoadAreaSqm: 0,
        landCategory: "宅地",
        zoning: "第一種住居地域",
        buildingCoverage: "60%",
        floorAreaRatio: "200%",
        legalRestrictions: "なし",
      },
    });
    expect(ok.ok).toBe(true);
  });

  it("dealType と spec.dealType の食い違いを拒否する", () => {
    const r = parsePropertyInput({ ...validHouse, dealType: "condo" });
    expect(r.ok).toBe(false);
  });

  it("priceYen は正の整数（0・負値を拒否）", () => {
    expect(parsePropertyInput({ ...validHouse, priceYen: 0 }).ok).toBe(false);
    expect(parsePropertyInput({ ...validHouse, priceYen: -1 }).ok).toBe(false);
    // Int32上限（21.4億）超も受け付ける（DBはBigInt＝浦松修正指示2）
    expect(parsePropertyInput({ ...validHouse, priceYen: 3_000_000_000 }).ok).toBe(true);
  });

  it("slug の形式・日付の形式を検証する", () => {
    expect(parsePropertyInput({ ...validHouse, slug: "日本語スラッグ" }).ok).toBe(false);
    expect(parsePropertyInput({ ...validHouse, infoUpdatedAt: "2026/09/01" }).ok).toBe(false);
  });
});

describe("parsePropertyPatch", () => {
  it("部分更新を受け付ける（成約処理＝statusのみ）", () => {
    const r = parsePropertyPatch({ status: "closed", infoUpdatedAt: "2026-09-10" });
    expect(r.ok).toBe(true);
  });
  it("不正なstatusを拒否する", () => {
    expect(parsePropertyPatch({ status: "deleted" }).ok).toBe(false);
  });
});

describe("bannedTermsError（公開時ゲート）", () => {
  it("published で禁止語があれば拒否メッセージを返す", () => {
    const msg = bannedTermsError({
      status: "published",
      title: "格安の戸建",
      description: "説明",
    });
    expect(msg).toContain("格安");
  });
  it("draft なら禁止語があってもnull（保存は許す＝フォーム側で警告）", () => {
    expect(
      bannedTermsError({ status: "draft", title: "格安の戸建", description: "" }),
    ).toBeNull();
  });
  it("クリーンな公開はnull", () => {
    expect(
      bannedTermsError({ status: "published", title: "小日向の戸建", description: "閑静な住宅街" }),
    ).toBeNull();
  });
});
