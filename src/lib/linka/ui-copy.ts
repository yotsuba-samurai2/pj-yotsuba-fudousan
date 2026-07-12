// フェーズK-2b｜LINKA UI文言の4ロケール集約（2026-07-12）
//
// 対象＝コーポレート3サイト（realestate / legal / labor）で表示されるUI文言。
// 士業ドットコム専用UI（会員モードの照会文パネル・候補カード・参考動画）は日本語のまま
// ＝あちらは日本語プラットフォームのため、本ファイルの対象外（コンポーネント側の直書きを維持）。
//
// ⚠️ 不変ルール：
//  1) labor の文言に**社労士事務所名を入れない**（クライアントバンドル漏れ防止＝全ロケールで汎用文言）。
//  2) disclaimer（免責・三禁則の説明）は**法的境界そのもの**。意味を弱める訳をしない。
//     en/zh の文面は【要監修】＝石井弁護士レビュー前（K-2aの安全メッセージと同じ扱い）。
//  3) ja は現行文字列を**そのまま**（表示回帰なし）。
//
// 三禁則（①選ばない ②判断しない ③機微を通さない）は文言でも崩さない：
// 「順位付け・推薦は行いません」「法律相談・法的判断はしません」「特定できる情報は入力しないでください」を全言語で保持。

import type { LangCode } from "@/config/languages";

/** コーポレート3サイト（concierge）の挨拶・クイックチップ */
export type SiteCopy = { greeting: string; chips: string[] };

export type LinkaUiCopy = {
  // FAB
  fabAria: string;
  fabChip: string;
  panelTitle: string;
  close: string;
  // ウィジェット共通
  thinking: string;
  placeholder: string;
  send: string;
  connError: string;
  disclaimer: string;
  // 結果カード
  escalationTitle: string;
  anonTitle: string;
  clarifyTitle: string;
  kentoLabel: string;
  demoBanner: string;
  servicesLabel: string;
  lineBtn: string;
  outOfScopeTitle: string;
  samuraiBtn: string;
  samuraiNote: string;
  columnsLabel: string;
  columnsNote: string;
  // サイト別（concierge）
  sites: { realestate: SiteCopy; legal: SiteCopy; labor: SiteCopy };
};

