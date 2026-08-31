import type { Metadata } from "next";
import { groupBusinesses } from "@/config/group";
import {
  SR_OFFICE_NAME,
  SR_OFFICE_NAME_ZH,
  SR_OFFICE_NAME_ZH_TW,
} from "@/lib/shared/sr-name";
import { GBP_URL } from "@/lib/shared/office-public";
import { DEFAULT_LOCALE, isValidLocale } from "@/lib/locale";
import type { LangCode } from "@/config/languages";

// ── Constants ──

export const SITE_URL = "https://luck428.com";

export const BUSINESS_URLS: Record<string, string> = {
  realestate: "https://luck428.com",
  legal: "https://luck428.com/legal",
  // 社労士（/labor維持＝2026-07-09浦松決定。旧yotsuba-labor.comは使わない）：
  // SR_LAUNCHED=true（開業日）まで登録しない＝robots.tsのsitemap一覧等へ露出しない。
  ...(process.env.NEXT_PUBLIC_SR_LAUNCHED === "true"
    ? { labor: "https://luck428.com/labor" }
    : {}),
};

export const SHARED_ORG_INFO = {
  name: "四葉グループ",
  nameEn: "YOTSUBA GROUP",
  representative: "浦松 丈二",
  representativeEn: "Joji Uramatsu",
  postalCode: "112-0006",
  streetAddress: "小日向４丁目２－５ 小日向安田ビル ２０３",
  addressLocality: "文京区",
  addressRegion: "東京都",
  addressCountry: "JP",
  telephone: "03-6161-9428",
  // FAX は3事業体で共通。可視表示（/contact・/legal/contact・/labor/contact・/access）と同一デプロイで追加した
  // ＝可視コンテンツ先行の原則（構造化データだけが先行しない）。表記は半角固定。
  faxNumber: "03-6161-2576",
  geo: { latitude: 35.715069, longitude: 139.739822 },
  foundingDate: "2025",
} as const;

export type OpeningHoursSpec = {
  dayOfWeek: string[];
  opens: string;
  closes: string;
};

/**
 * 事業別の営業時間（不動産と士業で異なる）
 * - 不動産: 月木金土日 10:00-18:00（火・水休）
 * - 行政書士・社労士: 火水 10:00-19:00 ＋ 月木金土日 18:00-19:00
 */
export const BUSINESS_HOURS: Record<
  string,
  { specs: OpeningHoursSpec[]; display: string }
