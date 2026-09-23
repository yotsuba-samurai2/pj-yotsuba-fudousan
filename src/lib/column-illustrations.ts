import type { LangCode } from "@/config/languages";
import type { BusinessKey, Column } from "@/lib/column-shared";

type LocalizedAlt = Record<LangCode, string>;

type IllustrationDefinition = {
  src: string;
  alt: LocalizedAlt;
};

export type ColumnIllustrationSource = "ogImage" | "slug" | "theme" | "fallback";

export type ResolvedColumnIllustration = {
  src: string;
  theme: string;
  source: ColumnIllustrationSource;
};

export type ColumnIllustrationInput = Pick<
  Column,
  "business" | "slug" | "title" | "category" | "tags" | "ogImage"
>;

const ILLUSTRATIONS = {
  "realestate-global": {
    src: "/hero/realestate-global-16x9.webp",
    alt: {
      ja: "海外と日本を結ぶ不動産相談のイメージ",
      en: "Illustration of cross-border real estate consultation in Japan",
      "zh-tw": "連結海外與日本的不動產諮詢示意圖",
      zh: "连接海外与日本的不动产咨询示意图",
    },
  },
  "realestate-group-home": {
    src: "/hero/realestate-group-home-16x9.webp",
    alt: {
      ja: "地域で暮らすグループホームと支援のイメージ",
      en: "Illustration of a community group home and support",
      "zh-tw": "社區團體家屋與生活支援示意圖",
      zh: "社区团体家屋与生活支持示意图",
    },
  },
  "realestate-shataku": {
    src: "/hero/realestate-shataku-16x9.webp",
    alt: {
      ja: "社宅向けの共同住宅と鍵のイメージ",
      en: "Illustration of company housing and a residential key",
      "zh-tw": "員工宿舍與住宅鑰匙示意圖",
      zh: "员工宿舍与住宅钥匙示意图",
    },
  },
  "realestate-toushi": {
    src: "/hero/realestate-toushi-16x9.webp",
    alt: {
      ja: "住宅と街並みから不動産活用を考えるイメージ",
      en: "Illustration of homes and streets for considering real estate use",
      "zh-tw": "從住宅與街景思考不動產活用的示意圖",
      zh: "从住宅与街景思考不动产活用的示意图",
    },
  },
  "bunkyo-sakura": {
    src: "/hero/bunkyo-sakura-16x9.webp",
    alt: {
      ja: "桜が咲く文京区の街並み",
      en: "A Bunkyo streetscape lined with cherry blossoms",
      "zh-tw": "櫻花盛開的文京區街景",
      zh: "樱花盛开的文京区街景",
    },
  },
  "legal-inheritance": {
    src: "/hero/legal-inheritance-16x9.webp",
    alt: {
      ja: "家族・住まい・相続書類を整理するイメージ",
      en: "Illustration of organizing family, housing, and inheritance documents",
      "zh-tw": "整理家族、住宅與繼承文件的示意圖",
      zh: "整理家庭、住宅与继承文件的示意图",
    },
  },
  "legal-visa": {
    src: "/hero/legal-visa-16x9.webp",
    alt: {
      ja: "旅券と地球儀で表す国際手続のイメージ",
      en: "Illustration of international procedures with a passport and globe",
      "zh-tw": "以護照與地球儀呈現國際手續的示意圖",
      zh: "以护照与地球仪呈现国际手续的示意图",
    },
  },
  "legal-company": {
    src: "/hero/legal-company-16x9.webp",
    alt: {
      ja: "事業所と申請書類を準備するイメージ",
      en: "Illustration of preparing business premises and application documents",
      "zh-tw": "準備營業場所與申請文件的示意圖",
      zh: "准备营业场所与申请文件的示意图",
    },
  },
  "legal-subsidy": {
    src: "/hero/legal-subsidy-16x9.webp",
    alt: {
      ja: "事業計画と資金計画を検討するイメージ",
      en: "Illustration of reviewing a business and funding plan",
      "zh-tw": "檢討事業計畫與資金計畫的示意圖",
      zh: "研究事业计划与资金计划的示意图",
    },
  },
  "legal-shogai-fukushi": {
    src: "/hero/legal-shogai-fukushi-16x9.webp",
    alt: {
      ja: "障害福祉の住まいと支援を考えるイメージ",
      en: "Illustration of housing and support in disability welfare",
      "zh-tw": "思考身心障礙福利住宅與支援的示意圖",
      zh: "思考残障福利住房与支持的示意图",
    },
  },
  "legal-top": {
    src: "/hero/legal-top-16x9.webp",
    alt: {
      ja: "書類を整えて行政手続を進めるイメージ",
      en: "Illustration of organizing documents for administrative procedures",
      "zh-tw": "整理文件並辦理行政手續的示意圖",
      zh: "整理文件并办理行政手续的示意图",
    },
  },
  "labor-gaibu-kansanin": {
    src: "/hero/labor-gaibu-kansanin-16x9.webp",
    alt: {
      ja: "資料を確認しながら外部監査を行うイメージ",
      en: "Illustration of an external audit and document review",
      "zh-tw": "查核文件並進行外部稽核的示意圖",
      zh: "核查文件并进行外部审计的示意图",
    },
  },
  "labor-gaikokujin-koyo": {
    src: "/hero/labor-gaikokujin-koyo-16x9.webp",
    alt: {
      ja: "多様な人材が働く職場づくりのイメージ",
      en: "Illustration of an inclusive workplace for international employees",
      "zh-tw": "多元人才共同工作的職場示意圖",
      zh: "多元人才共同工作的职场示意图",
    },
  },
  "labor-jinin-kijun-roumu": {
    src: "/hero/labor-jinin-kijun-roumu-16x9.webp",
    alt: {
      ja: "人事・賃金・労務制度を整えるイメージ",
      en: "Illustration of organizing HR, pay, and labor systems",
      "zh-tw": "建構人事、薪資與勞務制度的示意圖",
      zh: "建立人事、薪酬与劳动制度的示意图",
    },
  },
  "labor-joseikin": {
    src: "/hero/labor-joseikin-16x9.webp",
    alt: {
      ja: "助成金申請に向けて条件を確認するイメージ",
      en: "Illustration of checking eligibility for an employment subsidy",
      "zh-tw": "確認僱用相關補助金申請條件的示意圖",
      zh: "确认雇用相关补助金申请条件的示意图",
    },
  },
  "labor-kaigo-roumu": {
    src: "/hero/labor-kaigo-roumu-16x9.webp",
    alt: {
      ja: "介護・福祉事業所の労務管理を話し合うイメージ",
      en: "Illustration of discussing labor management in care and welfare services",
      "zh-tw": "討論照護與福利事業勞務管理的示意圖",
      zh: "讨论护理与福利事业劳动管理的示意图",
    },
  },
  "labor-saiyo": {
    src: "/hero/labor-saiyo-16x9.webp",
    alt: {
      ja: "採用面談と雇用書類のイメージ",
      en: "Illustration of a recruitment interview and employment documents",
      "zh-tw": "招募面談與僱用文件的示意圖",
      zh: "招聘面谈与雇用文件的示意图",
    },
  },
  "labor-shogai-nenkin": {
    src: "/hero/labor-shogai-nenkin-16x9.webp",
    alt: {
      ja: "障害年金と暮らしを支える手続のイメージ",
      en: "Illustration of disability pension procedures supporting daily life",
      "zh-tw": "以身心障礙年金手續支援生活的示意圖",
      zh: "以残障年金手续支持生活的示意图",
    },
  },
  "labor-shogu-kaizen": {
    src: "/hero/labor-shogu-kaizen-16x9.webp",
    alt: {
      ja: "福祉職場の処遇改善と公正な制度のイメージ",
      en: "Illustration of fair systems and improved working conditions in welfare",
      "zh-tw": "福利職場待遇改善與公平制度的示意圖",
      zh: "福利职场待遇改善与公平制度的示意图",
    },
  },
  "labor-top": {
    src: "/hero/labor-top-16x9.webp",
    alt: {
      ja: "福祉の現場と働く人を支えるイメージ",
      en: "Illustration of supporting welfare services and their workforce",
      "zh-tw": "支援福利服務現場與工作人員的示意圖",
      zh: "支持福利服务现场与工作人员的示意图",
    },
  },
} as const satisfies Record<string, IllustrationDefinition>;

