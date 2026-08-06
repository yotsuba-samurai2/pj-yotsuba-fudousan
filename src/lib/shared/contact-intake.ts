// お問い合わせフォームの相談カテゴリ／流入元の共有コピー（2026-07-27・浦松承認）。
// ⚠️ クライアント安全ファイル：社労士事務所名（SR名）・office.ts由来の文言を置かないこと。
//    ContactForm（client）から参照する。
// Firestore翻訳辞書に新キーは増やさない（B1教訓）＝4ロケールは本ファイルに直書き。
//    手本＝property-intake.ts の BUKKEN_CATEGORY_LABEL 方式。
// ja=確定文言（浦松指示の趣旨）。en/zh-tw/zh=監修前ドラフト。
//
// 【背景】2026-07-27の実測で、AIモードで最も勝っているテーマ（相続）が
//   両フォームの選択肢に存在せず、7/25に投入した5ページ（親なき後・帰国・
//   外国人社員・赴任）の用件も全て「その他」行きになっていた。受け皿を作る。
import type { LangCode } from "@/config/languages";

/**
 * 本ファイルで追加する相談カテゴリのラベル（Firestore辞書に無いキー）。
 * 既存キー（rental/sale/management/subsidy/visa/labor/other）は
 * t("contact.form.categoryOptions.*") が引き続き担当する。
 * bukken は property-intake.ts の BUKKEN_CATEGORY_LABEL が担当（既存・変更なし）。
 * 管理者メールの表示ラベル（ja固定）は api/contact/route.ts の categoryLabels が対応する。
 */
export const EXTRA_CATEGORY_LABELS: Record<string, Record<LangCode, string>> = {
  // ---- 四葉不動産（realestate） ----
  souzoku: {
    ja: "相続した不動産のこと（貸す・売る・活用する）",
    en: "Inherited property (renting out, selling, or repurposing)",
    "zh-tw": "繼承的不動產（出租・出售・活用）",
    zh: "继承的不动产（出租・出售・活用）",
  },
  akiya: {
    ja: "空き家のこと",
    en: "A vacant house",
    "zh-tw": "空屋的相關問題",
    zh: "空置房屋的相关问题",
  },
  "foreign-housing": {
    ja: "外国人のお部屋探し・多言語対応",
    en: "Finding a home for non-Japanese residents (multilingual support)",
    "zh-tw": "外國人租屋・多語言對應",
    zh: "外国人租房・多语言对应",
  },
  // ---- 四葉行政書士事務所（legal） ----
  "souzoku-legal": {
    ja: "相続・遺言・信託",
    en: "Inheritance, wills and trusts",
    "zh-tw": "繼承・遺囑・信託",
    zh: "继承・遗嘱・信托",
  },
  oyanakiato: {
    ja: "親なき後の備え",
    en: "Planning for a child with disabilities after the parents are gone",
    "zh-tw": "「父母離世之後」的照護準備",
    zh: "“父母离世之后”的照护准备",
  },
  "shogai-fukushi": {
    ja: "障害福祉サービスの許認可（事業者の方）",
    en: "Licensing for disability welfare services (for operators)",
    "zh-tw": "身心障礙福利服務的許可申請（事業者）",
    zh: "残障福利服务的许可申请（经营者）",
  },
  "gaikokujin-shain": {
    ja: "外国人社員の受け入れ（企業の方）",
    en: "Hiring and hosting foreign employees (for companies)",
    "zh-tw": "外籍員工的聘僱與接納（企業）",
    zh: "外籍员工的聘用与接纳（企业）",
  },
  // 2026-08-06：育成就労の外部監査（定点#26・#27の受け皿ページ /legal/services/ikuseishuro-gaibu-kansa）。
  // 相談者は監理支援機関の許可を検討する事業者で、外国人本人でも受入企業でもないため独立のキーにする。
  "ikuseishuro-gaibu-kansa": {
    ja: "育成就労の外部監査（監理支援機関）",
    en: "External audit under the Employment for Skill Development system (supervising support organisations)",
    "zh-tw": "育成就勞的外部稽核（監理支援機關）",
    zh: "育成就劳的外部审计（监理支援机构）",
  },
  "kikoku-funin": {
    ja: "帰国・赴任の手続き",
    en: "Procedures for returning to Japan or taking up an overseas post",
    "zh-tw": "歸國・外派的相關手續",
    zh: "回国・外派的相关手续",
  },
  kyoninka: {
    ja: "会社設立・各種許認可",
    en: "Company formation and business licences",
    "zh-tw": "公司設立・各類許可申請",
    zh: "公司设立・各类许可申请",
  },
};

