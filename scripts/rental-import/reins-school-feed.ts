/** Convert saved, user-authorized REINS detail DOM snapshots. No login/session or network access. */
import { readFileSync, writeFileSync } from "node:fs";
import { z } from "zod";
import { feedSchema, type FeedRecord } from "../../src/lib/school-rental-feed";

// Blank REINS cells are followed by the next field label, never a synthetic zero.
const labels = new Set(`物件番号|登録年月日|変更年月日|更新年月日|物件種目|新築フラグ|広告転載区分|商号|代表電話番号|問合せ先電話番号|物件問合せ担当者|物件担当者電話番号|Ｅメールアドレス|自社管理欄|賃料|㎡単価|坪単価|敷金|礼金|保証金|権利金|契約期間|償却コード|償却月数|償却率|建物賃貸借区分|建物賃貸借期間|建物賃貸借更新|面積計測方式|使用部分面積|建物面積|不動産ＩＤ（建物）|バルコニー(テラス)面積|都道府県名|所在地名１|所在地名２|所在地名３|建物名|部屋番号|その他所在地表示|沿線名|駅名|駅より徒歩|駅より車|駅よりバス|バス停より徒歩|バス路線名|バス停名称|その他交通手段|交通|間取タイプ|間取部屋数|その他|築年月|建物構造|地上階層|地下階層|所在階|バルコニー方向|増改築年月１|増改築履歴１|増改築年月２|増改築履歴２|[賃貸]棟総戸数|管理組合有無|管理費|うち管理費消費税|共益費|更新区分|更新料|その他一時金なし|その他一時金名称１|金額１|その他一時金名称２|金額２|その他月額費名称|その他月額費金額|駐車場在否|駐車場月額|駐車場月額(最低値)|駐車場月額(最高値)|現況|入居時期|入居年月|取引態様|報酬形態|報酬|負担割合貸主|負担割合借主|配分割合元付|配分割合客付|用途地域|最適用途|接道状況|接道種別|接道接面|接道位置指定|接道方向|接道幅員|保険加入義務|保険名称|保険料|保険期間|設備・条件・住宅性能等|設備(フリースペース)|条件(フリースペース)|鍵交換区分|鍵交換代金|省エネルギー性能|目安光熱費|備考１|備考２|備考３|備考４|ファイル名|説明|土地面積|私道面積|土地権利|接道接面|地目`.split("|"));
function cell(line: string | undefined) {
  const value = line?.match(/^- generic: (.*)$/)?.[1] ?? "";
  if (value.startsWith('"')) { try { return JSON.parse(value) as string; } catch { return ""; } }
  return value;
}
export function extractReinsRecord(raw: string): FeedRecord {
  const lines = raw.split("\n");
  function get(label: string) {
    const index = lines.findIndex(l => l === `- generic: ${label}`);
    if (index < 0) return "";
    const value = cell(lines[index + 1]);
    return labels.has(value) || value === "角部屋" || /^(室[１２３４５]|周辺環境|距離[１２３４５]|時間[１２３４５])/.test(value) ? "" : value;
  }
  const money = (s: string): number | null => {
    s = s.normalize("NFKC").replace(/,/g, "");
    if (/^(なし|無|0円)$/.test(s)) return 0;
    if (!/^\d+(\.\d+)?(万円|円)$/.test(s)) return null;
    return Math.round(parseFloat(s) * (s.endsWith("万円") ? 10000 : 1));
  };
  const notes = [get("条件(フリースペース)"), ...[1,2,3,4].map(n => get(`備考${"１２３４"[n-1]}`))].join("\n");
  const conditions = get("設備・条件・住宅性能等") + "\n" + notes;
  const terms = (pattern: RegExp) => conditions.split(/[\n。◆■★,]/).filter(s => pattern.test(s) && !/広告|ＡＤ|\bAD\b|客付|元付|https?:|@|\d{2,4}[-－]\d{2,4}[-－]\d{3,4}/i.test(s.normalize("NFKC"))).join("。 ").slice(0,1600);
  const classify = (quote: string, subject: string): "allowed" | "consult" | "not-allowed" | "unknown" => {
    if (new RegExp(`(?:${subject})[^。\n,、]{0,10}(不可|禁止|お断り)`).test(quote)) return "not-allowed";
    if (new RegExp(`(?:${subject})[^。\n,、]{0,10}(相談|条件|場合|飼育時|契約時)`).test(quote)) return "consult";
    if (new RegExp(`(?:${subject})[^。\n,、]{0,10}可`).test(quote)) return "allowed";
    return quote ? "consult" : "unknown";
  };
  const petTerms = terms(/ペット|小型犬|猫|ネコ/), foreignTerms = terms(/外国|留学生|海外審査/), corporateTerms = terms(/法人|社宅/);
  const adQuote = notes.split("\n").filter(n => /広告費|ＡＤ|\bAD\b/i.test(n)).join("\n").slice(0,1600);
  const positiveAd = /(?:広告費|AD)\s*[:：]?\s*(?:賃料の)?(?:[1-9]\d*(?:\.\d+)?|0\.[1-9]\d*)(?:%|ヶ月|か月|万円|円)/i.test(adQuote.normalize("NFKC"));
  const rent = money(get("賃料"));
  const area = parseFloat((get("使用部分面積") || get("建物面積")).replace(/,/g,""));
  if (rent === null || !Number.isFinite(area)) throw new Error(`賃料・面積を読めません: ${get("物件番号")}`);
  const advertisement = get("広告転載区分");
  const insurance = [get("保険加入義務") ? `加入義務：${get("保険加入義務")}` : "", get("保険名称"), get("保険料"), get("保険期間")].filter(Boolean).join(" / ");
  const fees = [1,2].map(n => [get(`その他一時金名称${n === 1 ? "１" : "２"}`), get(`金額${n === 1 ? "１" : "２"}`)].filter(Boolean).join("：")).filter(Boolean);
  if (get("その他月額費名称") || get("その他月額費金額")) fees.push(`月額：${get("その他月額費名称")} ${get("その他月額費金額")}`);
  return {
    sourceId: get("物件番号"), advertising: advertisement === "広告可" ? "allowed" : /要連絡/.test(advertisement) ? "contact-required" : "not-allowed", advertisingQuote: advertisement,
    availability: /募集終了|成約済/.test(notes) ? "closed" : "active", application: /申込(?:み)?(?:あり|有|済)|申込受付済/.test(notes) ? "present" : "unknown", applicationQuote: "",
    adQuote, adStatus: positiveAd ? /相談|迄|まで|最大|条件/.test(adQuote) ? "consult" : "confirmed" : adQuote ? "unknown" : "none",
    summary: {
      building: get("建物名") || `${get("所在地名２")} ${get("物件種目")}`, unit: get("部屋番号"), address: [get("都道府県名"), get("所在地名１"), get("所在地名２"), get("所在地名３")].join(""),
      rentYen: rent, managementYen: money(get("管理費")), commonYen: money(get("共益費")), deposit: get("敷金"), keyMoney: get("礼金"),
      layout: (get("間取部屋数").replace(/室$/, "") + get("間取タイプ")).normalize("NFKC"), areaSqm: area,
      availabilityText: [get("入居時期"), get("入居年月")].filter(Boolean).join(" / "),
      pets: classify(petTerms, "ペット|小型犬|猫"), foreignNationals: classify(foreignTerms, "外国籍|外国人"), corporate: classify(terms(/法人/), "法人契約|法人"), petTerms, foreignTerms, corporateTerms,
      companyHousing: classify(terms(/社宅/), "社宅"), companyHousingTerms: terms(/社宅/),
      buildingType: get("物件種目"), access: [get("沿線名"), get("駅名"), get("駅より徒歩") ? `徒歩${get("駅より徒歩")}` : ""].filter(Boolean).join(" "),
      built: get("築年月"), structure: get("建物構造"), floors: [get("地上階層") ? `地上${get("地上階層")}` : "", get("所在階") ? `所在${get("所在階")}` : ""].filter(Boolean).join(" / "),
      contractType: get("建物賃貸借区分"), contractPeriod: get("建物賃貸借期間") || get("契約期間"), guaranteeDeposit: get("保証金"), renewalFee: get("更新料"), insurance,
      guarantor: terms(/保証会社|保証料|賃貸保証/), otherFees: fees.join(" / "),
    },
  };
}

