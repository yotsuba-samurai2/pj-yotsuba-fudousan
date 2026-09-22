import type { LangCode } from "@/config/languages";
import type { BusinessKey, Column } from "@/lib/column-shared";

/**
 * コラム詳細ページの挿絵を、記事から決定論的に選ぶ純粋モジュール。
 *
 * 背景：3事業のコラム詳細テンプレートは日付・カテゴリ・H1しか描画しておらず、
 * 本文1,200字以上の記事に著者写真以外の画像が1枚も無い状態だった。
 * 3テンプレートへ個別の if を書かず、ここ1か所で決める。
 *
 * ★呼び出し側は getLocalizedColumn 前の base（ja 正本）を渡すこと。
 *   getLocalizedColumn は category・tags・title を翻訳版に差し替えるため、
 *   ローカライズ後の値で判定すると 4言語で別々の画像になる。
 *   同じ理由・同じ作法の先例が column-shared.ts の resolveRealestateColumnCta。
 *   alt だけを locale で出し分け、src は 4言語で同一にする。
 *
 * 決定論：Math.random()・現在時刻・オブジェクトのキー順に依存しない。
 * 候補が並んだときは slug の FNV-1a ハッシュで散らすため、再ビルドしても結果は変わらない。
 */

export type ColumnIllustration = {
  id: string;
  business: BusinessKey;
  /** 同一テーマに複数の画像を足すと、slug ハッシュで自動的に分散する */
  theme: string;
  /** public/ からのルート相対パス。next/image に渡せるローカルパスのみ */
  src: string;
  alt: Record<LangCode, string>;
  /** 記事 slug の完全一致ルール。キーワード一致より優先する */
  slugPatterns?: string[];
  categoryKeywords?: string[];
  tagKeywords?: string[];
  titleKeywords?: string[];
  /** 一致が無かった記事の受け皿。事業ごとに最低1枚必要 */
  isFallback?: boolean;
};

export type IllustrationSource = "ogImage" | "slug" | "keyword" | "fallback";

export type ResolvedColumnIllustration = {
  src: string;
  alt: string;
  source: IllustrationSource;
  /** マニフェスト由来のときだけ入る。ogImage 由来では undefined */
  id?: string;
};

/** 選択に使う最小限の入力。ja 正本を渡す */
export type IllustrationInput = Pick<
  Column,
  "business" | "slug" | "category" | "tags" | "title" | "ogImage"
>;

const TAG_WEIGHT = 2;
const CATEGORY_WEIGHT = 1;
const TITLE_WEIGHT = 1;

/**
 * 挿絵マニフェスト。
 *
 * 並び順に意味がある：得点が同じテーマが並んだときは、この配列で先にあるものを採る
 * （配列の取得順に依存しない、明示された優先順位）。具体的なテーマほど前に置く。
 *
 * 現在は既存 public/hero/ の画像だけで構成している。新規画像が増えたら
 * ここに1行足すだけで多様性が上がる（テンプレート側の変更は不要）。
 */