> = {
  realestate: {
    specs: [
      {
        dayOfWeek: ["Monday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:00",
        closes: "18:00",
      },
    ],
    display: "10:00〜18:00（火・水休）",
  },
  legal: {
    specs: [
      { dayOfWeek: ["Tuesday", "Wednesday"], opens: "10:00", closes: "19:00" },
      {
        dayOfWeek: ["Monday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "18:00",
        closes: "19:00",
      },
    ],
    display: "火・水 10:00〜19:00 ／ 月・木・金・土・日 18:00〜19:00",
  },
  labor: {
    specs: [
      { dayOfWeek: ["Tuesday", "Wednesday"], opens: "10:00", closes: "19:00" },
      {
        dayOfWeek: ["Monday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "18:00",
        closes: "19:00",
      },
    ],
    display: "火・水 10:00〜19:00 ／ 月・木・金・土・日 18:00〜19:00",
  },
};

/** 代表者（浦松丈二）Personノードの共通@id — 全記事のauthor・全組織のfounderからこれを参照する */
export const PERSON_ID = "https://luck428.com/#uramatsu-joji";

/** 士業ドットコムの浦松個人ページ（実在確認済み 2026-07-08） */
export const SAMURAI_URAMATSU_URL =
  "https://www.samurai.co.jp/samurai/reserve/uramatsu-joji";

/**
 * 代表者（浦松丈二）の外部プロフィールURL（いずれも現物確認済み）。
 * 個人のSNS・ブログはここ（Person）にのみ載せる＝組織のsameAsへ混ぜない（Person/Org境界）。
 * gyosei-bunkyo.org＝東京都行政書士会文京支部の公式会員名簿・本人ページ（2026-07-10実在確認）。
 *
 * ミツモア・ゼヒトモの事業者ページは掲載名義こそ屋号／法人名だが、
 * 士業ドットコムの本人Person（@id=Q139738129相当）のsameAsに既に収載済み（2026-07-16本番実測14件）。
 * 同一URLをこちらでOrg側に寄せると両サイトでエンティティの主張が食い違うため、
 * samurai.co.jp側の実装に合わせてPersonに揃える（クロスサイト整合を優先）。
 */
export const PERSON_SAME_AS = [
  "https://www.wikidata.org/wiki/Q139738129",
  "https://orcid.org/0009-0007-0460-3473",
  "https://kyoto-u.academia.edu/JojiUramatsu",
  SAMURAI_URAMATSU_URL,
  "https://gyosei-bunkyo.org/membersearch/%e6%b5%a6%e6%9d%be-%e4%b8%88%e4%ba%8c.html",
  "https://note.com/luck428",
  "https://x.com/uramatsujoji",
  "https://www.facebook.com/uramatsujoji",
  "https://www.instagram.com/uramatsu_joji/",
  "https://www.threads.com/@uramatsu_joji",
  "https://www.linkedin.com/in/joji-uramatsu/",
  // ミツモア事業者ページ（2026-07-16現物確認・掲載名義＝四葉行政書士事務所／事業者確認済み）。
  // noarchive指定だがnoindexではないためsameAsとして有効。
  "https://meetsmore.com/p/aa9Wdr6tn3FAECg9",
  // ゼヒトモ事業者ページ（2026-07-16確認・本人/電話/メール認証済み）。
  // URLのパーセントエンコードは解かない（ゼヒトモ側の正規表記）。
  "https://www.zehitomo.com/profile/%E5%9B%9B%E8%91%89%E4%B8%8D%E5%8B%95%E7%94%A3%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE-27nhi0ukf/pro",
] as const;

/**
 * 代表者（浦松丈二）のPersonフルノード。/aboutのProfilePageで出力し、
 * 他所からは { "@id": PERSON_ID } で参照する（エンティティ外部シグナル強化仕様_v1 §1-1）。
 * 社労士関連（jobTitle・worksFor）は開業まで出力しない。
 */
export const PERSON_JSONLD = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "浦松 丈二",
  alternateName: ["浦松丈二", "うらまつ じょうじ", "Joji Uramatsu", "Uramatsu Joji"],
  // 同姓の別人（株式会社浦松興産・大分県別府市）との識別用に宅建登録番号を identifier で明示
  identifier: [
    {
      "@type": "PropertyValue",
      propertyID: "宅地建物取引士登録番号",
      value: "（東京）第293544号",
    },
  ],
  // jobTitle＝役職／資格はhasCredentialへ分離。
  // **jobTitle には社労士を入れない**（開業まで役職としては名乗らない）。
  //
  // 2026-08-09 訂正：旧コメントは「社労士関連は開業まで出力しない」と書いていたが、
  // 下の hasCredential には「社会保険労務士試験合格」を**意図的に出力している**（浦松判断）。
  // 実装とコメントが食い違っていたため、コメント側を実装に合わせた。
  // 試験に合格した事実は正確であり、credentialCategory に「試験合格」と明記して
  // 登録資格と区別している。可視テキストも4言語で「試験合格（2026年9月開業予定）」。
  jobTitle: ["四葉不動産株式会社 代表取締役", "四葉行政書士事務所 代表行政書士"],
  description:
    "元毎日新聞中国総局長（記者歴34年）。文京区小日向で四葉不動産株式会社・四葉行政書士事務所を営む。",
  url: "https://luck428.com/about",
  worksFor: [
    { "@id": "https://luck428.com/#organization" },
    { "@id": "https://luck428.com/legal/#organization" },
  ],
  // samurai.co.jp本番のPerson.hasCredentialと完全同一構造（クロスサイト整合・2026-07-16実測に合わせた）
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "行政書士",
      identifier: "第25087022号",
      recognizedBy: {
        "@type": "Organization",
        name: "日本行政書士会連合会",
        url: "https://www.gyosei.or.jp/",
      },
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "宅地建物取引士",
      identifier: "（東京）第293544号",
      recognizedBy: { "@type": "Organization", name: "登録先の都道府県知事" },
    },
    // ★★ 2026年9月1日に差し替えるとき、この2行は**必ず同時に**変える ★★
    //   credentialCategory: "社会保険労務士試験合格" → "社会保険労務士"
    //   identifier:         "令和7年 第202500525号"   → "第【登録番号】号"（登録番号）
    //   recognizedBy:       （なし）                  → 全国社会保険労務士会連合会
    //
    // 第202500525号は**試験合格番号であって登録番号ではない**。
    // 登録番号と同じ形の欄に同じ形の番号が入っているため取り違えやすい。
    // 片方だけ変えると「社会保険労務士：第202500525号（試験合格番号）」または
    // 「社会保険労務士試験合格：第【登録番号】号」という不整合になる。
    // → sr-credential.test.ts が両者の整合を検査する。
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "社会保険労務士試験合格",
      identifier: "令和7年 第202500525号",
    },
  ],
  memberOf: [
    {
      "@type": "Organization",
      name: "東京都行政書士会",
      url: "https://www.tokyo-gyosei.or.jp/",
    },
    {
      "@type": "Organization",
      name: "日本行政書士会連合会",
      url: "https://www.gyosei.or.jp/",
    },
  ],
  affiliation: [
    {
      "@type": "Organization",
      name: "東京都行政書士会 文京支部",
      url: "https://gyosei-bunkyo.org/",
    },
    {
      "@type": "Organization",
      name: "士業ドットコム",
      url: "https://www.samurai.co.jp/",
    },
  ],
  knowsLanguage: ["ja", "en", "zh"],
  sameAs: [...PERSON_SAME_AS],
} as const;