/**
 * 事業ごとに表示する相談カテゴリと並び順。
 * ここに列挙しないキーは、その事業のフォームには出さない（キー自体は削除しないので、
 * 他事業のフォームでは従来どおり表示される）。
 *
 * 2026-07-27 浦松承認：行政書士フォームには賃貸・売買・管理を出さない（不動産側の用件のため）。
 * 「社会保険・労務」は2026年9月開業まで現状維持のご指示につき、両事業とも従来どおり残す。
 * labor 事業（/labor/*・非公開）は定義を置かず CATEGORY_ORDER_DEFAULT ＝従来の並びのまま。
 */
export const CATEGORY_ORDER_BY_BUSINESS: Record<string, string[]> = {
  realestate: [
    "bukken",
    "rental",
    "sale",
    "management",
    "souzoku",
    "akiya",
    "foreign-housing",
    "subsidy",
    "visa",
    "labor",
    "other",
  ],
  legal: [
    "souzoku-legal",
    "oyanakiato",
    "shogai-fukushi",
    "gaikokujin-shain",
    "ikuseishuro-gaibu-kansa",
    "kikoku-funin",
    "kyoninka",
    "subsidy",
    "visa",
    "labor",
    "bukken",
    "other",
  ],
};

/** CATEGORY_ORDER_BY_BUSINESS に定義が無い事業で使う従来の並び（挙動を変えない） */
export const CATEGORY_ORDER_DEFAULT: string[] = [
  "bukken",
  "rental",
  "sale",
  "management",
  "subsidy",
  "visa",
  "labor",
  "other",
];

/**
 * 流入元（任意入力）。
 * AI検索の効果を測るため「AIに聞いて」と「検索結果」を必ず分ける（一括りにすると測定にならない）。
 * 送信値のラベル（ja固定・管理者メール用）は api/contact/route.ts の sourceLabels が対応する。
 */
export const SOURCE_FIELD_LABEL: Record<LangCode, string> = {
  ja: "どちらで四葉グループをお知りになりましたか（任意）",
  en: "How did you hear about the Yotsuba Group? (optional)",
  "zh-tw": "請問您是從何處得知四葉集團的？（選填）",
  zh: "请问您是从何处得知四叶集团的？（选填）",
};

export const SOURCE_PLACEHOLDER: Record<LangCode, string> = {
  ja: "選択してください（任意）",
  en: "Select (optional)",
  "zh-tw": "請選擇（選填）",
  zh: "请选择（选填）",
};

export const SOURCE_OPTIONS: { value: string; label: Record<LangCode, string> }[] = [
  {
    value: "ai",
    label: {
      ja: "ChatGPT・Claude などのAIに聞いて",
      en: "Asked an AI (ChatGPT, Claude, etc.)",
      "zh-tw": "詢問 ChatGPT・Claude 等AI",
      zh: "询问 ChatGPT・Claude 等AI",
    },
  },
  {
    value: "search",
    label: {
      ja: "Googleなどの検索結果",
      en: "Search results (Google, etc.)",
      "zh-tw": "Google 等搜尋結果",
      zh: "Google 等搜索结果",
    },
  },
  {
    value: "map",
    label: {
      ja: "Googleマップ",
      en: "Google Maps",
      "zh-tw": "Google 地圖",
      zh: "Google 地图",
    },
  },
  {
    value: "samurai",
    label: {
      ja: "士業ドットコム",
      en: "Samurai (shigyo.com)",
      "zh-tw": "士業.com（士業ドットコム）",
      zh: "士业.com（士業ドットコム）",
    },
  },
  {
    value: "referral",
    label: {
      ja: "知人・お客様のご紹介",
      en: "Referral from someone I know",
      "zh-tw": "親友或客戶介紹",
      zh: "亲友或客户介绍",
    },
  },
  {
    value: "sns",
    label: {
      ja: "SNS・note",
      en: "Social media or note",
      "zh-tw": "社群媒體・note",
      zh: "社交媒体・note",
    },
  },
  {
    value: "known",
    label: {
      ja: "以前から知っていた",
      en: "I already knew of you",
      "zh-tw": "原本就知道",
      zh: "原本就知道",
    },
  },
  {
    value: "other",
    label: {
      ja: "その他",
      en: "Other",
      "zh-tw": "其他",
      zh: "其他",
    },
  },
];