if (process.argv[1]?.endsWith("reins-school-feed.ts")) {
  const [input, checkedAt, output] = process.argv.slice(2);
  if (!input || !checkedAt || !output) throw new Error("Usage: reins-school-feed.ts snapshots.json earliest-confirmed-ISO output.json");
  const capture = z.object({ scope: z.literal("bunkyo-rent-175000-area-48"), complete: z.literal(true), expectedCount: z.number().int().nonnegative(), snapshots: z.array(z.string()) }).parse(JSON.parse(readFileSync(input, "utf8")));
  if (capture.expectedCount !== capture.snapshots.length) throw new Error("検索件数と取得件数が一致しません。全ページを確認してください");
  const all = capture.snapshots.map(extractReinsRecord);
  if (new Set(all.map(r => r.sourceId)).size !== all.length) throw new Error("取得した登録IDが重複しています");
  // Keep negative evidence privately so it can suppress another source's stale active row.
  const records = all;
  const feed = feedSchema.parse({ version: 1, provider: "reins", scope: "bunkyo-rent-175000-area-48", checkedAt, complete: true, expectedCount: capture.expectedCount, records });
  writeFileSync(output, JSON.stringify(feed, null, 2) + "\n");
  console.log(JSON.stringify({ records: records.length, unconditionallyAllowed: records.filter(r => r.advertising === "allowed").length, adCandidates: records.filter(r => r.advertising === "allowed" && ["confirmed", "consult"].includes(r.adStatus)).length }));
}