type IllustrationTheme = keyof typeof ILLUSTRATIONS;

type ThemeRule = {
  theme: IllustrationTheme;
  keywords: readonly string[];
};

const THEME_RULES: Record<BusinessKey, readonly ThemeRule[]> = {
  realestate: [
    {
      theme: "realestate-group-home",
      keywords: ["グループホーム", "共同生活援助", "障害福祉", "福祉施設", "group-home"],
    },
    {
      theme: "realestate-global",
      keywords: [
        "外国人", "海外", "非居住者", "台湾", "台灣", "中国", "中国語圏",
        "在留", "cross-border", "taiwan", "foreign", "global",
      ],
    },
    {
      theme: "legal-inheritance",
      keywords: ["相続", "遺産", "空き家", "実家", "souzoku", "akiya", "inherit"],
    },
    {
      theme: "realestate-shataku",
      keywords: ["社宅", "社員寮", "法人契約", "corporate-housing", "shataku"],
    },
    {
      theme: "legal-company",
      keywords: [
        "事業用", "店舗", "事務所", "オフィス", "美容室", "理容所", "飲食店",
        "診療所", "物販", "倉庫", "工場", "営業所", "office", "shop", "restaurant",
      ],
    },
    {
      theme: "legal-subsidy",
      keywords: ["補助金", "助成金", "事業計画", "融資", "subsidy"],
    },
    {
      theme: "realestate-toushi",
      keywords: [
        "投資", "収益", "利回り", "一棟", "オーナーチェンジ", "賃貸経営",
        "土地活用", "不動産活用", "investment", "yield",
      ],
    },
    {
      theme: "bunkyo-sakura",
      keywords: ["文京区", "茗荷谷", "小石川", "春日", "後楽園", "bunkyo", "myogadani", "koishikawa"],
    },
  ],
  legal: [
    {
      theme: "legal-shogai-fukushi",
      keywords: [
        "障害福祉", "グループホーム", "共同生活援助", "放課後等デイ", "就労支援",
        "児童発達支援", "shogai", "welfare",
      ],
    },
    {
      theme: "legal-inheritance",
      keywords: ["相続", "遺言", "戸籍", "遺産", "家族信託", "成年後見", "souzoku", "inherit"],
    },
    {
      theme: "legal-visa",
      keywords: [
        "在留", "ビザ", "査証", "帰化", "永住", "外国人", "特定技能",
        "技能実習", "育成就労", "visa", "resident", "naturalization",
      ],
    },
    {
      theme: "legal-subsidy",
      keywords: ["補助金", "助成金", "事業計画", "資金計画", "subsidy"],
    },
    {
      theme: "legal-company",
      keywords: [
        "会社", "法人", "設立", "定款", "事業承継", "許認可", "営業許可",
        "建設業", "運送", "貨物", "旅館業", "民泊", "飲食店", "古物商",
        "company", "corporation", "permit", "license",
      ],
    },
  ],
  labor: [
    {
      theme: "labor-shogu-kaizen",
      keywords: ["処遇改善", "処遇改善加算", "ベースアップ等支援", "shogu-kaizen"],
    },
    {
      theme: "labor-shogai-nenkin",
      keywords: ["障害年金", "shogai-nenkin", "disability-pension"],
    },
    {
      theme: "labor-gaikokujin-koyo",
      keywords: [
        "外国人雇用", "特定技能", "技能実習", "育成就労", "在留資格",
        "gaikokujin", "foreign-worker", "foreign-employment",
      ],
    },
    {
      theme: "labor-gaibu-kansanin",
      keywords: ["外部監査", "監査人", "外部監査人", "gaibu-kansa", "external-audit"],
    },
    {
      theme: "labor-joseikin",
      keywords: ["助成金", "雇用関係助成金", "キャリアアップ助成金", "joseikin", "subsidy"],
    },
    {
      theme: "labor-kaigo-roumu",
      keywords: [
        "介護", "障害福祉", "福祉", "訪問看護", "放課後等デイ", "就労支援",
        "kaigo", "welfare", "care-worker",
      ],
    },
    {
      theme: "labor-saiyo",
      keywords: ["採用", "求人", "面接", "定着", "内定", "saiyo", "recruit"],
    },
    {
      theme: "labor-jinin-kijun-roumu",
      keywords: [
        "人事", "賃金", "給与", "評価", "就業規則", "労働時間", "社会保険",
        "雇用契約", "解雇", "ハラスメント", "安全衛生", "jinin", "payroll", "labor",
      ],
    },
  ],
};