/**
 * 四葉不動産（RealEstateAgent）の外部プロフィールURL（Wikidata Q139738235＝現物確認済み）。
 * sameAs＝「同一エンティティの別ページ」のみ：
 * - 別事業体（/legal）を入れない（別エンティティの同一視＝業法分離と矛盾）
 * - 個人SNS・noteはPerson側にのみ（Person/Org境界）
 * 事業間の関係は founder（Person @id）と可視リンクで表現する。
 */
export const REALESTATE_SAME_AS = [
  "https://www.wikidata.org/wiki/Q139738235",
  // 【2026-07-25 浦松判断＝現状維持で確定】このURLは301で /samurai/reserve/uramatsu-joji へ
  // 転送される。士業ドットコム側の法人プロフィールを削除したことへの対策として意図的に入れた
  // リダイレクト（PR #91）であり、放置ではない。AI検索の索引に残った旧URLが404になる方が
  // 損失が大きいという判断。この行は残す。
  "https://www.samurai.co.jp/samurai/reserve/yotubahudousan",
  // GBP＝office-public.tsのGBP_URLを参照（値の二重管理をしない・cid形式の恒久URL）
  GBP_URL.realestate,
  // 東京都宅建協会 会員検索の当社詳細ページ（2026-07-10現物確認＝免許 知事(1)113304・商号・住所一致・HP欄=luck428.com）
  "https://www.tokyo-takken.or.jp/search-member/detail/31253",
  // ナレッジパネル（kgmid）＝JSON-LD修正P2（2026-07-11浦松承認済み仕様）
  "https://www.google.com/search?kgmid=/g/11ytdshcrj",
] as const;

/**
 * 四葉行政書士事務所（LegalService）の外部プロフィールURL（Wikidata Q139738259＝現物確認済み）。
 * 士業ドットコムに事務所単体ページは無い＝浦松個人ページはPerson.sameAs経由で接続（Orgへは混ぜない）。
 * 文京支部の会員名簿は本人名義ページのためPerson側に収載。
 */
