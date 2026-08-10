import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getAllColumnsAllLocales, getAllLegalColumnsAllLocales } from "@/lib/columns";
import { canonicalUrl } from "@/lib/seo";
import type { Column } from "@/lib/columns";

export const revalidate = 300;

const ALL_LOCALES = ["ja", "en", "zh-tw", "zh"] as const;
/** sitemap の xhtml:link hreflang 値（ページmetadataの alternates と同一マッピング） */
const HREFLANG: Record<string, string> = { ja: "ja", en: "en", "zh-tw": "zh-Hant", zh: "zh-Hans" };

type ChangeFreq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
type StaticPage = {
  path: string;
  changeFrequency: ChangeFreq;
  priority: number;
  /** このページが実在するロケール（未指定＝全4ロケール）。ja先行公開ページはjaのみ出す＝存在しないロケールURLを広告しない */
  locales?: readonly (typeof ALL_LOCALES)[number][];
};

/**
 * hreflang alternates を生成する。URL生成は canonicalUrl（＝ページmetadataの alternates と
 * 同一の単一情報源）を再利用し、ロケール接頭辞・マルチテナントのパス結合を一箇所に集約する。
 */
function alternatesFor(businessKey: string, path: string, locales: readonly string[]) {
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[HREFLANG[loc] ?? loc] = canonicalUrl(businessKey, path, loc);
  }
  return { languages };
}

/**
 * 固定ページを全4ロケールに展開。各ロケールURLを独立した <loc> として出力し、
 * それぞれに全4言語の hreflang alternates を付与する
 * （Next.js は配列1要素につき <url> 1件・<loc>=url のみを出すため、ロケール別に要素化しないと
 *  /en・/zh が <loc> として現れない）。
 */
function expandStatic(
  businessKey: string,
  page: StaticPage,
  lastModified: string,
): MetadataRoute.Sitemap {
  const locales = page.locales ?? ALL_LOCALES;
  const alternates = alternatesFor(businessKey, page.path, locales);
  return locales.map((loc) => ({
    url: canonicalUrl(businessKey, page.path, loc),
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    alternates,
  }));
}

/**
 * コラムを、そのコラムが実際に公開されているロケール（col.locales）のみ展開する
 * （存在しないロケールのURLを機械生成して404を量産しない）。locales 未設定＝後方互換で全4言語。
 * lastModified は frontmatter 相当の modifiedDate → date の順で採用（両方欠落時のみビルド時刻）。
 */
function expandColumn(
  businessKey: string,
  path: string,
  col: Column,
  fallbackModified: string,
): MetadataRoute.Sitemap {
  const active = col.locales && col.locales.length > 0 ? col.locales : [...ALL_LOCALES];
  const alternates = alternatesFor(businessKey, path, active);
  const lastModified = col.modifiedDate ?? col.date ?? fallbackModified;
  return active.map((loc) => ({
    url: canonicalUrl(businessKey, path, loc),
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.6,
    alternates,
  }));
}

