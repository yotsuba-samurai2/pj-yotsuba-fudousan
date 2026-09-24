/**
 * 学区別の募集比較一覧（RentalComparison）の値の4言語化。2026-09-24。
 *
 * 募集情報は業者間サイトの日本語をそのまま取り込んでいる。英・中のページで
 * 「マンション」「1ヶ月」「加入義務：有」「清掃費：8.17万円」などが日本語のまま出ており、
 * 全ページ点検（2026-09-24 #3）で翻訳もれとして検出された。
 *
 * 方針：型の決まっている値（建物種別・構造・契約種別・期間・月数・万円・築年月・階数・入居時期・
 *       交通・保険の加入義務・費用の項目名）だけを機械的に訳す。
 *       物件名・住所・貸主ごとの備考（ペット・外国籍・法人・保証会社の条件文）は原文のまま
 *       （画面に「原文の日本語で表示」と明記している）。訳せない部分は原文を残す＝情報を落とさない。
 * ★金額・月数・日付の数値は変えない（テストで検査）。
 */
import type { LangCode } from "@/config/languages";

type NonJa = Exclude<LangCode, "ja">;
type Tr = Record<NonJa, string>;

const WHOLE: Record<string, Tr> = {
  "マンション": { en: "Apartment building", "zh-tw": "公寓大樓", zh: "公寓楼" },
  "アパート": { en: "Low-rise apartment", "zh-tw": "低層公寓", zh: "低层公寓" },
  "貸家": { en: "House for rent", "zh-tw": "出租獨棟住宅", zh: "出租独栋住宅" },
  "テラスハウス": { en: "Terraced house", "zh-tw": "連棟住宅", zh: "联排住宅" },
  "ＲＣ": { en: "RC (reinforced concrete)", "zh-tw": "RC（鋼筋混凝土）", zh: "RC（钢筋混凝土）" },
  "ＳＲＣ": { en: "SRC (steel-reinforced concrete)", "zh-tw": "SRC（鋼骨鋼筋混凝土）", zh: "SRC（钢骨钢筋混凝土）" },
  "木造": { en: "Wood", "zh-tw": "木造", zh: "木结构" },
  "軽量鉄骨": { en: "Light-gauge steel", "zh-tw": "輕量鋼骨", zh: "轻钢结构" },
  "鉄骨造": { en: "Steel frame", "zh-tw": "鋼骨造", zh: "钢结构" },
  "鉄骨": { en: "Steel frame", "zh-tw": "鋼骨", zh: "钢结构" },
  "定期借家権": { en: "Fixed-term lease", "zh-tw": "定期租賃", zh: "定期租赁" },
  "定期借家": { en: "Fixed-term lease", "zh-tw": "定期租賃", zh: "定期租赁" },
  "普通借家権": { en: "Standard lease", "zh-tw": "普通租賃", zh: "普通租赁" },
  "普通借家": { en: "Standard lease", "zh-tw": "普通租賃", zh: "普通租赁" },
  "即時": { en: "Immediately", "zh-tw": "即可入住", zh: "即可入住" },
  "相談": { en: "To be arranged", "zh-tw": "可商議", zh: "可商议" },
  "なし": { en: "None", "zh-tw": "無", zh: "无" },
  "無": { en: "None", "zh-tw": "無", zh: "无" },
};

