import type { ReactNode } from "react";
import type { LangCode } from "@/config/languages";
import type { PublicSurveySummary } from "@/lib/rental-survey/summary";

/**
 * 「今回の調査で確認した対象物件」の共通表示部品（ペット横断 指示書 版2.0 第8.2章のひな型）。
 * - 集計済みの公開用データだけを受け取る。hidden・条件文の無い scope では何も出さない（数値枠を出さず、相談導線はページ側で維持）。
 * - 「市場全体」「全件」「必ず紹介できる」とは書かない。0件は調査範囲での確認結果であることを添える。
 * - JSON-LD は出さない（ItemList は当該言語で実際に見える一覧だけから作るため、調査総数を入れない）。
 * - CTA は呼び出し側から渡す（計測は既存の CTA 部品に任せる）。
 */
type Copy = {
  title: string; target: string; period: string; finalized: string;
  range: (from: string, to: string) => string;
  total: (n: number) => string; listed: (n: number) => string; notListed: (n: number) => string;
  source: (kind: "single" | "multiple", attribution: string | null) => string;
  coverage: (source: string) => string;
  zero: string; notListedMeaning: string; petNote: string; consult: string;
};

const COPY: Record<LangCode, Copy> = {
  ja: {
    title: "今回の調査で確認した対象物件", target: "対象", period: "確認期間", finalized: "集計確定",
    range: (from, to) => `${from}〜${to}`,
    total: n => `重複を除いた確認件数：${n}件`,
    listed: n => `うち当サイトで詳細掲載中：${n}件`,
    notListed: n => `うち当サイトでは詳細非掲載：${n}件`,
    source: (kind, attribution) => `当社が利用する${kind === "multiple" ? "複数の" : ""}業者向け物件情報${attribution ? `（${attribution}）` : ""}`,
    coverage: source => `${source}のうち、上記の条件と集計公表の利用条件を満たす情報を確認した集計です。地域内の全募集物件を網羅するものではありません。`,
    zero: "0件は今回の調査範囲での確認結果であり、地域に該当する物件が存在しないことを示すものではありません。",
    notListedMeaning: "詳細非掲載には、広告ができない物件、掲載の許可を確認中の物件、掲載準備中の物件などが含まれます。ご紹介の可否は物件ごとに確認します。",
    petNote: "「可」「相談可」は無条件の入居を保証するものではありません。動物の種類・頭数・大きさ、管理規約、貸主の承諾、個別の審査などによります。",
    consult: "ご希望条件をお知らせいただければ、現在の募集状況と紹介の可否を確認してご案内します。",
  },
  en: {
    title: "Properties confirmed in this survey", target: "Scope", period: "Survey period", finalized: "Totals finalized",
    range: (from, to) => `${from} – ${to}`,
    total: n => `Confirmed properties (duplicates removed): ${n}`,
    listed: n => `Of these, listed in detail on this site: ${n}`,
    notListed: n => `Of these, not listed in detail on this site: ${n}`,
    source: (kind, attribution) => `${kind === "multiple" ? "several sources of " : ""}the real estate agents' listing information we use${attribution ? ` (${attribution})` : ""}`,
    coverage: source => `This total covers information from ${source} that meets the conditions above and the terms for publishing totals. It does not cover every rental available in the area.`,
    zero: "A count of zero reflects the results within this survey's scope; it does not mean that no such properties exist in the area.",
    notListedMeaning: "Properties not listed in detail include those that may not be advertised, those for which advertising permission is still being confirmed, and those being prepared for listing. Whether we can introduce a property is confirmed case by case.",
    petNote: "“Allowed” or “negotiable” does not guarantee that you can move in. It depends on the type, number and size of the animals, the building rules, the landlord's consent and individual screening.",
    consult: "Tell us your requirements and we will check current availability and whether we can introduce each property.",
  },
  "zh-tw": {
    title: "本次調查確認的對象物件", target: "對象", period: "確認期間", finalized: "統計確定",
    range: (from, to) => `${from}〜${to}`,
    total: n => `排除重複後的確認件數：${n}件`,
    listed: n => `其中在本網站刊登詳細資訊：${n}件`,
    notListed: n => `其中未在本網站刊登詳細資訊：${n}件`,
    source: (kind, attribution) => `本公司使用的${kind === "multiple" ? "多個" : ""}不動產業者用物件資訊${attribution ? `（${attribution}）` : ""}`,
    coverage: source => `本統計僅涵蓋${source}中符合上述條件及統計公開使用條件的資訊，並未涵蓋該地區所有招租物件。`,
    zero: "0件為本次調查範圍內的確認結果，並不表示該地區不存在相關物件。",
    notListedMeaning: "未刊登詳細資訊的物件，包含不可刊登廣告、刊登許可確認中、刊登準備中等情形。可否介紹需逐一確認。",
    petNote: "「可」或「可商議」並不保證一定能入住，仍取決於動物的種類、數量與體型、管理規約、房東同意及個別審查等。",
    consult: "歡迎告知您的希望條件，我們將確認最新招租狀況與可否介紹後為您說明。",
  },
  zh: {
    title: "本次调查确认的对象房源", target: "对象", period: "确认期间", finalized: "统计确定",
    range: (from, to) => `${from}〜${to}`,
    total: n => `去除重复后的确认件数：${n}套`,
    listed: n => `其中在本网站刊登详细信息：${n}套`,
    notListed: n => `其中未在本网站刊登详细信息：${n}套`,
    source: (kind, attribution) => `本公司使用的${kind === "multiple" ? "多个" : ""}不动产经纪业者用房源信息${attribution ? `（${attribution}）` : ""}`,
    coverage: source => `本统计仅涵盖${source}中符合上述条件及统计公开使用条件的信息，并未涵盖该地区所有招租房源。`,
    zero: "0套为本次调查范围内的确认结果，并不表示该地区不存在相关房源。",
    notListedMeaning: "未刊登详细信息的房源，包括不可刊登广告、刊登许可确认中、刊登准备中等情况。能否介绍需逐一确认。",
    petNote: "「可」或「可商议」并不保证一定能入住，仍取决于动物的种类、数量与体型、管理规约、房东同意及个别审查等。",
    consult: "欢迎告知您的希望条件，我们将确认最新招租情况与能否介绍后为您说明。",
  },
};