export const LEGAL_SAME_AS = [
  "https://www.wikidata.org/wiki/Q139738259",
  // GBP＝office-public.tsのGBP_URLを参照（値の二重管理をしない・cid形式の恒久URL）。
  // 2026-07-25にshare.google短縮リンクから差し替え。理由：share.googleの共有リンクは
  // 再発行のたびに変わり、同一GBPに対して複数の短縮URLが並存することを実測で確認した
  // （qw9imD2snNKDEQS3Z と B5qzOGwxOTmhsSjYe がいずれも kgmid=/g/11z5sjqsxz に解決）。
  // sameAsは「同一実体の恒久URL」を宣言する場所のため、揺れる短縮URLは不適。
  GBP_URL.legal,
  // ナレッジパネル（kgmid）＝JSON-LD修正P2（2026-07-11浦松承認済み仕様）
  "https://www.google.com/search?kgmid=/g/11z5sjqsxz",
  // いい相続グループ（鎌倉新書・東証プライム）の当事務所プロフィール＝2026-07-20掲載確認。
  // 同一エンティティ（四葉行政書士事務所）の別ページ。Wikidata Q139738259 P973 にも同URLを登録済み。
  "https://www.i-sozoku.com/detail/oid1000790/",
  "https://egyoseishoshi.jp/detail/oid1000790",
  "https://www.sozoku-price.com/detail/120920",
] as const;

/**
 * 組織のmemberOf（公的所属団体）。会員ページ等で裏取りできたもののみ出力（監査原則）。
 * - 宅建協会・全宅保証＝会員検索詳細ページで確認（2026-07-10・正会員）
 * - 日本賃貸住宅管理協会＝2026-08-01に裏取り完了のため追加（下記）
 *
 * memberOf に入れる理由（sameAs ではない）：
 * 日管協側に当社単独の詳細ページは無く、掲載は東京都支部の正会員一覧（957社）の1行のみ。
 * sameAs は「同一実体を一意に指す恒久URL」を宣言する場所であり、多数社の一覧ページは
 * その条件を満たさない。所属の宣言は memberOf が正しいスロット。
 * 会員一覧URLは /about の可視「所属団体」ブロックからリンクしている（AboutPageContent.tsx と対で管理）。
 */
export const REALESTATE_MEMBER_OF = [
  {
    "@type": "Organization",
    name: "公益社団法人 東京都宅地建物取引業協会",
    url: "https://www.tokyo-takken.or.jp/",
  },
  {
    "@type": "Organization",
    name: "公益社団法人 全国宅地建物取引業保証協会",
    url: "https://www.zentaku.or.jp/",
  },
  {
    // 2026-08-01 現物確認：東京都支部 正会員一覧（all.php?cid=14）に
    // 「四葉不動産（株）」として掲載。リンク先 https://luck428.com/ ・rel なし（follow）・
    // 住所表記も当社の正式表記と一致。なお list.php?cid=14（先頭ページのみ）には出ない。
    "@type": "Organization",
    name: "公益財団法人 日本賃貸住宅管理協会",
    url: "https://www.jpm.jp/",
  },
] as const;

export const LEGAL_MEMBER_OF = [
  {
    "@type": "Organization",
    name: "東京都行政書士会",
    url: "https://www.tokyo-gyosei.or.jp/",
  },
  {
    "@type": "Organization",
    name: "日本行政書士会連合会",
    url: "https://www.gyosei.or.jp/",
  },
] as const;