const LINES: Record<string, Tr> = {
  "都営三田線": { en: "Toei Mita Line", "zh-tw": "都營三田線", zh: "都营三田线" },
  "有楽町線": { en: "Yurakucho Line", "zh-tw": "有樂町線", zh: "有乐町线" },
  "丸ノ内線": { en: "Marunouchi Line", "zh-tw": "丸之內線", zh: "丸之内线" },
  "山手線": { en: "Yamanote Line", "zh-tw": "山手線", zh: "山手线" },
  "南北線": { en: "Namboku Line", "zh-tw": "南北線", zh: "南北线" },
  "千代田線": { en: "Chiyoda Line", "zh-tw": "千代田線", zh: "千代田线" },
  "大江戸線": { en: "Toei Oedo Line", "zh-tw": "大江戶線", zh: "大江户线" },
  "都営大江戸線": { en: "Toei Oedo Line", "zh-tw": "都營大江戶線", zh: "都营大江户线" },
  "東西線": { en: "Tozai Line", "zh-tw": "東西線", zh: "东西线" },
  "中央線": { en: "Chuo Line", "zh-tw": "中央線", zh: "中央线" },
  "銀座線": { en: "Ginza Line", "zh-tw": "銀座線", zh: "银座线" },
  "総武中央線": { en: "Chuo-Sobu Line", "zh-tw": "總武中央線", zh: "总武中央线" },
  "総武線": { en: "Sobu Line", "zh-tw": "總武線", zh: "总武线" },
  "副都心線": { en: "Fukutoshin Line", "zh-tw": "副都心線", zh: "副都心线" },
  "日比谷線": { en: "Hibiya Line", "zh-tw": "日比谷線", zh: "日比谷线" },
  "京浜東北線": { en: "Keihin-Tohoku Line", "zh-tw": "京濱東北線", zh: "京滨东北线" },
  "都電荒川線": { en: "Toden Arakawa Line", "zh-tw": "都電荒川線", zh: "都电荒川线" },
};

/** 駅名。英語はローマ字、中国語は漢字のまま（かなを含む駅だけ置き換える） */
const STATIONS: Record<string, Tr> = {
  "護国寺": { en: "Gokokuji", "zh-tw": "護國寺", zh: "护国寺" },
  "千石": { en: "Sengoku", "zh-tw": "千石", zh: "千石" },
  "白山": { en: "Hakusan", "zh-tw": "白山", zh: "白山" },
  "茗荷谷": { en: "Myogadani", "zh-tw": "茗荷谷", zh: "茗荷谷" },
  "本郷三丁目": { en: "Hongo-sanchome", "zh-tw": "本鄉三丁目", zh: "本乡三丁目" },
  "駒込": { en: "Komagome", "zh-tw": "駒込", zh: "驹込" },
  "春日": { en: "Kasuga", "zh-tw": "春日", zh: "春日" },
  "千駄木": { en: "Sendagi", "zh-tw": "千駄木", zh: "千驮木" },
  "本駒込": { en: "Hon-komagome", "zh-tw": "本駒込", zh: "本驹込" },
  "田端": { en: "Tabata", "zh-tw": "田端", zh: "田端" },
  "後楽園": { en: "Korakuen", "zh-tw": "後樂園", zh: "后乐园" },
  "湯島": { en: "Yushima", "zh-tw": "湯島", zh: "汤岛" },
  "御茶ノ水": { en: "Ochanomizu", "zh-tw": "御茶之水", zh: "御茶之水" },
  "新御茶ノ水": { en: "Shin-ochanomizu", "zh-tw": "新御茶之水", zh: "新御茶之水" },
  "水道橋": { en: "Suidobashi", "zh-tw": "水道橋", zh: "水道桥" },
  "新大塚": { en: "Shin-otsuka", "zh-tw": "新大塚", zh: "新大冢" },
  "飯田橋": { en: "Iidabashi", "zh-tw": "飯田橋", zh: "饭田桥" },
  "江戸川橋": { en: "Edogawabashi", "zh-tw": "江戶川橋", zh: "江户川桥" },
  "西日暮里": { en: "Nishi-nippori", "zh-tw": "西日暮里", zh: "西日暮里" },
  "巣鴨": { en: "Sugamo", "zh-tw": "巢鴨", zh: "巢鸭" },
  "早稲田": { en: "Waseda", "zh-tw": "早稻田", zh: "早稻田" },
  "末広町": { en: "Suehirocho", "zh-tw": "末廣町", zh: "末广町" },
  "東大前": { en: "Todaimae", "zh-tw": "東大前", zh: "东大前" },
  "大塚": { en: "Otsuka", "zh-tw": "大塚", zh: "大冢" },
  "池袋": { en: "Ikebukuro", "zh-tw": "池袋", zh: "池袋" },
  "根津": { en: "Nezu", "zh-tw": "根津", zh: "根津" },
  "上野": { en: "Ueno", "zh-tw": "上野", zh: "上野" },
  "日暮里": { en: "Nippori", "zh-tw": "日暮里", zh: "日暮里" },
  "本郷": { en: "Hongo", "zh-tw": "本鄉", zh: "本乡" },
  "目白": { en: "Mejiro", "zh-tw": "目白", zh: "目白" },
  "雑司が谷": { en: "Zoshigaya", "zh-tw": "雜司谷", zh: "杂司谷" },
  "東池袋": { en: "Higashi-ikebukuro", "zh-tw": "東池袋", zh: "东池袋" },
};

