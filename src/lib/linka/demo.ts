// フェーズK-1｜デモロジック（AI不通・検証失敗時のサーバ側フォールバック）
// 正本＝facilitator/linka-facilitator.jsx v0.2 の localSearch/localTriage/localConcierge/localDraft＋辞書を移植。
// 三禁則の機械的担保（URGENT/NAMEISH・候補は必ず2件以上）はここが最後の砦。
import {
  getColumns,
  getMembers,
  getSiteServices,
  getVideos,
  resolveColumnCards,
  SAMURAI_FACILITATOR_URL,
} from "./directory";
import { resolveResult, type RawResult } from "./resolve";
import type { LinkaResult, Member, Summary } from "./types";

export const REGION: Record<string, string> = { 東京: "関東", 神奈川: "関東", 埼玉: "関東", 千葉: "関東", 福岡: "九州", 北九州: "九州", 大阪: "近畿", 京都: "近畿", 名古屋: "東海", 札幌: "北海道" };
export const SYN: Record<string, string[]> = {
  ビザ: ["在留資格・ビザ"], 在留: ["在留資格・ビザ"], 外国人: ["在留資格・ビザ"], 帰化: ["在留資格・ビザ"], 永住: ["在留資格・ビザ"], 技人国: ["在留資格・ビザ"],
  相続: ["相続・遺言"], 遺言: ["相続・遺言"], 遺産: ["相続・遺言"],
  信託: ["信託"], 家族信託: ["信託"],
  会社設立: ["会社設立"], 設立: ["会社設立"], 起業: ["会社設立", "経営相談"], 法人化: ["会社設立"], LLP: ["会社設立"],
  補助金: ["助成金・補助金", "補助金"], 助成金: ["助成金・補助金", "雇用助成金"],
  建設: ["建設業許可"], 飲食: ["飲食店営業許可"], レストラン: ["飲食店営業許可"], 許可: ["建設業許可", "飲食店営業許可"],
  登記: ["不動産登記", "商業登記"], 不動産: ["不動産"], 物件: ["不動産"], 賃貸: ["不動産"], お部屋: ["不動産"], 社宅: ["不動産", "社宅"], 路線価: ["相続・遺言", "不動産"],
  投資: ["投資", "不動産"], 事業用: ["事業用", "不動産"],
  承継: ["事業承継"], "M&A": ["M&A"], 買収: ["M&A"], 経営: ["経営相談"], 広報: ["広報"],
  離婚: ["離婚協議"], 債務: ["債務整理"], 借金: ["債務整理"],
  労働: ["労働問題"], 解雇: ["労働問題"], 残業: ["労働問題"], 雇用: ["労働問題", "在留資格・ビザ"], 労務: ["労働問題"], 就業規則: ["労働問題", "賃金"], 賃金: ["賃金", "労働問題"],
  処遇改善: ["処遇改善", "賃金", "労働問題"], 介護: ["障害福祉", "労働問題"], 障害福祉: ["障害福祉"], グループホーム: ["障害福祉", "不動産"], GH: ["障害福祉", "不動産"], 指定: ["障害福祉"],
  障害年金: ["障害年金"], 年金: ["障害年金"],
  刑事: ["刑事事件"], 事故: ["交通事故"],
  記帳: ["記帳代行"], 経理: ["記帳代行"], 資金: ["資金調達"], 融資: ["資金調達"],
  DX: ["DX・AI開発支援"], AI: ["DX・AI開発支援"], システム: ["DX・AI開発支援"], 福祉: ["福祉・ITコンサル", "障害福祉"],
};
const LANGKEY: Record<string, string> = { 中国語: "中国語", 英語: "英語" };
export const URGENT = ["暴力", "DV", "脅され", "脅迫", "死にたい", "自殺", "逮捕", "差押", "明日まで", "危害"];
export const NAMEISH = /(株式会社|有限会社|合同会社|[一-龠]{1,4}(さん|氏|社長|様))/;