/**
 * 四葉社会保険労務士事務所（ProfessionalService）の外部プロフィールURL。
 *
 * 【空である理由＝監査原則】sameAs は「同一エンティティの別ページ」を宣言する場所であり、
 * 裏取りできたものだけを出す。2026-09-01 時点で当事務所には次のいずれも存在しない。
 *   - Wikidata エンティティ（既存4件は 浦松個人 Q139738129／不動産 Q139738235／
 *     行政書士 Q139738259／士業ドットコム Q139738269。社労士事務所のQ番号は未作成）
 *   - Google ビジネスプロフィール（GBP 3件は不動産・行政書士・士業ドットコムのみ）
 *   - 士業ドットコムの事務所単体ページ（浦松個人ページは Person.sameAs 経由で接続する）
 *
 * 【重要・2026-09-01の事故】この定数が無かったため OrganizationJsonLd の分岐が
 * 「realestate 以外は LEGAL」の二分岐となり、**社労士事務所が行政書士事務所の
 * sameAs（Wikidata Q139738259・GBP・いい相続等）をそのまま出力していた**。
 * 機械には「四葉社会保険労務士事務所＝四葉行政書士事務所」と読める状態だった。
 * 別事業体を同一視する出力は業法分離と真っ向から矛盾する。空配列でも必ず明示的に持たせ、
 * 暗黙のフォールバックで他事業体の識別子を借りない。
 *
 * Wikidata・GBP を整備したらここに足す（値の二重管理を避けるため GBP は GBP_URL.labor を参照）。
 */
export const LABOR_SAME_AS = [] as const;

/**
 * 四葉社会保険労務士事務所の memberOf（公的所属団体）。
 *
 * 社会保険労務士は登録により当然に都道府県会および連合会に所属する（社労士法25条の29等）。
 * 浦松は2026-09-01付で登録され、同日 四葉社会保険労務士事務所を開設した。
 * URLは2026-09-01に実ページのtitleで裏取りした（東京都社会保険労務士会／全国社会保険労務士会連合会）。
 *
 * 【未検証】会員名簿ページでの個別掲載は未確認。登録番号の交付が2026年9月下旬のため、
 * 名簿反映はそれ以降になる見込み。掲載を確認できたら、その会員ページURLを sameAs 側へ移す。
 */
export const LABOR_MEMBER_OF = [
  {
    "@type": "Organization",
    name: "東京都社会保険労務士会",
    url: "https://www.tokyosr.jp/",
  },
  {
    "@type": "Organization",
    name: "全国社会保険労務士会連合会",
    url: "https://www.shakaihokenroumushi.jp/",
  },
] as const;

export type BusinessSEOConfig = {
  url: string;
  name: string;
  legalName: string;
  description: string;
  schemaType: string;
  ogImage: string;
  /** ogImage の実寸（og:image:width/height・twitter用）。実画像と必ず一致させる */
  ogImageWidth?: number;
  ogImageHeight?: number;
  /** JSON-LDのlogo/image用・正方形ロゴ（ルート相対。SNS共有用ogImageとは独立＝ogImage値は変更しない） */
  squareLogo?: string;
  /** GBP直リンク（JSON-LD hasMap・地図リンク用）。正本=office-public.tsのGBP_URL。labor＝GBP未整備のため未設定 */
  gbpUrl?: string;
  columnBasePath: string;
  /** 同名他社との識別用の別名（JSON-LD alternateName）。未設定＝name のみ */
  alternateNames?: string[];
  /** 法人番号（JSON-LD taxID）。法人でない事業体（事務所）は未設定 */
  taxID?: string;
  /** 公的識別子（JSON-LD identifier=PropertyValue）。法人番号・免許/登録番号など */
  identifiers?: { propertyID: string; value: string }[];
  /**
   * 事業体ごとの設立・開設日（JSON-LD foundingDate）。
   * 未設定なら SHARED_ORG_INFO.foundingDate（グループとしての "2025"）にフォールバックする。
   * 開設時期が異なる事業体は必ず自分の値を持つ（社労士事務所＝2026-09-01）。
   */
  foundingDate?: string;
};