/** 費用の項目名（「清掃費：8.17万円」の左側）。商品名（「Ｇｏｏｄプレミアムα」等）は原文のまま */
const FEE_LABELS: Record<string, Tr> = {
  "清掃費": { en: "Cleaning fee", "zh-tw": "清潔費", zh: "清洁费" },
  "エアコン清掃費": { en: "Air-conditioner cleaning fee", "zh-tw": "冷氣清潔費", zh: "空调清洁费" },
  "鍵交換代": { en: "Key replacement", "zh-tw": "換鎖費", zh: "换锁费" },
  "カギ代": { en: "Key fee", "zh-tw": "鑰匙費", zh: "钥匙费" },
  "月額": { en: "Monthly", "zh-tw": "每月", zh: "每月" },
  "事務手数料": { en: "Administration fee", "zh-tw": "事務手續費", zh: "事务手续费" },
  "火災保険料": { en: "Fire insurance premium", "zh-tw": "火災保險費", zh: "火灾保险费" },
  "書類作成費": { en: "Document preparation fee", "zh-tw": "文件製作費", zh: "文件制作费" },
  "書類代": { en: "Document fee", "zh-tw": "文件費", zh: "文件费" },
  "室内消毒費用": { en: "Interior disinfection", "zh-tw": "室內消毒費", zh: "室内消毒费" },
  "除菌消臭代": { en: "Disinfection and deodorizing", "zh-tw": "除菌除臭費", zh: "除菌除臭费" },
  "除菌・消臭サービス": { en: "Disinfection and deodorizing service", "zh-tw": "除菌・除臭服務", zh: "除菌・除臭服务" },
  "除菌施工料（契約時のみ）": { en: "Disinfection treatment (at signing only)", "zh-tw": "除菌施工費（僅簽約時）", zh: "除菌施工费（仅签约时）" },
  "虫駆除サービス": { en: "Pest control service", "zh-tw": "驅蟲服務", zh: "驱虫服务" },
  "くらしのサポートサービス": { en: "Living support service", "zh-tw": "生活支援服務", zh: "生活支援服务" },
  "ライフサポート": { en: "Life support service", "zh-tw": "生活支援服務", zh: "生活支援服务" },
  "２４時間サポートサービス": { en: "24-hour support service", "zh-tw": "24小時支援服務", zh: "24小时支援服务" },
  "２４時間サポート（２年間）": { en: "24-hour support (2 years)", "zh-tw": "24小時支援（2年）", zh: "24小时支援（2年）" },
  "２４Ｈサポート（２年）": { en: "24-hour support (2 years)", "zh-tw": "24小時支援（2年）", zh: "24小时支援（2年）" },
  "２４時間緊急サービス": { en: "24-hour emergency service", "zh-tw": "24小時緊急服務", zh: "24小时紧急服务" },
  "駐車場登録料 １台（利用時のみ）": { en: "Parking registration, 1 car (only if used)", "zh-tw": "停車場登錄費　1台（僅使用時）", zh: "停车场登记费　1台（仅使用时）" },
  "退去時ＲＣ代": { en: "Restoration cost at move-out", "zh-tw": "退租時原狀回復費", zh: "退租时原状恢复费" },
  "１年未満短期解約違約金": { en: "Penalty for cancellation within 1 year", "zh-tw": "未滿1年短期解約違約金", zh: "未满1年短期解约违约金" },
  "消火器具代": { en: "Fire extinguisher", "zh-tw": "滅火器材費", zh: "灭火器材费" },
  "コールセンター登録料": { en: "Call-center registration fee", "zh-tw": "客服中心登錄費", zh: "客服中心登记费" },
  "住宅総合保険（フレックス）": { en: "Comprehensive home insurance (Flex)", "zh-tw": "住宅綜合保險（Flex）", zh: "住宅综合保险（Flex）" },
  "自治会費": { en: "Residents' association fee", "zh-tw": "自治會費", zh: "自治会费" },
  "町内会費": { en: "Neighborhood association fee", "zh-tw": "町內會費", zh: "町内会费" },
  "月額保証委託料": { en: "Monthly guarantee fee", "zh-tw": "每月保證委託費", zh: "每月保证委托费" },
  "電気料金": { en: "Electricity", "zh-tw": "電費", zh: "电费" },
  "コールセンター利用料": { en: "Call-center service fee", "zh-tw": "客服中心使用費", zh: "客服中心使用费" },
  "２４時間サポート": { en: "24-hour support", "zh-tw": "24小時支援", zh: "24小时支援" },
};

