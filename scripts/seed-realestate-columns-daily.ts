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