const DEFAULT_THEME: Record<BusinessKey, IllustrationTheme> = {
  realestate: "realestate-toushi",
  legal: "legal-top",
  labor: "labor-jinin-kijun-roumu",
};

const SLUG_OVERRIDES: Partial<Record<BusinessKey, Record<string, IllustrationTheme>>> = {};

function normalizeOgImage(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("//")) return undefined;
  if (trimmed.startsWith("/")) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(?:javascript|data):/i.test(trimmed)) return undefined;
  return `/${trimmed.replace(/^public\//, "")}`;
}

function searchableText(column: ColumnIllustrationInput): string {
  return [column.slug, column.title, column.category, ...(column.tags ?? [])]
    .join(" ")
    .normalize("NFKC")
    .toLowerCase();
}

function resolvedTheme(
  theme: IllustrationTheme,
  source: Exclude<ColumnIllustrationSource, "ogImage">,
): ResolvedColumnIllustration {
  return { src: ILLUSTRATIONS[theme].src, theme, source };
}

export function resolveColumnIllustration(
  column: ColumnIllustrationInput,
): ResolvedColumnIllustration {
  const ogImage = normalizeOgImage(column.ogImage);
  if (ogImage) return { src: ogImage, theme: "article", source: "ogImage" };

  const override = SLUG_OVERRIDES[column.business]?.[column.slug];
  if (override) return resolvedTheme(override, "slug");

  const haystack = searchableText(column);
  const rule = THEME_RULES[column.business].find(({ keywords }) =>
    keywords.some((keyword) => haystack.includes(keyword.toLowerCase())),
  );
  if (rule) return resolvedTheme(rule.theme, "theme");

  return resolvedTheme(DEFAULT_THEME[column.business], "fallback");
}