/** 保険欄の定型語（会社名は原文のまま） */
const INSURANCE: Record<string, Tr> = {
  "加入義務：有": { en: "Required", "zh-tw": "必須投保", zh: "必须投保" },
  "加入義務：無": { en: "Not required", "zh-tw": "無須投保", zh: "无须投保" },
  "住宅総合保険": { en: "Comprehensive home insurance", "zh-tw": "住宅綜合保險", zh: "住宅综合保险" },
  "住宅保険": { en: "Home insurance", "zh-tw": "住宅保險", zh: "住宅保险" },
  "火災保険": { en: "Fire insurance", "zh-tw": "火災保險", zh: "火灾保险" },
  "火災": { en: "Fire insurance", "zh-tw": "火災保險", zh: "火灾保险" },
  "家財保険": { en: "Contents insurance", "zh-tw": "家財保險", zh: "家财保险" },
  "借主にて加入": { en: "Arranged by the tenant", "zh-tw": "由承租人自行投保", zh: "由承租人自行投保" },
  "月額": { en: "Monthly", "zh-tw": "每月", zh: "每月" },
};

const MONTH_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function yen(n: number, loc: NonJa) {
  const s = n.toLocaleString("en-US");
  return loc === "en" ? `¥${s}` : loc === "zh-tw" ? `${s}日圓` : `${s}日元`;
}
function manYen(v: string, loc: NonJa) {
  // 「8.17万円」＝81,700円。浮動小数の誤差を避けて整数で計算する
  const [i, f = ""] = v.split(".");
  const n = Number(i) * 10000 + Number((f + "0000").slice(0, 4));
  return yen(n, loc);
}
function months(n: string, loc: NonJa) {
  if (loc === "en") return n === "1" ? "1 month's rent" : `${n} months' rent`;
  return loc === "zh-tw" ? `${n}個月租金` : `${n}个月租金`;
}
function ym(year: number, month: number, loc: NonJa) {
  return loc === "en" ? `${MONTH_EN[month - 1]} ${year}` : `${year}年${month}月`;
}
const ERA: Record<string, number> = { 令和: 2018, 平成: 1988, 昭和: 1925 };

/** 金額・月数の埋め込みを訳す（前後の日本語は残す） */
function amounts(s: string, loc: NonJa) {
  return s
    .replace(/(\d+(?:\.\d+)?)万円/g, (_, v) => manYen(v, loc))
    .replace(/([\d,]+)円/g, (_, v) => yen(Number(v.replace(/,/g, "")), loc))
    .replace(/(\d+(?:\.\d+)?)ヶ月/g, (_, v) => months(v, loc));
}