const STATIC_REALESTATE: StaticPage[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/souzoku", changeFrequency: "monthly", priority: 0.9 },
  { path: "/souzoku/nagare", changeFrequency: "monthly", priority: 0.7 },
  // タスクC-4（2026-07-19）：相続空き家。C-6-2で zh-tw・zh を公開。
  // 【2026-08-10】en 版は COPY に実在し本番の /en/souzoku/akiya が英語本文を配信しているため en を追加。
  // ページ側の availableLocales（PAGE_LOCALES）と必ず一致させる＝存在しないロケールURLを広告しない。
  {
    path: "/souzoku/akiya",
    changeFrequency: "monthly",
    priority: 0.7,
    locales: ["ja", "en", "zh-tw", "zh"],
  },
  // 2026-07-22：グループホーム開設ピラー（#4/#5 最優先KPI）。物件＋指定申請の分離受任ハブ。手本＝souzoku（priority 0.9）。
  { path: "/group-home", changeFrequency: "monthly", priority: 0.9 },
  // 2026-07-22：シナジー領域ピラー（#11 飲食店開業・#15 会社設立×オフィス）。ja先行公開（/toushi/shitei-shinseiと同方式）。
  { path: "/inshokuten", changeFrequency: "monthly", priority: 0.8, locales: ["ja"] },
  { path: "/office", changeFrequency: "monthly", priority: 0.8, locales: ["ja"] },
  // 2026-07-22：民泊ピラー（#13）。ja先行公開。
  { path: "/minpaku", changeFrequency: "monthly", priority: 0.8, locales: ["ja"] },
  // 2026-07-22：介護事業所ピラー（#14）。ja先行公開。GH（/group-home）と福祉系開設クラスタ。
  { path: "/kaigo", changeFrequency: "monthly", priority: 0.8, locales: ["ja"] },
  // 2026-07-24：借り上げ社宅ピラー（#12）。ja先行公開。導入・社宅規程・物件の分離受任（宅建業×社労士×税務）。
  { path: "/shataku", changeFrequency: "monthly", priority: 0.8 },
  // 2026-07-25：本帰国ピラー（定点#18の入れ替え先）。ja先行公開。
  // 役割＝主語は「帰国というライフイベント」。/global（主語＝在留資格・読者＝外国人）とは読者が別。
  { path: "/kikoku", changeFrequency: "monthly", priority: 0.8, locales: ["ja"] },
  // 2026-07-25：東京赴任の住まい（ピラーC）。ja＋zh-tw。主語は「時間と距離」で /global と分ける。
  { path: "/funin", changeFrequency: "monthly", priority: 0.8, locales: ["ja", "zh-tw"] },
  // 2026-07-27：非居住者オーナー（定点#32の対応ページ）。ja先行公開。
  // 主語は「非居住者であること」＝/kikoku（戻る）・/funin（来る）・売却コラム（売る）と読者が別。
  { path: "/kaigai-owner", changeFrequency: "monthly", priority: 0.8, locales: ["ja"] },
  // 2026-08-09：緊急帰国・不動産スピード換金（特集・離日売却クラスタの主力）。同日中に ja→zh→en→zh-tw の全4ロケール公開。
  // 主語は「これから出国する所有者・時間がない」＝売却コラム（海外在住・急がない）・/kaigai-owner（持つ）と読者が別。
  { path: "/leaving-japan", changeFrequency: "weekly", priority: 0.8 },
  // 2026-07-27：地名×空き家の1本目（レーンB）。ja先行公開・akiyaクラスタの子。
  // 誘導ページ化を避けるため段階実装：本ページを2測定で判定してから2本目以降に進む。
  { path: "/souzoku/akiya/koishikawa", changeFrequency: "monthly", priority: 0.6, locales: ["ja"] },
  // 2026-07-22：台湾越境相続（#19）。ja先行公開・souzokuクラスタの子。2026-07-23 zh-tw追加。
  { path: "/souzoku/taiwan", changeFrequency: "monthly", priority: 0.7, locales: ["ja", "zh-tw"] },
  // 2026-07-25：中国語相続ハブ（#7）。ja先行公開・souzokuクラスタの子。ページ側 availableLocales:["ja"] と一致させる。
  { path: "/souzoku/chinese", changeFrequency: "monthly", priority: 0.7, locales: ["ja"] },
  { path: "/toushi", changeFrequency: "monthly", priority: 0.9 },
  { path: "/toushi/group-home", changeFrequency: "monthly", priority: 0.8 },
  // タスクC-2（2026-07-19）：指定申請と物件の分離受任。現フェーズ＝ja先行公開（/ryokinと同方式）
  { path: "/toushi/shitei-shinsei", changeFrequency: "monthly", priority: 0.7, locales: ["ja"] },
  { path: "/global", changeFrequency: "monthly", priority: 0.8 },
  // タスクC-3（2026-07-19）：中国語圏特化ハブ。C-6-1で zh-tw・zh を公開。
  // 【2026-08-10】en 版は COPY に実在し本番の /en/global/chinese が英語本文を配信しているため en を追加。
  // ページ側の availableLocales（PAGE_LOCALES）と必ず一致させる＝存在しないロケールURLを広告しない。
  {
    path: "/global/chinese",
    changeFrequency: "monthly",
    priority: 0.7,
    locales: ["ja", "en", "zh-tw", "zh"],
  },
  // タスクC-5（2026-07-19）：相談事例（モデルケース）。現フェーズ＝ja先行公開（/ryokinと同方式）
  { path: "/jirei", changeFrequency: "monthly", priority: 0.7, locales: ["ja"] },
  { path: "/access", changeFrequency: "monthly", priority: 0.7 },
  // 2026-07-28：相談先型クエリの受け皿。ja先行公開（多言語は指示書13で別途）。
  // 正本＝Drive「四葉_社労士開業2026_サイト切替設計」設計書 §1-3・§2-A-2
  { path: "/reasons", changeFrequency: "monthly", priority: 0.8, locales: ["ja"] },
  { path: "/network", changeFrequency: "monthly", priority: 0.7, locales: ["ja"] },
  // タスクB-1（2026-07-19）：不動産・料金ページ。C-6-3（2026-07-19）で en/zh-tw/zh を公開＝locales指定を解除（全4ロケール）
  { path: "/ryokin", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  // タスクB-2（2026-07-19）：代表者プロフィール。C-6-3（2026-07-19）で en/zh-tw/zh を公開＝locales指定を解除（全4ロケール）
  { path: "/about/uramatsu", changeFrequency: "monthly", priority: 0.6 },
  { path: "/column", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/legal-notice", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

const STATIC_LEGAL: StaticPage[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services/shogai-fukushi", changeFrequency: "monthly", priority: 0.9 },
  // 親なき後（2026-07-25新設）＝ja先行公開のため locales:["ja"]
  { path: "/services/oyanakiato", changeFrequency: "monthly", priority: 0.9, locales: ["ja"] },
  // 2026-07-25：外国人社員の受け入れ（企業向け・ピラーB）。ja先行公開。アポスティーユ／領事認証が中核資産。
  { path: "/services/gaikokujin-shain", changeFrequency: "monthly", priority: 0.9, locales: ["ja"] },
  { path: "/services/ikuseishuro-gaibu-kansa", changeFrequency: "monthly", priority: 0.9, locales: ["ja"] },
  { path: "/services/visa", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/inheritance", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/company", changeFrequency: "monthly", priority: 0.7 },
  { path: "/services/subsidy", changeFrequency: "monthly", priority: 0.7 },
  { path: "/ryokin", changeFrequency: "monthly", priority: 0.8 },
  { path: "/nagare", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/column", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
];

async function buildRealestateSitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const columns = await getAllColumnsAllLocales();
  return [
    ...STATIC_REALESTATE.flatMap((page) => expandStatic("realestate", page, now)),
    ...columns.flatMap((col) =>
      expandColumn("realestate", `/column/${col.slug}`, col, now),
    ),
  ];
}

async function buildLegalSitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const legalColumns = await getAllLegalColumnsAllLocales();
  return [
    ...STATIC_LEGAL.flatMap((page) => expandStatic("legal", page, now)),
    ...legalColumns.flatMap((col) =>
      expandColumn("legal", `/column/${col.slug}`, col, now),
    ),
  ];
}

/**
 * ホスト名で振り分け:
 * - luck428gyosei.com → 行政書士のsitemap
 * - それ以外 → 不動産＋行政書士の統合sitemap
 *
 * 2026-07-25統合（AI可視性強化#2・Bing/IndexNow対応の前提整備）：
 * 旧構成では robots.txt が /legal/sitemap.xml を広告していたが該当ルートは存在せず404、
 * luck428gyosei.com/sitemap.xml も404＝**legal配下（GHコラム23本・業務ページ）がどの
 * サイトマップにも載っていなかった**。legalページのcanonicalホストは luck428.com
 * （BUSINESS_URLS.legal）のため、本体 sitemap.xml に統合して配信する。
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const host = h.get("host") || "";

  if (host.includes("luck428gyosei.com")) {
    return buildLegalSitemap();
  }

  return [...(await buildRealestateSitemap()), ...(await buildLegalSitemap())];
}
