import { describe, expect, it } from "vitest";
import { buildGhOwnerMessage, propertyTypeParam } from "@/lib/shared/gh-owner-intake";

// 期待出力は docs/gh-owner/20_form.md「送信本文（message）の整形」と一致させる。
describe("buildGhOwnerMessage（大家募集フォームの送信本文）", () => {
  it("全項目ありのとき、通知メールでそのまま読める1行1項目の本文になる", () => {
    const message = buildGhOwnerMessage({
      address: "文京区小日向",
      propertyType: "kodate",
      layout: "4LDK（居室4）",
      floorArea: "110",
      usage: "vacant",
      rent: "未定",
      hasDrawings: true,
      note: "相続した実家です。",
    });
    expect(message).toBe(
      [
        "【グループホーム向け物件のご相談】",
        "所在地：文京区小日向",
        "種別：戸建て",
        "間取り・部屋数：4LDK（居室4）",
        "延床面積：110㎡",
        "利用状況：空室・空き家",
        "希望賃料：未定",
        "図面・資料：あり（LINE またはメールで送付）",
        "備考：相続した実家です。",
      ].join("\n"),
    );
  });

  it("任意項目が空のときは「未入力」と書き、図面なしは「なし」になる", () => {
    const message = buildGhOwnerMessage({
      address: " 文京区小日向 ",
      propertyType: "kodate",
      layout: "",
      floorArea: "  ",
      usage: "",
      rent: "",
      hasDrawings: false,
      note: "",
    });
    expect(message).toBe(
      [
        "【グループホーム向け物件のご相談】",
        "所在地：文京区小日向",
        "種別：戸建て",
        "間取り・部屋数：未入力",
        "延床面積：未入力",
        "利用状況：未入力",
        "希望賃料：未入力",
        "図面・資料：なし",
        "備考：未入力",
      ].join("\n"),
    );
  });

  it("延床面積は数値だけなら㎡を補い、単位付きの入力はそのまま残す", () => {
    const base = { address: "文京区", propertyType: "apart", layout: "", usage: "", rent: "", hasDrawings: false, note: "" };
    expect(buildGhOwnerMessage({ ...base, floorArea: "98.5" })).toContain("延床面積：98.5㎡");
    expect(buildGhOwnerMessage({ ...base, floorArea: "約30坪" })).toContain("延床面積：約30坪");
  });

  it("GA4 の property_type は選択肢のキーだけを通し、それ以外は other に丸める", () => {
    expect(propertyTypeParam("kodate")).toBe("kodate");
    expect(propertyTypeParam("")).toBe("other");
    expect(propertyTypeParam("<script>")).toBe("other");
  });
});