export const ESCALATION_MESSAGE =
  "緊急のご事情が含まれている可能性があります。生命や安全に関わる場合は110番へ。法的な緊急のご相談は、法テラス(0570-078374)やお住まいの自治体・弁護士会の相談窓口に、まずご連絡ください。";
export const ANONYMIZATION_MESSAGE =
  "個人や会社が特定できる情報が含まれているようです。お名前や会社名は伏せて、お困りごとだけをお聞かせください。";

export const matchedTerms = (q: string): string[] =>
  Object.keys(SYN).filter((k) => q.includes(k)).flatMap((k) => SYN[k]).filter((v, i, a) => a.indexOf(v) === i);

const matchColumns = (q: string) => {
  const terms = matchedTerms(q);
  return getColumns()
    .filter((c) => c.tags.some((t) => terms.includes(t)))
    .slice(0, 3)
    .map((c) => ({ id: c.id, reason: "分野「" + c.tags.join("・") + "」の公開解説" }));
};
const matchVideos = (q: string) => {
  const terms = matchedTerms(q);
  return getVideos()
    .filter((v) => v.tags.some((t) => terms.includes(t)))
    .slice(0, 2)
    .map((v) => ({ id: v.id, reason: "分野「" + v.tags.join("・") + "」の解説動画" }));
};
export const extractSummary = (q: string): Summary => ({
  bunya: Object.keys(SYN).filter((k) => q.includes(k)).join("・") || "未指定",
  chiiki: Object.keys(REGION).find((a) => q.includes(a)) || "未指定",
  jiki: q.includes("今月") ? "今月" : q.includes("来月") ? "来月" : q.includes("急") ? "なるべく早く" : "未指定",
  kibo: "未指定",
});

