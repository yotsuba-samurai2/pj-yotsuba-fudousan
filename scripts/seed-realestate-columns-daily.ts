/**
 * 不動産コラム 追記型シード（2026-08-22 新設）
 *
 * ■ これは「追記型」のスクリプトです。
 *   不動産コラム（luck428.com /column・business=realestate）を1本足すたびに
 *   枝番スクリプト（-p2 …… -p6）と専用の管理画面ページを新規作成する方式をやめ、
 *   このファイルの ARTICLES に1エントリ追記するだけで済む形にしたもの。
 *   枝番方式は1本あたり seed 約294行＋管理画面 約121行＝約415行の新規作成が必要だった。
 *   毎日2本の運用では1か月で -p66 まで増えるため、ここで止める。
 *
 * ■ 新しい枝番スクリプト（seed-realestate-columns-p7.ts 等）を作らないこと。
 *   管理画面も /admin/columns/seed-realestate-daily で固定。記事が増えてもページを増やさない。
 *
 * ■ 1本追加する手順
 *   1. 原稿 scripts/realestate-columns/NN-<slug>.md を書く
 *      （H1なし／「**結論（先に要点）**：」開始／H2は疑問文／FAQ4問以上／
 *        「## この記事の出典（一次情報）」節／「一般的な情報提供」の判断留保／
 *        分離受任の明示／紹介料の扱い／禁止語を使わない）
 *   2. 翻訳する言語だけ scripts/realestate-columns/{en,zh-tw,zh}/NN-<slug>.md を書く
 *      （frontmatter に title / excerpt / category。内部リンクは絶対URL。相対パスはNG）
 *   3. 下の ARTICLES に1エントリ追記する（publishedAt と category は記事ごとに持たせる）
 *   4. npx tsx scripts/seed-realestate-columns-daily.ts → 「OK: 全チェック通過」を確認
 *   5. npx tsx scripts/seed-realestate-columns-daily.ts --emit-ts
 *      → src/lib/data/realestate-columns-daily-seed.ts を再生成（忘れると管理画面に並ばない）
 *   6. PRを出す（マージは浦松の指示を受けてから）
 *   7. マージ・デプロイ後に /admin/columns/seed-realestate-daily から投入
 *
 * ■ 既存記事をここへ移管しないこと。
 *   scripts/gh-columns/06-youto-henko.md は2つのスクリプトから同一slugを生成しており、
 *   片方だけ再emitすると本文が巻き戻る事故の種になっている。同じ轍を踏まないため、
 *   ARTICLES には「このスクリプトで新規に足した記事」だけを入れる。
 *   既存の枝番スクリプトと生成物（realestate-columns{,-p2..-p6}-seed.ts）は触らない。
 *
 * 使い方:
 *   npx tsx scripts/seed-realestate-columns-daily.ts            # dry-run（scripts/realestate-columns-daily.preview.json）
 *   npx tsx scripts/seed-realestate-columns-daily.ts --emit-ts  # src/lib/data/realestate-columns-daily-seed.ts を生成
 *
 * 本番投入は /admin/columns/seed-realestate-daily（管理者セッション経由・冪等upsert）を正とする。
 * --write は用意しない（このスクリプトはDBに書き込まない）。
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

import { AKIYA_GH_TENYO_SEED } from "../src/lib/data/akiya-gh-tenyo-seed";
import { HIKYOJUSHA_GAITAMEHO_COLUMN } from "../src/lib/data/hikyojusha-gaitameho-column-seed";
import { LEAVING_JAPAN_COLUMNS_SEED } from "../src/lib/data/leaving-japan-columns-seed";
import { REALESTATE_COLUMNS_P2_SEED } from "../src/lib/data/realestate-columns-p2-seed";
import { REALESTATE_COLUMNS_P3_SEED } from "../src/lib/data/realestate-columns-p3-seed";
import { REALESTATE_COLUMNS_P4_SEED } from "../src/lib/data/realestate-columns-p4-seed";
import { REALESTATE_COLUMNS_P5_SEED } from "../src/lib/data/realestate-columns-p5-seed";
import { REALESTATE_COLUMNS_P6_SEED } from "../src/lib/data/realestate-columns-p6-seed";
import { REALESTATE_COLUMNS_SEED } from "../src/lib/data/realestate-columns-seed";
import { SOUZOKU_JIKKA_SEED } from "../src/lib/data/souzoku-jikka-seed";
import { TAIWAN_COLUMNS_SEED } from "../src/lib/data/taiwan-columns-seed";
import { TOCHINE_YOSEKIRITSU_SEED } from "../src/lib/data/tochine-yosekiritsu-seed";

type Faq = { question: string; answer: string };

type Translation = {
  title: string;
  excerpt: string;
  content: string;
  category?: string;
};

type SeedColumn = {
  business: "realestate";
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  status: "published";
  author: { name: string; title: string };
  keywords: string[];
  tags: string[];
  locales: string[];
  faq: Faq[];
  translations?: { en?: Translation; "zh-tw"?: Translation; zh?: Translation };
};

const AUTHOR = {
  name: "浦松 丈二",
  title: "代表取締役・宅地建物取引士（四葉不動産株式会社）",
} as const;

const FORBIDDEN_WORDS = ["ワンストップ", "一括対応", "一体で", "一気通貫", "one-stop", "一站式"];

/**
 * 内部リンク先（/column/<slug>）の許可リスト。
 *
 * 手で維持しない。既存の realestate 系シード生成物から実行時に集める。
 * /column は business=realestate 専用ルート（社労士は /labor/column、行政書士は /legal/column）なので、
 * business で絞ってから slug を取る。記事を1本追加するときにこのリストを触る必要はない。
 *
 * ここに並ぶのは「realestate のコラムを1本でも含む src/lib/data の生成物」。
 * 枝番スクリプトを新設しない限り増えない（増やさないのが本スクリプトの目的）。
 *
 * ■ ただしリポジトリ由来だけでは足りない（2026-08-23 追記）
 *   管理画面から直接作られてリポジトリに原稿が無い記事が本番に実在する。
 *   例: /column/inuki-bukken-keiyakumae-hokenjo は本番で200を返すが、
 *   どの seed 生成物にも定義がないためこの Set に載らない。
 *   その結果 2026-08-23 に GitHub Actions の検証が
 *   「NG: shinya-shurui-inshoku-bukken-tekihi → 不明slug inuki-bukken-keiyakumae-hokenjo」
 *   で落ちた（2026-08-22 にも同じNGが出て、そのときは記事側のリンクを
 *   差し替えて回避している。原因が消えていないので再発した）。
 *   実在するURLを弾くのは検査の誤りなので、main() で本番 sitemap 由来の
 *   /column/<slug> を union して埋める（下の fetchPublishedColumnSlugs）。
 *   これは緩和ではない。実在しない slug は今までどおり NG で落ちる。
 *
 * union するので const ではなく let。
 */
