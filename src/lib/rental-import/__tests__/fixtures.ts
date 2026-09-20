import type { RentalImport } from "../validation";
export const NOW = new Date("2026-09-20T01:00:00.000Z");
export function fixture(): RentalImport & { reins: NonNullable<RentalImport["reins"]>; photoPermission: NonNullable<RentalImport["photoPermission"]> } {
  const evidence = { checkedAt: NOW.toISOString(), reference: "REINS詳細・物件番号test-100", quote: "広告可" };
  return {
    version: 1,
    email: { messageId: "mail-1", receivedAt: "2026-09-19T00:00:00Z", adQuote: "AD2ヶ月" },
    source: { provider: "itandi", roomId: "123", url: "https://itandibb.com/rent_rooms/123", building: "検証用マンション", address: "東京都文京区検証町1-2-3", unit: "001", availability: "available", checkedAt: NOW.toISOString(), listingEvidence: { ...evidence, reference: "https://itandibb.com/rent_rooms/123", quote: "募集中・001号室", authenticated: true, siteOperational: true, exactRoomMatched: true }, adQuote: "広告費200%" },
    reins: { propertyId: "test-100", building: "検証用マンション", address: "東京都文京区検証町1-2-3", unit: "001", advertising: "allowed", evidence, availability: "available", listingEvidence: { ...evidence, reference: "https://system.reins.jp/", quote: "掲載中・test-100・001号室", authenticated: true, siteOperational: true, exactRoomMatched: true } },
    photoPermission: { status: "allowed", evidence: { ...evidence, quote: "物件写真・間取りの自社HP転載可" } },
    conflicts: [],
    portalChecks: (["suumo", "athome", "homes"] as const).map((portal) => ({ portal, checkedAt: NOW.toISOString(), coverage: "complete" as const, searchUrl: `https://${portal === "suumo" ? "suumo.jp" : portal === "athome" ? "www.athome.co.jp" : "www.homes.co.jp"}/`, note: "匿名テスト用・検索0件", listings: [] })),
    property: { slug: "ignored", status: "draft", dealType: "rental", category: "other", tradeMode: "broker", title: "検証用マンション 001", priceYen: 85500, locationText: "東京都文京区検証町1-2-3", access: [],
      spec: { dealType: "rental", buildingType: "マンション", layout: "1LDK", exclusiveAreaSqm: 35.5, structure: "RC", floors: "地上3階", floorLocated: "1階", builtYm: "2020-04", deliveryYm: "即入居可", accessText: "検証線 検証駅 徒歩9分", managementFee: "月額5,000円", deposit: "1ヶ月", keyMoney: "なし", guaranteeDeposit: "なし", renewalFee: "1ヶ月", insurance: "加入必須", guarantor: "必須 初回賃料等の50%・年間1万円", otherFees: "鍵交換22,000円（税込）", contractType: "普通借家", contractPeriod: "2年", conditions: "ペット不可" },
      images: [{ url: "https://demo.supabase.co/storage/v1/object/public/column-images/bukken/auto/photo.jpg", alt: "建物外観", kind: "photo" }, { url: "https://demo.supabase.co/storage/v1/object/public/column-images/bukken/auto/plan.jpg", alt: "001号室 間取り", kind: "floorplan" }], description: "駅から徒歩9分。バス・トイレ別。", infoUpdatedAt: "2026-09-20", nextUpdateAt: "2026-09-21", locales: ["ja"],
    },
  };
}