export const LINKA_UI: Record<LangCode, LinkaUiCopy> = {
  ja: {
    fabAria: "LINKA・AIに相談",
    fabChip: "AIに相談",
    panelTitle: "LINKA｜四葉のAIコンシェルジュ",
    close: "閉じる",
    thinking: "確認しています…",
    placeholder: "お困りごとを匿名で入力…(⌘/Ctrl+Enterで送信)",
    send: "送信",
    connError: "接続に失敗しました。時間をおいてもう一度お試しください。",
    disclaimer:
      "お名前・会社名など特定できる情報は入力しないでください。LINKAは分野の見当・自社サービスや相談先・公開コラムのご案内までを行い、法律相談・法的判断はしません。回答の正確性・最新性は保証されません。ファシリテートは無償・中立で、順位付け・推薦は行いません。",
    escalationTitle: "まず公的な窓口へ",
    anonTitle: "匿名化のお願い",
    clarifyTitle: "確認させてください",
    kentoLabel: "関わりそうな分野(見当)",
    demoBanner: "AI接続が使えないため、簡易検索(デモモード)で表示しています。",
    servicesLabel: "ご案内先",
    lineBtn: "LINEで一言相談(無料)",
    outOfScopeTitle: "当サイトの範囲外かもしれません",
    samuraiBtn: "士業ドットコムで相談先を探す",
    samuraiNote:
      "中立のプラットフォームが、複数の専門家を順位付けせずご案内します(送客手数料はありません)。",
    columnsLabel: "参考コラム(samurai.co.jp・一般的な解説)",
    columnsNote: "コラムは一般的な解説であり、個別のご事情への回答ではありません。",
    sites: {
      realestate: {
        greeting:
          "こんにちは、四葉不動産のLINKAです。相続の不動産・投資や事業用・お部屋探しなど、まずはお気軽にどうぞ。分野の見当と、四葉のご案内先をお示しします。",
        chips: ["相続の相談", "投資・事業用を探す", "お部屋探し", "外国人・多言語"],
      },
      legal: {
        greeting:
          "こんにちは、四葉行政書士事務所のLINKAです。障害福祉の指定・GH、在留資格・ビザ、相続、会社設立、補助金など、分野の見当と当事務所のご案内先をお示しします。",
        chips: ["障害福祉(指定/GH)", "在留資格・ビザ", "相続", "会社設立", "補助金"],
      },
      // labor＝事務所名を入れない汎用文言（バンドル漏れ防止）
      labor: {
        greeting:
          "こんにちは、LINKAです。処遇改善加算、介護・福祉の労務、雇用助成金、外国人雇用、障害年金など、分野の見当とご案内先をお示しします。",
        chips: ["処遇改善加算", "介護・福祉労務", "雇用助成金", "外国人雇用", "障害年金"],
      },
    },
  },

  en: {
    fabAria: "LINKA — ask the AI",
    fabChip: "Ask the AI",
    panelTitle: "LINKA — Yotsuba's AI concierge",
    close: "Close",
    thinking: "Checking…",
    placeholder: "Describe your situation anonymously… (⌘/Ctrl+Enter to send)",
    send: "Send",
    connError: "Connection failed. Please wait a moment and try again.",
    // 【要監修】法的境界の文言（石井弁護士レビュー前）
    disclaimer:
      "Please do not enter identifying information such as your name or company name. LINKA only suggests which fields may be involved and points you to our services, contact channels, and public columns. It does not provide legal advice and does not make legal judgments. The accuracy and currency of its answers are not guaranteed. Facilitation is free of charge and neutral: LINKA does not rank or recommend.",
    escalationTitle: "Please contact a public helpline first",
    anonTitle: "Please remove identifying details",
    clarifyTitle: "One thing to confirm",
    kentoLabel: "Fields likely involved (tentative)",
    demoBanner:
      "The AI connection is unavailable, so results are shown in simple search (demo) mode.",
    servicesLabel: "Where we can help",
    lineBtn: "Chat on LINE (free)",
    outOfScopeTitle: "This may be outside the scope of this site",
    samuraiBtn: "Find a professional on 士業ドットコム",
    samuraiNote:
      "A neutral platform introduces several professionals without ranking them (no referral fees are charged).",
    columnsLabel: "Related columns (samurai.co.jp — general explanations)",
    columnsNote:
      "Columns are general explanations and are not answers to your individual circumstances.",
    sites: {
      realestate: {
        greeting:
          "Hello, I'm LINKA of Yotsuba Real Estate. Inherited property, investment and business-use property, finding a place to live — feel free to start anywhere. I'll suggest which fields may be involved and where in Yotsuba to go next.",
        chips: ["Inheritance", "Investment / business-use", "Finding a home", "Multilingual support"],
      },
      legal: {
        greeting:
          "Hello, I'm LINKA of Yotsuba Gyoseishoshi Office. Disability-welfare designation and group homes, visas and residence status, inheritance, company formation, subsidies — I'll suggest which fields may be involved and where in our office to go next.",
        chips: [
          "Disability welfare (designation / group home)",
          "Visa & residence status",
          "Inheritance",
          "Company formation",
          "Subsidies",
        ],
      },
      // labor＝事務所名を入れない汎用文言（バンドル漏れ防止）
      labor: {
        greeting:
          "Hello, I'm LINKA. Treatment-improvement add-ons, labor management for care and welfare providers, employment grants, employing foreign workers, disability pensions — I'll suggest which fields may be involved and where to go next.",
        chips: [
          "Treatment-improvement add-on",
          "Care & welfare labor management",
          "Employment grants",
          "Employing foreign workers",
          "Disability pension",
        ],
      },
    },
  },

  "zh-tw": {
    fabAria: "LINKA・向AI諮詢",
    fabChip: "向AI諮詢",
    panelTitle: "LINKA｜四葉的AI管家",
    close: "關閉",
    thinking: "確認中…",
    placeholder: "請以匿名方式描述您的問題…（⌘/Ctrl+Enter 送出）",
    send: "送出",
    connError: "連線失敗。請稍候再試一次。",
    // 【要監修】法的境界の文言（石井弁護士レビュー前）
    disclaimer:
      "請勿輸入姓名・公司名稱等可識別身分的資訊。LINKA僅提供可能相關領域的初步判斷，並為您指引本公司的服務、諮詢窗口與公開專欄；不提供法律諮詢，也不做法律判斷。回答的正確性與即時性不予保證。引導服務為免費且中立，不進行排名或推薦。",
    escalationTitle: "請先聯繫公家窗口",
    anonTitle: "請以匿名方式提供",
    clarifyTitle: "想向您確認一下",
    kentoLabel: "可能相關的領域（初步判斷）",
    demoBanner: "由於無法連線AI，目前以簡易搜尋（示範模式）顯示。",
    servicesLabel: "為您指引",
    lineBtn: "用LINE諮詢（免費）",
    outOfScopeTitle: "這可能超出本網站的範圍",
    samuraiBtn: "在士業ドットコム尋找諮詢對象",
    samuraiNote: "由中立的平台為您介紹多位專家，不進行排名（不收取介紹費）。",
    columnsLabel: "參考專欄（samurai.co.jp・一般性說明）",
    columnsNote: "專欄為一般性說明，並非針對您個別情況的回覆。",
    sites: {
      realestate: {
        greeting:
          "您好，我是四葉不動産的LINKA。繼承的不動產、投資與事業用物件、找房等，都歡迎先聊聊。我會為您指出可能相關的領域，以及四葉的對應窗口。",
        chips: ["繼承諮詢", "尋找投資・事業用物件", "找房", "外國人・多語言"],
      },
      legal: {
        greeting:
          "您好，我是四葉行政書士事務所的LINKA。障礙福祉的指定・團體家屋、在留資格（簽證）、繼承、公司設立、補助金等，我會為您指出可能相關的領域與本事務所的對應窗口。",
        chips: ["障礙福祉（指定／團體家屋）", "在留資格・簽證", "繼承", "公司設立", "補助金"],
      },
      // labor＝事務所名を入れない汎用文言（バンドル漏れ防止）
      labor: {
        greeting:
          "您好，我是LINKA。待遇改善加算、照護・福祉的勞務管理、雇用相關補助、外國人雇用、身心障礙年金等，我會為您指出可能相關的領域與對應窗口。",
        chips: ["待遇改善加算", "照護・福祉勞務", "雇用相關補助", "外國人雇用", "身心障礙年金"],
      },
    },
  },

  zh: {
    fabAria: "LINKA・向AI咨询",
    fabChip: "向AI咨询",
    panelTitle: "LINKA｜四葉的AI管家",
    close: "关闭",
    thinking: "确认中…",
    placeholder: "请以匿名方式描述您的问题…（⌘/Ctrl+Enter 发送）",
    send: "发送",
    connError: "连接失败。请稍后再试一次。",
    // 【要監修】法的境界の文言（石井弁護士レビュー前）
    disclaimer:
      "请勿输入姓名・公司名称等可识别身份的信息。LINKA仅提供可能相关领域的初步判断，并为您指引本公司的服务、咨询窗口与公开专栏；不提供法律咨询，也不做法律判断。回答的准确性与时效性不予保证。引导服务免费且中立，不进行排名或推荐。",
    escalationTitle: "请先联系公共窗口",
    anonTitle: "请以匿名方式提供",
    clarifyTitle: "想向您确认一下",
    kentoLabel: "可能相关的领域（初步判断）",
    demoBanner: "由于无法连接AI，当前以简易搜索（演示模式）显示。",
    servicesLabel: "为您指引",
    lineBtn: "用LINE咨询（免费）",
    outOfScopeTitle: "这可能超出本网站的范围",
    samuraiBtn: "在士業ドットコム寻找咨询对象",
    samuraiNote: "由中立的平台为您介绍多位专家，不进行排名（不收取介绍费）。",
    columnsLabel: "参考专栏（samurai.co.jp・一般性说明）",
    columnsNote: "专栏为一般性说明，并非针对您个别情况的回复。",
    sites: {
      realestate: {
        greeting:
          "您好，我是四葉不動産的LINKA。继承的不动产、投资与事业用物件、找房等，都欢迎先聊聊。我会为您指出可能相关的领域，以及四葉的对应窗口。",
        chips: ["继承咨询", "寻找投资・事业用物件", "找房", "外国人・多语言"],
      },
      legal: {
        greeting:
          "您好，我是四葉行政書士事務所的LINKA。残障福祉的指定・团体家屋、在留资格（签证）、继承、公司设立、补助金等，我会为您指出可能相关的领域与本事务所的对应窗口。",
        chips: ["残障福祉（指定／团体家屋）", "在留资格・签证", "继承", "公司设立", "补助金"],
      },
      // labor＝事務所名を入れない汎用文言（バンドル漏れ防止）
      labor: {
        greeting:
          "您好，我是LINKA。待遇改善加算、护理・福祉的劳务管理、雇用相关补助、外国人雇用、残障年金等，我会为您指出可能相关的领域与对应窗口。",
        chips: ["待遇改善加算", "护理・福祉劳务", "雇用相关补助", "外国人雇用", "残障年金"],
      },
    },
  },
};

/** ロケール解決（未知・未対応は ja へフォールバック） */
export function linkaUi(locale: string): LinkaUiCopy {
  return LINKA_UI[locale as LangCode] ?? LINKA_UI.ja;
}