let EXISTING_COLUMN_SLUGS: Set<string> = new Set(
  [
    REALESTATE_COLUMNS_SEED,
    REALESTATE_COLUMNS_P2_SEED,
    REALESTATE_COLUMNS_P3_SEED,
    REALESTATE_COLUMNS_P4_SEED,
    REALESTATE_COLUMNS_P5_SEED,
    REALESTATE_COLUMNS_P6_SEED,
    SOUZOKU_JIKKA_SEED,
    AKIYA_GH_TENYO_SEED,
    TOCHINE_YOSEKIRITSU_SEED,
    LEAVING_JAPAN_COLUMNS_SEED,
    TAIWAN_COLUMNS_SEED,
    HIKYOJUSHA_GAITAMEHO_COLUMN,
  ]
    .flat()
    .filter((c) => c.business === "realestate")
    .map((c) => c.slug),
);

const SITEMAP_URL = "https://luck428.com/sitemap.xml";
const SITEMAP_TIMEOUT_MS = 15_000;

/**
 * 他士業ルートに実在する slug（slug → その士業のルート接頭辞）。
 *
 * 用途は「NGメッセージに理由を添える」ことだけ。許可リストには入れない。
 * /column は business=realestate 専用ルートなので、行政書士・社労士の記事へ
 * /column/<slug> でリンクしたものは今までどおり NG で落とす（緩和しない）。
 *
 * 2026-08-24 の Daily Columns はこれで落ちた。slug は実在するのに
 * ルート接頭辞だけ間違っている、というのは NG 文面からは読み取れなかった。
 */
let OTHER_BUSINESS_COLUMN_SLUGS: Map<string, { prefix: string; label: string }> = new Map();

/** sitemap から拾う他士業ルート（/column は realestate 専用なのでここには入れない）。 */
const OTHER_BUSINESS_ROUTES = [
  { prefix: "/legal/column", label: "行政書士側" },
  { prefix: "/labor/column", label: "社労士側" },
] as const;

type PublishedSlugs = {
  /** 許可リストに union する realestate の slug。 */
  realestate: string[];
  /** ヒント専用。他士業ルートに実在する slug → そのルート接頭辞。 */
  other: Map<string, { prefix: string; label: string }>;
};

/**
 * 本番 sitemap に実在する /column/<slug> を集める。
 *
 * 拾うのは日本語の実体URL（`<loc>https://luck428.com/column/<slug></loc>`）だけ。
 * - ロケール接頭辞つき（/en/column/ /zh-tw/column/ /zh/column/）は拾わない。
 *   記事本文の内部リンクは日本語URLで書く決まりなので、許可リストに入れる意味がない。
 * - 他士業の /legal/column/ /labor/column/ は許可リストには入れない
 *   （/column は business=realestate 専用ルート）。ただし「slug は実在するが
 *   ルート接頭辞が別士業」という取り違えを NG 文面で言い当てるために、
 *   別枠（other）で集めて返す。許可リストが緩むわけではない。
 * - `<xhtml:link rel="alternate" href="…">` は `<loc>` ではないので、この正規表現には入らない。
 *
 * 取得に失敗しても検証は止めない。sitemap が引けないのは記事の不備ではないので
 * NG ではなく WARN を出し、リポジトリ由来の許可リストだけで続行する
 * （実在しない slug はその場合も NG のまま落ちる）。
 *
 * @returns realestate= 許可リストに union する slug、other= 他士業ルートに実在する
 *   slug の対応表（ヒント専用、許可リストには入れない）。取得できなかったときは null。
 */
async function fetchPublishedColumnSlugs(): Promise<PublishedSlugs | null> {
  let res: Response;
  try {
    res = await fetch(SITEMAP_URL, { signal: AbortSignal.timeout(SITEMAP_TIMEOUT_MS) });
  } catch (e) {
    const reason = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    console.log(`WARN: sitemap を取得できませんでした（${reason}）。リポジトリ由来の許可リストだけで検証を続行します。`);
    return null;
  }
  if (!res.ok) {
    console.log(`WARN: sitemap の取得に失敗（HTTP ${res.status}）。リポジトリ由来の許可リストだけで検証を続行します。`);
    return null;
  }
  let xml: string;
  try {
    xml = await res.text();
  } catch (e) {
    const reason = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    console.log(`WARN: sitemap の読み出しに失敗（${reason}）。リポジトリ由来の許可リストだけで検証を続行します。`);
    return null;
  }
  const re = /<loc>https:\/\/luck428\.com\/column\/([a-z0-9-]+)<\/loc>/g;
  const realestate = [...xml.matchAll(re)].map((m) => m[1]);

  // 他士業ルートは許可リストではなくヒント用に集める（用途の違いは上の宣言のコメント参照）。
  const other = new Map<string, { prefix: string; label: string }>();
  for (const route of OTHER_BUSINESS_ROUTES) {
    const rx = new RegExp(
      `<loc>https://luck428\\.com${route.prefix.replace(/\//g, "\\/")}/([a-z0-9-]+)</loc>`,
      "g",
    );
    for (const m of xml.matchAll(rx)) {
      if (!other.has(m[1])) other.set(m[1], route);
    }
  }
  return { realestate, other };
}

type ArticleSpec = {
  /** scripts/realestate-columns/ 配下のファイル名（翻訳も同名で {en,zh-tw,zh}/ 配下に置く） */
  file: string;
  slug: string;
  title: string;
  /** 記事ごとの公開日（YYYY-MM-DD）。バッチ共通の定数にしない */
  publishedAt: string;
  /** 記事ごとのカテゴリ。バッチ共通の定数にしない */
  category: string;
  excerpt: string;
  keywords: string[];
  tags: string[];
  locales: string[];
  localesWithTranslations?: Array<"zh" | "zh-tw" | "en">;
  /** 本文に必ず出す送出先（/office など）。全件の存在を verify で確認する */
  hubLinks: string[];
};