type Scored = { m: Member; s: number; hits: string[] };
const scoreMembers = (q: string): Scored[] =>
  getMembers()
    .map((m) => {
      const fields = [...m.bunya, ...m.shikaku].join("|");
      let s = 0;
      const hits: string[] = [];
      for (const [k, terms] of Object.entries(SYN))
        if (q.includes(k))
          for (const t of terms)
            if (fields.includes(t) && !hits.includes("得意分野: " + t)) { s++; hits.push("得意分野: " + t); }
      for (const sh of m.shikaku) if (q.includes(sh)) { s += 2; hits.push("資格: " + sh); }
      for (const [k, lg] of Object.entries(LANGKEY)) if (q.includes(k) && m.lang.includes(lg)) { s += 2; hits.push("対応言語: " + lg); }
      const rg = Object.keys(REGION).find((a) => q.includes(a));
      if (rg && (m.area.includes(REGION[rg]) || m.area.includes("全国"))) { s++; hits.push("エリア: " + m.area); }
      const terms = matchedTerms(q);
      const authored = getColumns().find((c) => c.author === m.id && c.tags.some((t) => terms.includes(t)));
      if (authored) { s++; hits.push("該当分野のコラムを執筆"); }
      return { m, s, hits };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);

/** 三禁則①の機械的担保：候補は必ず2件以上 */
const fillTo2 = (list: Scored[]): Scored[] => {
  if (list.length >= 2) return list;
  const rest = getMembers().filter((v) => !list.find((x) => x.m.id === v.id));
  while (list.length < 2 && rest.length) {
    const v = rest.shift()!;
    list.push({ m: v, s: 0, hits: ["簡易検索での近接候補"] });
  }
  return list;
};

export function localSearch(q: string): LinkaResult {
  const list = fillTo2(scoreMembers(q).slice(0, 4));
  const raw: RawResult = {
    type: "candidates", demo: true,
    message: "簡易検索の結果です(名簿・コラムとの機械的な一致。順位ではありません)。",
    summary: extractSummary(q),
    candidates: list.map(({ m, hits }) => ({ id: m.id, reasons: hits })),
    columns: matchColumns(q), videos: matchVideos(q),
  };
  return resolveResult(raw);
}

export function localTriage(q: string): LinkaResult {
  if (URGENT.some((k) => q.includes(k))) return { type: "escalation", demo: true, message: ESCALATION_MESSAGE };
  if (NAMEISH.test(q)) return { type: "anonymization_request", demo: true, message: ANONYMIZATION_MESSAGE };
  const kento = matchedTerms(q).slice(0, 4);
  const list = fillTo2(scoreMembers(q).slice(0, 4));
  const raw: RawResult = {
    type: "triage", demo: true,
    kento: kento.length ? kento : ["(見当を絞れませんでした)"],
    message: "お話の内容から、関わりそうな分野の見当を示しています。これは見当であって、法的な判断ではありません。一般的な解説として参考コラムもご覧いただけます。",
    summary: extractSummary(q),
    candidates: list.map(({ m, hits }) => ({ id: m.id, reasons: hits })),
    columns: matchColumns(q), videos: matchVideos(q),
  };
  return resolveResult(raw);
}

export function localConcierge(q: string, siteKey: "realestate" | "legal" | "labor"): LinkaResult {
  if (URGENT.some((k) => q.includes(k))) return { type: "escalation", demo: true, message: ESCALATION_MESSAGE };
  if (NAMEISH.test(q)) return { type: "anonymization_request", demo: true, message: ANONYMIZATION_MESSAGE };
  const conf = getSiteServices(siteKey);
  let terms = matchedTerms(q);
  // 業際（指示書§9-4）：行政書士サイトの見当に「助成金」を出さない（補助金のみ）。
  // ※escalateNoteの「雇用助成金＝社労士」は分界の説明（対比教育）＝B-2レビュー済みの適正表現として維持。
  if (siteKey === "legal") {
    terms = terms
      .map((t) => (t === "助成金・補助金" ? "補助金" : t))
      .filter((t) => !t.includes("助成金"))
      .filter((v, i, a) => a.indexOf(v) === i);
  }
  const hit = conf.services
    .map((s) => ({ s, n: s.tags.filter((t) => terms.includes(t)).length }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n);
  const services = hit.map(({ s }) => ({ label: s.label, url: s.url, reason: "当サイトの取扱サービス" }));
  const escalate = services.length === 0 && terms.length > 0;
  return {
    type: "concierge", demo: true,
    kento: terms.length ? terms.slice(0, 4) : ["(見当を絞れませんでした)"],
    message: escalate
      ? "お話の内容は、当サイトの範囲を超えるかもしれません。見当をお示ししたうえで、中立の士業ドットコムへおつなぎします。これは見当であって法的な判断ではありません。"
      : "お話の内容から、関わりそうな分野の見当と、当サイトのご案内先をお示しします。これは見当であって法的な判断ではありません。",
    services, escalate, escalateReason: escalate ? conf.escalateNote : "",
    columns: resolveColumnCards(matchColumns(q)),
    summary: extractSummary(q),
    samuraiUrl: SAMURAI_FACILITATOR_URL,
  };
}

export function localDraft(name: string, key: "a" | "b" | "c", s?: Summary): string {
  const b = s && s.bunya !== "未指定" ? s.bunya : "ご相談中の分野";
  const c = s && s.chiiki !== "未指定" ? s.chiiki : "未指定";
  const j = s && s.jiki !== "未指定" ? s.jiki : "未定";
  if (key === "b") return name + "先生\n士業ドットコムの[あなたのお名前]です。" + j + "ごろに" + b + "の案件が動く可能性があり、その際のご受任余力を伺えればと思います。現時点の感触で結構です。ご返答は任意で、お断りいただいても差し支えありません。";
  if (key === "c") return name + "先生\n士業ドットコムの[あなたのお名前]です。" + b + "のご経験・お取り扱いの有無を伺えますでしょうか。将来のご相談の可能性のための確認で、具体的な依頼ではありません。ご返答は任意で、お断りいただいても差し支えありません。";
  return name + "先生\n士業ドットコムの[あなたのお名前]です。" + b + "に関する案件(地域:" + c + "、時期:" + j + "目安)で、ご協力の可能性を探しています。ご関心の有無だけでもお聞かせいただければ幸いです。ご返答は任意で、お断りいただいても差し支えありません。詳細はご関心があれば直接ご相談させてください。";
}