export const COLUMN_ILLUSTRATIONS: readonly ColumnIllustration[] = [
  // ─────────── 不動産 ───────────
  {
    id: "realestate-group-home",
    business: "realestate",
    theme: "group-home",
    src: "/hero/realestate-group-home-16x9.webp",
    alt: {
      ja: "グループホームの前庭と、開かれた帳面を描いた水彩イラスト",
      en: "Watercolor illustration of a group home's front garden and an open notebook",
      "zh-tw": "團體家屋前庭與攤開筆記本的水彩插畫",
      zh: "团体家屋前庭与摊开笔记本的水彩插画",
    },
    categoryKeywords: ["グループホーム"],
    tagKeywords: ["グループホーム", "障害福祉", "介護", "福祉", "指定申請"],
  },
  {
    id: "realestate-souzoku",
    business: "realestate",
    theme: "souzoku",
    // 行政書士レーンの相続画像を共用する。日本家屋・家系図・書類という主題が
    // 相続不動産の記事にそのまま合うため。リポジトリ内でも office/page.tsx が
    // legal-company を、kaigo/page.tsx が labor-kaigo-roumu を共用する前例がある。
    src: "/hero/legal-inheritance-16x9.webp",
    alt: {
      ja: "家系図と日本家屋、書類と印鑑を描いた水彩イラスト",
      en: "Watercolor illustration of a family tree, a Japanese house, documents and a seal",
      "zh-tw": "家系圖、日式房屋與文件印章的水彩插畫",
      zh: "家系图、日式房屋与文件印章的水彩插画",
    },
    categoryKeywords: ["相続"],
    tagKeywords: ["相続", "相続登記", "遺産分割", "空き家", "実家", "遺言"],
  },
  {
    id: "realestate-global",
    business: "realestate",
    theme: "global",
    src: "/hero/realestate-global-16x9.webp",
    alt: {
      ja: "地球儀と家を前に言葉を交わす三人を描いた水彩イラスト",
      en: "Watercolor illustration of three people talking in front of a globe and a house",
      "zh-tw": "三人在地球儀與房屋前交談的水彩插畫",
      zh: "三人在地球仪与房屋前交谈的水彩插画",
    },
    categoryKeywords: ["離日", "海外", "台湾", "外国人"],
    tagKeywords: [
      "非居住者",
      "離日",
      "台湾",
      "中国語圏",
      "外国人",
      "海外",
      "納税管理人",
      "外為法",
    ],
  },
  {
    id: "realestate-toushi",
    business: "realestate",
    theme: "toushi",
    src: "/hero/realestate-toushi-16x9.webp",
    alt: {
      ja: "街並みと伸びる若葉を描いた水彩イラスト",
      en: "Watercolor illustration of a streetscape and a growing young plant",
      "zh-tw": "街景與抽長嫩葉的水彩插畫",
      zh: "街景与抽长嫩叶的水彩插画",
    },
    categoryKeywords: ["投資", "事業用不動産"],
    tagKeywords: [
      "投資",
      "収益",
      "利回り",
      "事業用不動産",
      "オーナーチェンジ",
      "賃貸経営",
      "融資",
      "用途地域",
      "許認可",
      "消防法",
    ],
  },
  {
    id: "realestate-bunkyo",
    business: "realestate",
    theme: "bunkyo",
    // 実写写真。文京区に特化した記事では、水彩より実在の街の写真のほうが適切。
    // 汎用フォールバックには使わない（地域記事以外に地域写真が付くのを避ける）。
    src: "/hero/bunkyo-sakura-16x9.webp",
    alt: {
      ja: "満開の桜並木が続く文京区の通りの写真",
      en: "Photograph of a street lined with cherry blossoms in Bunkyo, Tokyo",
      "zh-tw": "東京文京區櫻花盛開的街道照片",
      zh: "东京文京区樱花盛开的街道照片",
    },
    tagKeywords: ["文京区", "小日向", "本駒込"],
  },
  {
    id: "realestate-shataku",
    business: "realestate",
    theme: "shataku",
    src: "/hero/realestate-shataku-16x9.webp",
    alt: {
      ja: "集合住宅と鍵束を描いた水彩イラスト",
      en: "Watercolor illustration of an apartment building and a set of keys",
      "zh-tw": "集合住宅與一串鑰匙的水彩插畫",
      zh: "集合住宅与一串钥匙的水彩插画",
    },
    categoryKeywords: ["賃貸", "住まい"],
    tagKeywords: ["社宅", "賃貸", "マンション", "アパート", "売却", "契約"],
    isFallback: true,
  },

  // ─────────── 行政書士 ───────────
  {
    id: "legal-shogai-fukushi",
    business: "legal",
    theme: "shogai-fukushi",
    src: "/hero/legal-shogai-fukushi-16x9.webp",
    alt: {
      ja: "福祉施設の建物と積まれた書類を描いた水彩イラスト",
      en: "Watercolor illustration of a welfare facility building and stacked documents",
      "zh-tw": "福祉機構建築與成疊文件的水彩插畫",
      zh: "福祉机构建筑与成叠文件的水彩插画",
    },
    categoryKeywords: ["グループホーム", "障害福祉"],
    tagKeywords: [
      "グループホーム",
      "障害福祉",
      "指定申請",
      "人員基準",
      "設備基準",
      "介護",
    ],
  },
  {
    id: "legal-inheritance",
    business: "legal",
    theme: "souzoku",
    src: "/hero/legal-inheritance-16x9.webp",
    alt: {
      ja: "家系図と日本家屋、書類と印鑑を描いた水彩イラスト",
      en: "Watercolor illustration of a family tree, a Japanese house, documents and a seal",
      "zh-tw": "家系圖、日式房屋與文件印章的水彩插畫",
      zh: "家系图、日式房屋与文件印章的水彩插画",
    },
    categoryKeywords: ["相続"],
    tagKeywords: [
      "相続",
      "相続登記",
      "遺言",
      "遺産分割",
      "遺留分",
      "戸籍",
      "相続税",
      "法定相続情報一覧図",
    ],
  },
  {
    id: "legal-visa",
    business: "legal",
    theme: "zairyuu",
    src: "/hero/legal-visa-16x9.webp",
    alt: {
      ja: "パスポートと地球儀、旅立つ人々を描いた水彩イラスト",
      en: "Watercolor illustration of a passport, a globe and people setting off",
      "zh-tw": "護照、地球儀與啟程旅人的水彩插畫",
      zh: "护照、地球仪与启程旅人的水彩插画",
    },
    tagKeywords: ["在留資格", "外国人", "台湾", "中国", "入管", "帰化", "公証"],
  },
  {
    id: "legal-company",
    business: "legal",
    theme: "kaisha",
    src: "/hero/legal-company-16x9.webp",
    alt: {
      ja: "書類と印鑑、オフィスビルを描いた水彩イラスト",
      en: "Watercolor illustration of documents, a seal and an office building",
      "zh-tw": "文件、印章與辦公大樓的水彩插畫",
      zh: "文件、印章与办公楼的水彩插画",
    },
    categoryKeywords: ["会社設立", "オフィス"],
    tagKeywords: ["会社設立", "定款", "オフィス", "法人", "登記"],
  },
  {
    id: "legal-subsidy",
    business: "legal",
    theme: "hojokin",
    src: "/hero/legal-subsidy-16x9.webp",
    alt: {
      ja: "右肩上がりのグラフと電球を描いた水彩イラスト",
      en: "Watercolor illustration of a rising chart and a lightbulb",
      "zh-tw": "向上成長的圖表與燈泡的水彩插畫",
      zh: "向上成长的图表与灯泡的水彩插画",
    },
    tagKeywords: ["補助金", "助成金", "創業"],
  },
  {
    id: "legal-top",
    business: "legal",
    theme: "kyoninka",
    src: "/hero/legal-top-16x9.webp",
    alt: {
      ja: "書類と万年筆が置かれた事務机を描いた水彩イラスト",
      en: "Watercolor illustration of an office desk with documents and a fountain pen",
      "zh-tw": "擺著文件與鋼筆的辦公桌水彩插畫",
      zh: "摆着文件与钢笔的办公桌水彩插画",
    },
    categoryKeywords: ["許認可", "手続"],
    tagKeywords: ["許認可", "行政書士", "建設業許可", "運送", "飲食", "旅館"],
    isFallback: true,
  },

  // ─────────── 社労士 ───────────
  {
    id: "labor-gaikokujin-koyo",
    business: "labor",
    theme: "gaikokujin-koyo",
    src: "/hero/labor-gaikokujin-koyo-16x9.webp",
    alt: {
      ja: "さまざまな国から来た従業員が机を囲む様子を描いた水彩イラスト",
      en: "Watercolor illustration of employees from different countries gathered around a table",
      "zh-tw": "不同國籍員工圍坐桌邊的水彩插畫",
      zh: "不同国籍员工围坐桌边的水彩插画",
    },
    categoryKeywords: ["外国人"],
    tagKeywords: [
      "外国人雇用",
      "在留資格",
      "育成就労",
      "特定技能",
      "技能実習",
      "留学生",
      "社会保障協定",
    ],
  },
  {
    id: "labor-jinin-kijun-roumu",
    business: "labor",
    theme: "jinin-kijun",
    src: "/hero/labor-jinin-kijun-roumu-16x9.webp",
    alt: {
      ja: "升目の勤務表と打ち合わせる職員を描いた水彩イラスト",
      en: "Watercolor illustration of a blank shift grid and staff in discussion",
      "zh-tw": "空白排班表與員工討論的水彩插畫",
      zh: "空白排班表与员工讨论的水彩插画",
    },
    categoryKeywords: ["労働時間"],
    tagKeywords: ["常勤換算", "人員基準", "シフト", "労働時間", "36協定", "変形労働時間"],
  },
  {
    id: "labor-kaigo-roumu",
    business: "labor",
    theme: "kaigo-roumu",
    src: "/hero/labor-kaigo-roumu-16x9.webp",
    alt: {
      ja: "打ち合わせをする介護現場の職員たちを描いた水彩イラスト",
      en: "Watercolor illustration of care-facility staff holding a meeting",
      "zh-tw": "照護現場員工開會的水彩插畫",
      zh: "照护现场员工开会的水彩插画",
    },
    categoryKeywords: ["介護", "障害福祉", "業種別"],
    tagKeywords: ["介護", "障害福祉", "グループホーム", "訪問看護", "保育"],
  },
  {
    id: "labor-shogu-kaizen",
    business: "labor",
    theme: "shogu-kaizen",
    src: "/hero/labor-shogu-kaizen-16x9.webp",
    alt: {
      ja: "介護の現場と机上の書類を描いた水彩イラスト",
      en: "Watercolor illustration of a care setting and documents on a desk",
      "zh-tw": "照護現場與桌上文件的水彩插畫",
      zh: "照护现场与桌上文件的水彩插画",
    },
    tagKeywords: ["処遇改善加算", "賃金", "最低賃金", "昇給", "評価"],
  },
  {
    id: "labor-joseikin",
    business: "labor",
    theme: "joseikin",
    src: "/hero/labor-joseikin-16x9.webp",
    alt: {
      ja: "握手を交わす二人と机上の書類を描いた水彩イラスト",
      en: "Watercolor illustration of two people shaking hands and documents on a desk",
      "zh-tw": "兩人握手與桌上文件的水彩插畫",
      zh: "两人握手与桌上文件的水彩插画",
    },
    categoryKeywords: ["助成金", "誰に頼むか", "料金"],
    tagKeywords: ["助成金", "補助金", "業際", "顧問"],
  },
  {
    id: "labor-saiyo",
    business: "labor",
    theme: "saiyo",
    src: "/hero/labor-saiyo-16x9.webp",
    alt: {
      ja: "面接の場面と机上の書類を描いた水彩イラスト",
      en: "Watercolor illustration of a job interview and documents on a desk",
      "zh-tw": "面試場景與桌上文件的水彩插畫",
      zh: "面试场景与桌上文件的水彩插画",
    },
    categoryKeywords: ["採用", "雇用"],
    tagKeywords: [
      "採用",
      "内定",
      "求人",
      "雇用契約",
      "労働条件明示",
      "就業規則",
      "退職",
      "解雇",
    ],
  },
  {
    id: "labor-shogai-nenkin",
    business: "labor",
    theme: "shakai-hoken",
    src: "/hero/labor-shogai-nenkin-16x9.webp",
    alt: {
      ja: "家族をやさしく包む両手を描いた水彩イラスト",
      en: "Watercolor illustration of two hands gently sheltering a family",
      "zh-tw": "雙手輕輕守護家庭的水彩插畫",
      zh: "双手轻轻守护家庭的水彩插画",
    },
    categoryKeywords: ["社会保険", "労働保険", "雇用保険"],
    tagKeywords: [
      "社会保険",
      "年金",
      "雇用保険",
      "労働保険",
      "労災保険",
      "傷病手当金",
      "標準報酬月額",
      "育児休業",
      "健康保険",
    ],
  },
  {
    id: "labor-gaibu-kansanin",
    business: "labor",
    theme: "roumu-kansa",
    src: "/hero/labor-gaibu-kansanin-16x9.webp",
    alt: {
      ja: "開かれた帳簿と虫めがねを描いた水彩イラスト",
      en: "Watercolor illustration of an open ledger and a magnifying glass",
      "zh-tw": "攤開的帳簿與放大鏡的水彩插畫",
      zh: "摊开的账簿与放大镜的水彩插画",
    },
    categoryKeywords: ["手続と期限"],
    tagKeywords: ["帳簿", "労務監査", "勤怠", "給与計算", "freee", "法定三帳簿"],
  },
  {
    id: "labor-top",
    business: "labor",
    theme: "roumu-ippan",
    src: "/hero/labor-top-16x9.webp",
    alt: {
      ja: "介護施設の室内と机上の書類を描いた水彩イラスト",
      en: "Watercolor illustration of a care facility interior and documents on a desk",
      "zh-tw": "照護機構室內與桌上文件的水彩插畫",
      zh: "照护机构室内与桌上文件的水彩插画",
    },
    categoryKeywords: ["労働法", "労務"],
    tagKeywords: ["労働基準法", "労務管理", "社会保険労務士"],
    isFallback: true,
  },
];