export const BUSINESS_SEO: Record<string, BusinessSEOConfig> = {
  realestate: {
    url: "https://luck428.com",
    name: "四葉不動産",
    legalName: "四葉不動産株式会社",
    description:
      "元新聞記者が中国や台湾、タイでの駐在経験を活かして立ち上げた、東京都文京区にある不動産屋。賃貸・売買・管理から相続不動産まで、多言語（日本語・英語・中国語繁体字・中国語簡体字）対応と専門家ネットワークで住まい探しから契約まで対応。相続書類・許認可は併設の四葉行政書士事務所が別契約で受任します。ご相談は無料、お気軽にどうぞ。",
    schemaType: "RealEstateAgent",
    ogImage: "/og.png",
    ogImageWidth: 1322,
    ogImageHeight: 834,
    squareLogo: "/yotsuba/realestate-square.png",
    gbpUrl: GBP_URL.realestate,
    columnBasePath: "/column",
    // 同名他社（本駒込 1010001172596／静岡 7080001012468／港区 1010001100838 等）との識別。
    // 当社の法人番号は 7010001259396 のみ（文京区小日向・2025-10-15設立登記）。
    alternateNames: [
      "四葉不動産",
      "四葉不動産（文京区小日向）",
      "Yotsuba Real Estate",
      "Yotsuba Real Estate Co., Ltd.",
      "YOTSUBA REAL ESTATE",
    ],
    taxID: "7010001259396",
    identifiers: [
      { propertyID: "法人番号", value: "7010001259396" },
      { propertyID: "宅地建物取引業免許番号", value: "東京都知事(1)第113304号" },
    ],
  },
  legal: {
    url: "https://luck428.com/legal",
    name: "四葉行政書士事務所",
    legalName: "四葉行政書士事務所",
    // 原稿_行政書士サイト_v1.0 #10 の確定meta description（業際：雇用関係助成金＝社労士領域のため「助成金」を出さない）
    description:
      "東京都文京区小日向・茗荷谷駅徒歩5分の四葉行政書士事務所。障害福祉サービスの指定申請、在留資格・ビザ、相続、会社設立、補助金申請に対応。元毎日新聞中国総局長の行政書士が、中国語・英語も交え、書類作成から申請までお手伝いします。",
    schemaType: "LegalService",
    // 行政書士サイト既定のOG画像（SEO監査2026-08-24 P1-4で新設・1200×630）。
    // 旧実装は "" ＝ legal 全ページで og:image / twitter:image が出ず、
    // BlogPosting の image が /legal そのもの（非画像URL）になっていた。
    ogImage: "/yotsuba/legal-og.png",
    ogImageWidth: 1200,
    ogImageHeight: 630,
    squareLogo: "/yotsuba/legal-square.png",
    gbpUrl: GBP_URL.legal,
    columnBasePath: "/legal/column",
    alternateNames: [
      "四葉行政書士事務所",
      "Yotsuba Administrative Scrivener Office",
    ],
    identifiers: [
      { propertyID: "行政書士登録番号", value: "第25087022号" },
    ],
  },
  // 社労士：SR_LAUNCHED=true（開業日）までキー自体を登録しない（名称・説明の露出防止）
  ...(process.env.NEXT_PUBLIC_SR_LAUNCHED === "true"
    ? {
        labor: {
          url: "https://luck428.com/labor",
          name: SR_OFFICE_NAME, // 事務所名は実行時結合（法27条ソース漏れ対策＝sr-name.ts参照）
          legalName: SR_OFFICE_NAME,
          // 原稿_社労士サイト_v1.0 #1 の確定meta description
          description:
            `東京都文京区小日向・茗荷谷駅徒歩5分の${SR_OFFICE_NAME}。障害福祉・介護事業所の労務管理、処遇改善加算、社会保険手続き、雇用関係助成金、外国人介護人材の労務に対応。元新聞記者の社労士が、複雑な労務を整理してお手伝いします。`,
          schemaType: "ProfessionalService",
          // OG画像（2026-08-31 新設・1200×630）。legal と同じ体裁で作成。
          // 旧実装は "" ＝ labor 全ページで og:image / twitter:image が出ず、
          // OrganizationJsonLd の logo が `SITE_URL + ""`（＝サイトURL）に潰れていた。
          ogImage: "/yotsuba/labor-og.png",
          ogImageWidth: 1200,
          ogImageHeight: 630,
          squareLogo: "/yotsuba/labor-square.png",
          // GBP＝office-public.tsのGBP_URL.labor（cid設定後に自動で入る）。未設定のあいだは
          // OrganizationJsonLd が geo からの地図検索URLへフォールバックする
          gbpUrl: GBP_URL.labor,
          columnBasePath: "/labor/column",
          // 登録番号は2026年9月下旬交付予定のため identifiers はまだ置かない。
          // 交付後に { propertyID: "社会保険労務士登録番号", value: … } を追加する。
          // 事務所名は実行時結合のものだけを並べる。英訳は裏取りできていないため置かない
          // （英語の連続リテラルは sr-strip.ts の除去対象＝開業前にクライアントへ載せない）。
          alternateNames: [
            SR_OFFICE_NAME,
            SR_OFFICE_NAME_ZH_TW,
            SR_OFFICE_NAME_ZH,
          ],
          // 開設日＝2026-09-01（登録日と同日）。グループ共通の "2025" を継がせない。
          foundingDate: "2026-09-01",
        },
      }
    : {}),
};