const ARTICLE_ALT_PREFIX: Record<LangCode, (title: string) => string> = {
  ja: (title) => `「${title}」に関する記事画像`,
  en: (title) => `Article image for “${title}”`,
  "zh-tw": (title) => `「${title}」的文章圖片`,
  zh: (title) => `“${title}”的文章图片`,
};

export function getColumnIllustrationAlt(
  illustration: ResolvedColumnIllustration,
  locale: LangCode,
  localizedTitle: string,
): string {
  if (illustration.source === "ogImage") return ARTICLE_ALT_PREFIX[locale](localizedTitle);
  return ILLUSTRATIONS[illustration.theme as IllustrationTheme].alt[locale];
}

export function getColumnIllustrationAssetPaths(): string[] {
  return [...new Set(Object.values(ILLUSTRATIONS).map(({ src }) => src))];
}

export type ColumnIllustration = {
  src: `/hero/${string}`;
  alt: string;
};

export const COLUMN_ILLUSTRATIONS = {
  "realestate-souzoku": {
    src: "/hero/realestate-souzoku-16x9.webp",
    alt: "相続した実家を前に立つ二人の後ろ姿を描いた水彩イラスト",
  },
  "realestate-akiya": {
    src: "/hero/realestate-akiya-16x9.webp",
    alt: "雨戸を閉めたまま草の伸びた空き家を描いた水彩イラスト",
  },
  "realestate-isan-bunkatsu": {
    src: "/hero/realestate-isan-bunkatsu-16x9.webp",
    alt: "一軒の家が三つに分かれる様子と三人の後ろ姿を描いた水彩イラスト",
  },
  "realestate-baikyaku-satei": {
    src: "/hero/realestate-baikyaku-satei-16x9.webp",
    alt: "机に広げた間取り図と巻尺で不動産の査定をする場面の水彩イラスト",
  },
  "realestate-keiyaku-kessai": {
    src: "/hero/realestate-keiyaku-kessai-16x9.webp",
    alt: "決済の場で鍵が手渡される瞬間を描いた水彩イラスト",
  },
  "realestate-jouto-shotoku": {
    src: "/hero/realestate-jouto-shotoku-16x9.webp",
    alt: "申告書と電卓を並べた確定申告の準備を描いた水彩イラスト",
  },
  "realestate-youto-chiiki": {
    src: "/hero/realestate-youto-chiiki-16x9.webp",
    alt: "用途地域ごとに色分けされた街区を上空から見た水彩イラスト",
  },
  "realestate-jigyou-fudosan": {
    src: "/hero/realestate-jigyou-fudosan-16x9.webp",
    alt: "ガラス面に空が映る低層オフィスビルを描いた水彩イラスト",
  },
  "realestate-inshokuten": {
    src: "/hero/realestate-inshokuten-16x9.webp",
    alt: "無地の暖簾をかけた小さな飲食店の店先を描いた水彩イラスト",
  },
  "realestate-owner-change": {
    src: "/hero/realestate-owner-change-16x9.webp",
    alt: "灯りのともる集合住宅と並べて置かれた二本の鍵を描いた水彩イラスト",
  },
  "realestate-yuushi-deguchi": {
    src: "/hero/realestate-yuushi-deguchi-16x9.webp",
    alt: "育つ若木と高さの異なる矩形で収支の推移を表した水彩イラスト",
  },
  "realestate-taiwan-chuuka": {
    src: "/hero/realestate-taiwan-chuuka-16x9.webp",
    alt: "海を挟んで向かい合う二つの街並みを描いた水彩イラスト",
  },
  "realestate-rinichi": {
    src: "/hero/realestate-rinichi-16x9.webp",
    alt: "片付いた玄関に置かれた旅行鞄と戸口に立つ後ろ姿の水彩イラスト",
  },
  "legal-koseki-ichiranzu": {
    src: "/hero/legal-koseki-ichiranzu-16x9.webp",
    alt: "重ねた戸籍の帳面から人の関係が枝分かれする様子の水彩イラスト",
  },
  "legal-isan-bunkatsu-kyougi": {
    src: "/hero/legal-isan-bunkatsu-kyougi-16x9.webp",
    alt: "座卓を囲んで一枚の書面に向かう三人の後ろ姿を描いた水彩イラスト",
  },
  "legal-iryuubun": {
    src: "/hero/legal-iryuubun-16x9.webp",
    alt: "不均等に分かれた円の中で小さな一片が示される水彩イラスト",
  },
  "legal-yuigon": {
    src: "/hero/legal-yuigon-16x9.webp",
    alt: "文机に置かれた封をした和封筒と硯を描いた水彩イラスト",
  },
  "legal-ninni-kouken": {
    src: "/hero/legal-ninni-kouken-16x9.webp",
    alt: "年長者に寄り添う人の後ろ姿と小卓の帳面を描いた水彩イラスト",
  },
  "legal-souzoku-zei": {
    src: "/hero/legal-souzoku-zei-16x9.webp",
    alt: "三冊の帳面から伸びる線が一点に集まる専門家連携の水彩イラスト",
  },
  "legal-kyoninka": {
    src: "/hero/legal-kyoninka-16x9.webp",
    alt: "窓口カウンターに置かれた申請書の束を描いた水彩イラスト",
  },
  "legal-shitei-shinsei": {
    src: "/hero/legal-shitei-shinsei-16x9.webp",
    alt: "平面図の上に置かれた小さな建物模型を描いた水彩イラスト",
  },
  "legal-jinin-setsubi-kijun": {
    src: "/hero/legal-jinin-setsubi-kijun-16x9.webp",
    alt: "間取り図の各部屋に人型が配置された人員基準の水彩イラスト",
  },
  "legal-inshoku-ryokan": {
    src: "/hero/legal-inshoku-ryokan-16x9.webp",
    alt: "行灯のともる和風旅館の玄関と徳利を描いた水彩イラスト",
  },
  "legal-kensetsu-unsou": {
    src: "/hero/legal-kensetsu-unsou-16x9.webp",
    alt: "足場のある建設現場と小型トラック、ヘルメットの水彩イラスト",
  },
  "legal-kousho-ninshou": {
    src: "/hero/legal-kousho-ninshou-16x9.webp",
    alt: "リボンと封蝋で結ばれた二通の書類を描いた水彩イラスト",
  },
  "labor-shugyo-kisoku": {
    src: "/hero/labor-shugyo-kisoku-16x9.webp",
    alt: "付箋のはさまった就業規則の冊子を開いた机上の水彩イラスト",
  },
  "labor-roudou-jikan": {
    src: "/hero/labor-roudou-jikan-16x9.webp",
    alt: "壁の掛け時計と升目だけのシフト表を描いた水彩イラスト",
  },
  "labor-roudou-jouken": {
    src: "/hero/labor-roudou-jouken-16x9.webp",
    alt: "労働条件を記した書面が手渡される場面の水彩イラスト",
  },
  "labor-kyuyo-keisan": {
    src: "/hero/labor-kyuyo-keisan-16x9.webp",
    alt: "電卓と升目の一覧表、給与封筒を並べた机上の水彩イラスト",
  },
  "labor-shakai-hoken": {
    src: "/hero/labor-shakai-hoken-16x9.webp",
    alt: "淡い半円が人々を覆う社会保険の仕組みを表した水彩イラスト",
  },
  "labor-koyou-hoken": {
    src: "/hero/labor-koyou-hoken-16x9.webp",
    alt: "ヘルメットと救急箱、支える曲線を描いた労働保険の水彩イラスト",
  },
  "labor-taishoku-kaiko": {
    src: "/hero/labor-taishoku-kaiko-16x9.webp",
    alt: "片付いた机と空の椅子、私物の入った段ボール箱の水彩イラスト",
  },
  "labor-harassment": {
    src: "/hero/labor-harassment-16x9.webp",
    alt: "向かい合う椅子と空白の吹き出しを描いた相談窓口の水彩イラスト",
  },
  "labor-mental-health": {
    src: "/hero/labor-mental-health-16x9.webp",
    alt: "窓辺の椅子と曇りから晴れへ移る空、新しい芽を描いた水彩イラスト",
  },
} satisfies Record<string, ColumnIllustration>;
