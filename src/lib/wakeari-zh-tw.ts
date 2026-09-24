// 売りにくい土地・建物の出口相談（/wakeari 配下）の繁体字（zh-tw）共通文言。2026-09-24 Phase 3 で追加。
//
// 繁体字版を持つのは /wakeari/kyoyu と /wakeari/shakuchi-sokochi の2枚だけ（企画書 v1.0 §10 Phase 3・指示書 v2.0 §11）。
// ハブと再建築不可・狭小地は日本語のみ。繁体字ページからそれらへは日本語版の URL で「（日文）」と明示してリンクする。
//
// 【訳の決まり】
//   ・src/lib/wakeari.ts の固定文言（直答ブロック・留保・事業者主語の一文・分離受任の一文・役割表）の逐語訳。内容を足さない・削らない。
//   ・事業体名は日本語表記のまま（四葉不動産株式会社・四葉行政書士事務所）＝/souzoku/taiwan の zh-tw と同じ（luck428-column-seo 第9条）。
//   ・資格名は CannotHandle zh-tw の確定訳に揃える：司法書士〔日本的登記申請代理專業資格〕・稅理士〔日本的稅務專業資格〕・律師・分離受任・個別簽約・介紹費。
//   ・法令名は日本語の漢字のまま（民法・借地借家法・不動產登記法・宅地建物取引業法）。条項号は「第○條第○項第○號」。
//   ・買取は「以收購業者為買方的仲介」。「合作的（提携する）」は付けない（2026-09-24 浦松決定＝提携の書面は無い）。
//   ・禁止語（一站式・單一窗口・高價收購・最高價 等）を書かない。「一個窗口」は分離受任の一文と同じ部品内でのみ使う。
//
// ⚠️ クライアント安全：社労士事務所名・office.ts 由来の文言を置かない（wakeari.ts と同じ決まり）。
import type { WakeariRoleRow } from "@/lib/wakeari";

/** 繁体字版の最終更新日（ページの可視表示と ArticleJsonLd の dateModified を揃える） */
export const WAKEARI_TW_LAST_UPDATED_ISO = "2026-09-24";
export const WAKEARI_TW_LAST_UPDATED = "2026年9月24日";

/** Service JSON-LD の Offer（価格を書かない） */
export const WAKEARI_TW_SERVICE_OFFER = "免費諮詢";

/** 直答ブロック直下の留保1行（WAKEARI_ANSWER_RESERVATION の逐語訳） */
export const WAKEARI_TW_ANSWER_RESERVATION =
  "可否與價格的判斷，會在經過現場與公所的調查後，由有資格者（建築士・特定行政廳・司法書士・稅理士・律師）確認。共有物分割請求、與地主的紛爭等具爭訟性的程序，將為您引介律師。";

/** 事業者主語の一文（WAKEARI_PROVIDER_SENTENCE の逐語訳） */
export const WAKEARI_TW_PROVIDER_SENTENCE =
  "四葉不動産株式会社（宅地建物取引業 東京都知事(1)第113304號）以文京區小日向為據點，針對不可重建・共有・借地・狹小地的土地與建物，進行公所調查、出路比較與出售仲介。希望由業者收購時，以「以收購業者為買方的仲介」的形式，並列多家的報價供您比較。";

/** 分離受任の一文（WAKEARI_SEPARATION_NOTE の逐語訳。判定語＝獨立的事業體・分別簽約） */
export const WAKEARI_TW_SEPARATION_NOTE =
  "四葉不動産株式会社與四葉行政書士事務所，各以獨立的事業體受任業務，請分別簽約。登記請直接委託司法書士、稅務請直接委託稅理士、紛爭請直接委託律師，我們會說明各自直接委託的方式。本公司不收取介紹費。";