// ── Helpers ──

/** パス断片を安全に連結（重複スラッシュ・空断片を除去） */
function joinPath(...segments: string[]): string {
  const parts = segments.flatMap((s) => s.split("/")).filter(Boolean);
  return parts.length ? `/${parts.join("/")}` : "/";
}

/**
 * マルチテナント×多言語のcanonical URL生成
 * 内部パス `/legal/about` + locale `en` → `https://luck428.com/en/legal/about`
 * 内部パス `/legal/about` + locale `ja`（デフォルト）→ `https://luck428.com/legal/about`
 */
export function canonicalUrl(
  businessKey: string,
  internalPath: string,
  locale: string = DEFAULT_LOCALE,
): string {
  const baseUrl = BUSINESS_URLS[businessKey] ?? SITE_URL;
  const biz = groupBusinesses.find((b) => b.key === businessKey);
  const prefix = biz?.pathPrefix ?? "/";

  const publicPath =
    prefix !== "/" && internalPath.startsWith(prefix)
      ? internalPath.slice(prefix.length) || "/"
      : internalPath;

  const { origin, pathname: basePath } = new URL(baseUrl);
  const localePrefix =
    isValidLocale(locale) && locale !== DEFAULT_LOCALE ? `/${locale}` : "";
  const path = joinPath(localePrefix, basePath, publicPath);

  return `${origin}${path === "/" ? "" : path}`;
}

/** 翻訳データからネストされたキーを取得 */
export function getNestedValue(
  data: Record<string, unknown>,
  key: string,
): string {
  const keys = key.split(".");
  let current: unknown = data;
  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = (current as Record<string, unknown>)[k];
    } else {
      return "";
    }
  }
  return typeof current === "string" ? current : "";
}

/** OG locale マッピング */
const OG_LOCALES: Record<string, string> = {
  ja: "ja_JP",
  en: "en_US",
  "zh-tw": "zh_TW",
  zh: "zh_CN",
};

/** hreflang の並び順（x-default はこの順で最初に「存在する」ロケールを指す＝全バリアントで同一値） */
const HREFLANG_ORDER: readonly LangCode[] = ["ja", "en", "zh-tw", "zh"];
/**
 * LangCode → BCP47 言語タグ。hreflang 属性値と JSON-LD の inLanguage で共用する
 * （2026-07-19 C-6-1：/global/chinese 多言語化で inLanguage 用途を追加。hreflang と単一情報源に保つ）。
 */
export const BCP47_BY_LOCALE: Record<LangCode, string> = {
  ja: "ja",
  en: "en",
  "zh-tw": "zh-Hant",
  zh: "zh-Hans",
};
const HREFLANG_ATTR = BCP47_BY_LOCALE;

/**
 * alternates.languages（hreflang）を生成する。
 * `availableLocales` 未指定＝全ロケール（従来挙動＝全ページで不変）。
 * コラム等、一部ロケールのみ公開のページは公開ロケール（`Column.locales`）だけを渡すことで、
 * 存在しないロケールURLを hreflang に出さない＝Googleに404を広告しない（GSC「見つかりませんでした」対策）。
 */
