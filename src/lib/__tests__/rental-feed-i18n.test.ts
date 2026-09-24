import { describe, expect, it } from "vitest";
import { localizeRentalValue as t } from "@/lib/rental-feed-i18n";

// 2026-09-24 全ページ点検 #3：本番の募集比較一覧に実在した値から採った例
describe("募集比較一覧の値の訳（型の決まった値だけ）", () => {
  it("建物種別・構造・契約種別・期間", () => {
    expect(t("マンション", "en")).toBe("Apartment building");
    expect(t("ＲＣ", "zh-tw")).toBe("RC（鋼筋混凝土）");
    expect(t("定期借家権", "zh")).toBe("定期租赁");
    expect(t("2年", "en")).toBe("2 years");
    expect(t("1年", "en")).toBe("1 year");
  });

  it("月数・万円は数値を変えずに訳す", () => {
    expect(t("1ヶ月", "en")).toBe("1 month's rent");
    expect(t("2ヶ月", "en")).toBe("2 months' rent");
    expect(t("1.5ヶ月", "zh-tw")).toBe("1.5個月租金");
    expect(t("30.2万円", "en")).toBe("¥302,000");
    expect(t("8.17万円", "zh")).toBe("81,700日元");
    expect(t("39.4万円", "zh-tw")).toBe("394,000日圓");
  });

  it("築年月・入居時期・階数", () => {
    expect(t("2025年（令和 7年）12月", "en")).toBe("December 2025");
    expect(t("1998年（平成10年） 1月", "zh")).toBe("1998年1月");
    expect(t("予定 / 令和 8年10月", "en")).toBe("Planned: October 2026");
    expect(t("期日指定 / 令和 9年 3月", "zh-tw")).toBe("指定日期：2027年3月");
    expect(t("即時", "en")).toBe("Immediately");
    expect(t("地上5階 / 所在4階", "en")).toBe("5 floors above ground / unit on floor 4");
  });

  it("交通", () => {
    expect(t("有楽町線 護国寺 徒歩4分", "en")).toBe("Yurakucho Line, Gokokuji Station, 4 min walk");
    expect(t("丸ノ内線 茗荷谷 徒歩8分", "zh-tw")).toBe("丸之內線「茗荷谷」站 步行8分鐘");
    // 辞書にない路線・駅は原文を残す（情報を落とさない）
    expect(t("架空線 架空駅 徒歩3分", "en")).toBe("架空線, 架空駅 Station, 3 min walk");
  });

  it("保険：加入義務と金額は訳し、保険会社名は原文", () => {
    expect(t("加入義務：有 / 住宅総合保険 / 16,550円 / 2年", "en")).toBe("Required / Comprehensive home insurance / ¥16,550 / 2 years");
    expect(t("加入義務：無", "zh")).toBe("无须投保");
    expect(t("加入義務：有 / 東京海上ミレア少額短期保険（株）※貸主指定 / 21,500円 / 2年", "zh-tw")).toBe(
      "必須投保 / 東京海上ミレア少額短期保険（株）※貸主指定 / 21,500日圓 / 2年",
    );
  });

  it("その他費用：項目名と金額を訳し、商品名は原文", () => {
    expect(t("清掃費：8.17万円 / エアコン清掃費：6.6万円", "en")).toBe("Cleaning fee: ¥81,700 / Air-conditioner cleaning fee: ¥66,000");
    expect(t("虫駆除サービス：1.65万円 / 除菌・消臭サービス：1.65万円 / 月額：髙松あんしんサポート 0.17万円", "zh-tw")).toBe(
      "驅蟲服務：16,500日圓 / 除菌・除臭服務：16,500日圓 / 每月：髙松あんしんサポート 1,700日圓",
    );
  });

  it("ja と空文字・型に当てはまらない条件文はそのまま", () => {
    expect(t("マンション", "ja")).toBe("マンション");
    expect(t("", "en")).toBe("");
    const free = "ペット相談。 ペット飼育可（敷金１ヶ月積み増し、退去時償却）";
    expect(t(free, "en")).toBe(free);
  });
});
