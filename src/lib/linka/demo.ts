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
import type { LangCode } from "@/config/languages";

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

// ===== K-2a 多言語入力ガード（2026-07-12追加・診断書B-1の穴を塞ぐ）=====
// 既存jaパターン（URGENT/NAMEISH）は不変＝追加のみ（三禁則の強化）。誤検知より取りこぼしを恐れる（広めに）。
/** 中文（簡繁両表記・字面includes）：自傷・自殺／暴力・DV／脅迫／逮捕・差押 相当 */
export const URGENT_ZH = [
  "想死", "自杀", "輕生", "轻生", // 自傷・自殺（繁体「自殺」は既存URGENTと同字＝既にカバー）
  "家暴", "打我", "被打", // 暴力・DV（「家庭暴力」は既存「暴力」でカバー）
  "威脅", "威胁", "胁迫", "恐嚇", "恐吓", // 脅迫（繁体「脅迫」は既存と同字）
  "被捕", "查封", "扣押", // 逮捕・差押
];
/** en（小文字化して照合・単語境界つき）：kill myself/suicide/abuse/threaten/restraining order/domestic violence 等（診断書E-1） */
export const URGENT_EN =
  /\b(kill (myself|me)|suicide|suicidal|end my life|self[- ]harm|domestic violence|abuse|abusive|threat|threaten(s|ed|ing)?|restraining order|(hit|hits|hitting|beat|beats|beating) me|hurt (me|myself)|violence|arrest(ed)?|seizure|seized)\b/;
/** 緊急判定（4言語）。既存URGENT（ja）を含む上位互換＝強化のみ */
export const isUrgent = (q: string): boolean =>
  URGENT.some((k) => q.includes(k)) || URGENT_ZH.some((k) => q.includes(k)) || URGENT_EN.test(q.toLowerCase());

/** 法人格（Inc/Corp/Ltd/LLC/Co., Ltd./有限公司・股份有限公司・公司）＋敬称（Mr./Ms./Mrs./先生・小姐・總經理・总经理）。enは大文字小文字非依存 */
export const NAMEISH_MULTI =
  /(有限公司|股份有限公司|公司|[一-龠]{1,4}(先生|小姐|總經理|总经理)|\b(mr|ms|mrs)\.|\b(inc|corp|ltd|llc)\b\.?|co\.,?\s*ltd)/i;
/** 実名・法人検知（4言語）。既存NAMEISH（ja）を含む上位互換＝強化のみ */
export const isNameish = (q: string): boolean => NAMEISH.test(q) || NAMEISH_MULTI.test(q);

// ===== K-2a 安全メッセージ4言語（2026-07-12追加）=====
// en/zh-tw/zh訳は**石井弁護士レビュー済み**（2026-07-12・修正なしで承認）。趣旨は現行ja維持・法的境界を弱めない。変更時は再レビュー必須。
// 窓口は現行どおり 110・法テラス(0570-078374) で統一（多言語窓口0570-078377への差し替え要否はレビュー時判断）。
export const ESCALATION_MESSAGES: Record<LangCode, string> = {
  ja: "緊急のご事情が含まれている可能性があります。生命や安全に関わる場合は110番へ。法的な緊急のご相談は、法テラス(0570-078374)やお住まいの自治体・弁護士会の相談窓口に、まずご連絡ください。",
  en: "Your message may involve an urgent situation. If your life or safety is in danger, please call 110 (police) immediately. For urgent legal matters, please first contact Houterasu, the Japan Legal Support Center (0570-078374), or the consultation desk of your local government or bar association.",
  "zh-tw":
    "您的訊息可能涉及緊急情況。若生命或人身安全受到威脅，請立即撥打110（警察）。如需緊急法律協助，請先聯絡日本司法支援中心「法テラス」（0570-078374），或您所在地方政府、律師會的諮詢窗口。",
  zh: "您的信息可能涉及紧急情况。若生命或人身安全受到威胁，请立即拨打110（警察）。如需紧急法律协助，请先联系日本司法支援中心“法テラス”（0570-078374），或您所在地方政府、律师会的咨询窗口。",
};
export const ANONYMIZATION_MESSAGES: Record<LangCode, string> = {
  ja: "個人や会社が特定できる情報が含まれているようです。お名前や会社名は伏せて、お困りごとだけをお聞かせください。",
  en: "Your message appears to include information that could identify a person or company. Please leave out names and company names, and tell us only about the situation itself.",
  "zh-tw": "您的訊息似乎包含可識別個人或公司的資訊。請隱去姓名與公司名稱，只告訴我們您遇到的困擾即可。",
  zh: "您的信息似乎包含可识别个人或公司的信息。请隐去姓名与公司名称，只告诉我们您遇到的困扰即可。",
};
/** locale選択（不正値・未指定はja） */
export const getEscalationMessage = (locale?: string): string =>
  ESCALATION_MESSAGES[locale && locale in ESCALATION_MESSAGES ? (locale as LangCode) : "ja"];
export const getAnonymizationMessage = (locale?: string): string =>
  ANONYMIZATION_MESSAGES[locale && locale in ANONYMIZATION_MESSAGES ? (locale as LangCode) : "ja"];

// 既存参照互換（ja固定の従来定数。draft等の既存importを壊さない）
export const ESCALATION_MESSAGE = ESCALATION_MESSAGES.ja;
export const ANONYMIZATION_MESSAGE = ANONYMIZATION_MESSAGES.ja;

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