function buildHreflang(
  businessKey: string,
  path: string,
  availableLocales?: LangCode[],
): Record<string, string> {
  const locales = availableLocales?.length
    ? HREFLANG_ORDER.filter((l) => availableLocales.includes(l))
    : HREFLANG_ORDER;
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[HREFLANG_ATTR[l]] = canonicalUrl(businessKey, path, l);
  }
  // x-default＝優先順位で最初に存在するロケール（ja があれば ja、無ければ公開先頭）。
  const xDefault = locales[0] ?? DEFAULT_LOCALE;
  languages["x-default"] = canonicalUrl(businessKey, path, xDefault);
  return languages;
}

/**
 * 全ページ共通のMetadata生成
 */
export function buildPageMetadata({
  businessKey,
  title,
  description,
  path,
  image,
  keywords,
  type = "website",
  noindex = false,
  publishedTime,
  modifiedTime,
  section,
  locale = "ja",
  absoluteTitle = false,
  availableLocales,
}: {
  businessKey: string;
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  locale?: string;
  absoluteTitle?: boolean;
  /** このページが実在するロケール（hreflang をこのロケールに限定）。未指定＝全ロケール（従来挙動）。 */
  availableLocales?: LangCode[];
}): Metadata {
  // 【法27条・社労士 完全非表示の要】開業（SR_LAUNCHED=true）までは labor のメタデータを一切出力しない。
  // (labor)/layout.tsx の notFound() は「本文」しか止めない：Next.jsはページ側 generateMetadata を
  // 並行解決するため、404レスポンスの <title> に社労士事務所名が出てしまう
  // （2026-07-11 本番実測＝/labor の title に「四葉社会保険労務士事務所｜…障害福祉に強い社労士」が露出）。
  // labor全14ページが本ヘルパー経由のため、ここで一元遮断する（title/description/keywords/OG/canonicalすべて出さない）。
  // 開業時：Vercelの NEXT_PUBLIC_SR_LAUNCHED=true で自動的に通常のメタデータへ戻る。
  if (businessKey === "labor" && process.env.NEXT_PUBLIC_SR_LAUNCHED !== "true") {
    return { robots: { index: false, follow: false } };
  }

  const biz = BUSINESS_SEO[businessKey];
  const url = canonicalUrl(businessKey, path, locale);
  // ルート相対は正規ホストの絶対URLに解決する（legal配下は layout の metadataBase が
  // luck428gyosei.com のため、相対のままだと og:image が非正規ホストで出力される）
  const rawImage = image ?? biz?.ogImage ?? "";
  const ogImage = rawImage.startsWith("/") ? `${SITE_URL}${rawImage}` : rawImage;
  const hasImage = Boolean(ogImage);
  // 寸法は「事業既定のogImageを使うとき」だけ主張する（ページ個別画像は実寸不明のため出さない）
  const isDefaultImage = hasImage && rawImage === biz?.ogImage;
  const imageDims =
    isDefaultImage && biz?.ogImageWidth && biz?.ogImageHeight
      ? { width: biz.ogImageWidth, height: biz.ogImageHeight }
      : {};

  const ogBase = {
    title,
    description,
    url,
    siteName: biz?.name ?? "四葉グループ",
    locale: OG_LOCALES[locale] ?? "ja_JP",
    type,
    ...(hasImage
      ? {
          images: [
            {
              url: ogImage,
              ...imageDims,
              alt: title,
            },
          ],
        }
      : {}),
  };

  const articleFields =
    type === "article"
      ? {
          ...(publishedTime ? { publishedTime } : {}),
          ...(modifiedTime ? { modifiedTime } : {}),
          ...(section ? { section } : {}),
        }
      : {};

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: url,
      languages: buildHreflang(businessKey, path, availableLocales),
    },
    openGraph: { ...ogBase, ...articleFields },
    twitter: {
      // 1200×630級の横長画像を持つため大型カード（SEO監査2026-08-24 P1-4）
      card: hasImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(hasImage ? { images: [ogImage] } : {}),
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