/**
 * FNV-1a（32bit）。slug から安定した整数を作り、候補の分散に使う。
 * 再ビルドでも、別プロセスでも、同じ slug なら必ず同じ値になる。
 */
export function stableHash(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function countKeywordHits(haystack: string, keywords?: string[]): number {
  if (!keywords?.length || !haystack) return 0;
  let hits = 0;
  for (const keyword of keywords) {
    if (haystack.includes(keyword.toLowerCase())) hits += 1;
  }
  return hits;
}

/** 同点の候補から1つ選ぶ。テーマが割れていれば定義順、同一テーマなら slug ハッシュで分散 */
function pickAmongTied(
  tied: ColumnIllustration[],
  slug: string,
): ColumnIllustration {
  const firstTheme = tied[0].theme;
  const sameTheme = tied.filter((c) => c.theme === firstTheme);
  return sameTheme[stableHash(slug) % sameTheme.length];
}

/**
 * 記事に対応する挿絵を1枚決める。どの記事でも必ず1枚返す（画像0枚を作らない）。
 *
 * 優先順位：
 *  1. 記事固有の ogImage（ルート相対パスのときだけ）
 *  2. slug の明示ルール
 *  3. ja 正本の tags（重み2）・category（重み1）・title（重み1）による加点
 *  4. 事業別フォールバックを slug ハッシュで選択
 *
 * ogImage が外部URLの場合は採用しない。next.config.ts に remotePatterns が
 * 無いため next/image が実行時に落ちる。壊れた画像を出すより 2 以降へ落とす。
 */
export function resolveColumnIllustration(
  base: IllustrationInput,
  locale: LangCode,
  options?: { localizedTitle?: string },
): ResolvedColumnIllustration {
  const candidates = COLUMN_ILLUSTRATIONS.filter(
    (c) => c.business === base.business,
  );

  // 1. 記事固有の ogImage
  const ogImage = base.ogImage?.trim();
  if (ogImage && ogImage.startsWith("/")) {
    return {
      src: ogImage,
      alt: options?.localizedTitle?.trim() || base.title,
      source: "ogImage",
    };
  }

  // 2. slug の明示ルール
  const bySlug = candidates.find((c) => c.slugPatterns?.includes(base.slug));
  if (bySlug) {
    return { src: bySlug.src, alt: bySlug.alt[locale], source: "slug", id: bySlug.id };
  }

  // 3. キーワード一致（ja 正本のみを見る）
  const tagText = (base.tags ?? []).join(" ").toLowerCase();
  const categoryText = (base.category ?? "").toLowerCase();
  const titleText = (base.title ?? "").toLowerCase();

  let best = 0;
  let tied: ColumnIllustration[] = [];
  for (const candidate of candidates) {
    const score =
      countKeywordHits(tagText, candidate.tagKeywords) * TAG_WEIGHT +
      countKeywordHits(categoryText, candidate.categoryKeywords) * CATEGORY_WEIGHT +
      countKeywordHits(titleText, candidate.titleKeywords) * TITLE_WEIGHT;
    if (score <= 0) continue;
    if (score > best) {
      best = score;
      tied = [candidate];
    } else if (score === best) {
      tied.push(candidate);
    }
  }
  if (tied.length > 0) {
    const chosen = pickAmongTied(tied, base.slug);
    return { src: chosen.src, alt: chosen.alt[locale], source: "keyword", id: chosen.id };
  }

  // 4. 事業別フォールバック
  const fallbacks = candidates.filter((c) => c.isFallback);
  if (fallbacks.length === 0) {
    // マニフェストの不備。テストで検出する（各事業に最低1枚の isFallback が必要）
    throw new Error(`No fallback illustration registered for business: ${base.business}`);
  }
  const chosen = fallbacks[stableHash(base.slug) % fallbacks.length];
  return { src: chosen.src, alt: chosen.alt[locale], source: "fallback", id: chosen.id };
}