export function localSearch(q: string, locale?: string): LinkaResult {
  // K-2a（2026-07-12）：デモ側ガード欠落（診断A-1）の修理＝会員検索にも同一のURGENT/NAMEISHガードを適用
  if (isUrgent(q)) return { type: "escalation", demo: true, message: getEscalationMessage(locale) };
  if (isNameish(q)) return { type: "anonymization_request", demo: true, message: getAnonymizationMessage(locale) };
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

export function localTriage(q: string, locale?: string): LinkaResult {
  // K-2a（2026-07-12）：4言語判定＋locale別メッセージ（既存jaパターンは不変＝isUrgent/isNameishが内包）
  if (isUrgent(q)) return { type: "escalation", demo: true, message: getEscalationMessage(locale) };
  if (isNameish(q)) return { type: "anonymization_request", demo: true, message: getAnonymizationMessage(locale) };
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

/**
 * K-2c（2026-07-12）｜デモ（AI不可時の退避）本文の4言語化。
 *
 * デモは「AIが使えないときの命綱」なので**決定論的**でなければならない＝AI翻訳に頼らず定型文で持つ。
 * 分野の推定（matchedTerms）は日本語キーワード照合のため、en/zh入力では terms が空になる。
 * 従来はそこで日本語の定型文が出ていた＝**外国語利用者に読めない退避先**だった（本番実測で発見）。
 *
 * ⚠️ ja は既存文字列をそのまま（noTerms は normal と同一文字列＝表示回帰なし）。
 * ⚠️ 「見当であって法的判断ではない」（三禁則②）を全言語で保持する。
 */
const DEMO_CONCIERGE: Record<
  LangCode,
  { normal: string; escalate: string; noTerms: string; serviceReason: string; kentoUnknown: string }
> = {
  ja: {
    normal:
      "お話の内容から、関わりそうな分野の見当と、当サイトのご案内先をお示しします。これは見当であって法的な判断ではありません。",
    escalate:
      "お話の内容は、当サイトの範囲を超えるかもしれません。見当をお示ししたうえで、中立の士業ドットコムへおつなぎします。これは見当であって法的な判断ではありません。",
    // ja は normal と同一＝既存挙動を1文字も変えない
    noTerms:
      "お話の内容から、関わりそうな分野の見当と、当サイトのご案内先をお示しします。これは見当であって法的な判断ではありません。",
    serviceReason: "当サイトの取扱サービス",
    kentoUnknown: "(見当を絞れませんでした)",
  },
  en: {
    normal:
      "Based on what you've told us, here are the fields that may be involved and where we can help. This is a tentative guide, not a legal judgment.",
    escalate:
      "What you describe may fall outside the scope of this site. We show a tentative guide and connect you to the neutral platform 士業ドットコム. This is a tentative guide, not a legal judgment.",
    noTerms:
      "The AI assistant is temporarily unavailable, so we cannot narrow down the fields right now. Please tell us your situation via LINE or the contact form — we can respond in English. This is a tentative guide, not a legal judgment.",
    serviceReason: "A service handled by this office",
    kentoUnknown: "(could not narrow down)",
  },
  "zh-tw": {
    normal:
      "根據您所述的內容，為您指出可能相關的領域與本站的對應窗口。這僅為初步判斷，並非法律判斷。",
    escalate:
      "您所述的內容可能超出本站的範圍。我們先提供初步判斷，並為您連結至中立平台「士業ドットコム」。這僅為初步判斷，並非法律判斷。",
    noTerms:
      "AI 目前暫時無法使用，因此無法為您歸納相關領域。請透過 LINE 或聯絡表單告訴我們您的狀況，我們可以用中文回覆。這僅為初步判斷，並非法律判斷。",
    serviceReason: "本事務所承辦的服務",
    kentoUnknown: "（無法歸納出領域）",
  },
  zh: {
    normal:
      "根据您所述的内容，为您指出可能相关的领域与本站的对应窗口。这仅为初步判断，并非法律判断。",
    escalate:
      "您所述的内容可能超出本站的范围。我们先提供初步判断，并为您连接至中立平台“士業ドットコム”。这仅为初步判断，并非法律判断。",
    noTerms:
      "AI 目前暂时无法使用，因此无法为您归纳相关领域。请通过 LINE 或联系表单告诉我们您的情况，我们可以用中文回复。这仅为初步判断，并非法律判断。",
    serviceReason: "本事务所承办的服务",
    kentoUnknown: "（无法归纳出领域）",
  },
};

export function localConcierge(q: string, siteKey: "realestate" | "legal" | "labor", locale?: string): LinkaResult {
  // K-2a（2026-07-12）：4言語判定＋locale別メッセージ（既存jaパターンは不変＝isUrgent/isNameishが内包）
  if (isUrgent(q)) return { type: "escalation", demo: true, message: getEscalationMessage(locale) };
  if (isNameish(q)) return { type: "anonymization_request", demo: true, message: getAnonymizationMessage(locale) };
  // K-2c：デモ本文のロケール解決（不正値・未指定は ja ＝既存挙動）
  const d = DEMO_CONCIERGE[locale && locale in DEMO_CONCIERGE ? (locale as LangCode) : "ja"];
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
  const services = hit.map(({ s }) => ({ label: s.label, url: s.url, reason: d.serviceReason }));
  const escalate = services.length === 0 && terms.length > 0;
  return {
    type: "concierge", demo: true,
    kento: terms.length ? terms.slice(0, 4) : [d.kentoUnknown],
    // K-2c：terms が空（＝日本語キーワードに当たらない＝en/zh入力の典型）のときは、
    // 「AIが一時的に使えないので窓口へ」という利用者の言語の案内を出す（ja は normal と同一文字列＝回帰なし）。
    message: terms.length === 0 ? d.noTerms : escalate ? d.escalate : d.normal,
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
