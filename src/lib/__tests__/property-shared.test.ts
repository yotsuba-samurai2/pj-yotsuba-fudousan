import { describe, it, expect } from "vitest";
import {
  walkMinutes,
  formatAccess,
  formatPriceYen,
  toPublicProperty,
  buildRequiredDisplayRows,
  isStaleListing,
  daysSince,
  defaultNextUpdateAt,
  isListable,
  filterListable,
  scanPropertyText,
  getLocalizedProperty,
  isPropertyLocaleAllowed,
  type AdminProperty,
  type PublicProperty,
} from "@/lib/property-shared";

/** テスト用のadmin物件（internal＝公開してはならない業者間情報入り） */
function makeAdmin(overrides: Partial<AdminProperty> = {}): AdminProperty {
  return {
    id: "test-id-123",
    slug: "test-house",
    status: "published",
    dealType: "house",
    category: "gh",
    tradeMode: "broker",
    title: "テスト戸建",
    priceYen: 58_000_000,
    priceNote: "税込",
    locationText: "東京都文京区小日向",
    access: [{ line: "東京メトロ丸ノ内線", station: "茗荷谷", distanceM: 400 }],
    spec: {
      dealType: "house",
      landAreaSqm: 85.12,
      privateRoadAreaSqm: 0,
      buildingAreaSqm: 92.34,
      builtYm: "2005-03",
      deliveryYm: "即時（相談）",
    },
    images: [{ url: "https://example.supabase.co/x.webp", alt: "外観" }],
    description: "テスト用の説明",
    publishedAt: "2026-09-01",
    infoUpdatedAt: "2026-09-01",
    nextUpdateAt: "2026-09-15",
    locales: ["ja"],
    internal: {
      sourceType: "permitted",
      memo: "元付：株式会社ヒミツ不動産 AD100 配分50:50",
    },
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("walkMinutes（規約施行規則第9条(9)：80m=1分・端数切り上げ）", () => {
  it("80m→1分・81m→2分・400m→5分", () => {
    expect(walkMinutes(80)).toBe(1);
    expect(walkMinutes(81)).toBe(2);
    expect(walkMinutes(400)).toBe(5);
  });
  it("1分未満の端数は1分に切り上げ（40m→1分）", () => {
    expect(walkMinutes(40)).toBe(1);
    expect(walkMinutes(1)).toBe(1);
  });
  it("不正値は最小1分", () => {
    expect(walkMinutes(0)).toBe(1);
    expect(walkMinutes(-5)).toBe(1);
    expect(walkMinutes(NaN)).toBe(1);
  });
  it("formatAccess が道路距離（算出根拠）を含む", () => {
    const s = formatAccess({ line: "丸ノ内線", station: "茗荷谷", distanceM: 400 });
    expect(s).toContain("徒歩5分");
    expect(s).toContain("400m");
  });
});

describe("toPublicProperty（ホワイトリスト変換＝業者間情報の非流出）", () => {
  it("internal・id・createdAt/updatedAt が公開ビューに一切現れない", () => {
    const pub = toPublicProperty(makeAdmin());
    const json = JSON.stringify(pub);
    expect(json).not.toContain("internal");
    expect(json).not.toContain("ヒミツ不動産");
    expect(json).not.toContain("AD100");
    expect(json).not.toContain("permitted");
    expect(json).not.toContain("test-id-123");
    expect(Object.keys(pub)).not.toContain("internal");
    expect(Object.keys(pub)).not.toContain("id");
    expect(Object.keys(pub)).not.toContain("createdAt");
  });
  it("locales 未設定は ja に既定される", () => {
    const pub = toPublicProperty(makeAdmin({ locales: [] }));
    expect(pub.locales).toEqual(["ja"]);
  });
});

describe("buildRequiredDisplayRows（別表のインターネット広告列・原本目視2026-09-01）", () => {
  const keys = (p: PublicProperty) => buildRequiredDisplayRows(p).map((r) => r.key);

  it("共通：取引態様・所在地・交通・価格", () => {
    const pub = toPublicProperty(makeAdmin());
    const k = keys(pub);
    for (const key of ["tradeMode", "location", "access", "price"]) {
      expect(k).toContain(key);
    }
  });

  it("土地（別表3）：面積・私道負担・地目・用途地域・建ぺい率・容積率・法令制限", () => {
    const pub = toPublicProperty(
      makeAdmin({
        dealType: "land",
        spec: {
          dealType: "land",
          landAreaSqm: 100,
          privateRoadAreaSqm: 5,
          landCategory: "宅地",
          zoning: "第一種住居地域",
          buildingCoverage: "60%",
          floorAreaRatio: "200%",
          legalRestrictions: "なし",
        },
      }),
    );
    const k = keys(pub);
    for (const key of [
      "landArea",
      "privateRoad",
      "landCategory",
      "zoning",
      "buildingCoverage",
      "floorAreaRatio",
      "legalRestrictions",
    ]) {
      expect(k).toContain(key);
    }
  });

  it("戸建（別表5）：土地・私道負担・建物面積・建築年月・引渡し可能年月", () => {
    const pub = toPublicProperty(makeAdmin());
    const k = keys(pub);
    for (const key of ["landArea", "privateRoad", "buildingArea", "builtYm", "deliveryYm"]) {
      expect(k).toContain(key);
    }
  });

  it("私道負担0は「なし」と表示（省略しない）", () => {
    const rows = buildRequiredDisplayRows(toPublicProperty(makeAdmin()));
    const row = rows.find((r) => r.key === "privateRoad");
    expect(row?.value).toBe("なし");
  });

  it("マンション（別表7）：階数・所在階・専有面積・バルコニー・管理費・修繕積立金・管理形態・勤務形態", () => {
    const pub = toPublicProperty(
      makeAdmin({
        dealType: "condo",
        spec: {
          dealType: "condo",
          floors: "地上10階建",
          floorLocated: "5階",
          exclusiveAreaSqm: 60.5,
          balconyAreaSqm: 8.2,
          builtYm: "2010-05",
          deliveryYm: "2026-10",
          managementFee: "月額12,000円",
          repairReserve: "月額9,000円",
          managementForm: "全部委託",
          managerWorkStyle: "日勤",
        },
      }),
    );
    const k = keys(pub);
    for (const key of [
      "floors",
      "floorLocated",
      "exclusiveArea",
      "balconyArea",
      "builtYm",
      "deliveryYm",
      "managementFee",
      "repairReserve",
      "managementForm",
      "managerWorkStyle",
    ]) {
      expect(k).toContain(key);
    }
  });

  it("一棟売り（別表5-17）：その旨・住戸数・専有面積最小最大・構造・階数", () => {
    const pub = toPublicProperty(
      makeAdmin({
        dealType: "wholeBuilding",
        spec: {
          dealType: "wholeBuilding",
          landAreaSqm: 120,
          privateRoadAreaSqm: 0,
          buildingAreaSqm: 300,
          builtYm: "2000-01",
          deliveryYm: "相談",
          unitCount: 6,
          unitAreaMinSqm: 20,
          unitAreaMaxSqm: 35,
          structure: "鉄筋コンクリート造",
          floors: "地上3階建",
        },
      }),
    );
    const k = keys(pub);
    for (const key of ["wholeBuilding", "unitCount", "unitArea", "structure", "floors"]) {
      expect(k).toContain(key);
    }
  });

  it("借地の場合はその旨の行が出る／所有権では出ない", () => {
    const own = keys(toPublicProperty(makeAdmin()));
    expect(own).not.toContain("leasehold");
    const lease = keys(
      toPublicProperty(
        makeAdmin({
          spec: {
            dealType: "house",
            landAreaSqm: 85,
            privateRoadAreaSqm: 0,
            buildingAreaSqm: 92,
            builtYm: "2005-03",
            deliveryYm: "即時",
            leasehold: "旧法借地権・期間20年・保証金なし",
          },
        }),
      ),
    );
    expect(lease).toContain("leasehold");
  });
});

describe("鮮度（おとり広告の構造的回避）", () => {
  const now = new Date("2026-09-10T12:00:00+09:00");
  it("情報更新日から7日超の公開物件を警告対象にする", () => {
    expect(isStaleListing({ status: "published", infoUpdatedAt: "2026-09-01" }, now)).toBe(true);
    expect(isStaleListing({ status: "published", infoUpdatedAt: "2026-09-05" }, now)).toBe(false);
  });
  it("下書き・成約済みは警告しない", () => {
    expect(isStaleListing({ status: "draft", infoUpdatedAt: "2026-08-01" }, now)).toBe(false);
    expect(isStaleListing({ status: "closed", infoUpdatedAt: "2026-08-01" }, now)).toBe(false);
  });
  it("daysSince は日数を返す", () => {
    expect(daysSince("2026-09-01", now)).toBe(9);
  });
  it("次回更新予定日の既定は更新日+14日（浦松承認④）", () => {
    expect(defaultNextUpdateAt("2026-09-01")).toBe("2026-09-15");
  });
});

describe("収載判定（closed/draft を一覧・sitemapに出さない）", () => {
  it("published のみ isListable", () => {
    expect(isListable({ status: "published" })).toBe(true);
    expect(isListable({ status: "closed" })).toBe(false);
    expect(isListable({ status: "draft" })).toBe(false);
  });
  it("filterListable は closed・draft を除外する", () => {
    const list = filterListable([
      { status: "published" as const, slug: "a" },
      { status: "closed" as const, slug: "b" },
      { status: "draft" as const, slug: "c" },
    ]);
    expect(list.map((p) => p.slug)).toEqual(["a"]);
  });
});

describe("禁止語スキャン（規約第18条・特定用語＋業者間用語）", () => {
  it("特定用語を検出する", () => {
    const hits = scanPropertyText("格安の掘り出し物件！完璧な立地");
    const terms = hits.map((h) => h.term);
    expect(terms).toContain("格安");
    expect(terms).toContain("掘り出し");
    expect(terms).toContain("完璧");
  });
  it("業者間用語を検出する", () => {
    const terms = scanPropertyText("元付に確認中。AD 100。レインズ掲載済").map((h) => h.term);
    expect(terms).toContain("元付");
    expect(terms).toContain("AD");
    expect(terms).toContain("レインズ");
  });
  it("通常の物件説明はヒットしない（ADSL等の誤検知もしない）", () => {
    expect(scanPropertyText("閑静な住宅街の中古戸建です。ADSL対応。")).toEqual([]);
  });
});

describe("ロケール", () => {
  it("locales=['ja'] の物件は ja のみ許可", () => {
    const pub = toPublicProperty(makeAdmin());
    expect(isPropertyLocaleAllowed(pub, "ja")).toBe(true);
    expect(isPropertyLocaleAllowed(pub, "en")).toBe(false);
  });
  it("translations があれば title/description/locationText を差し替える", () => {
    const pub = toPublicProperty(
      makeAdmin({
        locales: ["ja", "en"],
        translations: {
          en: { title: "Test House", description: "For sale", locationText: "Kohinata, Bunkyo-ku" },
        },
      }),
    );
    const en = getLocalizedProperty(pub, "en");
    expect(en.title).toBe("Test House");
    expect(en.locationText).toBe("Kohinata, Bunkyo-ku");
    const ja = getLocalizedProperty(pub, "ja");
    expect(ja.title).toBe("テスト戸建");
  });
});

describe("価格表示", () => {
  it("万円・億円表記（BigInt由来の大きな値も桁あふれしない）", () => {
    expect(formatPriceYen(58_000_000)).toBe("5,800万円");
    expect(formatPriceYen(2_140_000_000)).toBe("21億4,000万円"); // Int32上限相当の額
    expect(formatPriceYen(30_000_000_000)).toBe("300億円");
  });
});