/** 役割表（WAKEARI_ROLE_ROWS の逐語訳・行の順番も同じ） */
export const WAKEARI_TW_ROLE_ROWS: WakeariRoleRow[] = [
  {
    what: "出售的仲介、尋找買方、說明價格的依據",
    who: "四葉不動産株式会社",
    note: "依據宅建業法第34條之2的仲介契約",
    ours: true,
  },
  {
    what: "收購",
    who: "收購業者（本公司為仲介）",
    note: "買方為收購業者。本公司依據與賣方的仲介契約，收取宅建業法第46條範圍內的報酬",
  },
  {
    what: "遺產分割協議書、繼承關係說明圖等文件的製作",
    who: "四葉行政書士事務所",
    note: "以獨立的事業體受任，請分別簽約",
  },
  {
    what: "繼承登記、持分移轉登記、表題登記",
    who: "司法書士〔日本的登記申請代理專業資格〕・土地家屋調查士",
    note: "說明直接委託的方式",
  },
  {
    what: "讓渡所得、遺產稅",
    who: "稅理士〔日本的稅務專業資格〕・稅務署",
    note: "本公司不參與",
  },
  {
    what: "共有物分割請求、借地非訟、與地主・共有人的紛爭",
    who: "律師",
    note: "說明直接委託的方式",
  },
  {
    what: "第43條第2項的認定・許可、可否建築、擋土牆的安全性",
    who: "建築士、特定行政廳（文京區）、建築審查會",
    note: "本公司不判斷可否",
  },
];

/** 役割表まわりの見出し・導入・列名・末尾リンク文 */
export const WAKEARI_TW_ROLE_TABLE = {
  heading: "該找誰諮詢？",
  introPlain: ["諮詢由一個窗口受理，但業務依資格分開。我們先說明", "哪項工作由誰負責", "。"] as const,
  cols: ["要做的事", "由誰", "備註"] as const,
  profileBefore: "代表・浦松丈二的經歷與資格請見",
  profileLabel: "代表簡介",
  ryokinBefore: "，費用的思考方式請見",
  ryokinLabel: "費用說明",
  after: "。",
} as const;

/** 「この記事の根拠」の見出し・列名・注記 */
export const WAKEARI_TW_SOURCES = {
  heading: "本頁的依據",
  cols: ["內容", "依據"] as const,
  lawNoteBefore:
    "條文於2026年9月23日透過 e-Gov 法令檢索（法令API）取得。各法令現行版的施行日（同日・法令API v2）：",
  lawNoteAfter: "。各條文的最終修正日未逐條查證（未檢證）。",
  generalInfo: "本頁為一般性資訊提供。",
  lastUpdatedLabel: "最終更新：",
  authorLabel: "執筆：",
  authorLink: "浦松丈二（四葉不動産株式会社 代表取締役・宅地建物取引士・行政書士）",
} as const;

/** 法令の現行版の施行日（WAKEARI_LAW_REVISIONS の繁体字表記） */
export const WAKEARI_TW_LAW_REVISIONS: { law: string; lawNum: string; currentRevisionDate: string; amendedBy: string }[] = [
  { law: "建築基準法", lawNum: "昭和25年法律第201號", currentRevisionDate: "2026年5月27日", amendedBy: "令和8年法律第23號" },
  { law: "建築基準法施行令", lawNum: "昭和25年政令第338號", currentRevisionDate: "2025年12月1日", amendedBy: "令和7年政令第377號" },
  { law: "民法", lawNum: "明治29年法律第89號", currentRevisionDate: "2026年6月24日", amendedBy: "令和8年法律第45號" },
  { law: "不動產登記法", lawNum: "平成16年法律第123號", currentRevisionDate: "2026年6月24日", amendedBy: "令和8年法律第46號" },
  { law: "借地借家法", lawNum: "平成3年法律第90號", currentRevisionDate: "2026年5月21日", amendedBy: "令和4年法律第48號" },
  { law: "宅地建物取引業法", lawNum: "昭和27年法律第176號", currentRevisionDate: "2026年4月1日", amendedBy: "令和7年法律第68號" },
];

/** 繁体字版のパンくず・リンクで使うラベル（日本語のみのページは「（日文）」を付ける） */
export const WAKEARI_TW_LABELS = {
  home: "首頁",
  hubJaOnly: "難以出售的土地・建物的出路諮詢（日文）",
  saikenchikuJaOnly: "不可重建的土地・房屋的出路（日文）",
  kyoshoJaOnly: "狹小地・旗竿地的出路（日文）",
  faqHeading: "常見問題",
  contact: "聯絡我們",
  ryokin: "費用說明",
} as const;

/** 繁体字版の署名（authorBio）。社労士の記載は SR_BIO を使わず、社名・登録番号の事実のみにする */
export const WAKEARI_TW_AUTHOR_BIO =
  "浦松 丈二｜四葉不動産株式会社 代表取締役・專任宅地建物取引士（東京）第293544號。行政書士（登錄號碼第25087022號）。前每日新聞中國總局長。";