/** scope の版ごとの条件文。条件を変えたら scope の版と一緒に新しいキーを足す（古い版の文言は変えない）。 */
const CONDITIONS: Record<string, Record<LangCode, string>> = {
  "bunkyo-rent-pet-v1": {
    ja: "文京区・居住用賃貸（賃料・面積の条件なし）。媒体の記載で、2頭以上の飼育が可・相談可、または大型犬が可・相談可と確認できた住戸。1住戸を1件として集計。",
    en: "Residential rentals in Bunkyo City (no rent or floor-area limits). Units whose listing states that keeping two or more pets, or a large dog, is allowed or negotiable. Each unit is counted once.",
    "zh-tw": "文京區・住宅用租賃（不限租金與面積）。刊登資訊載明可飼養2隻以上寵物或可商議，或可飼養大型犬或可商議的住戶。每戶以1件計算。",
    zh: "文京区・住宅用租赁（不限租金与面积）。房源信息载明可饲养2只以上宠物或可商议，或可饲养大型犬或可商议的住户。每户按1套计算。",
  },
};

const DATE_LOCALE: Record<LangCode, string> = { ja: "ja-JP", en: "en-GB", "zh-tw": "zh-TW", zh: "zh-CN" };

export function SurveyCountsPanel({ summary, locale, cta }: { summary: PublicSurveySummary; locale: LangCode; cta?: ReactNode }) {
  if (summary.state !== "shown") return null;
  const conditions = CONDITIONS[summary.conditionsKey]?.[locale];
  if (!conditions) return null;
  const c = COPY[locale];
  const dateOptions = { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" } as const;
  const day = (iso: string) => new Date(iso).toLocaleDateString(DATE_LOCALE[locale], dateOptions);
  const time = (iso: string) => `${new Date(iso).toLocaleString(DATE_LOCALE[locale], { ...dateOptions, hour: "2-digit", minute: "2-digit" })} JST`;
  return (
    <section className="mt-8 rounded-xl border border-border bg-surface p-4 sm:p-5" aria-label={c.title}>
      <h2 className="font-serif text-xl font-semibold text-ink">{c.title}</h2>
      <dl className="mt-3 grid gap-2 text-sm">
        <div><dt className="text-xs text-text-muted">{c.target}</dt><dd className="mt-1">{conditions}</dd></div>
        <div><dt className="text-xs text-text-muted">{c.period}</dt><dd className="mt-1">{c.range(day(summary.observedFrom), day(summary.observedTo))}</dd></div>
        <div><dt className="text-xs text-text-muted">{c.finalized}</dt><dd className="mt-1">{time(summary.finalizedAt)}</dd></div>
      </dl>
      <p className="mt-4 text-lg font-bold text-primary">{c.total(summary.x)}</p>
      {summary.breakdown && (
        <ul className="mt-2 space-y-1 text-sm">
          <li>{c.listed(summary.breakdown.y)}</li>
          <li>{c.notListed(summary.breakdown.z)}</li>
        </ul>
      )}
      <p className="mt-4 text-xs leading-relaxed text-text-muted">{c.coverage(c.source(summary.sourceKind, summary.attribution))}</p>
      {summary.x === 0 && <p className="mt-2 text-xs leading-relaxed text-text-muted">{c.zero}</p>}
      {summary.breakdown && <p className="mt-2 text-xs leading-relaxed text-text-muted">{c.notListedMeaning}</p>}
      <p className="mt-2 text-xs leading-relaxed text-text-muted">{c.petNote}</p>
      <p className="mt-4 text-sm font-semibold leading-relaxed text-ink">{c.consult}</p>
      {cta && <div className="mt-3">{cta}</div>}
    </section>
  );
}