/**
 * 追記していく配列。ここに1エントリ足すのが「1本追加する」の実体。
 *
 * テンプレート（コピーして使う）:
 *   {
 *     file: "12-<slug>.md",
 *     slug: "<slug>",
 *     title: "……",
 *     publishedAt: "2026-08-23",
 *     category: "投資・事業用不動産",
 *     excerpt: "……",
 *     keywords: ["……"],
 *     tags: ["……"],
 *     locales: ["ja"],
 *     localesWithTranslations: [],
 *     hubLinks: ["/toushi"],
 *   },
 */
const ARTICLES: ArticleSpec[] = [
  {
    file: "12-clinic-bukken-youto-chiiki-kaisetsu-todokede.md",
    slug: "clinic-bukken-youto-chiiki-kaisetsu-todokede",
    title: "クリニックの物件は、契約前に何を確認するのか──用途地域・用途変更・開設届の順番",
    publishedAt: "2026-08-22",
    category: "投資・事業用不動産",
    excerpt:
      "診療所は用途地域の制限では13地域すべてで建てられます。物件で詰まるのは用途地域ではなく、有床か無床か、用途変更の確認申請の要否、消防用設備の現況、そして開設者が個人か医療法人か。東京都文京区の宅地建物取引士兼行政書士が、契約前に確認できることを条文と自治体の案内から順に整理します。",
    keywords: [
      "クリニック 物件",
      "診療所 用途地域",
      "診療所 用途変更 確認申請",
      "診療所開設届",
      "医療法人 診療所 開設許可",
    ],
    tags: ["事業用不動産", "許認可", "用途地域", "消防法"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/toushi", "/office"],
  },
  {
    file: "13-souzoku-shakuchi-jinushi-shodaku-baikyaku.md",
    slug: "souzoku-shakuchi-jinushi-shodaku-baikyaku",
    title: "相続した家が借地だった──地主の承諾がいる場面・いらない場面と、売るときの順番",
    publishedAt: "2026-08-22",
    category: "相続",
    excerpt:
      "相続で借地上の建物を引き継ぐこと自体に、地主の承諾は要りません。承諾が要るのは売るときです。旧法と新法の分かれ目、建物の登記が対抗力の土台になること、売る前に集める書類まで、東京都文京区の宅地建物取引士兼行政書士が条文から整理します。",
    keywords: [
      "借地権 相続",
      "借地 地主 承諾",
      "借地権 売却",
      "借地非訟 承諾に代わる許可",
      "旧借地法 借地借家法 違い",
    ],
    tags: ["相続", "借地権", "売却"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/souzoku"],
  },
  {
    file: "14-unsou-eigyosho-shako-bukken-yoken.md",
    slug: "unsou-eigyosho-shako-bukken-yoken",
    title: "運送業を始めるなら、営業所と車庫の物件はどこを見て選ぶか",
    publishedAt: "2026-08-23",
    category: "投資・事業用不動産",
    excerpt:
      "運送業（緑ナンバー）の物件で詰まるのは用途地域ではありません。営業所と車庫が市街化調整区域でないか、両者の直線距離が公示の範囲内か、車庫が全車両を収容でき前面道路が通れる幅員か、休憩施設を営業所か車庫に併設できるか。東京都文京区の宅地建物取引士兼行政書士が、契約前に確認できることを条文と公示から順に整理します。",
    keywords: [
      "運送業 物件",
      "一般貨物 営業所 車庫",
      "運送業 車庫 要件",
      "営業所 車庫 距離",
      "運送業 市街化調整区域",
    ],
    tags: ["事業用不動産", "許認可", "運送業", "市街化調整区域"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/toushi", "/office"],
  },
  {
    file: "15-souzoku-nochi-baikyaku-kashidashi-nagare.md",
    slug: "souzoku-nochi-baikyaku-kashidashi-nagare",
    title: "相続した農地を売る・貸すときに最初に確認すること",
    publishedAt: "2026-08-23",
    category: "相続",
    excerpt:
      "相続した農地は、売る・貸す前に「農地のままか、宅地などに転用するか」で手続きが分かれます。農地のまま耕作目的で売買・貸借するには農業委員会の許可（農地法第3条）、転用して売るには都道府県知事等の許可（第4条・第5条）が要り、市街化区域内なら届出で足ります。東京都文京区の宅地建物取引士兼行政書士が、契約前に確認できることを条文と農林水産省の資料から順に整理します。",
    keywords: [
      "農地 相続 売却",
      "農地 貸す 農業委員会",
      "農地法 3条 4条 5条",
      "農地 転用 市街化区域 届出",
      "相続 農地 3条の3 届出",
    ],
    tags: ["相続", "農地", "農地法", "売却"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/souzoku"],
  },
  {
    file: "16-chugokugo-buyer-juyojiko-check-toushi-bukken.md",
    slug: "chugokugo-buyer-juyojiko-check-toushi-bukken",
    title: "中国語圏の買主に日本の収益物件を紹介する前に読む重要事項説明の要点",
    publishedAt: "2026-08-23",
    category: "投資・事業用不動産",
    excerpt:
      "日本の収益物件を中国語圏の買主に紹介する前に読むべきは、宅地建物取引業法第35条の重要事項説明です。登記された権利・法令上の制限・私道負担・供給施設が並び、非居住者が買主になるときは外為法の報告と税務の確認が先に重なります。東京都文京区の宅地建物取引士兼行政書士が、買主側デューデリの観点を条文と公的資料から整理します。",
    keywords: [
      "重要事項説明 宅建業法35条",
      "収益物件 買主 デューデリ",
      "非居住者 不動産 外為法 報告",
      "非居住者 賃料 源泉徴収",
      "中国語圏 買主 日本 不動産",
    ],
    tags: ["投資・事業用不動産", "重要事項説明", "非居住者", "外為法"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/toushi"],
  },
  {
    file: "17-hoiku-shoukibo-bukken-youto-chiiki.md",
    slug: "hoiku-shoukibo-bukken-youto-chiiki",
    title: "小規模保育事業の物件を貸す・探すとき、用途地域と面積で何を確認するのか",
    publishedAt: "2026-08-24",
    category: "投資・事業用不動産",
    excerpt:
      "小規模保育の物件は用途地域では詰まりません。保育所は最も厳しい第一種低層住居専用地域でも建てられます。詰まるのは居室の面積（満2歳未満は1人3.3㎡、満2歳以上は1人1.98㎡）、用途変更の確認申請の要否、消防用設備、2階以上の避難の4点。東京都文京区の宅地建物取引士兼行政書士が、契約前に確認できることを条文と省令から順に整理します。",
    keywords: [
      "小規模保育 物件",
      "保育所 用途地域",
      "保育所 用途変更 確認申請",
      "小規模保育 面積 基準",
      "保育所 消防設備",
    ],
    tags: ["事業用不動産", "許認可", "用途地域", "保育"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/toushi", "/office"],
  },
  {
    file: "18-souzoku-saikenchiku-fuka-baikyaku.md",
    slug: "souzoku-saikenchiku-fuka-baikyaku",
    title: "相続した再建築不可の物件は、売る前に何を確かめるのか",
    publishedAt: "2026-08-24",
    category: "相続",
    excerpt:
      "相続した再建築不可の物件は、まず接道を確かめます。建築基準法第43条は敷地が道路に2m以上接することを求め、幅員4m未満のみなし道路（2項道路）ではセットバックが要ります。接道が足りなくても、隣地の買い増しや第43条第2項の認定・許可という道があります。東京都文京区の宅地建物取引士兼行政書士が、売る前に確認できることを条文から整理します。",
    keywords: [
      "再建築不可 相続 売却",
      "接道義務 建築基準法 43条",
      "43条2項 認定 許可 建築審査会",
      "2項道路 セットバック",
      "無道路地 評価 財産評価基本通達",
    ],
    tags: ["相続", "再建築不可", "接道義務", "売却"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/souzoku"],
  },
  {
    file: "19-chuka-souzoku-akiya-shodo-genchi.md",
    slug: "chuka-souzoku-akiya-shodo-genchi",
    title: "中華圏の相続人が日本の空き家を相続したとき、不動産会社が最初にできることは何か",
    publishedAt: "2026-08-24",
    category: "相続",
    excerpt:
      "中華圏の相続人が日本の空き家を相続したとき、不動産会社が相続直後にできるのは現地確認・査定・維持管理・売却準備の4つです。日本にいなくても現地を見て査定を出せ、相続登記や遺産分割の前でも並行できます。東京都文京区の宅地建物取引士兼行政書士が、不動産会社の範囲と他士業に振る境目を条文から整理します。",
    keywords: [
      "海外 相続人 日本 空き家",
      "相続登記 義務化 3年 不動産登記法",
      "空き家 固定資産税 住宅用地特例",
      "管理不全空家 特定空家 勧告",
      "在外相続人 署名証明 印鑑証明",
    ],
    tags: ["相続", "空き家", "中国語圏", "非居住者"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/souzoku"],
  },
  {
    file: "20-biyoshitsu-riyojo-bukken-hokenjo-todokede.md",
    slug: "biyoshitsu-riyojo-bukken-hokenjo-todokede",
    title: "美容室・理容所を開くための物件は何を確認する？──保健所の構造設備基準と用途地域",
    publishedAt: "2026-08-25",
    category: "投資・事業用不動産",
    excerpt:
      "美容室・理容所の物件で保健所が見るのは、作業場と待合を明確に区分できるか、洗場・消毒・採光照明換気が整うかの2点です。飲食店やクリニックと違い、美容院・理髪店は建築基準法の用途地域制限を受けます。開設届はあらかじめ出し、構造設備の検査・確認を受けてからでなければ使えません。東京都文京区の宅地建物取引士兼行政書士が、契約前に確認できることを条文と厚生労働省の要領から整理します。",
    keywords: [
      "美容室 物件 保健所",
      "美容所 構造設備基準",
      "理容所 開設届",
      "美容院 用途地域 兼用住宅",
      "美容所 検査確認 使用",
    ],
    tags: ["事業用不動産", "許認可", "用途地域", "美容師法"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/toushi", "/office"],
  },
  {
    file: "21-souzoku-kyutaishin-mansion-baikyaku.md",
    slug: "souzoku-kyutaishin-mansion-baikyaku",
    title: "相続した旧耐震マンションは売れる？──新耐震基準と買主の住宅ローンの壁",
    publishedAt: "2026-08-25",
    category: "相続",
    excerpt:
      "相続した旧耐震マンションは売れます。境目は1981年6月1日で、この日以降に建築確認を受けた建物が新耐震です。売却の鍵は買主が住宅ローンを組めるか。買主の住宅ローン控除は登記簿上の建築日付が昭和57年1月1日以降かで変わり、旧耐震では耐震基準適合証明が要りますが区分マンションでは取得が難しいことが多い点まで、東京都文京区の宅地建物取引士兼行政書士が条文と国税庁の資料から整理します。",
    keywords: [
      "旧耐震 マンション 相続 売却",
      "新耐震基準 1981年6月1日",
      "耐震基準適合証明書 住宅ローン控除",
      "空き家 3000万円控除 区分所有 対象外",
      "旧耐震 住宅ローン 買主",
    ],
    tags: ["相続", "旧耐震", "マンション", "売却"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/souzoku"],
  },
  {
    file: "22-doubutsu-toriatsukai-bukken-youken.md",
    slug: "doubutsu-toriatsukai-bukken-youken",
    title: "トリミング・ペットショップの物件、開業前に何を確認する？──第一種動物取扱業の飼養施設と物件の条件",
    publishedAt: "2026-08-26",
    category: "投資・事業用不動産",
    excerpt:
      "トリミングサロン・ペットショップの物件で先に詰まるのは、飼養施設の基準（ケージ・洗浄・消毒・換気・排水）を満たせるか、臭気・鳴き声で近隣とぶつからないか、賃貸借契約で「動物の飼養」が禁じられていないかの3点です。第一種動物取扱業の登録は事業所ごとで、物件が飼養施設の基準を満たせることが前提。東京都文京区の宅地建物取引士兼行政書士が、動物の愛護及び管理に関する法律の条文と環境省・自治体の案内から、契約前に確認できることを整理します。",
    keywords: [
      "トリミングサロン 物件",
      "ペットショップ 開業 物件",
      "第一種動物取扱業 登録 飼養施設",
      "動物取扱業 ケージ 数値規制",
      "動物取扱業 用途地域 賃貸",
    ],
    tags: ["事業用不動産", "許認可", "動物取扱業", "用途地域"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/toushi", "/office"],
  },
  {
    file: "23-sakoju-bukken-youken-toroku.md",
    slug: "sakoju-bukken-youken-toroku",
    title: "サ高住にできる物件の条件は？各戸25㎡・バリアフリーの実際──高齢者住まい法の登録基準",
    publishedAt: "2026-08-26",
    category: "投資・事業用不動産",
    excerpt:
      "サービス付き高齢者向け住宅（サ高住）として登録できる物件の骨格は、各戸原則25㎡以上（共用部分が十分なら18㎡以上）、各戸または共用部分の台所・便所・洗面・浴室・収納、廊下幅・段差・手すりのバリアフリー、少なくとも安否確認と生活相談の提供の4つです。既存建物でも満たせますが、床面積と共用設備の作りで可否が決まります。東京都文京区の宅地建物取引士兼行政書士が、高齢者の居住の安定確保に関する法律と国交省・厚労省の案内から物件条件を整理します。",
    keywords: [
      "サ高住 物件 条件",
      "サービス付き高齢者向け住宅 登録基準",
      "サ高住 25㎡ 18㎡ 床面積",
      "サ高住 バリアフリー 既存建物 改修",
      "高齢者住まい法 登録",
    ],
    tags: ["事業用不動産", "許認可", "サ高住", "バリアフリー"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/toushi", "/office"],
  },
  {
    file: "24-houkago-day-bukken-youto-chiiki-1kai.md",
    slug: "houkago-day-bukken-youto-chiiki-1kai",
    title: "放課後等デイサービスの物件は、用途地域・1階・面積・採光で決まる",
    publishedAt: "2026-08-27",
    category: "投資・事業用不動産",
    excerpt:
      "放課後等デイサービスに使える物件は、用途地域（工業専用地域では児童福祉施設等を建てられず、それ以外の12地域は原則可）、指導訓練室と面積、避難（児童の活動室を2階以上に置くなら要確認）、消防（消防法施行令別表第一(6)項ロ・ハ）、耐震の5点で決まります。東京都文京区の宅地建物取引士兼行政書士が、貸主・借主が物件を選ぶ段階で確認できる適合条件を条文と自治体の運用から整理します。",
    keywords: [
      "放課後等デイサービス 物件",
      "児童発達支援 用途地域",
      "放課後等デイ 訓練室 面積",
      "放課後等デイ 用途変更 確認申請",
      "児童福祉施設等 消防 (6)項ロ",
    ],
    tags: ["事業用不動産", "許認可", "用途地域", "障害福祉"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/toushi", "/office"],
  },
  {
    file: "25-souzoku-akiya-kaitai-koyatsuki-dochira.md",
    slug: "souzoku-akiya-kaitai-koyatsuki-dochira",
    title: "相続した空き家は、解体して更地で売るか古家付き土地で売るか",
    publishedAt: "2026-08-27",
    category: "相続",
    excerpt:
      "相続した空き家を「解体して更地」で売るか「古家付き土地（現況）」で売るかは、解体費と更地後に上がる固定資産税、買主層、契約不適合責任と解体費の負担、空き家3000万円特別控除（租税特別措置法35条3項）の適用のさせ方で決まります。控除は令和6年から買主が引渡し後に除却する形でも使える余地があり、解体のタイミングが手取りを左右します。東京都文京区の宅地建物取引士兼行政書士が売り方の比較を整理します。",
    keywords: [
      "相続 空き家 解体 更地",
      "古家付き土地 売却",
      "空き家 3000万円 特別控除",
      "更地 固定資産税 住宅用地特例",
      "契約不適合責任 現況渡し",
    ],
    tags: ["相続", "空き家", "売却", "税制特例"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/souzoku"],
  },
  {
    file: "26-yakkyoku-bukken-youken-kozo-setsubi.md",
    slug: "yakkyoku-bukken-youken-kozo-setsubi",
    title: "調剤薬局を開くための物件は何が必要？──用途地域と構造設備基準（面積・調剤室・清潔区域）の確認点",
    publishedAt: "2026-08-28",
    category: "投資・事業用不動産",
    excerpt:
      "調剤薬局の物件で先に効くのは、①用途地域（薬局は「店舗」扱いで、診療所と違い用途地域の制限を受ける）②薬局等構造設備規則が求める面積おおむね19.8㎡以上・調剤室6.6㎡以上・清潔な区画、の2点です。医療モールやクリニック併設なら処方箋の応需と動線も見ます。東京都文京区の宅地建物取引士兼行政書士が、契約前に確認できることを薬機法と構造設備規則の条文から整理します。",
    keywords: [
      "調剤薬局 物件",
      "薬局開設許可 構造設備規則",
      "薬局 調剤室 6.6平方メートル",
      "薬局 用途地域 店舗",
      "医療モール 薬局 併設",
    ],
    tags: ["事業用不動産", "許認可", "用途地域", "薬機法"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/toushi", "/office"],
  },
  {
    file: "27-kanka-bunkatsu-fudosan-baikyaku-nagare.md",
    slug: "kanka-bunkatsu-fudosan-baikyaku-nagare",
    title: "相続した不動産を換価分割で売る流れは？──名義・登記・譲渡税の按分まで",
    publishedAt: "2026-08-28",
    category: "相続",
    excerpt:
      "相続した不動産を「売って現金で分ける」のが換価分割です。代表者名義で登記して売る場合でも、換価のための便宜で代金を協議どおりに分けるなら贈与税は問題にならず（国税庁の質疑応答事例）、売却益にかかる譲渡所得税は各相続人が持分に応じて申告します。相続登記は2024年4月1日から義務化され、売る前提でも避けて通れません。東京都文京区の宅地建物取引士兼行政書士が、民法・所得税法・不動産登記法の条文から実務の順序を整理します。",
    keywords: [
      "換価分割 不動産 売却",
      "換価分割 代表者名義 贈与税",
      "換価分割 譲渡所得税 按分",
      "相続登記 義務化 3年 売却",
      "現物分割 代償分割 換価分割 違い",
    ],
    tags: ["相続", "換価分割", "譲渡所得税", "売却"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/souzoku"],
  },
  {
    file: "28-shinkyu-seikotsuin-bukken-youto-hokenjo-todokede.md",
    slug: "shinkyu-seikotsuin-bukken-youto-hokenjo-todokede",
    title: "鍼灸院・整骨院の物件を探すとき、用途地域と保健所の開設届で何を確認する？",
    publishedAt: "2026-08-29",
    category: "投資・事業用不動産",
    excerpt:
      "鍼灸院・整骨院（あはき・柔整の施術所）の物件で先に効くのは、①用途地域（施術所は診療所と違い「サービス業を営む店舗」に準じて扱われるのが一般的で、用途地域の制限を受ける）②施術所の構造設備基準（専用施術室6.6㎡以上・待合室3.3㎡以上・換気・消毒設備）を満たせるか、の2点です。開設届は「開設後10日以内」に施術者本人が保健所へ出すもので、届出書類の作成は行政書士が承ります。東京都文京区の宅地建物取引士兼行政書士が、契約前に確認できることをあはき法・柔道整復師法の条文と省令から整理します。",
    keywords: [
      "鍼灸院 物件",
      "整骨院 接骨院 開業 物件",
      "施術所 構造設備基準 6.6平方メートル",
      "施術所 用途地域 サービス業を営む店舗",
      "あはき法 柔道整復師法 施術所 届出 10日以内",
    ],
    tags: ["事業用不動産", "許認可", "用途地域", "施術所"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/toushi", "/office"],
  },
  {
    file: "29-taiwan-senmonka-nihon-fudosan-touki-kenrisho-chigai.md",
    slug: "taiwan-senmonka-nihon-fudosan-touki-kenrisho-chigai",
    title: "台湾の専門家が日本の不動産取引で戸惑う登記と権利証の違いはどこ？",
    publishedAt: "2026-08-29",
    category: "相続",
    excerpt:
      "台湾の「權狀（権利証）」と日本の「登記識別情報」は、どちらも所有者の本人性を示す道具ですが性格が違います。日本は2004年の不動産登記法改正で紙の権利証（登記済証）を廃止し、英数字12桁の登記識別情報に切り替えました。所有権を公示する正本は登記簿で、権利証や識別情報を失っても事前通知や資格者代理人の本人確認情報で売れます。所有権移転登記を代理できるのは日本では司法書士で、台湾の地政士は代理できません。東京都文京区の宅地建物取引士兼行政書士が、専門家間の前提知識として条文から整理します。",
    keywords: [
      "台湾 地政士 日本 不動産 登記",
      "登記識別情報 登記済証 権利証 廃止",
      "権利証 なくても 売れる 事前通知",
      "司法書士 登記申請 代理 地政士",
      "台湾 相続人 日本 不動産 相続登記",
    ],
    tags: ["相続", "登記", "非居住者", "中国語圏"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/souzoku"],
  },
  {
    file: "30-gakudou-houkago-jido-club-bukken-youken.md",
    slug: "gakudou-houkago-jido-club-bukken-youken",
    title: "放課後児童クラブ（学童保育）に使える物件は？用途地域と面積・避難の目安",
    publishedAt: "2026-08-30",
    category: "投資・事業用不動産",
    excerpt:
      "放課後児童クラブ（学童保育＝放課後児童健全育成事業）に使える物件は、用途地域（工業専用地域では児童福祉施設等を建てられず、それ以外の12地域は原則可）、専用区画の面積（放課後児童健全育成事業の設備及び運営に関する基準〈平成26年厚生労働省令第63号〉第9条＝児童1人おおむね1.65㎡以上・静養区画を含む）、避難、消防、耐震の5点で決まります。放課後等デイサービスとは別制度です。東京都文京区の宅地建物取引士兼行政書士が、契約前に確認できることを条文と省令から整理します。",
    keywords: [
      "放課後児童クラブ 物件",
      "学童保育 物件 用途地域",
      "放課後児童健全育成事業 面積 1.65平方メートル",
      "学童 届出 市町村 34条の8",
      "放課後児童クラブ 放課後等デイ 違い",
    ],
    tags: ["事業用不動産", "許認可", "用途地域", "学童保育"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/toushi", "/office"],
  },
  {
    file: "31-chousei-kuiki-souzoku-tochi-baikyaku.md",
    slug: "chousei-kuiki-souzoku-tochi-baikyaku",
    title: "相続した市街化調整区域の土地は売れる？既存宅地・開発許可の見分け方",
    publishedAt: "2026-08-30",
    category: "相続",
    excerpt:
      "相続した市街化調整区域の土地は、売ること自体はできます。所有権の移転に開発許可は要りません。価格を左右するのは「買主がそこに建てられるか」です。かつての既存宅地制度は2001年に廃止されており、建て替え可否は今は条例区域（都市計画法34条11号）や個別の開発許可（29条）・建築許可（43条）で決まります。東京都文京区の宅地建物取引士兼行政書士が、売る前に確認できることを条文と自治体の運用から整理します。",
    keywords: [
      "市街化調整区域 相続 売却",
      "既存宅地 廃止 2001年",
      "都市計画法 34条 43条 建築許可",
      "市街化調整区域 開発許可 29条",
      "調整区域 土地 査定 建て替え",
    ],
    tags: ["相続", "市街化調整区域", "都市計画法", "売却"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/souzoku"],
  },
  {
    file: "32-jidosha-tokutei-seibi-ninsho-koujou-bukken-youken.md",
    slug: "jidosha-tokutei-seibi-ninsho-koujou-bukken-youken",
    title: "自動車整備工場（特定整備の認証工場）に使える物件の要件は？──面積・天井高・用途地域",
    publishedAt: "2026-08-31",
    category: "投資・事業用不動産",
    excerpt:
      "特定整備の認証工場（道路運送車両法第78条）に使える物件は、①用途地域で自動車修理工場を建てられる区域か②認証基準（第80条）の車両整備作業場・点検作業場が取れる広さと天井高か③リフト作業に耐える床と前面道路か、の3点で決まります。認証基準の作業場と用途地域の作業場床面積は別の物差しで、準工業・工業系が向くのはこのため。東京都文京区の宅地建物取引士兼行政書士が、契約前に確認できることを道路運送車両法・建築基準法の条文から整理します。",
    keywords: [
      "自動車整備工場 物件",
      "特定整備 認証工場 要件",
      "認証工場 作業場 面積 天井高",
      "自動車修理工場 用途地域 建築基準法",
      "認証工場 指定工場 民間車検場 違い",
    ],
    tags: ["事業用不動産", "許認可", "用途地域", "自動車整備"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/toushi", "/office"],
  },
  {
    file: "33-baibai-keiyaku-teppukin-loan-tokuyaku-chugokugo-buyer.md",
    slug: "baibai-keiyaku-teppukin-loan-tokuyaku-chugokugo-buyer",
    title: "中国語圏の買主が日本の売買契約で誤解しやすい条項（手付・ローン特約・契約不適合）は？",
    publishedAt: "2026-08-31",
    category: "投資・事業用不動産",
    excerpt:
      "中国語圏の買主が日本の売買契約でつまずきやすいのは、①手付が中国の「定金」と役割が違うこと（民法第557条＝解約手付）②ローン特約で契約が無条件に白紙へ戻る仕組み③契約不適合責任を「知った時から1年以内の通知」で行使する期間（民法第566条）、の3つです。東京都文京区の宅地建物取引士兼行政書士が、中国の商習慣との違いをふまえ、契約書と重要事項説明書のどの条項を先に読むかを条文から整理します。",
    keywords: [
      "日本 不動産 売買契約 手付 定金 違い",
      "ローン特約 融資利用の特約 白紙解除",
      "契約不適合責任 民法566条 1年 通知",
      "宅建業法 35条 37条 重要事項説明",
      "中国語圏 買主 非居住者 売買契約",
    ],
    tags: ["投資・事業用不動産", "売買契約", "非居住者", "中国語圏"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/toushi"],
  },
];

function toPlainText(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .trim();
}

function parseFaq(content: string, label: string): Faq[] {
  const m = content.match(/## よくある質問\n([\s\S]*?)(?=\n## |$)/);
  if (!m) throw new Error(`${label}: 「## よくある質問」節が見つかりません`);
  const faqs: Faq[] = [];
  const re = /\*\*Q\.\s*([\s\S]*?)\*\*\n(A\.\s*[\s\S]*?)(?=\n\*\*Q\.|\s*$)/g;
  let q: RegExpExecArray | null;
  while ((q = re.exec(m[1])) !== null) {
    faqs.push({
      question: toPlainText(q[1]),
      answer: toPlainText(q[2].replace(/^A\.\s*/, "")),
    });
  }
  if (faqs.length === 0) throw new Error(`${label}: FAQを1件もパースできません`);
  return faqs;
}

function parseFrontmatter(raw: string, label: string): { meta: Record<string, string>; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${label}: frontmatterが見つかりません`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-zA-Z-]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1").trim();
  }
  for (const key of ["title", "excerpt", "category"]) {
    if (!meta[key]) throw new Error(`${label}: frontmatterに ${key} がありません`);
  }
  return { meta, body: m[2].trim() };
}

function readTranslation(spec: ArticleSpec, locale: "zh" | "zh-tw" | "en"): Translation {
  const p = resolve(process.cwd(), "scripts", "realestate-columns", locale, spec.file);
  const { meta, body } = parseFrontmatter(readFileSync(p, "utf-8"), `${locale}/${spec.file}`);
  return { title: meta.title, excerpt: meta.excerpt, category: meta.category, content: body };
}

function buildColumn(spec: ArticleSpec): SeedColumn {
  const jaPath = resolve(process.cwd(), "scripts", "realestate-columns", spec.file);
  const content = readFileSync(jaPath, "utf-8").trim();
  const translations: SeedColumn["translations"] = {};
  if (spec.localesWithTranslations?.includes("en")) translations.en = readTranslation(spec, "en");
  if (spec.localesWithTranslations?.includes("zh-tw")) translations["zh-tw"] = readTranslation(spec, "zh-tw");
  if (spec.localesWithTranslations?.includes("zh")) translations.zh = readTranslation(spec, "zh");
  return {
    business: "realestate",
    slug: spec.slug,
    title: spec.title,
    date: spec.publishedAt,
    category: spec.category,
    excerpt: spec.excerpt,
    content,
    status: "published",
    author: { ...AUTHOR },
    keywords: [...spec.keywords],
    tags: [...spec.tags],
    locales: [...spec.locales],
    faq: parseFaq(content, spec.file),
    translations: Object.keys(translations).length ? translations : undefined,
  };
}

/**
 * 検査は seed-realestate-columns-p6.ts のものを弱めずに引き継いでいる。
 * 追加した点は EXISTING_COLUMN_SLUGS を実行時に集めるようにしたことだけ。
 * ここの NG 判定を外して記事を通さない（記事側を直す）。
 */
function verify(cols: SeedColumn[], specs: ArticleSpec[]): string[] {
  const notes: string[] = [];
  const batchSlugs = new Set(cols.map((c) => c.slug));

  cols.forEach((c, i) => {
    const spec = specs[i];
    if (!c.content.startsWith("**結論（先に要点）**：")) {
      notes.push(`NG: ${spec.slug} が「**結論（先に要点）**：」で始まっていない`);
    }
    if (c.faq.length < 4) notes.push(`WARN: ${spec.slug} のFAQが${c.faq.length}件`);
    if (c.content.length < 1500) notes.push(`WARN: ${spec.slug} の本文が短い（${c.content.length}字）`);
    for (const hub of spec.hubLinks) {
      if (!c.content.includes(`](${hub})`)) notes.push(`NG: ${spec.slug} に ${hub} リンクなし`);
    }
    const links = [...c.content.matchAll(/\]\(\/column\/([a-z0-9-]+)\)/g)].map((x) => x[1]);
    for (const l of links) {
      if (l !== c.slug && !batchSlugs.has(l) && !EXISTING_COLUMN_SLUGS.has(l)) {
        // slug 自体は実在して、ルート接頭辞だけ間違っている場合がある。
        // 落とす条件は変えない。NG文面に直し方を書き足すだけ。
        const other = OTHER_BUSINESS_COLUMN_SLUGS.get(l);
        notes.push(
          other
            ? `NG: ${spec.slug} → 不明slug ${l}` +
                `（${other.label} ${other.prefix}/${l} に実在。ルート接頭辞の誤り。` +
                `リンクを ${other.prefix}/${l} に直す）`
            : `NG: ${spec.slug} → 不明slug ${l}`,
        );
      }
    }
    if (!c.content.includes("## この記事の出典（一次情報）")) notes.push(`NG: ${spec.slug} に出典節なし`);
    if (!c.content.includes("一般的な情報提供")) notes.push(`NG: ${spec.slug} に判断留保なし`);
    // 分離受任の明示（3事業体にまたがるため必須）
    if (!/それぞれ直接ご契約|独立した事業体|別々にご契約/.test(c.content)) {
      notes.push(`NG: ${spec.slug} に分離受任の明示なし`);
    }
    if (!/紹介料/.test(c.content)) notes.push(`NG: ${spec.slug} に紹介料の扱いの記載なし`);
    // 社労士は2026年9月開業予定。開業前に社労士としての業務・立場を書かない
    if (/社会保険労務士/.test(c.content) && !/開業予定/.test(c.content)) {
      notes.push(`NG: ${spec.slug} の社労士表記に「開業予定」の但し書きなし`);
    }
    if (/助成金/.test(c.content)) notes.push(`NG: ${spec.slug} に「助成金」（社労士領域・開業前）あり`);

    if (c.translations) {
      for (const loc of ["en", "zh", "zh-tw"] as const) {
        const t = c.translations[loc];
        if (!t) continue;
        if (/\]\(\/(?!\/)/.test(t.content)) notes.push(`NG: ${spec.slug}/${loc} に相対パスの内部リンクあり`);
        if (!t.content.startsWith("**")) notes.push(`WARN: ${spec.slug}/${loc} が直答ブロックで始まっていない`);
      }
      if (c.translations.zh && !c.translations.zh.content.includes("四叶不动产株式会社")) {
        notes.push(`WARN: ${spec.slug}/zh のブランド表記を確認`);
      }
      if (c.translations["zh-tw"] && !c.translations["zh-tw"].content.includes("四葉不動產株式會社")) {
        notes.push(`WARN: ${spec.slug}/zh-tw のブランド表記を確認`);
      }
      if (c.translations.en && !c.translations.en.content.includes("Yotsuba Real Estate Co., Ltd.")) {
        notes.push(`WARN: ${spec.slug}/en のブランド表記を確認`);
      }
    }
  });

  const texts: Array<[string, string]> = [];
  for (const c of cols) {
    texts.push([c.slug, c.content + c.excerpt]);
    if (c.translations) {
      for (const loc of ["en", "zh", "zh-tw"] as const) {
        const t = c.translations[loc];
        if (t) texts.push([`${c.slug}/${loc}`, t.content + t.excerpt]);
      }
    }
  }
  for (const [label, text] of texts) {
    for (const w of FORBIDDEN_WORDS) {
      if (text.toLowerCase().includes(w.toLowerCase())) notes.push(`NG: ${label} に禁止語「${w}」あり`);
    }
  }

  // 追記型なのでバッチ内のslug重複を明示的に見る（同じ記事を2回書いても気づけるように）
  const seen = new Set<string>();
  for (const c of cols) {
    if (seen.has(c.slug)) notes.push(`NG: slug ${c.slug} が ARTICLES に重複している`);
    seen.add(c.slug);
  }

  return notes;
}

const EMIT_HEADER = `// このファイルは自動生成（npx tsx scripts/seed-realestate-columns-daily.ts --emit-ts）。直接編集しない。
// 原稿の正本＝scripts/realestate-columns/NN-<slug>.md（ja）＋{en,zh,zh-tw}/NN-<slug>.md（翻訳）。
// 修正はmd側→再生成で行う。用途＝/admin/columns/seed-realestate-daily からの管理者セッション経由upsert。
// 追記型。記事が増えてもこのファイルと管理画面ページは増やさない（枝番スクリプトを新設しないこと）。

export type RealestateSeedColumnDaily = {
  business: "realestate";
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  status: "published";
  author: { name: string; title: string };
  keywords: string[];
  tags: string[];
  locales: ("ja" | "en" | "zh-tw" | "zh")[];
  faq: { question: string; answer: string }[];
  translations?: {
    en?: { title: string; excerpt: string; content: string; category?: string };
    "zh-tw"?: { title: string; excerpt: string; content: string; category?: string };
    zh?: { title: string; excerpt: string; content: string; category?: string };
  };
};

export const REALESTATE_COLUMNS_DAILY_SEED: RealestateSeedColumnDaily[] = `;

async function main() {
  const emitTs = process.argv.includes("--emit-ts");
  if (process.argv.includes("--write")) {
    console.error("--write は用意していません。本番投入は /admin/columns/seed-realestate-daily を正とします。");
    process.exit(1);
  }

  // ARTICLES が空でも例外を投げない（追記型なので「まだ0本」は正常な状態）。
  const cols = ARTICLES.map(buildColumn);

  // 許可リストは「リポジトリ由来 ∪ 本番sitemap由来」。verify() より前に union する。
  // 管理画面から直接作られた記事はリポジトリに原稿が無く、sitemap でしか実在を確認できない。
  const published = await fetchPublishedColumnSlugs();
  if (published) {
    const before = EXISTING_COLUMN_SLUGS.size;
    EXISTING_COLUMN_SLUGS = new Set([...EXISTING_COLUMN_SLUGS, ...published.realestate]);
    const added = EXISTING_COLUMN_SLUGS.size - before;
    console.log(
      `sitemap: /column/ を ${published.realestate.length} 件検出、` +
        `うち ${added} 件を許可リストに追加（許可リスト合計 ${EXISTING_COLUMN_SLUGS.size} 件）`,
    );
    // 許可リストではない。NG になったときに理由を言い当てるための対応表。
    OTHER_BUSINESS_COLUMN_SLUGS = published.other;
    if (OTHER_BUSINESS_COLUMN_SLUGS.size) {
      console.log(
        `sitemap: 他士業ルートを ${OTHER_BUSINESS_COLUMN_SLUGS.size} 件検出` +
          `（許可リストには入れない。ルート接頭辞の取り違えを指摘するためだけに使う）`,
      );
    }
  }

  const notes = verify(cols, ARTICLES);

  if (emitTs) {
    if (notes.some((n) => n.startsWith("NG"))) {
      console.error(notes.join("\n"));
      console.error("NGがあるため中断します。");
      process.exit(1);
    }
    const out = resolve(process.cwd(), "src/lib/data/realestate-columns-daily-seed.ts");
    writeFileSync(out, EMIT_HEADER + JSON.stringify(cols, null, 2) + ";\n");
    console.log(`emit-ts → ${out}（${cols.length}本）`);
    console.log(notes.length ? notes.join("\n") : "OK: 全チェック通過");
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "不動産コラム（追記型）。1本追加は ARTICLES に1エントリ追記。投入は /admin/columns/seed-realestate-daily。",
    articleCount: cols.length,
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: cols.map((c) => ({
      slug: c.slug,
      title: c.title,
      date: c.date,
      category: c.category,
      locales: c.locales,
      faq: c.faq.length,
      contentChars: c.content.length,
      translationChars: c.translations
        ? Object.fromEntries(
            Object.entries(c.translations).map(([k, v]) => [k, v ? v.content.length : 0]),
          )
        : undefined,
    })),
  };
  const out = resolve(process.cwd(), "scripts", "realestate-columns-daily.preview.json");
  writeFileSync(out, JSON.stringify(preview, null, 2));
  console.log(`dry-run → ${out}（${cols.length}本）`);
  console.log(preview.verification.join("\n"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