function feePart(part: string, loc: NonJa) {
  const i = part.indexOf("：");
  if (i < 0) return amounts(part, loc);
  const label = part.slice(0, i);
  const rest = part.slice(i + 1).trim();
  const tl = FEE_LABELS[label]?.[loc] ?? label;
  // 「月額：自治会費 200円」＝右側の項目名は辞書にあれば訳す。商品名（「リロサポプラス加入料」等）は原文、金額だけ訳す
  const inner = rest.match(/^(.+?)\s+(\S+円)$/);
  const body = inner && FEE_LABELS[inner[1]] ? `${FEE_LABELS[inner[1]][loc]} ${amounts(inner[2], loc)}` : amounts(rest, loc);
  return `${tl}${loc === "en" ? ": " : "："}${body}`;
}

/** 募集比較一覧の1つの値を訳す。ja はそのまま。訳せない部分は原文を残す */
export function localizeRentalValue(value: string, locale: LangCode): string {
  if (locale === "ja" || !value) return value;
  const loc = locale as NonJa;
  const v = value.trim();
  if (WHOLE[v]) return WHOLE[v][loc];

  let m = v.match(/^(\d{4})年（(?:令和|平成|昭和)\s*\d+年）\s*(\d+)月$/);
  if (m) return ym(Number(m[1]), Number(m[2]), loc);

  m = v.match(/^(予定|期日指定)\s*\/\s*(令和|平成)\s*(\d+)年\s*(\d+)月$/);
  if (m) {
    const date = ym(ERA[m[2]] + Number(m[3]), Number(m[4]), loc);
    const kind = m[1] === "予定"
      ? { en: "Planned", "zh-tw": "預定", zh: "预定" }[loc]
      : { en: "From a set date", "zh-tw": "指定日期", zh: "指定日期" }[loc];
    return `${kind}${loc === "en" ? ": " : "："}${date}`;
  }

  m = v.match(/^(\d{4})年（(?:令和|平成|昭和)\s*\d+年）$/);
  if (m) return loc === "en" ? m[1] : `${m[1]}年`;

  m = v.match(/^地上(\d+)階$/);
  if (m) return loc === "en" ? `${m[1]} floors above ground` : loc === "zh-tw" ? `地上${m[1]}層` : `地上${m[1]}层`;

  m = v.match(/^地上(\d+)階\s*\/\s*所在(\d+)階$/);
  if (m) {
    if (loc === "en") return `${m[1]} floors above ground / unit on floor ${m[2]}`;
    return loc === "zh-tw" ? `地上${m[1]}層／位於${m[2]}樓` : `地上${m[1]}层／位于${m[2]}楼`;
  }

  m = v.match(/^(\d+)年$/);
  if (m) return loc === "en" ? `${m[1]} year${m[1] === "1" ? "" : "s"}` : `${m[1]}年`;

  m = v.match(/^(\S+線)\s+(\S+)\s+徒歩(\d+)分$/);
  if (m) {
    const line = LINES[m[1]]?.[loc] ?? m[1];
    const st = STATIONS[m[2]]?.[loc] ?? m[2];
    if (loc === "en") return `${line}, ${st} Station, ${m[3]} min walk`;
    return loc === "zh-tw" ? `${line}「${st}」站 步行${m[3]}分鐘` : `${line}“${st}”站 步行${m[3]}分钟`;
  }

  if (v.startsWith("加入義務：")) {
    return v
      .split(" / ")
      .map((p) => {
        const q = p.trim();
        if (INSURANCE[q]) return INSURANCE[q][loc];
        const y = q.match(/^(\d+)年$/);
        if (y) return loc === "en" ? `${y[1]} year${y[1] === "1" ? "" : "s"}` : `${y[1]}年`;
        return amounts(q, loc);
      })
      .join(" / ");
  }

  if (/^[^：]+：/.test(v) && /万円|円/.test(v)) {
    return v.split(" / ").map((p) => feePart(p.trim(), loc)).join(" / ");
  }

  if (/^(\d+(?:\.\d+)?)(万円|ヶ月)$/.test(v)) return amounts(v, loc);
  return value;
}

